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
- **Gestión de cuentas:** Implementación de historial de movimientos y retiros.


## Tecnologías Utilizadas
- Componente	Tecnología
- Runtime	Node.js y .Net
- Lenguaje	JavaScript / C#
- Seguridad	JSON Web Tokens (JWT) & Bcrypt
- PostgreSQL
- Documentación	Postman
- React (Vite)

## Endpoints API (Authentication-Services)

Base URL: `http://localhost:5288/api/v1`

### Autenticación (`/auth`)

| Método | Ruta | Descripción | Auth | Rol |
|--------|------|-------------|------|-----|
| `POST` | `/auth/login` | Permite registrar cualquier usuario | No | Público |
| `POST` | `/auth/register` | Restringido solo para Admin | Si | Admin |
| `POST` | `/auth/verify-email` | Verifica correo electrónico a cualquier usuario vía Token | No | Público |


### Gestionar (`/user`)
| Método | Ruta | Descripción | Auth | Rol |
|--------|------|-------------|------|-----|
| `GET` | `/user` | Devuelve listado completo de usuarios registrados en el sistema | Si | Admin |
| `GET` | `/user/{id}` | Recupera Información de Usuarios con ID específico Datos | Si | Admin |
| `PUT` | `/user/{id}` | Modificar datos de usuario | Si | User/Admin |
| `POST` | `/user/assign-role` | Asigna roles para gestiones dentro del banco | Si | Admin |
| `GET` | `/user/me` | Muestra información detallada del usuario logueado actualmente | Si | User |

 **Nota**: En este apartado detalla las funcionalidades disponibles para administrar las cuentas de usuario dentro del sistema.

---

## Endpoints API (Core_Bank_Service)

Base URL: `http://localhost:3001/api`

### Creación de Cuentas (`/accounts`)

| Método | Ruta | Descripción | Auth | Rol |
|--------|------|-------------|------|-----|
| `POST` | `/accounts` | Crea nueva cuenta bancaria vinculada a usuario existente | Si | Admin |

### Administrador de Cuentas "ADMIN" (`/accounts`)

| Método | Ruta | Descripción | Auth | Rol |
|--------|------|-------------|------|-----|
| `PATCH` | `/accounts/disable ` | Deshabilita el acceso y la operatividad de una cuenta bancaria de forma temporal | Si | Admin |
| `PATCH` | `/accounts/enable` | Reactiva las funciones de una cuenta previamente suspendida para permitir nuevas transacciones | Si | Admin |
| `GET` | `/accounts/admin/allmovements` | Genera un reporte global que permite visualizar todos los movimientos realizados en el sistema | Si | Admin |
| `GET` | `/accounts/admin/statement/{id}` | Permite consultar el historial detallado de transacciones de una cuenta específica mediante su ID | Si | Admin |
| `GET` | `/accounts/admin/all` | Permite obtener el listado de todas las cuentas bancarias | Si | Admin |

 **Nota**: Este apartado muestra las herramientas de supervisión y control preventivo.

### Consultas de estado de Cuentas "Clientes" (`/accounts`)

| Método | Ruta | Descripción | Auth | Rol |
|--------|------|-------------|------|-----|
| `GET` | `/accounts/statement/{id}` | Permite al usuario de la cuenta ver su historial detallado de todos sus movimientos bancarios   | Si | Usuario |
| `GET` | `/accounts/summary/{id}` | Genera una vista rápida del estado actual y saldo disponible para el usuario de la cuenta | Si | Usuario |
| `GET` | `/accounts/summary/my-accounts` | Permite al usuario vizualizar todas las cuentas de banco que tenga | Si | Usuario |

> **Nota**: En este módulo los clientes pueden interactuar de manera ágil con su información financiera.

### Depositos (`/deposit`)

| Método | Ruta | Descripción | Auth | Rol |
|--------|------|-------------|------|-----|
| `POST` | `/deposit` | Registra el ingreso de capital a una cuenta bancaria específica | Si | Admin |
| `PUT` | `/deposit/{id}` | Permite corregir datos de un deposito previo | Si | Admin |

### Transferencia (`/transfers`)

| Método | Ruta | Descripción | Auth | Rol |
|--------|------|-------------|------|-----|
| `POST` | `/transfers` | Registra y ejecuta el envío de fondos entre cuentas internas del banco | Si | Admin/Usuario |

### Retiros (`/withdrawals`)

| Método | Ruta | Descripción | Auth | Rol |
|--------|------|-------------|------|-----|
| `POST` | `/withdrawals` | Registra los retiros de efectivo o débito de una cuenta bancaria específica | Si | Admin |

**Nota**: En este módulo se gestiona la salida de fondos del sistema, debido a que implica una disminución del saldo real.

### Modelos de Request

---

# Auth_Service

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

#### Listado de Usuarios (`/user`)
> **Nota:** Este endpoint es de acceso restringido. Requiere un **Bearer Token** en el encabezado (Authorization) de un administrador.

---

#### Obtener a un Usuario por ID (`/user/{id}`)
> **Nota:** Requiere el perfil del usuario que se desea obtener, solo administradores

```
{
    "id": "usrGRKGznskZz6h"
}
```

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

#### Perfil del Usuario (`/user/me`)
> **Nota:** Requiere un **Bearer Token** en el encabezado (Authorization). Devuelve la información del usuario autenticado.

---

# Core_Bank_Service API

---

#### Crear Nueva Cuenta Bancaria (`/accounts`)
> **Nota:** Este endpoint requiere un **Bearer Token** en el encabezado (Authorization) de un administrador para crear la cuenta. Tipos (Monetaria o de Ahorro)

```json
{
  "userId": "ID_DEL_USUARIO",
  "type": "MONETARIA"
}
```
---

#### Deshabilitar (`/accounts/disable`)
> **Nota:** Este endpoint requiere un **Bearer Token** en el encabezado (Authorization) de un administrador para deshabilitar la cuenta.

```
{
    "accountNumber": "0000 0000 00 00"
}
```

---

#### Habilitar (`/accounts/enable`)
> **Nota:** Este endpoint requiere un **Bearer Token** en el encabezado (Authorization) de un administrador para habilitar la cuenta.

```
{
    "accountNumber": "0000 0000 00 00"
}
```
---

#### Visualizar Movimientos Completos (`/accounts/admin/all-movements?order=DESC`)
> **Nota:** Este endpoint es de uso exclusivo para administradores. Requiere un **Bearer Token** en el encabezado (Authorization) de un administrador.

**Parámetros de Consulta (Query Params):**
```
`order`: Define el orden de los movimientos (ej. `ASC` o `DESC`).
```

---

#### Consultar estado de cuenta de un Usuario (`/accounts/admin/statement/{id}`)

> **Nota:** Este endpoint es de uso exclusivo para administradores. Requiere un **Bearer Token** en el encabezado (Authorization) de un administrador.

**Parámetros de Consulta (Query Params):**
```
`id`: Requiere el UUID de la cuenta.
`order`: Define el orden de los movimientos (ej. `ASC` o `DESC`).
```

---

#### Obtener el listado de cuentas bancarias (`/accounts/admin/all?order=ASC`)

> **Nota:** Este endpoint es de uso exclusivo para administradores. Requiere un **Bearer Token** en el encabezado (Authorization) de un administrador.

**Parámetros de Consulta (Query Params):**

```
`order`: Define el orden de los movimientos (ej. `ASC` o `DESC`).
```

---

#### Consultar estado de cuenta(`/accounts/statement/{id}`)

> **Nota:** Este endpoint es de uso exclusivo para usurios de la cuenta. Requiere un **Bearer Token** en el encabezado (Authorization).

**Parámetros de Consulta (Query Params):**
```
`id`: Requiere el UUID de la cuenta.
`order`: Define el orden de los movimientos (ej. `ASC` o `DESC`).
```

---

#### Obtener resumen de cuenta(`/accounts/summary/{id}`)

> **Nota:** Este endpoint es de uso exclusivo para usurios de la cuenta. Requiere un **Bearer Token** en el encabezado (Authorization).

**Parámetros de Consulta (Query Params):**
```
`id`: Requiere el UUID de la cuenta.
```

---

#### Obtener todas las cuentas del usuario logueado(`/accounts/my-accounts`)

> **Nota:** Este endpoint es de uso exclusivo para usurios de la cuenta. Requiere un **Bearer Token** en el encabezado (Authorization).

**Parámetros de Consulta (Query Params):**
```
`order`: Define el orden de los movimientos (ej. `ASC` o `DESC`).
```

---

#### Realizar Depósito (`/deposit`)
> **Nota:** Este endpoint requiere un **Bearer Token** en el encabezado (Authorization) de un administrador para autorizar el deposito.

```json
{
  "accountNumber": "0000 0000 00 00",
  "amount": 2000.00,
  "description": "Depósito de nómina"
}
```

---

#### Actualizar Depósito (`/deposit/{id}`)
> **Nota:** Este endpoint es de uso exclusivo para administradores. Requiere un **Bearer Token** en el encabezado (Authorization) de un administrador.

```json
{
  "amount": 500,
  "description": "Corrección de monto: Depósito en efectivo"
}
```

---

#### Realizar Transferencia (`/transfers`)
> **Nota:** Este endpoint requiere un **Bearer Token** en el encabezado (Authorization). Puede ser ejecutado por el usuario dueño de la cuenta emisora o por un administrador con `ADMIN_ROLE`.

```json
{
  "senderAccountNumber": "0000 0000 00 00",
  "receiverAccountNumber": "0000 0000 00 00",
  "amount": 200.00,
  "description": "Pago de servicios"
}
```

---

#### Realizar Retiro (`/withdrawal`)
> **Nota:** Este endpoint es de uso exclusivo para administradores. Requiere un **Bearer Token** en el encabezado (Authorization) de un administrador.

```json
{
    "accountNumber": "No.Cuenta",
    "amount": 300.00
}
```

* `No.Cuenta`: El número de cuenta (ej. `0000 0000 00 00`) del cual se desea retirar.

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
│   ├── associations.js                 # Define cómo se relacionan las tablas
│   ├── configuration.js                # Tiene las opciones de CORS
│   ├── documentation.js                # Configura Swagger
│   ├── helmets.js                      # Configura Helmet
│   ├── rateLimit.js                    # Controla el limite de periciones
│   ├── app.js                          # Configuración principal del servidor
│   └── db.js                           # Conexión a MongoDB
│
├── middlewares/
│   ├── account-validator.js            # Valida que el formate de cuenta sean correctos
│   ├── check-validators.js             # Intercepta peticiones y frena el flujo (express-validator)
│   ├── deposit-validator.js            # Asegura que los depósitos y sus modificaciones
│   ├── transfer-validator.js           # Garantiza las transferencias
│   ├── validate-JWT.js                 # Actúa como la primera barrera de seguridad.
│   ├── validate-user.js                # Consulta a tiempo real al servidos .NET
│   └── withdrawal-validator.js         # Verificación de retiros
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
│   │   ├── deposits.routes.js
│   │   └── deposits.service.js 
│   │
│   ├── transfers/                      # Módulo de transferencias
│   │   ├── transfers.controller.js
│   │   ├── transfers.model.js
│   │   ├── transfers.routes.js
│   │   └── deposits.service.js 
│   │
│   └── withdrawal/                     # Módulo de retiros
│       ├── withdrawal.controller.js    
│       ├── withdrawal.model.js
│       ├── withdrawal.routes.js
│       └── deposits.service.js 
│
├── utils/                              # Utilidades generales
├── index.js                            # Punto de entrada
├── package.json                        # Dependencias y scripts
├── pnpm-lock.yaml                      # Lock file de pnpm
└── README.md
```

---

```
bank_client_web/
├── public/
│   ├── favicon.svg
│   └── icons.svg
│   
├── src/
│   ├── app/
│   │   ├── layouts/
│   │   │   └── DashboardPage.jsx
│   │   │ 
│   │   ├── router/
│   │   │   ├── AccountsContainer.jsx
│   │   │   ├── AppRouter.jsx
│   │   │   ├── ProtecterRoute.jsx
│   │   │   └── RoleGuard.jsx
│   │   │ 
│   │   ├── App.jsx
│   │   └── Main.jsx
│   │ 
│   ├── assets/
│   │   ├── hero.png
│   │   ├── kingbankicon.png
│   │   ├── react.svg
│   │   └── vite.svg
│   │   
│   ├── features/
│   │   ├── accounts/
│   │   │    ├── components/
│   │   │    │    ├── Accounts.jsx
│   │   │    │    ├── CreateAccountModal.jsx
│   │   │    │    ├── DisableAccountModal.jsx
│   │   │    │    ├── EnableAccountModal.jsx
│   │   │    │    └── Movements.jsx
│   │   │    |    
│   |   |    └── store/
│   │   │         └── useAccountStore.js
│   │   │    
│   │   ├── accountsuser/
│   │   │    ├── components/
│   │   │    │    ├── MovementsUser.jsx
│   │   │    │    └── MyAccounts.jsx
│   │   │    |    
│   |   |    └── store/
│   │   │         └── useUserAccountStore.js
│   │   │    
│   │   ├── auth/
│   │   │    ├── components/
│   │   │    │    ├── LoginForm.jsx
│   │   │    │    └── Spinner.jsx
│   │   │    |    
│   |   |    ├── hooks/
│   │   │    │    └── useVerifyEmail.jsx
│   │   │    |    
│   |   |    ├── pages/
│   │   │    │    ├── LoginPage.jsx
│   │   │    │    └── VerifyEmailPage.jsx
│   │   │    |    
│   |   |    └── store/
│   │   │         ├── authStore.js
│   │   │         └── uiStore.js
│   │   │        
│   │   ├── deposits/
│   │   │    ├── components/
│   │   │    │    └── Deposits.jsx
│   │   │    |    
│   |   |    └── store/
│   │   │         └── useDepositStore.js
│   │   │    
│   │   ├── transfers/
│   │   │    ├── components/
│   │   │    │    ├── Transfers.jsx
│   │   │    |    
│   |   |    └── store/
│   │   │         └── useTransferStore.js
│   │   │    
│   │   ├── users/
│   |   |    ├── components/
│   │   │    │    ├── AddUserForm.jsx
│   │   │    │    ├── AssingRoleModal.jsx
│   │   │    │    ├── ProfileViewer.jsx
│   │   │    │    ├── UpdateProfile.jsx
│   │   │    │    ├── UpdateUserForm.jsx
│   │   │    │    └── Users.jsx
│   │   │    |    
│   |   |    └── store/
│   │   │         └── useUserManagementStore.js
│   │   │        
│   │   └── withdrawals/
│   |        ├── components/
│   │        │    └── Withdrawals.jsx
│   │        |    
│   |        └── store/
│   │             └── useWithdrawalStore.js
│   │            
│   ├── shared/
│   │   ├── api/
│   │   │    ├── api.js
│   │   │    ├── auth.js
│   │   │    ├── coreBank.js
│   │   │    └── index.js
│   │   |    
│   │   ├── components/
│   │   │    ├── layout/
│   │   │    |    ├── DashboardContainer.jsx
│   │   │    |    ├── Navbar.jsx
│   │   │    |    └── Sidebar.jsx
│   │   |    |
│   │   │    └── ui/
│   │   │         └── UserMenu.jsx
│   │   |    
│   │   └── utils/
│   │        ├── axios.js
│   │        ├── formatter.js
│   │        └── toast.js
│   │           
│   └── styles/
│       ├── App.css
│       └── index.css
│   
├── .env
├── .gitignore.
├── .prettierignore
├── .prettierrc
├── README.md
├── eslint.config.js
├── index.html
├── package.json
├── pnpm-lock.yaml
└── vite.config.js

```

### Requisitos Previos
- .NET 8.0 SDK
- PostgreSQL 13+
- Cuenta de Gmail con App Password (para emails)
- Node.js 22+
- pnpm 10+ (Package Manager)

### Variables de Entorno de CoreBank

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
### Variables de Entorno de React

```env
VITE_AUTH_URL=http://localhost:5288/api/v1
VITE_CORE_BANK_SERVICE_URL=http://localhost:3001/api
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

8. **Instalar dependencias con pnpm**
```bash
pnpm install
```

9. **Abrir en Visual Studio Code**
```bash
Crea un archivo .env en la carpeta core_bank_service y pega las variables que se dan más abajo.
```

10. **Ejecutar en modo desarrollo**
```bash
pnpm run dev
```

El servidor estará disponible en `http://localhost:3001`


11. **Abrir en Visual Studio Code**
```bash
Abre una nueva ventana de visual y abre la carpeta del proyecto hasta el bank_client_web
```

12. **Abre terminal**
```bash
Abre una terminal en Visual Studio Code
```

13. **Instalar dependencias con pnpm**
```bash
pnpm install
```

14. **Ejecutar en modo desarrollo**
```bash
pnpm run dev
```

El servidor estará disponible en `http://localhost:5173`



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
