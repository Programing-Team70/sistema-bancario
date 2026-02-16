# Sistema-Bancario - Banco King
> **Nota**: Este proyecto ha sido desarrollado por Programming Team utilizando como base técnica y educativa el código y la arquitectura proporcionada por el Catedrático Braulio Echeverría (PEM) del curso IN6AV, Kinal Guatemala 2026.

## Descripción:
Este repositorio contiene el microservicio central de Banco King, encargado de la seguridad, autenticación de usuarios y la estructura base para la gestión de cuentas bancarias. El sistema está diseñado bajo una arquitectura de microservicios, enfocándose en la escalabilidad y la integridad de los datos financieros.

## Funcionalidades Principales:

### Gestión de Identidad (Auth):
- Registro de Usuarios: Creación de nuevos clientes con validación de datos.

- Inicio de Sesión: Autenticación segura mediante intercambio de credenciales.

- Verificación de Token: Middleware robusto para validar la autenticidad de las peticiones en todo el ecosistema del banco.

- Seguridad: Implementación de hashing para protección de contraseñas.

### Estructura de Cuentas (Accounts):
- Definición de Cuentas: Estructura lógica para el manejo de saldos y tipos de cuenta.

## Endpoints API

Base URL: `http://localhost:5288/api/v1`

### Autenticación (`/auth`)

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `POST` | `/auth/register` | Registrar nuevo usuario | No |
| `POST` | `/auth/login` | Iniciar sesión | No |
| `POST` | `/auth/verify-email` | Verificar correo electrónico | No |

## Tecnologías Utilizadas
- Componente	Tecnología
- Runtime	Node.js y .Net
- Lenguaje	JavaScript / C#
- Seguridad	JSON Web Tokens (JWT) & Bcrypt
- Base de Datos	MongoDB / PostgreSQL (según implementación)
- Documentación	Swagger / Postman

### Modelos de Request

// form-data
#### Registro (`/auth/register`)
```json
{
  "firstName": "Nombre",
  "lastName": "Apellido",
  "username": "user123",
  "email": "user@ejemplo.com",
  "password": "PassIKLqn!",
  "phone": "12345678"
  "profilePicture": "archivo.jpg"
}
```

#### Login (`/auth/login`)
```json
{
  "emailOrUsername": "user@ejemplo.com",
  "password": "PassIKLqn!"
}
```

#### Verificación de Email (`/auth/verify-email`)
```json
{
  "token": "token-de-verificacion"
}
```

## Estado del Proyecto: En Desarrollo

> Progreso Actual: 35%: Actualmente, el Banco King se encuentra en una fase inicial de desarrollo. Se ha completado la base de la arquitectura y el núcleo de seguridad, pero aún faltan módulos críticos para el funcionamiento bancario completo, al igual que se ah empezado a trabajar en el siguiente servicio.

## Próximas Actualizaciones
> Este archivo README.md se actualizará periódicamente a medida que el Programming Team avance en los hitos del proyecto. Las nuevas funcionalidades se documentarán conforme se integren a la rama principal.
