# Sistema-Bancario - Banco King
> **Nota**: Este proyecto ha sido desarrollado por Programming Team utilizando como base técnica y educativa el código y la arquitectura proporcionada por el Catedrático Braulio Echeverría (PEM) del curso IN6AV, Kinal Guatemala 2026.

## Descripción:
Este repositorio contiene el microservicio central de Banco King, encargado de la seguridad, autenticación de usuarios y la estructura base para la gestión de cuentas bancarias. El sistema está diseñado bajo una arquitectura de microservicios, enfocándose en la escalabilidad y la integridad de los datos financieros.

## Funcionalidades Principales:

### Gestión de Identidad (Auth)

- **Registro de usuarios:** Creación de nuevos clientes con validación de datos.
- **Inicio de sesión:** Autenticación segura mediante intercambio de credenciales.
- **Verificación de token:** Middleware para validar la autenticidad de las peticiones dentro del ecosistema del banco.
- **Seguridad:** Implementación de hashing para la protección de contraseñas.
- **Gestión de usuarios:** Permite actualizar datos de la cuenta. Solo el usuario y el administrador pueden modificar la información.
- **Gestión de roles:** Implementación de cambio de roles para los usuarios (solo administrador).

### Gestión de Cuentas

- **Creación de cuentas bancarias:** Creación de cuentas para usuarios activos. Solo los administradores pueden realizarlas.
- **Depósitos:** Sistema de depósitos implementado con arquitectura Node.js para un mejor manejo (realizar, modificar y revertir).
- **Transferencias:** Sistema para transferencias de dinero entre usuarios.
- **Visualización de cuenta:** Consulta de cuentas con sistema de divisas para visualizar conversiones de moneda.
- **Gestión de cuentas:** Implementación de historial de movimientos, reportes y retiros.


## Tecnologías Utilizadas
- Componente	Tecnología
- Runtime	Node.js y .Net
- Lenguaje	JavaScript / C#
- Seguridad	JSON Web Tokens (JWT) & Bcrypt
- PostgreSQL
- Documentación	Postman

## Endpoints API (Authentication-Services)

Base URL: `http://localhost:5288/api/v1`

### Autenticación (`/auth`)

| Método | Ruta | Descripción | Auth | Rol |
|--------|------|-------------|------|-----|
| `POST` | `/auth/register` | Registrar nuevo usuario | Si | Admin |
| `POST` | `/auth/login` | Iniciar sesión | No | Público |
| `POST` | `/auth/verify-email` | Verificar correo electrónico | No | Público |

### Gestionar (`/user`)
| Método | Ruta | Descripción | Auth | Rol |
|--------|------|-------------|------|-----|
| `GET` | `/user/me` | Obtener Perfil | Si | Usuario |
| `PUT` | `/user/{id}` | Modificar Datos | Si | Usuario/Admin |
| `POST` | `/user/assign-role` | Cambiar rol del usuario | Si | Admin |
| `GET` | `/user` | Obtener Usuario | Si | Admin |

---

## Endpoints API (Core_Bank_Service)

Base URL: `http://localhost:3001/api`

### Creación de Cuentas (`/accounts`)

| Método | Ruta | Descripción | Auth | Rol |
|--------|------|-------------|------|-----|
| `POST` | `/accounts/create` | Agregar una nueva cuenta de banco | Si | Admin |

### Depositos (`/deposit`)

| Método | Ruta | Descripción | Auth | Rol |
|--------|------|-------------|------|-----|
| `POST` | `/deposit` | Depositar dinero en la cuenta | Si | Admin |
| `PUT` | `/deposit/{id de deposito}` | Corregir el deposito | Si | Admin |
| `DEL` | `/deposit/{id de deposito}` | Revierte el deposito | Si | Admin |

### Transferencia (`/transfer`)

| Método | Ruta | Descripción | Auth | Rol |
|--------|------|-------------|------|-----|
| `POST` | `/transfer` | Transferencia entre usuarios | Si | Admin/Usuario |

### Divisas (`/accounts`)

| Método | Ruta | Descripción | Auth | Rol |
|--------|------|-------------|------|-----|
| `GET` | `/accounts/{no.Cuenta}` | Observar la cuenta | Si | Admin/Usuario |

### Observar Movimientos (`/accounts`)

| Método | Ruta | Descripción | Auth | Rol |
|--------|------|-------------|------|-----|
| `GET` | `/accounts/history/{no.Cuenta}` | Observar movimiento de la cuenta | Si | Admin/Usuario |
| `GET` | `/accounts/admin/top-movements?order=DESC` | Reporte de Cuentas | Si | Admin |

> **Nota**: El Reporte de Cuentas puede ser DESC o ASC solo cambie en la parte de order como lo quiere ver.

### Retiros (`/withdrawal`)

| Método | Ruta | Descripción | Auth | Rol |
|--------|------|-------------|------|-----|
| `POST` | `/withdrawal` | Retiros | Si | Admin |



### Modelos de Request

---

#### Registro (`/auth/register`)
> **Nota:** Requiere un **Bearer Token** en el encabezado (Authorization) de cualquier usuario logeado con el rol de ADMIN_ROLE.

```json
{
  "Name": "Nombre del Usuario",
  "Surname": "Apellido del Usuario",
  "Username": "usuario123",
  "Email": "ejemplo@correo.com",
  "Phone": "12345678",
  "Password": "Password123!",
  "Dpi": "1234567890101",
  "Address": "Ciudad de Guatemala",
  "JobName": "Puesto de Trabajo",
  "MonthlyIncome": 0
}
```
---

#### Login (`/auth/login`)
```json
{
  "emailOrUsername": "tu_usuario_o_email",
  "password": "tu_password_aqui"
}
```

---

#### Verificación de Email (`/auth/verify-email`)
> **Nota:** Puede verse en el correo que se agrego o en la base de datos de pgAdmin
```json
{
  "token": "token-de-verificacion"
}
```

---

#### Perfil del Usuario (`/user/me`)
> **Nota:** Requiere un **Bearer Token** en el encabezado (Authorization). Devuelve la información del usuario autenticado.

---

#### Actualizar Perfil (`/user/{id}`)
> **Nota:** Requiere un **Bearer Token** en el encabezado (Authorization). Este endpoint permite a un usuario editar su propia información o a un administrador gestionar cuentas existentes.

```json
{
  "name": "Nombre Actualizado",
  "surname": "Apellido Actualizado",
  "phone": "87654321",
  "address": "Nueva Dirección",
  "jobName": "Puesto Actualizado",
  "monthlyIncome": 0.0
}
```

---

#### Asignar Rol (`/user/assign-role`)
> **Nota:** Este endpoint es de uso exclusivo para administradores. Requiere un **Bearer Token** en el encabezado (Authorization) de un administrador.
```json
{
  "userId": "id-del-usuario",
  "roleName": "USER_ROLE"
}
```

> En el roleName puede ser "USER_ROLE" o "ADMIN_ROLE".

---

#### Listado de Usuarios (`/user`)
> **Nota:** Este endpoint es de acceso restringido. Requiere un **Bearer Token** en el encabezado (Authorization) de un administrador.

---

#### Crear Nueva Cuenta Bancaria (`/accounts/create`)
> **Nota:** Este endpoint requiere un **Bearer Token** en el encabezado (Authorization) de un administrador para crear la cuenta.

```json
{
  "userId": "ID_DEL_USUARIO",
  "type": "MONETARIA",
  "initialBalance": 0
}
```
---

#### Realizar Depósito (`/api/deposit`)
> **Nota:** Este endpoint requiere un **Bearer Token** en el encabezado (Authorization) de un administrador para autorizar el deposito.

```json
{
  "accountNumber": "No.Cuenta",
  "amount": 2000.00,
  "description": "Depósito de nómina"
}
```

---

#### Actualizar Depósito (`/deposit/{id-de-deposito}`)
> **Nota:** Este endpoint es de uso exclusivo para administradores. Requiere un **Bearer Token** en el encabezado (Authorization) de un administrador.

```json
{
  "newAmount": 150.00
}
```

---

#### Eliminar Depósito (`/deposit/{id-de-deposito}`)
> **Nota:** Este endpoint es de uso exclusivo para administradores. Requiere un **Bearer Token** en el encabezado (Authorization) de un administrador.

* `id-de-deposito`: El identificador único (UUID) del depósito que se desea eliminar.

---

#### Realizar Transferencia (`/transfer`)
> **Nota:** Este endpoint requiere un **Bearer Token** en el encabezado (Authorization). Puede ser ejecutado por el usuario dueño de la cuenta emisora o por un administrador con `ADMIN_ROLE`.

```json
{
  "senderAccountNumber": "No.Cuenta-Emisora",
  "receiverAccountNumber": "No.Cuenta-Receptora",
  "amount": 2000.00
}
```

---

#### Consultar Detalle de Cuenta (`/accounts/{No.Cuenta}`)
> **Nota:** Este endpoint requiere un **Bearer Token** en el encabezado (Authorization). Solo puede ser consultado por el usuario propietario de la cuenta o por un administrador con `ADMIN_ROLE`.

* `No.Cuenta`: El número de cuenta bancaria que se desea consultar.

---

#### Historial de cuenta (`/accounts/history/{no.Cuenta}`)
> **Nota:** Este endpoint requiere un **Bearer Token** en el encabezado (Authorization). Solo puede ser consultado por el usuario propietario de la cuenta o por un administrador con el rol `ADMIN_ROLE`.

**Parámetros de URL:**
* `no.Cuenta`: El número de cuenta (ej. `7269909557`) del cual se desea obtener el historial de movimientos.

---

#### Reporte de Cuentas (Movimientos) (`/accounts/admin/top-movements?order=DESC`)
> **Nota:** Este endpoint es de uso exclusivo para administradores. Requiere un **Bearer Token** en el encabezado (Authorization) de un administrador.

**Parámetros de Consulta (Query Params):**
* `order`: Define el orden de los movimientos (ej. `ASC` o `DESC`).

---

#### Realizar Retiro (`/withdrawal`)
> **Nota:** Este endpoint es de uso exclusivo para administradores. Requiere un **Bearer Token** en el encabezado (Authorization) de un administrador.

```json
{
    "accountNumber": "No.Cuenta",
    "amount": 340.00,
    "description": "Retiro de efectivo"
}
```

* `No.Cuenta`: El número de cuenta (ej. `7269909557`) del cual se desea retirar.

---

## 📁 Estructura del Proyecto

```
auth-service/
├── src/
│   ├── AuthService.Api/              # Capa de presentación
│   │   ├── Controllers/              # Controladores REST
│   │   ├── Extensions/               # Configuraciones y extensiones
│   │   ├── Middlewares/              # Middlewares personalizados
│   │   ├── ModelBinders/             # Model binders personalizados
│   │   ├── Models/                   # Modelos de API
│   │   └── Program.cs                # Punto de entrada
│   │
│   ├── AuthService.Application/      # Capa de aplicación
│   │   ├── DTOs/                     # Data Transfer Objects
│   │   ├── Exceptions/               # Excepciones personalizadas
|   |   ├── Extensions/               # Configuraciones y extensiones
│   │   ├── Interfaces/               # Interfaces de servicios
│   │   ├── Services/                 # Implementación de servicios
│   │   └── Validators/               # Validadores FluentValidation
│   │
│   ├── AuthService.Domain/           # Capa de dominio
│   │   ├── Constants/                # Constantes del dominio
│   │   ├── Entities/                 # Entidades del dominio
│   │   ├── Enums/                    # Enumeraciones
│   │   └── Interfaces/               # Interfaces de repositorios
│   │
│   └── AuthService.Persistence/      # Capa de persistencia
│       ├── Data/                     # DbContext y configuraciones
│       ├── Migrations/               # Migraciones de EF Core
│       └── Repositories/             # Implementación de repositorios
│
├── AuthService.sln                   # Solución de Visual Studio
├── global.json                       # Versión de .NET
└── .gitignore
```

---

```
core_bank_service/
├── configs/
│   ├── app.js                          # Configuración principal del servidor
│   └── db.js                           # Conexión a MongoDB
│
├── middlewares/
│   └── auth.middleware.js              # Actúa como la primera barrera de seguridad.
│
├── src/
│   ├── account/                        # Módulo de cuentas
│   │   ├── account.controller.js       # Controladores
│   │   ├── account.model.js            # Modelo de datos
│   │   ├── account.routes.js           # Rutas
│   │   └── account.service.js          # Lógica de negocio
│   │
│   ├── deposits/                       # Módulo de depositos
│   │   ├── deposits.controller.js
│   │   ├── deposits.model.js
│   │   └── deposits.routes.js
│   │
│   ├── transfers/                      # Módulo de equipos
│   │   ├── transfers.controller.js
│   │   ├── transfers.model.js
│   │   └── transfers.routes.js
│   │
│   └── withdrawal/                     # Módulo de torneos
│       ├── withdrawal.controller.js    
│       ├── withdrawal.model.js
│       └── withdrawal.routes.js
│
├── utils/                            # Utilidades generales
├── index.js                          # Punto de entrada
├── package.json                      # Dependencias y scripts
├── pnpm-lock.yaml                    # Lock file de pnpm
└── README.md
```

### Requisitos Previos
- .NET 8.0 SDK
- PostgreSQL 13+
- Cuenta de Gmail con App Password (para emails)
- Node.js 22+
- pnpm 10+ (Package Manager)

### Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
PORT=3001
DB_NAME=banco_king_users
DB_USER=Programming
DB_PASSWORD="tE4m!"
DB_HOST=localhost
DB_PORT=5436
SECRET_KEY=$ecretKeyForKingProgramingTeam70
TZ='America/Guatemala'
```

### Instalación y Ejecución

1. **Clonar el repositorio**
```bash
git clone <url-repositorio>
```

2. **Correr Docker**
```bash
Ve a la carpeta de postgre_db, y abre una terminal
Ejecuta: docker-compose up -d
```

3. **Abrir en Visual Studio Code**
```bash
Abre visual y abre la carpeta del proyecto hasta el auth-services
nota: /sistema-bancario\BancoKing\authentication-service\auth-service
```

4. **Restaurar dependencias**
```bash
Abre una nueva terminal en visual y ejecuta
Ejecuta: dotnet restore
```

5. **Aplicar migraciones**
```bash
dotnet ef database update --project src/AuthService.Persistence --startup-project src/AuthService.Api
```

6. **Ejecutar el servicio**
```bash
cd src
cd AuthService.Api
dotnet build
dotnet run
```
El servicio estará disponible en: `http://localhost:5288`

7. **Abrir en Visual Studio Code**
```bash
Abre una nueva ventana de visual y abre la carpeta del proyecto hasta el core_bank_service
```

6. **Instalar dependencias con pnpm**
```bash
pnpm install
```

7. **Abrir en Visual Studio Code**
```bash
Crea un archivo .env en la carpeta core_bank_service y pega las variables que se dan más abajo.
```

8. **Ejecutar en modo desarrollo**
```bash
pnpm run dev
```

El servidor estará disponible en `http://localhost:3001`



## Seguridad

### JWT
- Tokens con tiempo de expiración configurable
- Validación de issuer y audience
- Almacenamiento seguro de claves

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulte el archivo [LICENSE](LICENSE) para más detalles.

## Autor

**Programming Team**  
Curso IN6AV - Kinal Guatemala 2026

## Próximas Actualizaciones
> Este archivo README.md se actualizará periódicamente a medida que el Programming Team avance en los hitos del proyecto. Las nuevas funcionalidades se documentarán conforme se integren a la rama principal.
