
CREATE DATABASE IF NOT EXISTS `sabor_aroma`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `sabor_aroma`;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. CATEGORIAS
CREATE TABLE IF NOT EXISTS `categorias` (
  `id_categoria` INT NOT NULL AUTO_INCREMENT,
  `nombre_categoria` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id_categoria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- 2. OFERTAS
CREATE TABLE IF NOT EXISTS `ofertas` (
  `id_oferta` INT NOT NULL AUTO_INCREMENT,
  `porcentaje_descuento` INT NOT NULL,
  PRIMARY KEY (`id_oferta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- 3. USUARIOS
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `region` VARCHAR(100) DEFAULT NULL,
  `comuna` VARCHAR(100) DEFAULT NULL,
  `esadmin` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- 4. PRODUCTOS
CREATE TABLE IF NOT EXISTS `productos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `codigo` VARCHAR(10) NOT NULL,
  `nombre` VARCHAR(100) NOT NULL,
  `id_categoria` INT NOT NULL,
  `id_oferta` INT DEFAULT NULL,
  `descripcion` TEXT,
  `precio` INT NOT NULL,
  `stock` INT NOT NULL DEFAULT 0,
  `imagen` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo` (`codigo`),
  KEY `fk_productos_categorias` (`id_categoria`),
  KEY `fk_productos_ofertas` (`id_oferta`),
  CONSTRAINT `fk_productos_categorias`
    FOREIGN KEY (`id_categoria`)
    REFERENCES `categorias` (`id_categoria`),
  CONSTRAINT `fk_productos_ofertas`
    FOREIGN KEY (`id_oferta`)
    REFERENCES `ofertas` (`id_oferta`)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- 5. ORDENES
CREATE TABLE IF NOT EXISTS `ordenes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `usuario_id` INT NOT NULL,
  `total` DECIMAL(10,2) NOT NULL,
  `fecha` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `estado` VARCHAR(50) DEFAULT 'Pendiente',
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `ordenes_ibfk_1`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- 6. CARRITO
CREATE TABLE IF NOT EXISTS `carrito` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `usuario_id` INT NOT NULL,
  `producto_id` INT NOT NULL,
  `cantidad` INT NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario_producto_unique` (`usuario_id`,`producto_id`),
  KEY `producto_id` (`producto_id`),
  CONSTRAINT `carrito_ibfk_1`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `carrito_ibfk_2`
    FOREIGN KEY (`producto_id`)
    REFERENCES `productos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- 7. DETALLE DE ORDENES
CREATE TABLE IF NOT EXISTS `detalle_ordenes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `orden_id` INT NOT NULL,
  `producto_id` INT NOT NULL,
  `cantidad` INT NOT NULL,
  `precio_unitario` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `orden_id` (`orden_id`),
  KEY `producto_id` (`producto_id`),
  CONSTRAINT `detalle_ordenes_ibfk_1`
    FOREIGN KEY (`orden_id`)
    REFERENCES `ordenes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `detalle_ordenes_ibfk_2`
    FOREIGN KEY (`producto_id`)
    REFERENCES `productos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- DATOS: CATEGORIAS
INSERT INTO `categorias` (`id_categoria`, `nombre_categoria`) VALUES
(1, 'Comida Rapida'),
(2, 'Saludable'),
(3, 'Postres'),
(4, 'Bebidas');

-- DATOS: OFERTAS
INSERT INTO `ofertas` (`id_oferta`, `porcentaje_descuento`) VALUES
(1, 15),
(2, 20),
(3, 25);

-- DATOS: USUARIOS
INSERT INTO `usuarios`
(`id`, `nombre`, `email`, `password`, `region`, `comuna`, `esadmin`, `created_at`)
VALUES
(1, 'Cliente Gmail', 'cliente.prueba@gmail.com', '123456',
 'Región Metropolitana', 'Santiago', 0, '2026-10-06 17:33:04'),
(2, 'Estudiante Duoc', 'estudiante@duocuc.cl', '123456',
 'Región Metropolitana', 'Providencia', 0, '2026-10-06 17:33:04'),
(3, 'Profesor Duoc', 'profesor@profesor.duoc.cl', '123456',
 'Región Metropolitana', 'San Joaquín', 1, '2026-10-06 17:33:04');

-- DATOS: PRODUCTOS
INSERT INTO `productos`
(`id`, `codigo`, `nombre`, `id_categoria`, `id_oferta`,
 `descripcion`, `precio`, `stock`, `imagen`)
VALUES
(1, 'P001', 'Hamburguesa Artesanal', 1, NULL,
 'Carne de res de 200g, queso cheddar fundido y tocino.',
 11990, 25, 'img/hamburguesa-index.webp'),
(2, 'P002', 'Pizza Pepperoni Especial', 1, NULL,
 'Masa madre, queso mozzarella y abundante pepperoni.',
 14990, 15, 'img/pizza-pepperoni.jpg'),
(3, 'P003', 'Ensalada César con Pollo', 2, NULL,
 'Lechuga fresca, pollo a la parrilla y aderezo césar.',
 8990, 30, 'img/ceasar-index.jpg'),
(4, 'P004', 'Brownie con Helado', 3, NULL,
 'Brownie de chocolate servido con helado de vainilla.',
 5990, 20, 'img/brownie-helado.jpg'),
(5, 'P005', 'Batido Tropical', 4, NULL,
 'Mezcla natural de mango, maracuyá y fresas.',
 4290, 50, 'img/batido-tropical.jpg'),
(6, 'P006', 'Tacos al Pastor', 1, 1,
 'Tortillas de maíz con carne adobada y piña.',
 9490, 18, 'img/Tacos-Al-Pastor.jpg'),
(7, 'P007', 'Lasaña Bolognesa', 1, NULL,
 'Capas de pasta con boloñesa y queso gratinado.',
 12990, 12, 'img/lasaña-boloñesa.jpg'),
(8, 'P008', 'Sushi Roll California', 2, NULL,
 'Rollos de cangrejo o salmon, palta, pepino y ajonjolí.',
 13490, 22, 'img/sushi-index.jpg'),
(9, 'P009', 'Club Sándwich Doble', 1, 2,
 'Pan tostado con pavo, queso y papas fritas.',
 7990, 40, 'img/club-sandwich-doble.png'),
(10, 'P010', 'Alitas BBQ (8 Piezas)', 1, 3,
 'Alitas crujientes bañadas en salsa BBQ.',
 10490, 35, 'img/alitas-bbq.webp'),
(11, 'P011', 'Cheesecake de Frutos Rojos', 3, NULL,
 'Pastel de queso cremoso con mermelada.',
 5290, 15, 'img/Cheesecake de Frutos Rojos.jpg'),
(12, 'P012', 'Café Cappuccino Frappé', 4, NULL,
 'Café licuado con hielo, leche y crema.',
 3890, 60, 'img/Café Cappuccino Frappé.jpg');

-- DATOS: CARRITO
INSERT INTO `carrito`
(`id`, `usuario_id`, `producto_id`, `cantidad`, `created_at`)
VALUES
(1, 3, 1, 1, '2026-10-09 03:01:38'),
(2, 3, 2, 1, '2026-10-09 03:01:42');

-- Reiniciar siguientes identificadores
ALTER TABLE `categorias` AUTO_INCREMENT = 5;
ALTER TABLE `ofertas` AUTO_INCREMENT = 4;
ALTER TABLE `usuarios` AUTO_INCREMENT = 6;
ALTER TABLE `productos` AUTO_INCREMENT = 13;

SET FOREIGN_KEY_CHECKS = 1;