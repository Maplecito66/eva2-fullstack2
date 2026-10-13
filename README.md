# Manual de Usuario & Proyecto — Sabor & Aroma 🍔

¡Bienvenido a **Sabor & Aroma**! Una plataforma web e-commerce gastronómica desarrollada con **React 18 (Vite)** en el Frontend, **Node.js con Express** en el Backend y **MySQL** como Base de Datos relacional.

---

## 📋 Índice
1. [Navegación Básica y Menú](#1-navegación-básica-y-menú)
2. [Buscar Productos y Catálogo](#2-buscar-productos-y-catálogo)
3. [Realizar un Pedido (Carrito & Checkout)](#3-realizar-un-pedido-carrito--checkout)
4. [Crear Cuenta e Iniciar Sesión](#4-crear-cuenta-e-iniciar-sesión)
5. [Panel de Administración (👑 Solo Admins)](#5-panel-de-administración--solo-admins)
6. [Instalación y Ejecución Local (Servidor & BD)](#6-instalación-y-ejecución-local-servidor--bd)
---

## 1. Navegación Básica y Menú

### Cabecera Principal (Header)
* **Logo Sabor & Aroma (🍔):** Haz clic en el logo para regresar a la página de inicio en cualquier momento.
* **Menú Responsivo (☰ / ✕):** En teléfonos móviles y tablets, presiona el botón hamburguesa para desplegar la navegación de forma limpia.
* **Barra de Usuario Superior:** Muestra la bienvenida personalizada con tu nombre y enlaces rápidos de acceso/cierre de sesión.
* **Botonera de Navegación:**
  * **Inicio:** Página principal con ofertas destacadas.
  * **Categorías (▼):** Menú desplegable dinámico para filtrar platillos por categoría (Pizzas, Hamburguesas, Sándwiches, etc.).
  * **Ofertas:** Promociones activas con descuentos especiales.
  * **Nosotros:** Información sobre la historia y visión del restaurante.
  * **Blog Culinario:** Artículos y novedades gastronómicas.
  * **Contacto:** Formulario de consultas.
  * **🛒 Mi Pedido (N):** Acceso directo al carrito con contador dinámico de ítems en tiempo real.

---

## 2. Buscar Productos y Catálogo

### Método 1: Por Categoría Dinámica
1. Pasa el cursor o presiona la flecha **▼** al lado de **Categorías** en el menú principal.
2. Selecciona la categoría deseada (ej. *Hamburguesas*).
3. Serás redirigido al catálogo filtrado automáticamente.

### Método 2: Explorar Catálogo Completo
1. Haz clic en **Categorías** o **Ofertas** en el menú de navegación.
2. Haz clic en **🍽️ Todas las Categorías** para visualizar el menú gastronómico completo.

---

## 3. Realizar un Pedido (Carrito & Checkout)

### Paso 1: Agregar Productos
1. Navega por el catálogo y selecciona el producto de tu preferencia.
2. Haz clic en **"Agregar al Carrito"**.
3. El contador en el botón **🛒 Mi Pedido** se actualizará automáticamente.

### Paso 2: Revisar el Carrito
1. Ingresa a **🛒 Mi Pedido**.
2. **Modificar Cantidad:** Usa los botones `+` y `-` para ajustar las unidades deseada.
3. **Eliminar Producto:** Presiona el botón del contenedor para remover un ítem.
4. **Cupón de Descuento:** Ingresa cupones como `SABOR10` en la casilla correspondiente y presiona **Aplicar**.
5. Haz clic en **Pagar** o **Finalizar Compra**.

### Paso 3: Proceso de Compra (Checkout)
1. Completa los datos personales y la **Dirección de Entrega** (Calle, Departamento, Región, Comuna e Indicaciones adicionales).
2. **Prueba de Pago Simulado:**
   * **Pago Correcto:** Presiona **Pagar Ahora**. El sistema registrará la transacción en la base de datos MySQL, asignará un **N° de Orden** único (ej. `#100025`), limpiará tu carrito y te permitirá imprimir tu boleta en PDF o enviarla por correo.
   * **Pago Incorrecto:** Simula un fallo de pasarela para reintentar la transacción sin perder tus datos de envío.

---

## 4. Crear Cuenta e Iniciar Sesión

### Crear Cuenta Nueva
1. Haz clic en **Crear cuenta** en la barra superior.
2. Completa el formulario de registro:
   * **Nombre Completo:** Debe contener al menos nombre y apellido (ej. *Juan Pérez*).
   * **Correo Electrónico:** Dominios válidos aceptados: `@gmail.com`, `@duoc.cl` o `@profesor.duoc.cl`.
   * **Contraseña:** Mínimo 6 caracteres.
   * **Ubicación:** Selecciona tu Región y Comuna.
3. Haz clic en **Registrarse**.

> 💡 **Asignación Automática de Rol:** Todo registro con correo de dominio `@profesor.duoc.cl` obtendrá permisos de **Administrador** automáticamente.

### Iniciar Sesión
1. Haz clic en **Iniciar sesión**.
2. Ingresa tu correo electrónico registrado y contraseña.
3. El sistema validará tus credenciales con el Backend en MySQL. Si posees rol de administrador, se habilitará el botón **⚙️ Panel Administrador** en la barra superior.

---

## 5. Panel de Administración (👑 Solo Admins)

Si has iniciado sesión con una cuenta de Administrador, tendrás acceso exclusivo a las consolas de gestión protegidas:

### 📊 Dashboard
* Vista analítica con métricas consolidadas en tiempo real: **Compras Totales**, **Productos en Inventario** y **Usuarios Registrados**.
* Indicador *spinner* de carga durante la sincronización con el servidor.
* Tarjetas de navegación rápida a todos los submódulos.

### 📦 Gestión de Productos (`ProductosAdmin`)
* **Listado de Inventario:** Visualiza todos los platillos con código, precio, existencias y categoría.
* **Alerta de Stock Crítico:** Botón de filtrado rápido para aislar productos con existencias iguales o inferiores a **10 unidades ($\le 10$)**.
* **Crear / Editar:** Formulario completo para actualizar código, nombre, categoría, precio, stock, descripción y seleccionar archivo de imagen (`img/`).
* **Eliminación Segura:** Confirmación modal previa para prevenir eliminaciones accidentales.

### 📁 Gestión de Categorías (`CategoriasAdmin`)
* Crear, modificar y eliminar categorías gastronómicas (Pizzas, Comida Vegana, Postres, etc.).
* Actualización instantánea reflejada en el menú del cliente.

### 🛒 Gestión de Órdenes (`Ordenes`)
* Monitoreo del historial de ventas con N° de Orden, cliente, fecha formateada en formato local de Chile y total pagado.
* **Selector de Estado:** Cambia el estado del despacho en tiempo real a `Pendiente`, `En Camino` o `Entregado`.
* **Detalle de Orden:** Haz clic en **Ver detalles** para desplegar un modal emergente con el desglose del pedido ítem por ítem.

### 👥 Gestión de Usuarios (`UsuariosAdmin`)
* Administra las cuentas registradas.
* Permite cambiar el rol de un usuario entre **Cliente Normal** y **Administrador**.
* Incluye selectores condicionales anidados de Región y Comuna.

### 📈 Auditoría y Reportes (`ReportesAdmin`)
* Bitácora de eventos con historial de cambios clasificando operaciones por tipo (*Producto, Usuario, Categoría*) y acción (*Nuevo, Editar, Eliminar*).

---

## 6. Instalación y Ejecución Local (Servidor & BD)

### Requisitos Previos
* **Node.js** (v18.0 o superior)
* **MySQL Server** (v8.0 ejecutándose localmente)
* **Git**

### Paso 1: Clonar el Repositorio
```bash
git clone [https://github.com/tu-usuario/sabor-y-aroma.git](https://github.com/tu-usuario/sabor-y-aroma.git)
cd sabor-y-aroma
