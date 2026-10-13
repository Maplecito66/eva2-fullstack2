-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         XAMPP (MariaDB)
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
CREATE DATABASE IF NOT EXISTS `sabor_aroma` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla sabor_aroma.carrito: ~2 rows (aproximadamente)
INSERT IGNORE INTO `carrito` (`id`, `usuario_id`, `producto_id`, `cantidad`, `created_at`) VALUES
    (1, 3, 1, 1, '2026-10-09 06:01:38'),
    (2, 3, 2, 1, '2026-10-09 06:01:42');

-- Volcando estructura para tabla sabor_aroma.categorias
CREATE TABLE IF NOT EXISTS `categorias` (
  `id_categoria` int NOT NULL AUTO_INCREMENT,
  `nombre_categoria` varchar(100) NOT NULL,
  PRIMARY KEY (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla sabor_aroma.categorias: ~5 rows (aproximadamente)
INSERT IGNORE INTO `categorias` (`id_categoria`, `nombre_categoria`) VALUES
    (1, 'Comida Rapida'),
    (2, 'Saludable'),
    (3, 'Postres'),
    (4, 'Bebidas'),
    (5, 'Vegana');

-- Volcando estructura para tabla sabor_aroma.comunas
CREATE TABLE IF NOT EXISTS `comunas` (
  `id_comuna` int NOT NULL AUTO_INCREMENT,
  `nombre_comuna` varchar(100) NOT NULL,
  `id_region` int NOT NULL,
  PRIMARY KEY (`id_comuna`),
  KEY `fk_comunas_regiones` (`id_region`),
  CONSTRAINT `fk_comunas_regiones` FOREIGN KEY (`id_region`) REFERENCES `regiones` (`id_region`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=87 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla sabor_aroma.comunas: ~86 rows (aproximadamente)
INSERT IGNORE INTO `comunas` (`id_comuna`, `nombre_comuna`, `id_region`) VALUES
    (1, 'Arica', 1),
    (2, 'Camarones', 1),
    (3, 'Putre', 1),
    (4, 'General Lagos', 1),
    (5, 'Iquique', 2),
    (6, 'Alto Hospicio', 2),
    (7, 'Pozo Almonte', 2),
    (8, 'Pica', 2),
    (9, 'Antofagasta', 3),
    (10, 'Calama', 3),
    (11, 'Tocopilla', 3),
    (12, 'Mejillones', 3),
    (13, 'Copiapó', 4),
    (14, 'Vallenar', 4),
    (15, 'Caldera', 4),
    (16, 'Chañaral', 4),
    (17, 'La Serena', 5),
    (18, 'Coquimbo', 5),
    (19, 'Ovalle', 5),
    (20, 'Illapel', 5),
    (21, 'Vicuña', 5),
    (22, 'Valparaíso', 6),
    (23, 'Viña del Mar', 6),
    (24, 'Quilpué', 6),
    (25, 'Villa Alemana', 6),
    (26, 'Concón', 6),
    (27, 'San Antonio', 6),
    (28, 'Quillota', 6),
    (29, 'San Felipe', 6),
    (30, 'Los Andes', 6),
    (31, 'Santiago', 7),
    (32, 'Providencia', 7),
    (33, 'Las Condes', 7),
    (34, 'Vitacura', 7),
    (35, 'Ñuñoa', 7),
    (36, 'San Joaquín', 7),
    (37, 'La Cisterna', 7),
    (38, 'Maipú', 7),
    (39, 'Puente Alto', 7),
    (40, 'La Florida', 7),
    (41, 'Pudahuel', 7),
    (42, 'Quilicura', 7),
    (43, 'San Bernardo', 7),
    (44, 'Colina', 7),
    (45, 'Melipilla', 7),
    (46, 'Talagante', 7),
    (47, 'Rancagua', 8),
    (48, 'San Fernando', 8),
    (49, 'Pichilemu', 8),
    (50, 'Machalí', 8),
    (51, 'Rengo', 8),
    (52, 'Talca', 9),
    (53, 'Curicó', 9),
    (54, 'Linares', 9),
    (55, 'Constitución', 9),
    (56, 'Cauquenes', 9),
    (57, 'Chillán', 10),
    (58, 'Chillán Viejo', 10),
    (59, 'San Carlos', 10),
    (60, 'Bulnes', 10),
    (61, 'Concepción', 11),
    (62, 'Talcahuano', 11),
    (63, 'San Pedro de la Paz', 11),
    (64, 'Chiguayante', 11),
    (65, 'Los Ángeles', 11),
    (66, 'Coronel', 11),
    (67, 'Temuco', 12),
    (68, 'Padre Las Casas', 12),
    (69, 'Villarrica', 12),
    (70, 'Pucón', 12),
    (71, 'Angol', 12),
    (72, 'Valdivia', 13),
    (73, 'La Unión', 13),
    (74, 'Río Bueno', 13),
    (75, 'Panguipulli', 13),
    (76, 'Puerto Montt', 14),
    (77, 'Osorno', 14),
    (78, 'Castro', 14),
    (79, 'Puerto Varas', 14),
    (80, 'Ancud', 14),
    (81, 'Coyhaique', 15),
    (82, 'Aysén', 15),
    (83, 'Chile Chico', 15),
    (84, 'Punta Arenas', 16),
    (85, 'Puerto Natales', 16),
    (86, 'Porvenir', 16);

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
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla sabor_aroma.detalle_ordenes: ~22 rows (aproximadamente)
INSERT IGNORE INTO `detalle_ordenes` (`id`, `orden_id`, `producto_id`, `cantidad`, `precio_unitario`) VALUES
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla sabor_aroma.ofertas: ~3 rows (aproximadamente)
INSERT IGNORE INTO `ofertas` (`id_oferta`, `porcentaje_descuento`) VALUES
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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla sabor_aroma.ordenes: ~10 rows (aproximadamente)
INSERT IGNORE INTO `ordenes` (`id`, `usuario_id`, `total`, `fecha`, `estado`) VALUES
    (1, 1, 32560.00, '2026-09-20 12:30:00', 'Entregado'),
    (2, 2, 20980.00, '2026-09-22 19:15:00', 'Entregado'),
    (3, 1, 12880.00, '2026-09-25 14:00:00', 'Entregado'),
    (4, 3, 31270.00, '2026-09-28 20:45:00', 'Completado'),
    (5, 2, 29470.00, '2026-10-01 13:10:00', 'Entregado'),
    (6, 1, 18280.00, '2026-10-03 21:00:00', 'Entregado'),
    (7, 2, 23760.00, '2026-10-05 18:30:00', 'Pendiente'),
    (8, 3, 38960.00, '2026-10-07 14:20:00', 'Pendiente'),
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
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla sabor_aroma.productos: ~12 rows (aproximadamente)
INSERT IGNORE INTO `productos` (`id`, `codigo`, `nombre`, `id_categoria`, `id_oferta`, `descripcion`, `precio`, `stock`, `imagen`) VALUES
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

-- Volcando estructura para tabla sabor_aroma.regiones
CREATE TABLE IF NOT EXISTS `regiones` (
  `id_region` int NOT NULL AUTO_INCREMENT,
  `nombre_region` varchar(100) NOT NULL,
  PRIMARY KEY (`id_region`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla sabor_aroma.regiones: ~16 rows (aproximadamente)
INSERT IGNORE INTO `regiones` (`id_region`, `nombre_region`) VALUES
    (1, 'Arica y Parinacota'),
    (2, 'Tarapacá'),
    (3, 'Antofagasta'),
    (4, 'Atacama'),
    (5, 'Coquimbo'),
    (6, 'Valparaíso'),
    (7, 'Región Metropolitana de Santiago'),
    (8, 'O\'Higgins'),
    (9, 'Maule'),
    (10, 'Ñuble'),
    (11, 'Bío Bío'),
    (12, 'Araucanía'),
    (13, 'Los Ríos'),
    (14, 'Los Lagos'),
    (15, 'Aysén'),
    (16, 'Magallanes');

-- Volcando estructura para tabla sabor_aroma.reportes
CREATE TABLE IF NOT EXISTS `reportes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tipo_reporte` varchar(50) NOT NULL,
  `especialidad` varchar(50) NOT NULL,
  `descripcion` text NOT NULL,
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla sabor_aroma.reportes: ~21 rows (aproximadamente)
INSERT IGNORE INTO `reportes` (`id`, `tipo_reporte`, `especialidad`, `descripcion`, `fecha`) VALUES
    (1, 'Sistema', 'Nuevo', 'Se inicializó la tabla de reportes en la base de datos', '2026-10-11 20:38:11'),
    (2, 'Producto', 'Editar', 'Se actualizó el stock inicial del sistema', '2026-10-11 20:38:11'),
    (3, 'Producto', 'Nuevo', 'Se creó el producto Sushi Roll California (P008)', '2026-10-09 10:15:00'),
    (4, 'Producto', 'Editar', 'Se actualizó el precio del Club Sándwich Doble de 7500 a 7990', '2026-10-09 14:30:22'),
    (5, 'Producto', 'Nuevo', 'Se agregó el producto Alitas BBQ 8 Piezas (P010)', '2026-10-10 09:45:10'),
    (6, 'Producto', 'Editar', 'Se incrementó el stock de Batido Tropical en 20 unidades', '2026-10-10 16:20:00'),
    (7, 'Producto', 'Eliminar', 'Se eliminó el producto temporal Ensalada de Verano (P099)', '2026-10-11 11:05:45'),
    (8, 'Usuario', 'Nuevo', 'Se registró la cuenta de Estudiante Duoc (estudiante@duoc.cl)', '2026-10-06 20:33:04'),
    (9, 'Usuario', 'Nuevo', 'Se registró la cuenta de Cliente Gmail (cliente.prueba@gmail.com)', '2026-10-06 20:35:12'),
    (10, 'Usuario', 'Editar', 'El usuario ID 2 (Estudiante Duoc) actualizó su dirección', '2026-10-08 12:10:00'),
    (11, 'Usuario', 'Nuevo', 'Se creó la cuenta administrativa para Profesor Duoc', '2026-10-09 08:00:00'),
    (12, 'Usuario', 'Editar', 'Se modificaron los permisos del usuario ID 3 a Administrador', '2026-10-10 15:40:30'),
    (13, 'Categoría', 'Nuevo', 'Se creó la categoría Bebidas', '2026-10-05 09:00:00'),
    (14, 'Categoría', 'Nuevo', 'Se creó la categoría Saludable', '2026-10-05 09:15:30'),
    (15, 'Categoría', 'Editar', 'Se renombró la categoría Ensaladas a Saludable', '2026-10-06 14:22:15'),
    (16, 'Categoría', 'Eliminar', 'Se eliminó la categoría Promociones de Verano por fin de temporada', '2026-10-08 17:30:00'),
    (17, 'Categoría', 'Nuevo', 'Se creó la categoría Postres', '2026-10-11 10:20:45'),
    (18, 'Producto', 'Eliminar', 'Se eliminó el producto con ID: 30 del catálogo', '2026-10-11 21:08:31'),
    (19, 'Categoría', 'Nuevo', 'Se creó la categoría: Vegana', '2026-10-11 21:17:51'),
    (20, 'Producto', 'Nuevo', 'Se creó el producto ffw (p212)', '2026-10-11 21:21:02'),
    (21, 'Producto', 'Eliminar', 'Se eliminó el producto con ID: 31 del catálogo', '2026-10-11 21:21:16');

-- Volcando estructura para tabla sabor_aroma.usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `region` varchar(100) DEFAULT NULL,
  `comuna` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `esadmin` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla sabor_aroma.usuarios: ~3 rows (aproximadamente)
INSERT IGNORE INTO `usuarios` (`id`, `nombre`, `email`, `password`, `region`, `comuna`, `telefono`, `esadmin`, `created_at`) VALUES
    (1, 'Cliente Gmail', 'cliente.prueba@gmail.com', '123456', 'Región Metropolitana de Santiago', 'Santiago', '+56912345678', 0, '2026-10-06 20:33:04'),
    (2, 'Estudiante Duoc', 'estudiante@duoc.cl', '123456', 'Región Metropolitana de Santiago', 'Providencia', '+56987654321', 0, '2026-10-06 20:33:04'),
    (3, 'Profesor Duoc', 'profesor@profesor.duoc.cl', '123456', 'Región Metropolitana de Santiago', 'San Joaquín', '+56955554444', 1, '2026-10-06 20:33:04');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;