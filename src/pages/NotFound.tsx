import Button from "../components/Button";
import { useMeta } from "../hooks/useMeta";

export default function NotFound() {
  useMeta("Página não encontrada | Central Academia Premium", "Página não encontrada.", "/");
  return (
    <section className="section not-found">
      <div className="wrap">
        <p className="eyebrow">Erro 404</p>
        <h1>
          Essa página
          <br />
          <span>não existe.</span>
        </h1>
        <div className="actions-row">
          <Button to="/" icon="arrow" trailing>
            Voltar ao início
          </Button>
          <Button to="/unidades" variant="outline-dark">
            Ver unidades
          </Button>
        </div>
      </div>
    </section>
  );
}
