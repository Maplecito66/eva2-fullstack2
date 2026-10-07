-- 1. Desactivar temporalmente la revisión de claves foráneas
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- 2. Creación y selección de la base de datos
CREATE DATABASE IF NOT EXISTS `sabor_aroma` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `sabor_aroma`;

-- 3. Tabla: usuarios (Padre)
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `region` varchar(100) DEFAULT NULL,
  `comuna` varchar(100) DEFAULT NULL,
  `esadmin` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Datos para usuarios (0 = Usuario normal, 1 = Administrador)
INSERT INTO `usuarios` (`id`, `nombre`, `email`, `password`, `region`, `comuna`, `esadmin`, `created_at`) VALUES
  (1, 'Cliente Gmail', 'cliente.prueba@gmail.com', '123456', 'Región Metropolitana', 'Santiago', 0, '2026-10-06 17:33:04'),
  (2, 'Estudiante Duoc', 'estudiante@duocuc.cl', '123456', 'Región Metropolitana', 'Providencia', 0, '2026-10-06 17:33:04'),
  (3, 'Profesor Duoc', 'profesor@profesor.duoc.cl', '123456', 'Región Metropolitana', 'San Joaquín', 1, '2026-10-06 17:33:04');

-- 4. Tabla: productos (Padre)
CREATE TABLE IF NOT EXISTS `productos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(10) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `categoria` varchar(50) NOT NULL,
  `descripcion` text,
  `precio` int NOT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `imagen` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo` (`codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Datos para productos (incluyendo columna stock)
INSERT INTO `productos` (`id`, `codigo`, `nombre`, `categoria`, `descripcion`, `precio`, `stock`, `imagen`) VALUES
  (1, 'P001', 'Hamburguesa Artesanal', 'pizzas-hamburguesas', 'Carne de res de 200g, queso cheddar fundido y tocino.', 11990, 25, 'img/hamburguesa-index.webp'),
  (2, 'P002', 'Pizza Pepperoni Especial', 'pizzas-hamburguesas', 'Masa madre, queso mozzarella y abundante pepperoni.', 14990, 15, 'img/pizza-pepperoni.jpg'),
  (3, 'P003', 'Ensalada César con Pollo', 'saludable', 'Lechuga fresca, pollo a la parrilla y aderezo césar.', 8990, 30, 'img/ceasar-index.jpg'),
  (4, 'P004', 'Brownie con Helado', 'postres', 'Brownie de chocolate servido con helado de vainilla.', 5990, 20, 'img/brownie-helado.jpg'),
  (5, 'P005', 'Batido Tropical', 'bebidas', 'Mezcla natural de mango, maracuyá y fresas.', 4290, 50, 'img/batido-tropical.jpg'),
  (6, 'P006', 'Tacos al Pastor', 'ofertas', 'Tortillas de maíz con carne adobada y piña.', 9490, 18, 'img/Tacos-Al-Pastor.jpg'),
  (7, 'P007', 'Lasaña Bolognesa', 'pizzas-hamburguesas', 'Capas de pasta con boloñesa y queso gratinado.', 12990, 12, 'img/lasaña-boloñesa.jpg'),
  (8, 'P008', 'Sushi Roll California', 'saludable', 'Rollos de cangrejo o salmon, palta, pepino y ajonjolí.', 13490, 22, 'img/sushi-index.jpg'),
  (9, 'P009', 'Club Sándwich Doble', 'ofertas', 'Pan tostado con pavo, queso y papas fritas.', 7990, 40, 'img/club-sandwich-doble.png'),
  (10, 'P010', 'Alitas BBQ (8 Piezas)', 'ofertas', 'Alitas crujientes bañadas en salsa BBQ.', 10490, 35, 'img/alitas-bbq.webp'),
  (11, 'P011', 'Cheesecake de Frutos Rojos', 'postres', 'Pastel de queso cremoso con mermelada.', 5290, 15, 'img/Cheesecake de Frutos Rojos.jpg'),
  (12, 'P012', 'Café Cappuccino Frappé', 'bebidas', 'Café licuado con hielo, leche y crema.', 3890, 60, 'img/Café Cappuccino Frappé.jpg');

-- 5. Tabla: ordenes (Hija de usuarios)
CREATE TABLE IF NOT EXISTS `ordenes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  `estado` varchar(50) DEFAULT 'Pendiente',
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `ordenes_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Tabla: detalle_ordenes (Hija de ordenes y productos)
CREATE TABLE IF NOT EXISTS `detalle_ordenes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `orden_id` int NOT NULL,
  `producto_id` int NOT NULL,
  `cantidad` int NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `orden_id` (`orden_id`),
  KEY `producto_id` (`producto_id`),
  CONSTRAINT `detalle_ordenes_ibfk_1` FOREIGN KEY (`orden_id`) REFERENCES `ordenes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `detalle_ordenes_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Tabla: carrito (Hija de usuarios y productos)
CREATE TABLE IF NOT EXISTS `carrito` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `producto_id` int NOT NULL,
  `cantidad` int NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario_producto_unique` (`usuario_id`,`producto_id`),
  KEY `producto_id` (`producto_id`),
  CONSTRAINT `carrito_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `carrito_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Reactivar verificación de claves foráneas
SET FOREIGN_KEY_CHECKS = 1;