import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AvisLegal from "./pages/AvisLegal";
// import Shop from "./pages/Shop";

const router = createBrowserRouter(
  [
    { path: "/", element: <Home /> },
    { path: "/about", element: <About /> },
    { path: "/contact", element: <Contact /> },
    { path: "/avis-legal", element: <AvisLegal /> },
    // { path: "/shop", element: <Shop /> }
  ],
  {
    basename: import.meta.env.BASE_URL,  // 👈 molt important per GitHub Pages
  }
);

export default router;

