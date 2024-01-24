import { useRoutes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import WithCorp from "./pages/WithCorp";

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "react_corp", element: <WithCorp /> },
    ],
  },
];

const RouteConf = () => {
  const routeConfig = useRoutes(routes);
  return routeConfig;
};

export default RouteConf;
