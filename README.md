# Barbershop Management System

Sistema de gestión de barberías desarrollado con arquitectura de servicios separados, con un servidor de autenticación y una API de negocio independiente.

---

## Arquitectura

El sistema está compuesto por dos servicios independientes:

```
┌─────────────────────┐         ┌─────────────────────┐
│     Auth Server     │         │    Business API      │
│    :9000            │ ──────► │    :8080             │
│                     │  sync   │                      │
│  - Identidad        │         │  - Barberías         │
│  - JWT / OAuth2     │         │  - Barberos          │
│  - Roles            │         │  - Reservaciones     │
│  - Google Login     │         │  - Transacciones     │
└─────────────────────┘         │  - Reportes          │
                                └─────────────────────┘
```

**Auth Server** es el único responsable de la identidad del usuario. La **Business API** recibe una réplica sincronizada de los datos del usuario y maneja toda la lógica de negocio.

---

## Tecnologías

| Capa                         | Tecnología                                 |
| ---------------------------- | ------------------------------------------ |
| Backend                      | Java 21 · Spring Boot 3                    |
| Seguridad                    | Spring Authorization Server · OAuth2 · JWT |
| Base de datos                | MySQL · Spring Data JPA                    |
| Emails                       | SendGrid                                   |
| Imágenes                     | Cloudinary                                 |
| Comunicación entre servicios | OpenFeign                                  |
| Documentación                | Swagger / OpenAPI 3                        |
| Contenedores                 | Docker · Docker Compose                    |

---

## Autenticación

El sistema implementa **OAuth2 Authorization Server** con soporte para:

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
  "roles": ["ROLE_CLIENTE"]
}
```

---

## Módulos — Business API

La Business API está organizada en módulos por dominio:

### User

Réplica local sincronizada desde el Auth Server. La Business API nunca modifica datos personales directamente.

### Barbershop

Gestión completa del perfil de la barbería, horarios de atención, categorías y subcategorías de servicios, imágenes y gestión de barberos mediante invitaciones.

### Barber

Perfil del barbero, descansos, disponibilidad y respuesta a invitaciones.

### Reservation

Sistema de reservaciones con validación de disponibilidad por bloques de 15 minutos, considerando horarios de atención, descansos del barbero y reservaciones existentes.

### Transaction

Registro de pagos por parte del cliente y confirmación por parte del barbero. Genera automáticamente un registro de ingresos para la barbería con desglose de comisiones y propinas.

### Client

Perfil del cliente y búsqueda de barberías.

### Reports

Dashboards de ingresos para barberos y barberías con reportes diarios, semanales, mensuales y comparativas.

---

## Sincronización de Usuarios

Cuando un usuario se registra o actualiza su perfil en el Auth Server, la Business API es notificada automáticamente mediante una llamada interna autenticada con API Key.

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
│   └── Dockerfile
├── business-api/
│   ├── src/
│   └── Dockerfile
├── docker-compose.yml
├── API_GUIDE.md
└── README.md
```

---

## Decisiones de diseño

- **Separación Auth / Business** — El Auth Server es el único dueño de la identidad. La Business API nunca modifica datos personales.
- **Módulos por dominio** — Cada módulo es dueño de su modelo y repository. Un módulo llama al service de otro, nunca a su repository directamente.
- **Bloques de 15 minutos** — La disponibilidad se calcula en bloques de 15 minutos para permitir servicios de cualquier duración.
- **Transacciones en dos pasos** — El cliente registra el pago y el barbero lo confirma, generando el registro de ingresos automáticamente.
- **Emails asíncronos** — Todos los correos se envían de forma asíncrona con `@Async` para no bloquear las operaciones principales.
