import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/index";
import New from "./pages/new";
import Profile from "./pages/profile";
import Badge from "./pages/badge";

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
    path: "/p/:p",
    element: <Profile />,
  },
  {
    path: "/b/:naddr",
    element: <Badge />,
  },
]);
