import { lazy } from "react";
import Loadable from "./components/Loadable";
import sessionRoutes from "./views/sessions/session-routes";

const Image = Loadable(lazy(() => import("app/views/projects/Image")));

const routes = [
  {
    path: "/",
    element: <Image />,
  },

  ...sessionRoutes
];

export default routes;
