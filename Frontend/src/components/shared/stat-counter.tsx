export function StatCounter({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="text-center">
      <p className="font-mono text-3xl text-primary md:text-4xl">{value}</p>
      <p className="mt-1 text-xs text-dark/50">{label}</p>
    </div>
  );
}
