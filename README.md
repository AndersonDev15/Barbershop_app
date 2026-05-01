# Barbershop Management System

Sistema de gestión de barberías desarrollado con arquitectura de servicios separados, con un servidor de autenticación, una API de negocio y un gateway BFF que intermedia entre el frontend y los servicios internos.

---

## Arquitectura

```
                        ┌──────────────────────────────┐
                        │         Frontend             │
                        │         :5173                │
                        └──────────────┬───────────────┘
                                       │ HTTP (cookies)
                        ┌──────────────▼───────────────┐
                        │             BFF              │
                        │      Spring Cloud Gateway    │
                        │            :8090             │
                        │                              │
                        │  - Sesión OAuth2             │
                        │  - Proxy autenticado         │
                        │  - CORS centralizado         │
                        └──────┬───────────────┬───────┘
                               │ Bearer JWT    │ Bearer JWT
               ┌───────────────▼───┐       ┌───▼───────────────┐
               │   Auth Server     │       │   Business API    │
               │      :9000        │       │      :8080        │
               │                   │       │                   │
               │  - Identidad      │──────►│  - Barberías      │
               │  - OAuth2 / JWT   │ sync  │  - Barberos       │
               │  - Roles          │       │  - Reservaciones  │
               │  - Google Login   │       │  - Transacciones  │
               └───────────────────┘       │  - Reportes       │
                                           └───────────────────┘
```

**Auth Server** es el único responsable de la identidad del usuario. El **BFF** gestiona la sesión con cookies HttpOnly y actúa como proxy hacia los servicios internos, de modo que el frontend nunca maneja tokens JWT directamente. La **Business API** recibe una réplica sincronizada de los datos del usuario y maneja toda la lógica de negocio.

---

## Tecnologías

| Capa                         | Tecnología                                 |
| ---------------------------- | ------------------------------------------ |
| Backend                      | Java 21 · Spring Boot 3                    |
| BFF / Gateway                | Spring Cloud Gateway · OAuth2 Client       |
| Seguridad                    | Spring Authorization Server · OAuth2 · JWT |
| Base de datos                | MySQL · Spring Data JPA                    |
| Emails                       | SendGrid                                   |
| Imágenes                     | Cloudinary                                 |
| Comunicación entre servicios | OpenFeign                                  |
| Documentación                | Swagger / OpenAPI 3                        |
| Contenedores                 | Docker · Docker Compose                    |

---

## BFF — Backend For Frontend (`:8090`)

El BFF no es un servicio de negocio — es un **gateway que protege el frontend**. El frontend nunca recibe ni almacena tokens JWT. La sesión vive en una cookie `SESSION` HttpOnly gestionada por el BFF.

**Responsabilidades:**

- Iniciar el flujo OAuth2 Authorization Code con el Auth Server
- Intercambiar el código por token y mantener la sesión
- Exponer endpoints de sesión (`/auth/status`, `/userinfo`, `/auth/me`)
- Hacer proxy de todas las rutas `/api/**` hacia los servicios internos con el token inyectado via `TokenRelay`
- Centralizar CORS para el frontend

**Rutas proxy configuradas:**

| Prefijo         | Destino              |
| --------------- | -------------------- |
| `/api/users/**` | Auth Server `:9000`  |
| `/api/auth/**`  | Auth Server `:9000`  |
| `/api/**`       | Business API `:8080` |

**Flujo de login:**

```
Frontend → GET /oauth2/authorization/barberia-client
         → Auth Server :9000 (login Thymeleaf)
         → BFF recibe código, intercambia por token
         → Redirige a frontend /auth/callback
         → Frontend llama /auth/status con credentials: include
```

---

## Auth Server (`:9000`)

Servidor de autorización OAuth2 con soporte para:

- Registro con verificación de correo electrónico
- Login tradicional (email + contraseña)
- Login con Google (OAuth2 federado)
- Recuperación de contraseña mediante OTP
- Invalidación de sesiones al cambiar contraseña
- Roles: `CLIENTE`, `BARBERO`, `BARBERIA`

El token JWT incluye claims personalizados:

```json
{
  "sub": "user-uuid",
  "email": "usuario@email.com",
  "roles": ["ROLE_CLIENTE"],
  "user_uuid": "611ca80b-aaab-4162-9b66-cd4f60e5f313"
}
```

El endpoint `/userinfo` devuelve claims OIDC estándar (`given_name`, `family_name`, `phone_number`, `email`) además de `roles` y `user_uuid`.

---

## Business API (`:8080`)

API REST de negocio organizada en módulos por dominio. Recibe el JWT del BFF via `Authorization: Bearer` y extrae la identidad del usuario con `@AuthenticationPrincipal CurrentUser`.

**Módulos:**

**User** — Réplica local sincronizada desde el Auth Server. La Business API nunca modifica datos personales directamente.

**Barbershop** — Gestión completa del perfil de la barbería, horarios de atención, categorías y subcategorías de servicios, imágenes y gestión de barberos mediante invitaciones.

**Barber** — Perfil del barbero, descansos, disponibilidad y respuesta a invitaciones.

**Reservation** — Sistema de reservaciones con validación de disponibilidad por bloques de 15 minutos, considerando horarios de atención, descansos del barbero y reservaciones existentes.

**Transaction** — Registro de pagos por parte del cliente y confirmación por parte del barbero. Genera automáticamente un registro de ingresos para la barbería con desglose de comisiones y propinas.

**Client** — Perfil del cliente y búsqueda de barberías.

**Reports** — Dashboards de ingresos para barberos y barberías con reportes diarios, semanales, mensuales y comparativas.

---

## Sincronización de Usuarios

Cuando un usuario se registra o actualiza su perfil en el Auth Server, la Business API es notificada automáticamente mediante una llamada interna autenticada con API Key, implementada con OpenFeign.
El objetivo es mantener una réplica local en la Business API para evitar llamadas repetidas al Auth Server en cada operación de negocio.

Adicionalmente existe un **job de reconciliación diaria** que garantiza consistencia entre ambas bases de datos.

```
Auth Server ──► POST /internal/sync ──► Business API
                    (API Key)
```

---

## Notificaciones por Correo

El sistema envía correos automáticos en los siguientes eventos:

- Verificación de correo al registrarse
- Código OTP para recuperación de contraseña
- Confirmación de nueva reservación (cliente y barbero)
- Cambio de estado de reservación
- Cancelación de reservación
- Recordatorio 20 minutos antes de la cita
- Confirmación de pago (cliente, barbero y barbería)
- Invitación a barbero

---

## Endpoints principales

### BFF

| Método | Endpoint                                | Descripción                           |
| ------ | --------------------------------------- | ------------------------------------- |
| GET    | `/oauth2/authorization/barberia-client` | Iniciar login OAuth2                  |
| GET    | `/auth/status`                          | Estado de sesión actual               |
| GET    | `/userinfo`                             | Claims del usuario autenticado        |
| GET    | `/auth/me`                              | Perfil unificado (usuario + barbería) |
| POST   | `/logout`                               | Cerrar sesión                         |

### Auth Server

| Método | Endpoint                    | Descripción            |
| ------ | --------------------------- | ---------------------- |
| POST   | `/api/auth/register`        | Registro de usuario    |
| GET    | `/api/auth/verify-email`    | Verificación de correo |
| POST   | `/api/auth/logout`          | Cerrar sesión          |
| POST   | `/api/auth/forgot-password` | Solicitar OTP          |
| POST   | `/api/auth/reset-password`  | Restablecer contraseña |
| PATCH  | `/api/auth/change-password` | Cambiar contraseña     |
| PUT    | `/api/users/me`             | Actualizar perfil      |

### Business API

| Método | Endpoint                                 | Descripción                   |
| ------ | ---------------------------------------- | ----------------------------- |
| POST   | `/api/client/init`                       | Inicializar cliente           |
| POST   | `/api/client/reservations`               | Crear reservación             |
| POST   | `/api/client/availability/search`        | Consultar disponibilidad      |
| POST   | `/api/client/transactions`               | Registrar pago                |
| PATCH  | `/api/barber/reservations/{id}/status`   | Cambiar estado de reservación |
| PATCH  | `/api/barber/transactions/{id}/complete` | Confirmar pago                |
| GET    | `/api/barber/dashboard`                  | Dashboard del barbero         |
| GET    | `/api/barbershop/dashboard`              | Dashboard de la barbería      |
| POST   | `/api/barbershop/invitations`            | Invitar barbero               |

---

## Estructura del repositorio

```
barbershop/
├── auth-server/
│   ├── src/
│   ├── .env
│   └── Dockerfile
├── business-api/
│   ├── src/
│   ├── .env
│   └── Dockerfile
├── bff/
│   ├── src/
│   ├── .env
│   └── Dockerfile
├── docker-compose.yml
├── API_GUIDE.md
└── README.md
```

---

## Orden de arranque

Los servicios deben levantarse en este orden porque el BFF descarga los metadatos OIDC del Auth Server al iniciar:

```
1. MySQL
2. Auth Server   :9000
3. Business API  :8080
4. BFF           :8090
5. Frontend      :5173
```

---

## Decisiones de diseño

**Patrón BFF** — El frontend nunca maneja tokens JWT. Toda la autenticación pasa por el BFF, que mantiene la sesión con cookies HttpOnly. Esto elimina el riesgo de XSS con tokens en localStorage y simplifica el frontend.

**Token Relay** — El BFF inyecta automáticamente el Bearer token en cada petición proxy hacia los servicios internos. Los servicios internos no necesitan conocer la sesión del usuario, solo validar el JWT.

**Separación Auth / Business** — El Auth Server es el único dueño de la identidad. La Business API nunca modifica datos personales.

**Módulos por dominio** — Cada módulo es dueño de su modelo y repository. Un módulo llama al service de otro, nunca a su repository directamente.

**Bloques de 15 minutos** — La disponibilidad se calcula en bloques de 15 minutos para permitir servicios de cualquier duración.

**Transacciones en dos pasos** — El cliente registra el pago y el barbero lo confirma, generando el registro de ingresos automáticamente.

**Emails asíncronos** — Todos los correos se envían de forma asíncrona con `@Async` para no bloquear las operaciones principales.
