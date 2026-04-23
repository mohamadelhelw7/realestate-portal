export default function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-gray-300 bg-white">
      <div className="px-4 py-2.5 bg-gray-100 border-b border-gray-300 text-sm font-medium text-gray-700">
        {title}
      </div>
      <div className="p-4 flex flex-col gap-3">{children}</div>
    </div>
  );
}
