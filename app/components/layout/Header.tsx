interface Props {
  title: string;
  action?: React.ReactNode;
}

export function Header({ title, action }: Props) {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-300">
      <h1 className="text-base font-semibold text-gray-900">{title}</h1>
      {action && <div>{action}</div>}
    </div>
  );
}
