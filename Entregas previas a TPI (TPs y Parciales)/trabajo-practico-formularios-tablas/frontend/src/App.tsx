import { Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { CategoriasPage } from "./pages/CategoriasPage";
import { ProductsPage } from "./pages/ProductsPage";
import { IngredientesPage } from "./pages/IngredientesPage";

export function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/categorias" replace />} />
          <Route path="/categorias" element={<CategoriasPage />} />
          <Route path="/productos" element={<ProductsPage />} />
          <Route path="/ingredientes" element={<IngredientesPage />} />
          <Route path="*" element={<Navigate to="/categorias" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
