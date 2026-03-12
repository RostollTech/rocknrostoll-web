import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AvisLegal from "./pages/AvisLegal";
import Shop from "./pages/Shop";
import Comanda from "./pages/Comanda";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";

const router = createBrowserRouter(
  [
    {
      element: <Layout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/about", element: <About /> },
        { path: "/contact", element: <Contact /> },
        { path: "/avis-legal", element: <AvisLegal /> },
        { path: "/shop", element: <Shop /> },
        { path: "/comanda", element: <Comanda /> },
        { path: "/success", element: <Success /> },
        { path: "/cancel", element: <Cancel /> },
        { path: "*", element: <NotFound /> }
      ]
    }
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
);

export default router;
