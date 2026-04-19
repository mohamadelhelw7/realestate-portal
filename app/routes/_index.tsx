import { redirect } from "react-router";

export function loader() {
  return redirect("/units");
}

export default function Index() {
  return null;
}
