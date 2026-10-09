-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         8.4.3 - MySQL Community Server - GPL
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para sabor_aroma
CREATE DATABASE IF NOT EXISTS `sabor_aroma` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `sabor_aroma`;

-- Volcando estructura para tabla sabor_aroma.carrito
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sabor_aroma.carrito: ~0 rows (aproximadamente)
INSERT INTO `carrito` (`id`, `usuario_id`, `producto_id`, `cantidad`, `created_at`) VALUES
	(1, 3, 1, 1, '2026-10-09 03:01:38'),
	(2, 3, 2, 1, '2026-10-09 03:01:42');

-- Volcando estructura para tabla sabor_aroma.categorias
CREATE TABLE IF NOT EXISTS `categorias` (
  `id_categoria` int NOT NULL AUTO_INCREMENT,
  `nombre_categoria` varchar(100) NOT NULL,
  PRIMARY KEY (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sabor_aroma.categorias: ~4 rows (aproximadamente)
INSERT INTO `categorias` (`id_categoria`, `nombre_categoria`) VALUES
	(1, 'Comida Rapida'),
	(2, 'Saludable'),
	(3, 'Postres'),
	(4, 'Bebidas');

-- Volcando estructura para tabla sabor_aroma.detalle_ordenes
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
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sabor_aroma.detalle_ordenes: ~22 rows (aproximadamente)
INSERT INTO `detalle_ordenes` (`id`, `orden_id`, `producto_id`, `cantidad`, `precio_unitario`) VALUES
	(1, 1, 1, 2, 11990.00),
	(2, 1, 5, 2, 4290.00),
	(3, 2, 2, 1, 14990.00),
	(4, 2, 4, 1, 5990.00),
	(5, 3, 3, 1, 8990.00),
	(6, 3, 12, 1, 3890.00),
	(7, 4, 8, 2, 13490.00),
	(8, 4, 5, 1, 4290.00),
	(9, 5, 6, 2, 9490.00),
	(10, 5, 10, 1, 10490.00),
	(11, 6, 7, 1, 12990.00),
	(12, 6, 11, 1, 5290.00),
	(13, 7, 9, 2, 7990.00),
	(14, 7, 12, 2, 3890.00),
	(15, 8, 1, 1, 11990.00),
	(16, 8, 2, 1, 14990.00),
	(17, 8, 4, 2, 5990.00),
	(18, 9, 10, 2, 10490.00),
	(19, 9, 5, 2, 4290.00),
	(20, 10, 8, 1, 13490.00),
	(21, 10, 3, 1, 8990.00),
	(22, 10, 11, 1, 5290.00);

-- Volcando estructura para tabla sabor_aroma.ofertas
CREATE TABLE IF NOT EXISTS `ofertas` (
  `id_oferta` int NOT NULL AUTO_INCREMENT,
  `porcentaje_descuento` int NOT NULL,
  PRIMARY KEY (`id_oferta`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sabor_aroma.ofertas: ~3 rows (aproximadamente)
INSERT INTO `ofertas` (`id_oferta`, `porcentaje_descuento`) VALUES
	(1, 15),
	(2, 20),
	(3, 25);

-- Volcando estructura para tabla sabor_aroma.ordenes
CREATE TABLE IF NOT EXISTS `ordenes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  `estado` varchar(50) DEFAULT 'Pendiente',
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `ordenes_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sabor_aroma.ordenes: ~10 rows (aproximadamente)
INSERT INTO `ordenes` (`id`, `usuario_id`, `total`, `fecha`, `estado`) VALUES
	(1, 1, 32560.00, '2026-09-20 12:30:00', 'Entregado'),
	(2, 2, 20980.00, '2026-09-22 19:15:00', 'Entregado'),
	(3, 1, 12880.00, '2026-09-25 14:00:00', 'Entregado'),
	(4, 3, 31270.00, '2026-09-28 20:45:00', 'Completado'),
	(5, 2, 29470.00, '2026-10-01 13:10:00', 'Entregado'),
	(6, 1, 18280.00, '2026-10-03 21:00:00', 'Entregado'),
	(7, 2, 23760.00, '2026-10-05 18:30:00', 'En Camino'),
	(8, 3, 38960.00, '2026-10-07 14:20:00', 'Completado'),
	(9, 1, 29560.00, '2026-10-08 19:40:00', 'Pendiente'),
	(10, 2, 27770.00, '2026-10-09 11:15:00', 'Pendiente');

-- Volcando estructura para tabla sabor_aroma.productos
CREATE TABLE IF NOT EXISTS `productos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(10) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `id_categoria` int NOT NULL,
  `id_oferta` int DEFAULT NULL,
  `descripcion` text,
  `precio` int NOT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `imagen` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo` (`codigo`),
  KEY `fk_productos_categorias` (`id_categoria`),
  KEY `fk_productos_ofertas` (`id_oferta`),
  CONSTRAINT `fk_productos_categorias` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`),
  CONSTRAINT `fk_productos_ofertas` FOREIGN KEY (`id_oferta`) REFERENCES `ofertas` (`id_oferta`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sabor_aroma.productos: ~12 rows (aproximadamente)
INSERT INTO `productos` (`id`, `codigo`, `nombre`, `id_categoria`, `id_oferta`, `descripcion`, `precio`, `stock`, `imagen`) VALUES
	(1, 'P001', 'Hamburguesa Artesanal', 1, NULL, 'Carne de res de 200g, queso cheddar fundido y tocino.', 11990, 25, 'img/hamburguesa-index.webp'),
	(2, 'P002', 'Pizza Pepperoni Especial', 1, NULL, 'Masa madre, queso mozzarella y abundante pepperoni.', 14990, 15, 'img/pizza-pepperoni.jpg'),
	(3, 'P003', 'Ensalada César con Pollo', 2, NULL, 'Lechuga fresca, pollo a la parrilla y aderezo césar.', 8990, 30, 'img/ceasar-index.jpg'),
	(4, 'P004', 'Brownie con Helado', 3, NULL, 'Brownie de chocolate servido con helado de vainilla.', 5990, 20, 'img/brownie-helado.jpg'),
	(5, 'P005', 'Batido Tropical', 4, NULL, 'Mezcla natural de mango, maracuyá y fresas.', 4290, 50, 'img/batido-tropical.jpg'),
	(6, 'P006', 'Tacos al Pastor', 1, 1, 'Tortillas de maíz con carne adobada y piña.', 9490, 18, 'img/Tacos-Al-Pastor.jpg'),
	(7, 'P007', 'Lasaña Bolognesa', 1, NULL, 'Capas de pasta con boloñesa y queso gratinado.', 12990, 12, 'img/lasaña-boloñesa.jpg'),
	(8, 'P008', 'Sushi Roll California', 2, NULL, 'Rollos de cangrejo o salmon, palta, pepino y ajonjolí.', 13490, 22, 'img/sushi-index.jpg'),
	(9, 'P009', 'Club Sándwich Doble', 1, 2, 'Pan tostado con pavo, queso y papas fritas.', 7990, 40, 'img/club-sandwich-doble.png'),
	(10, 'P010', 'Alitas BBQ (8 Piezas)', 1, 3, 'Alitas crujientes bañadas en salsa BBQ.', 10490, 35, 'img/alitas-bbq.webp'),
	(11, 'P011', 'Cheesecake de Frutos Rojos', 3, NULL, 'Pastel de queso cremoso con mermelada.', 5290, 15, 'img/Cheesecake de Frutos Rojos.jpg'),
	(12, 'P012', 'Café Cappuccino Frappé', 4, NULL, 'Café licuado con hielo, leche y crema.', 3890, 60, 'img/Café Cappuccino Frappé.jpg');

-- Volcando estructura para tabla sabor_aroma.usuarios
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sabor_aroma.usuarios: ~3 rows (aproximadamente)
INSERT INTO `usuarios` (`id`, `nombre`, `email`, `password`, `region`, `comuna`, `esadmin`, `created_at`) VALUES
	(1, 'Cliente Gmail', 'cliente.prueba@gmail.com', '123456', 'Región Metropolitana', 'Santiago', 0, '2026-10-06 17:33:04'),
	(2, 'Estudiante Duoc', 'estudiante@duocuc.cl', '123456', 'Región Metropolitana', 'Providencia', 0, '2026-10-06 17:33:04'),
	(3, 'Profesor Duoc', 'profesor@profesor.duoc.cl', '123456', 'Región Metropolitana', 'San Joaquín', 1, '2026-10-06 17:33:04');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
