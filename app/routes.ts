import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("units", "routes/units._index.tsx"),
  route("units/new", "routes/units.new.tsx"),
  route("units/:id", "routes/units.$id.edit.tsx"),
  route("units/:id/images", "routes/units.$id.images.tsx"),
] satisfies RouteConfig;
