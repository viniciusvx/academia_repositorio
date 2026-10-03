export type IconName =
  | "arrow"
  | "arrowLeft"
  | "check"
  | "clock"
  | "expand"
  | "instagram"
  | "map"
  | "menu"
  | "phone"
  | "pin"
  | "whatsapp"
  | "x";

const paths: Record<IconName, React.ReactNode> = {
  arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
  arrowLeft: <path d="M19 12H5m5-5-5 5 5 5" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  expand: <path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7" />,
  instagram: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="5" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="M17.5 6.5h.01" />
    </>
  ),
  map: (
    <>
      <path d="m3 6 5-2 8 2 5-2v14l-5 2-8-2-5 2Z" />
      <path d="M8 4v14m8-12v14" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  phone: (
    <path d="M7 3H4.5A1.5 1.5 0 0 0 3 4.5 16.5 16.5 0 0 0 19.5 21a1.5 1.5 0 0 0 1.5-1.5V17l-4-1.5-1.2 2a13 13 0 0 1-9.3-9.3l2-1.2Z" />
  ),
  pin: (
    <>
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M20 11.5a8 8 0 0 1-11.7 7L4 20l1.4-4.2A8 8 0 1 1 20 11.5Z" />
      <path d="M8.2 8.1c.7 3.5 2.3 5.1 5.8 5.8" />
    </>
  ),
  x: <path d="m6 6 12 12M18 6 6 18" />,
};

export default function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
      width={size}
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}
