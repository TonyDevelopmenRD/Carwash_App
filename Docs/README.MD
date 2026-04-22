# CARWASH API
**Introducción**
El sistema CarWash API es una aplicación web desarrollada para la gestión de servicios de lavado de autos. Permite a los usuarios autenticarse, consultar servicios y gestionar información mediante una arquitectura basada en frontend y backend conectados a una base de datos.

**Objetivo del Proyecto**
Objetivo general
Desarrollar una aplicación web que permita administrar un autolavado mediante una API REST y una interfaz interactiva.

**Objetivos específicos**
Implementar un backend con FastAPI
Crear un frontend dinámico con React
Conectar el sistema a una base de datos MySQL
Gestionar usuarios mediante autenticación
Permitir la administración de servicios


**Arquitectura del Sistema**
El sistema sigue una arquitectura cliente-servidor:
CapaTecnologíaDescripciónFrontendReact + ViteInterfaz de usuarioBackendFastAPIAPI que procesa las solicitudesBase de datosMySQLAlmacenamiento de informaciónContenedoresDockerContenerización del sistema

📁Estructura del Proyecto
<table>
  <tr>
    <th>Backend</th>
    <th>Frontend</th>
  </tr>
  <tr>
    <td><img src="/Docs/assets/Backend.png" width="200"></td>
    <td><img src="/Docs/assets/Frontend.png" width="200"></td>
  </tr>
</table>

**Backend (FastAPI)**
El backend fue desarrollado utilizando FastAPI, un framework moderno de Python orientado a la creación de APIs REST. Este componente se encarga de gestionar la lógica del sistema, incluyendo la autenticación de usuarios, el procesamiento de solicitudes y la comunicación con la base de datos.
Para garantizar la seguridad y la correcta configuración del sistema, se implementó el uso de variables de entorno, las cuales permiten almacenar información sensible como credenciales de la base de datos y claves secretas sin exponerlas directamente en el código fuente.
Variables de entorno
<img src="/Docs/assets/env.png" width="500">
**Endpoints principales**
Métodos POST, GET, DELETE, UPDATE — endpoints de autenticación de login, obtención de usuarios y creación de usuarios.
<img src="/Docs/assets/PGDU.png" width="600">
**Autenticación**
Se utiliza una clave secreta (SECRET_KEY) para gestionar la seguridad del sistema.
Base de datos
El backend se conecta a MySQL utilizando variables de entorno.
<img src="/Docs/assets/BD_env.png" width="500">
**Scripts incluidos**

init_db.py → crea las tablas
populate_db.py → inserta datos

<img src="/Docs/assets/Scripts_Include.png" width="600">

**Frontend (React + Vite)**
El frontend fue desarrollado con React utilizando Vite como herramienta de desarrollo.
Funcionalidades
Login de usuario y consumo de API mediante axios con credenciales.
<table>
  <tr>
    <td><img src="/Docs/assets/Login_user.png" width="310"></td>
    <td><img src="/Docs/assets/Credenciales.png" width="400"></td>
  </tr>
</table>

**Docker**
Docker permite ejecutar el sistema en contenedores, facilitando su despliegue. Los servidores dentro del contenedor están activos (punto verde).
<img src="/Docs/assets/Docker.png" width="600">

**Ejecución del Sistema**
1. Backend (Python - FastAPI)
Instala todas las librerías necesarias definidas en requirements.txt:
bashcd car-wash-api
python -m pip install -r requirements.txt
<img src="/Docs/assets/Download_Req.png" width="650">
<img src="/Docs/assets/requirements.png" width="600">

2. Frontend (React - Node.js)
bashcd Frontend
npm install
<img src="/Docs/assets/Dependens.png" width="600">
Modo desarrollo (opcional) — permite visualizar la interfaz en tiempo real:
bashnpm run dev
<img src="/Docs/assets/Mod_Desarrollo.png" width="600">

3. Ejecución completa con Docker
Para ejecutar el sistema completo (frontend, backend y base de datos):
bashdocker-compose up --build
<img src="/Docs/assets/ejecution.png" width="600">
¿Qué hace este comando?

Construye las imágenes necesarias a partir de los archivos Dockerfile
Crea y levanta los contenedores del sistema
Configura la comunicación entre servicios (backend, frontend y base de datos)
Ejecuta el sistema en un entorno aislado

<img src="/Docs/assets/image_Docker.png" width="600">

Nota: Durante la ejecución, Docker descarga automáticamente las imágenes base necesarias (Python para el backend, Node.js para el frontend), lo que permite estandarizar el entorno de desarrollo y facilitar la portabilidad del sistema.


**Funcionamiento del Sistema**
API (Swagger)
👉 http://localhost:8000/docs
<img src="/Docs/assets/API1.png" width="600">
<img src="/Docs/assets/API2.png" width="600">
<img src="/Docs/assets/API3.png" width="600">
<img src="/Docs/assets/API4.png" width="600">
Documentación interactiva de la API donde se visualizan los endpoints disponibles del sistema.
Crear usuario / Login
Crea un usuario y autentica por user/login en el Backend para poder ingresar con las credenciales al Frontend:
<img src="/Docs/assets/create_user.png" width="700">

**Frontend en Ejecución**
Accede en: http://localhost:5173/
Se redirige al login de app-carwash. Ingresa los datos obtenidos de la autenticación del backend:
<img src="/Docs/assets/Login_user.png" width="310">

**Dashboard**
El Dashboard es la pantalla principal del sistema y sirve para ver rápidamente el estado general del carwash.
<img src="/Docs/assets/Dashboard.png" width="900">
**Datos mostrados:**

Número de usuarios
Servicios disponibles
Vehículos registrados
Productos en inventario

**Información del día:**

Citas programadas
Servicios en proceso
Servicios completados
Ingresos generados

También incluye accesos rápidos para crear usuarios, citas o servicios sin navegar por todo el sistema.

**Módulo de Usuarios**
Permite administrar las cuentas del sistema, controlar quién puede acceder y qué rol tiene.
<img src="/Docs/assets/module_users.png" width="700">
En esta pantalla se puede:

Ver la lista de usuarios registrados
Buscar usuarios por nombre
Registrar un nuevo usuario con el botón + Nuevo Usuario
Visualizar: ID, Nombre, Email, Rol y Estado

<img src="/Docs/assets/insert_user.png" width="700">

Si no hay usuarios, el sistema muestra el mensaje "No se encontraron usuarios".


**Módulo de Servicios**
Permite gestionar los servicios que ofrece el car wash (lavado básico, premium, encerado, entre otros).
<img src="/Docs/assets/modulo_services.png" width="700">
<img src="/Docs/assets/insert_service.png" width="900">
En esta sección se puede:
Ver la lista de servicios disponibles
Registrar un nuevo servicio
Editar información como nombre, precio o descripción
Eliminar servicios

Cada servicio forma parte del catálogo utilizado al momento de crear citas.

**Módulo de Productos**
<img src="/Docs/assets/productos.png" width="900">
**Tabla de productos:**

Lista todos los productos con columnas: ID, Producto, Tipo, Cantidad
Filtros por categorías y barra de búsqueda global

Historial de Movimientos (panel derecho):

Muestra entradas y salidas de stock
Columnas: Producto, Tipo, Cantidad

Acciones disponibles:

+ Nuevo Producto — Abre un modal con campos: Nombre, Categoría, Stock inicial y Descripción
Registrar Movimiento — Para registrar cuando se usa o repone un producto

<img src="/Docs/assets/insertamos_products.png" width="900">

**Módulo de Vehículos**
<img src="/Docs/assets/modulo_vehicle.png" width="900">
El módulo de Vehículos permite administrar todos los vehículos registrados en el sistema. Cada vehículo se identifica con un ID de placa en formato alfanumérico (ej. CD-495-TX) y está vinculado a un dueño específico.
<img src="/Docs/assets/insert_vehicle.png" width="900">
La vista principal muestra todos los vehículos en una tabla con filtros rápidos por estado. Desde cada registro se pueden ejecutar acciones como editar o eliminar. La tabla cuenta con paginación para manejar grandes volúmenes de datos.

📝 Conclusión
La aplicación de Carwash se encuentra en un estado funcional con un avance aproximado del 70% al 80%. Aún quedan algunas mejoras por implementar, principalmente en el apartado de citas y en la incorporación de ciertas validaciones.
A pesar de ello, el proyecto muestra una estructura sólida y una integración clara entre el frontend y el backend, lo que permite gestionar correctamente operaciones como el registro de vehículos y movimientos.
Próximas mejoras:

Fortalecer la validación de datos en los formularios para evitar errores de entrada
Optimizar el manejo de errores en las peticiones
Mejorar la retroalimentación al usuario tanto en frontend como en backend