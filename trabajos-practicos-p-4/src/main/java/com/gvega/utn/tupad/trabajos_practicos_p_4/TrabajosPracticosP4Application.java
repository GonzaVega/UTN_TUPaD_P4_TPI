package com.gvega.utn.tupad.trabajos_practicos_p_4;

import com.gvega.utn.tupad.trabajos_practicos_p_4.dto.categoria.CategoriaCreate;
import com.gvega.utn.tupad.trabajos_practicos_p_4.dto.categoria.CategoriaDto;
import com.gvega.utn.tupad.trabajos_practicos_p_4.dto.detallePedido.DetallePedidoCreate;
import com.gvega.utn.tupad.trabajos_practicos_p_4.dto.pedido.PedidoEdit;
import com.gvega.utn.tupad.trabajos_practicos_p_4.dto.producto.ProductoCreate;
import com.gvega.utn.tupad.trabajos_practicos_p_4.dto.producto.ProductoDto;
import com.gvega.utn.tupad.trabajos_practicos_p_4.dto.usuario.UsuarioCreate;
import com.gvega.utn.tupad.trabajos_practicos_p_4.dto.usuario.UsuarioDto;
import com.gvega.utn.tupad.trabajos_practicos_p_4.entity.enums.Estado;
import com.gvega.utn.tupad.trabajos_practicos_p_4.entity.enums.FormaPago;
import com.gvega.utn.tupad.trabajos_practicos_p_4.entity.enums.Rol;
import com.gvega.utn.tupad.trabajos_practicos_p_4.service.CategoriaService;
import com.gvega.utn.tupad.trabajos_practicos_p_4.service.PedidoService;
import com.gvega.utn.tupad.trabajos_practicos_p_4.service.ProductoService;
import com.gvega.utn.tupad.trabajos_practicos_p_4.service.UsuarioService;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.LocalDate;
import java.util.List;

@SpringBootApplication
public class TrabajosPracticosP4Application {

	public static void main(String[] args) {
		SpringApplication.run(TrabajosPracticosP4Application.class, args);
	}

	@Bean
	public CommandLineRunner initData(UsuarioService usuarioService, CategoriaService categoriaService,
			ProductoService productoService, PedidoService pedidoService) {
		return args -> {
			UsuarioDto admin = usuarioService.create(new UsuarioCreate(
					"Gonzalo",
					"Vega",
					"gonzalo.vega@mail.com",
					"3510000001",
					"admin123",
					Rol.ADMIN));

			UsuarioDto usuario = usuarioService.create(new UsuarioCreate(
					"Juan",
					"Perez",
					"juan.perez@mail.com",
					"3510000002",
					"usuario123",
					Rol.USUARIO));

			CategoriaDto electronica = categoriaService.create(new CategoriaCreate(
					"Electronica",
					"Productos electronicos y gadgets"));

			CategoriaDto indumentaria = categoriaService.create(new CategoriaCreate(
					"Indumentaria",
					"Ropa y accesorios"));

			CategoriaDto deportes = categoriaService.create(new CategoriaCreate(
					"Deportes",
					"Articulos deportivos"));

			ProductoDto smartphone = productoService.create(new ProductoCreate(
					"Smartphone",
					499999.99,
					"Smartphone gama media con 128GB",
					50,
					"smartphone.jpg",
					true,
					electronica.id()));

			ProductoDto notebook = productoService.create(new ProductoCreate(
					"Notebook",
					899999.99,
					"Notebook 15.6 pulgadas, 16GB RAM",
					30,
					"notebook.jpg",
					true,
					electronica.id()));

			ProductoDto auriculares = productoService.create(new ProductoCreate(
					"Auriculares",
					89999.99,
					"Auriculares inalambricos Bluetooth",
					100,
					"auriculares.jpg",
					true,
					electronica.id()));

			ProductoDto remera = productoService.create(new ProductoCreate(
					"Remera",
					24999.99,
					"Remera de algodon talle M",
					200,
					"remera.jpg",
					true,
					indumentaria.id()));

			ProductoDto jean = productoService.create(new ProductoCreate(
					"Jean",
					44999.99,
					"Jean clasico talle 42",
					80,
					"jean.jpg",
					true,
					indumentaria.id()));

			ProductoDto campera = productoService.create(new ProductoCreate(
					"Campera",
					119999.99,
					"Campera de invierno impermeable",
					40,
					"campera.jpg",
					true,
					indumentaria.id()));

			ProductoDto zapatillas = productoService.create(new ProductoCreate(
					"Zapatillas",
					129999.99,
					"Zapatillas running talles 38 a 45",
					60,
					"zapatillas.jpg",
					true,
					deportes.id()));

			ProductoDto pelota = productoService.create(new ProductoCreate(
					"Pelota de futbol",
					34999.99,
					"Pelota de futbol nro 5",
					150,
					"pelota.jpg",
					true,
					deportes.id()));

			ProductoDto mancuernas = productoService.create(new ProductoCreate(
					"Mancuernas",
					79999.99,
					"Par de mancuernas 5kg",
					45,
					"mancuernas.jpg",
					true,
					deportes.id()));

			ProductoDto bicicleta = productoService.create(new ProductoCreate(
					"Bicicleta",
					599999.99,
					"Bicicleta mountain bike 29",
					20,
					"bicicleta.jpg",
					true,
					deportes.id()));

			pedidoService.create(new PedidoEdit(
					null,
					LocalDate.now(),
					Estado.PENDIENTE,
					FormaPago.TARJETA,
					admin.id(),
					List.of(
							new DetallePedidoCreate(1, smartphone.id()),
							new DetallePedidoCreate(2, auriculares.id()))));

			pedidoService.create(new PedidoEdit(
					null,
					LocalDate.now(),
					Estado.CONFIRMADO,
					FormaPago.TRANSFERENCIA,
					usuario.id(),
					List.of(
							new DetallePedidoCreate(1, notebook.id()),
							new DetallePedidoCreate(1, remera.id()),
							new DetallePedidoCreate(1, zapatillas.id()))));

			pedidoService.create(new PedidoEdit(
					null,
					LocalDate.now(),
					Estado.TERMINADO,
					FormaPago.EFECTIVO,
					usuario.id(),
					List.of(
							new DetallePedidoCreate(2, pelota.id()),
							new DetallePedidoCreate(1, mancuernas.id()))));

			System.out.println("=== Consigna 3.a ===");				
			System.out.println("=== USUARIOS ===");
			usuarioService.getAll().forEach(System.out::println);

			System.out.println("=== Consigna 3.b ===");				
			System.out.println("=== PEDIDOS ===");
			pedidoService.getAll().forEach(System.out::println);
			
			System.out.println("=== Consigna 3.c ===");				
			System.out.println("=== CATEGORIAS ===");
			categoriaService.getAll().forEach(System.out::println);

			System.out.println("=== Consigna 3.d ===");				
			System.out.println("=== PRODUCTOS ===");
			productoService.getAll().forEach(System.out::println);

		};
	}
}
