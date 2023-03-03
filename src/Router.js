import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/index";
import New from "./pages/new";
import Profile from "./pages/profile";
import Badge from "./pages/badge";
import EditBadge from "./pages/editbadge";
import Login from "./pages/login";

export default createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/new",
    element: <New />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/p/:p",
    element: <Profile />,
  },
  {
    path: "/b/:naddr",
    element: <Badge />,
  },
  {
    path: "/b/:naddr/edit",
    element: <EditBadge />,
  },
]);
