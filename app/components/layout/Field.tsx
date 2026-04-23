export default function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-600">
        {label} {required && "*"}
      </label>
      {children}
    </div>
  );
}
