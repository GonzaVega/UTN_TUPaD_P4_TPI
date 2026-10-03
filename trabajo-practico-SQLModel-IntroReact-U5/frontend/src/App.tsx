import type { Producto } from "./types/producto";
import { Navbar } from "./components/Navbar";
import { ProductoForm } from "./components/ProductoForm";
import { ProductoList } from "./components/ProductoList";
import { Footer } from "./components/Footer";

const PRODUCTOS_INICIALES: Producto[] = [
  {
    id: 1,
    nombre: "iPhone 15",
    descripcion: "Smartphone Apple 128GB pantalla Super Retina XDR",
    precio: 999.0,
    categoria: "Electrónica",
  },
  {
    id: 2,
    nombre: "Remera Nike",
    descripcion: "Remera deportiva clásica de algodón y poliéster",
    precio: 35.0,
    categoria: "Ropa",
  },
  {
    id: 3,
    nombre: "Yerba Mate 1kg",
    descripcion: "Yerba mate tradicional con palo de estacionamiento natural",
    precio: 8.0,
    categoria: "Alimentos",
  },
  {
    id: 4,
    nombre: "Silla Ergonómica",
    descripcion: "Silla giratoria de oficina con soporte lumbar ajustable",
    precio: 250.0,
    categoria: "Hogar",
  },
  {
    id: 5,
    nombre: "Pelota de Fútbol",
    descripcion: "Pelota oficial de fútbol campo número 5 cosida a mano",
    precio: 45.0,
    categoria: "Deportes",
  },
];

export function App() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-800 font-sans antialiased px-4 selection:bg-indigo-100 selection:text-indigo-800">
      <div className="max-w-2xl mx-auto">
        <Navbar />

        <main>
          <ProductoForm />

          <ProductoList productos={PRODUCTOS_INICIALES} />
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;
