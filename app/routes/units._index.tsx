import { Link } from "react-router";
import type { Route } from "./+types/units._index";
import { getUnits } from "~/lib/api.server";
import { Header } from "~/components/layout/Header";

export async function loader() {
  const result = await getUnits({ take: "100" });
  return { units: result.units };
}

export default function UnitsPage({ loaderData }: Route.ComponentProps) {
  const { units } = loaderData;

  return (
    <div>
      <Header
        title="Units"
        action={
          <Link
            to="/units/new"
            className="bg-gray-900 text-white text-sm px-4 py-2 hover:bg-gray-700"
          >
            + Add unit
          </Link>
        }
      />

      <div className="p-6">
        <table className="w-full border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300">
              <th className="text-left px-4 py-2.5 font-medium text-gray-700 border-r border-gray-300">
                Title
              </th>
              <th className="text-left px-4 py-2.5 font-medium text-gray-700 border-r border-gray-300">
                City
              </th>
              <th className="text-left px-4 py-2.5 font-medium text-gray-700 border-r border-gray-300">
                Type
              </th>
              <th className="text-left px-4 py-2.5 font-medium text-gray-700 border-r border-gray-300">
                Purpose
              </th>
              <th className="text-left px-4 py-2.5 font-medium text-gray-700 border-r border-gray-300">
                Price
              </th>
              <th className="text-left px-4 py-2.5 font-medium text-gray-700 border-r border-gray-300">
                Status
              </th>
              <th className="text-left px-4 py-2.5 font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {units.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-400">
                  No units yet
                </td>
              </tr>
            )}
            {units.map((unit, i) => (
              <tr
                key={unit.id}
                className={`border-b border-gray-200 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
              >
                <td className="px-4 py-2.5 border-r border-gray-200 text-gray-900">
                  {unit.title}
                </td>
                <td className="px-4 py-2.5 border-r border-gray-200 text-gray-600">
                  {unit.city}
                </td>
                <td className="px-4 py-2.5 border-r border-gray-200 text-gray-600 capitalize">
                  {unit.type}
                </td>
                <td className="px-4 py-2.5 border-r border-gray-200 text-gray-600 capitalize">
                  {unit.purpose}
                </td>
                <td className="px-4 py-2.5 border-r border-gray-200 text-gray-600">
                  EGP {unit.price.toLocaleString()}
                </td>
                <td className="px-4 py-2.5 border-r border-gray-200">
                  <span
                    className={`text-xs px-2 py-0.5 border ${
                      unit.status === "available"
                        ? "border-green-400 text-green-700 bg-green-50"
                        : unit.status === "sold"
                          ? "border-red-400 text-red-700 bg-red-50"
                          : "border-yellow-400 text-yellow-700 bg-yellow-50"
                    }`}
                  >
                    {unit.status}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex gap-2">
                    <Link
                      to={`/units/${unit.id}`}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
