interface ProductoFormProps {
  onGuardar?: () => void;
  onLimpiar?: () => void;
}

export const ProductoForm = ({ onGuardar, onLimpiar }: ProductoFormProps) => {
  const handleGuardar = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (onGuardar) {
      onGuardar();
    } else {
      alert(
        "Aviso: Esta pantalla corresponde al maquetado estático (TP5 - Unidad 5). Se estima que la funcionalidad de guardado y persistencia con la API se implementará posteriormente.",
      );
    }
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-xl mx-auto mb-6">
      <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-1.5">
        <span className="text-xl leading-none font-semibold text-gray-700">
          +
        </span>
        <span>Nuevo Producto</span>
      </h2>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label
            htmlFor="nombre"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Nombre
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            placeholder="Ej: Auriculares Bluetooth"
            className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
          />
        </div>

        <div>
          <label
            htmlFor="descripcion"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Descripción
          </label>
          <input
            id="descripcion"
            name="descripcion"
            type="text"
            placeholder="Ej: Inalámbricos con cancelación de ruido"
            className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
          />
        </div>

        <div>
          <label
            htmlFor="precio"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Precio ($)
          </label>
          <input
            id="precio"
            name="precio"
            type="text"
            placeholder="Ej: 99.99"
            className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
          />
        </div>

        <div>
          <label
            htmlFor="categoria"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Categoría
          </label>
          <input
            id="categoria"
            name="categoria"
            type="text"
            placeholder="Ej: Electrónica"
            className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            onClick={handleGuardar}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm py-2.5 px-4 rounded-lg transition-colors cursor-pointer"
          >
            Guardar producto
          </button>
          <button
            type="reset"
            onClick={onLimpiar}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm py-2.5 px-4 rounded-lg transition-colors cursor-pointer"
          >
            Limpiar
          </button>
        </div>
      </form>
    </section>
  );
};
