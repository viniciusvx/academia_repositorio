export default function Brand({ subtitle = "Academia Premium" }: { subtitle?: string }) {
  return (
    <span className="brand" aria-label={`Central ${subtitle}`}>
      <span className="brand__mark" aria-hidden="true">
        <i />
      </span>
      <span className="brand__type">
        <strong>Central</strong>
        <small>{subtitle}</small>
      </span>
    </span>
  );
}
