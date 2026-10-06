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

-- Volcando estructura para tabla sabor_aroma.productos
CREATE TABLE IF NOT EXISTS `productos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(10) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `categoria` varchar(50) NOT NULL,
  `descripcion` text,
  `precio` int NOT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo` (`codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sabor_aroma.productos: ~12 rows (aproximadamente)
INSERT INTO `productos` (`id`, `codigo`, `nombre`, `categoria`, `descripcion`, `precio`, `imagen`) VALUES
	(1, 'P001', 'Hamburguesa Artesanal', 'pizzas-hamburguesas', 'Carne de res de 200g, queso cheddar fundido y tocino.', 11990, 'img/hamburguesa-index.webp'),
	(2, 'P002', 'Pizza Pepperoni Especial', 'pizzas-hamburguesas', 'Masa madre, queso mozzarella y abundante pepperoni.', 14990, 'img/pizza-pepperoni.jpg'),
	(3, 'P003', 'Ensalada César con Pollo', 'saludable', 'Lechuga fresca, pollo a la parrilla y aderezo césar.', 8990, 'img/ceasar-index.jpg'),
	(4, 'P004', 'Brownie con Helado', 'postres', 'Brownie de chocolate servido con helado de vainilla.', 5990, 'img/brownie-helado.jpg'),
	(5, 'P005', 'Batido Tropical', 'bebidas', 'Mezcla natural de mango, maracuyá y fresas.', 4290, 'img/batido-tropical.jpg'),
	(6, 'P006', 'Tacos al Pastor', 'ofertas', 'Tortillas de maíz con carne adobada y piña.', 9490, 'img/Tacos-Al-Pastor.jpg'),
	(7, 'P007', 'Lasaña Bolognesa', 'pizzas-hamburguesas', 'Capas de pasta con boloñesa y queso gratinado.', 12990, 'img/lasaña-boloñesa.jpg'),
	(8, 'P008', 'Sushi Roll California', 'saludable', 'Rollos de cangrejo o salmon, palta, pepino y ajonjolí.', 13490, 'img/sushi-index.jpg'),
	(9, 'P009', 'Club Sándwich Doble', 'ofertas', 'Pan tostado con pavo, queso y papas fritas.', 7990, 'img/club-sandwich-doble.png'),
	(10, 'P010', 'Alitas BBQ (8 Piezas)', 'ofertas', 'Alitas crujientes bañadas en salsa BBQ.', 10490, 'img/alitas-bbq.webp'),
	(11, 'P011', 'Cheesecake de Frutos Rojos', 'postres', 'Pastel de queso cremoso con mermelada.', 5290, 'img/Cheesecake de Frutos Rojos.jpg'),
	(12, 'P012', 'Café Cappuccino Frappé', 'bebidas', 'Café licuado con hielo, leche y crema.', 3890, 'img/Café Cappuccino Frappé.jpg');

-- Volcando estructura para tabla sabor_aroma.usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `region` varchar(100) DEFAULT NULL,
  `comuna` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla sabor_aroma.usuarios: ~3 rows (aproximadamente)
INSERT INTO `usuarios` (`id`, `nombre`, `email`, `password`, `region`, `comuna`, `created_at`) VALUES
	(1, 'Cliente Gmail', 'cliente.prueba@gmail.com', '123456', 'Región Metropolitana', 'Santiago', '2026-10-06 17:33:04'),
	(2, 'Estudiante Duoc', 'estudiante@duocuc.cl', '123456', 'Región Metropolitana', 'Providencia', '2026-10-06 17:33:04'),
	(3, 'Profesor Duoc', 'profesor@profesor.duoc.cl', '123456', 'Región Metropolitana', 'San Joaquín', '2026-10-06 17:33:04');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
