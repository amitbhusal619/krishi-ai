export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
      <div>
        <h1 className="font-display text-2xl text-dark md:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-dark/50">{description}</p>}
      </div>
      {action}
    </div>
  );
}
