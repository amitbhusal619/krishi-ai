export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="font-mono text-xs tracking-wide text-primary">
        {eyebrow.toUpperCase()}
      </span>
      <h2 className="mt-3 font-display text-3xl text-dark md:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-dark/60">{description}</p>
      )}
    </div>
  );
}
