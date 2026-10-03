import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { LightboxProvider } from "./components/Lightbox";
import Contato from "./pages/Contato";
import Estrutura from "./pages/Estrutura";
import Galeria from "./pages/Galeria";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Planos from "./pages/Planos";
import { UnidadeDetalhe, UnidadesIndex } from "./pages/Unidades";

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <LightboxProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="estrutura" element={<Estrutura />} />
            <Route path="planos" element={<Planos />} />
            <Route path="unidades" element={<UnidadesIndex />} />
            <Route path="unidades/:id" element={<UnidadeDetalhe />} />
            <Route path="galeria" element={<Galeria />} />
            <Route path="contato" element={<Contato />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </LightboxProvider>
    </BrowserRouter>
  );
}

export default App;
