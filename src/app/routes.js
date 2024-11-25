import { lazy } from "react";
import Loadable from "./components/Loadable";
import sessionRoutes from "./views/sessions/session-routes";
import MatxLayout from "./components/MatxLayout/MatxLayout";
import AuthGuard from "./auth/AuthGuard";

const Image = Loadable(lazy(() => import("app/views/projects/Image")));

const routes = [
  {
  element: (
    <AuthGuard>
      <MatxLayout />
    </AuthGuard>
  ),
  children: [
  {
    path: "/",
    element: <Image />,
  },
]
},

  ...sessionRoutes
];

export default routes;
