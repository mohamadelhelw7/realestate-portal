import { Link, useLocation } from "react-router";

const links = [
  { label: "Units", href: "/units" },
  // { label: "Leads", href: "/leads" },
  // { label: "Sellers", href: "/sellers" },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-48 min-h-screen bg-white border-r border-gray-300 flex flex-col flex-shrink-0">
      <div className="px-4 py-4 border-b border-gray-300">
        <span className="text-sm font-semibold text-gray-900">
          Egypt Estate
        </span>
        <p className="text-xs text-gray-500 mt-0.5">Portal</p>
      </div>
      <nav className="flex flex-col mt-2">
        {links.map((link) => {
          const active = location.pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              to={link.href}
              className={`px-4 py-2.5 text-sm border-l-2 ${
                active
                  ? "border-gray-900 bg-gray-100 text-gray-900 font-medium"
                  : "border-transparent text-gray-600 hover:bg-gray-50"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
