export function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="statCard">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
