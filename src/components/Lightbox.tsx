import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Photo as PhotoData } from "../data/photos";
import Icon from "./Icon";

type OpenFn = (photos: PhotoData[], index: number) => void;
type Registry = Map<string, HTMLElement>;

const LightboxContext = createContext<{ open: OpenFn; registry: Registry } | null>(null);

type Box = { left: number; top: number; width: number; height: number };

const EASE = "cubic-bezier(0.22, 0.8, 0.2, 1)";
const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const duration = (ms: number) => (reduceMotion() ? 1 : ms);

// Maior retângulo com a proporção da foto que cabe na tela, deixando espaço para legenda e controles.
function fit(photo: PhotoData): Box {
  const small = window.innerWidth < 768;
  const maxW = window.innerWidth - (small ? 24 : 160);
  const maxH = window.innerHeight - (small ? 170 : 190);
  const scale = Math.min(maxW / photo.width, maxH / photo.height);
  const width = photo.width * scale;
  const height = photo.height * scale;
  return {
    left: (window.innerWidth - width) / 2,
    top: (window.innerHeight - height) / 2 - (small ? 24 : 10),
    width,
    height,
  };
}

const toBox = (r: DOMRect): Box => ({ left: r.left, top: r.top, width: r.width, height: r.height });
const px = (b: Box) => ({
  left: `${b.left}px`,
  top: `${b.top}px`,
  width: `${b.width}px`,
  height: `${b.height}px`,
});

export function LightboxProvider({ children }: { children: React.ReactNode }) {
  const registry = useRef<Registry>(new Map()).current;
  const [state, setState] = useState<{ photos: PhotoData[]; index: number } | null>(null);
  const open = useCallback<OpenFn>((photos, index) => setState({ photos, index }), []);
  const value = useMemo(() => ({ open, registry }), [open, registry]);

  return (
    <LightboxContext.Provider value={value}>
      {children}
      {state &&
        createPortal(
          <LightboxView photos={state.photos} startIndex={state.index} registry={registry} onClose={() => setState(null)} />,
          document.body,
        )}
    </LightboxContext.Provider>
  );
}

function LightboxView({
  photos,
  startIndex,
  registry,
  onClose,
}: {
  photos: PhotoData[];
  startIndex: number;
  registry: Registry;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);
  const [closing, setClosing] = useState(false);
  const figureRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastBox = useRef<Box | null>(null);
  const prevIndex = useRef<number | null>(null);
  const returnFocus = useRef<HTMLElement | null>(document.activeElement as HTMLElement | null);
  const photo = photos[index];

  const thumb = (id: string) => registry.get(id);
  const lift = (id: string, hidden: boolean) => {
    const el = thumb(id);
    if (el) el.style.visibility = hidden ? "hidden" : "";
  };

  // Abre a partir da miniatura e, ao trocar de foto, "morpha" do retângulo anterior para o novo.
  useLayoutEffect(() => {
    const figure = figureRef.current;
    if (!figure) return;
    const target = fit(photo);
    Object.assign(figure.style, px(target));
    let from: Box | null = lastBox.current;
    if (!from) {
      const el = thumb(photo.id);
      if (el) from = toBox(el.getBoundingClientRect());
    }
    if (from) {
      figure.animate(
        [
          { ...px(from), borderRadius: "0.2rem" },
          { ...px(target), borderRadius: "0.2rem" },
        ],
        { duration: duration(560), easing: EASE },
      );
    } else {
      figure.animate([{ opacity: 0, transform: "scale(0.94)" }, { opacity: 1, transform: "none" }], {
        duration: duration(400),
        easing: EASE,
      });
    }
    lastBox.current = target;
    if (prevIndex.current !== null && prevIndex.current !== index) lift(photos[prevIndex.current].id, false);
    lift(photo.id, true);
    prevIndex.current = index;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const close = useCallback(() => {
    if (closing) return;
    setClosing(true);
    const figure = figureRef.current;
    const el = thumb(photo.id);
    const finish = () => {
      lift(photo.id, false);
      onClose();
      returnFocus.current?.focus?.({ preventScroll: true });
    };
    if (!figure) return finish();
    const current = toBox(figure.getBoundingClientRect());
    const r = el?.getBoundingClientRect();
    const visible = r && r.bottom > 0 && r.top < window.innerHeight && r.width > 0;
    const anim = visible
      ? figure.animate([{ ...px(current) }, { ...px(toBox(r)) }], {
          duration: duration(460),
          easing: EASE,
          fill: "forwards",
        })
      : figure.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "scale(0.94)" }], {
          duration: duration(260),
          easing: EASE,
          fill: "forwards",
        });
    anim.onfinish = finish;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closing, photo, onClose]);

  const go = useCallback(
    (delta: number) => {
      if (closing || photos.length < 2) return;
      setIndex((i) => (i + delta + photos.length) % photos.length);
    },
    [closing, photos.length],
  );

  // Teclado, trava de rolagem e foco.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Tab") {
        const focusables = document.querySelectorAll<HTMLElement>(".lightbox button:not([disabled])");
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      photos.forEach((p) => lift(p.id, false));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [close, go]);

  // Reposiciona se a janela mudar de tamanho (ex.: girar o celular).
  useEffect(() => {
    const onResize = () => {
      const figure = figureRef.current;
      if (!figure || closing) return;
      const target = fit(photo);
      Object.assign(figure.style, px(target));
      lastBox.current = target;
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [photo, closing]);

  // Gestos: arrastar para baixo fecha, arrastar para os lados troca de foto.
  const drag = useRef<{ x: number; y: number; id: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    drag.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    const figure = figureRef.current;
    if (!d || !figure) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    figure.style.transition = "none";
    figure.style.transform = `translate(${dx * 0.5}px, ${dy}px) scale(${1 - Math.min(Math.abs(dy), 300) / 1800})`;
    document.querySelector<HTMLElement>(".lightbox__backdrop")!.style.opacity = String(1 - Math.min(Math.abs(dy), 320) / 480);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag.current;
    const figure = figureRef.current;
    drag.current = null;
    if (!d || !figure) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    const backdrop = document.querySelector<HTMLElement>(".lightbox__backdrop");
    const reset = () => {
      figure.style.transition = `transform 0.35s ${EASE}`;
      figure.style.transform = "";
      if (backdrop) backdrop.style.opacity = "";
    };
    if (dy > 110 && dy > Math.abs(dx)) {
      figure.style.transition = "";
      figure.style.transform = "";
      if (backdrop) backdrop.style.opacity = "";
      close();
    } else if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy)) {
      reset();
      go(dx < 0 ? 1 : -1);
    } else {
      reset();
    }
  };

  return (
    <div
      className={`lightbox ${closing ? "is-closing" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={`Foto ampliada: ${photo.caption}`}
    >
      <div className="lightbox__backdrop" onClick={close} />
      <div
        className="lightbox__stage"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClick={(e) => e.target === e.currentTarget && close()}
      >
        <div className="lightbox__figure" ref={figureRef}>
          <img key={photo.id} src={photo.src} alt={photo.alt} draggable={false} />
        </div>
      </div>

      <button className="lightbox__close" ref={closeRef} type="button" onClick={close} aria-label="Fechar foto">
        <Icon name="x" size={22} />
      </button>
      <div className="lightbox__bar">
        {photos.length > 1 && (
          <button type="button" onClick={() => go(-1)} aria-label="Foto anterior">
            <Icon name="arrowLeft" size={22} />
          </button>
        )}
        <p>
          <strong>{photo.caption}</strong>
          <span>
            {String(index + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
          </span>
        </p>
        {photos.length > 1 && (
          <button type="button" onClick={() => go(1)} aria-label="Próxima foto">
            <Icon name="arrow" size={22} />
          </button>
        )}
      </div>
    </div>
  );
}

type PhotoProps = {
  photo: PhotoData;
  group: PhotoData[];
  className?: string;
  caption?: boolean;
  sizes?: string;
  loading?: "lazy" | "eager";
  reveal?: boolean;
};

// Foto clicável: abre o lightbox a partir da própria miniatura.
export function Photo({ photo, group, className = "", caption = true, loading = "lazy", reveal = true }: PhotoProps) {
  const ctx = useContext(LightboxContext)!;
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (el) ctx.registry.set(photo.id, el);
    return () => {
      ctx.registry.delete(photo.id);
    };
  }, [ctx.registry, photo.id]);
  return (
    <figure className={`photo ${className}`} {...(reveal ? { "data-reveal": "" } : {})}>
      <button
        type="button"
        className="photo__button"
        onClick={() =>
          ctx.open(
            group,
            group.findIndex((p) => p.id === photo.id),
          )
        }
        aria-label={`Ampliar foto: ${photo.caption}`}
      >
        <img
          ref={ref}
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          loading={loading}
          decoding="async"
          style={{ objectPosition: photo.position }}
        />
        <span className="photo__zoom" aria-hidden="true">
          <Icon name="expand" size={18} />
        </span>
      </button>
      {caption && <figcaption>{photo.caption}</figcaption>}
    </figure>
  );
}
