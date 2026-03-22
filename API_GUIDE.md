# API Guide — Barbershop Management System

## Módulos

- [Auth Server](#auth-server)
  - [Autenticación](#autenticación)
  - [Contraseñas](#contraseñas)
  - [Perfil de Usuario](#perfil-de-usuario)
- [Business API](#business-api)
  - [Cliente](#cliente)
  - [Barbero](#barbero)
  - [Barbería](#barbería)
  - [Disponibilidad](#disponibilidad)
  - [Reservaciones](#reservaciones)
  - [Transacciones](#transacciones)

---

# Auth Server

Base URL: `http://localhost:9000`

---

## Autenticación

### Registrar usuario

`POST /api/auth/register`

Crea una nueva cuenta. El usuario recibirá un correo de verificación antes de poder iniciar sesión.

**Body:**

```json
{
  "firstName": "Carlos",
  "lastName": "Ramírez",
  "phone": "3001234567",
  "email": "carlos@email.com",
  "password": "MiContrasena123",
  "role": "CLIENTE"
}
```

> Roles disponibles: `CLIENTE`, `BARBERO`, `BARBERIA`

**Ejemplo curl:**

```bash
curl -X POST \
  'http://localhost:9000/api/auth/register' \
  -H 'Content-Type: application/json' \
  -d '{
    "firstName": "Carlos",
    "lastName": "Ramírez",
    "phone": "3001234567",
    "email": "carlos@email.com",
    "password": "MiContrasena123",
    "role": "CLIENTE"
  }'
```

**Respuesta exitosa (201 Created):** sin body

---

### Verificar correo electrónico

`GET /api/auth/verify-email?token={token}`

Activa la cuenta del usuario. El token llega al correo registrado.

**Ejemplo curl:**

```bash
curl -X GET \
  'http://localhost:9000/api/auth/verify-email?token=fe245cd9-726d-4aa7-bd34-c8e0a1d6d492'
```

**Respuesta exitosa (200 OK):**

```
Correo verificado correctamente. Ya puedes iniciar sesión.
```

---

### Cerrar sesión

`POST /api/auth/logout`

Invalida el token JWT activo del usuario autenticado.

**Ejemplo curl:**

```bash
curl -X POST \
  'http://localhost:9000/api/auth/logout' \
  -H 'Authorization: Bearer <TOKEN_JWT>'
```

**Respuesta exitosa (204 No Content):** sin body

---

## Contraseñas

### Solicitar recuperación de contraseña

`POST /api/auth/forgot-password`

Envía un código OTP al correo si existe una cuenta registrada con ese email.

**Body:**

```json
{
  "email": "carlos@email.com"
}
```

**Ejemplo curl:**

```bash
curl -X POST \
  'http://localhost:9000/api/auth/forgot-password' \
  -H 'Content-Type: application/json' \
  -d '{ "email": "carlos@email.com" }'
```

**Respuesta exitosa (204 No Content):** sin body

> Por seguridad la respuesta es siempre 204 independientemente de si el correo existe o no.

---

### Restablecer contraseña

`POST /api/auth/reset-password`

Restablece la contraseña usando el código OTP recibido por correo. El código expira en 5 minutos y tiene un límite de 5 intentos.

**Body:**

```json
{
  "email": "carlos@email.com",
  "otp": "482910",
  "newPassword": "NuevaContrasena123"
}
```

**Ejemplo curl:**

```bash
curl -X POST \
  'http://localhost:9000/api/auth/reset-password' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "carlos@email.com",
    "otp": "482910",
    "newPassword": "NuevaContrasena123"
  }'
```

**Respuesta exitosa (204 No Content):** sin body

---

### Cambiar contraseña

`PATCH /api/auth/change-password`

Cambia la contraseña del usuario autenticado. Invalida todas las sesiones activas al completarse.

**Body:**

```json
{
  "currentPassword": "MiContrasena123",
  "newPassword": "NuevaContrasena456",
  "confirmNewPassword": "NuevaContrasena456"
}
```

**Ejemplo curl:**

```bash
curl -X PATCH \
  'http://localhost:9000/api/auth/change-password' \
  -H 'Authorization: Bearer <TOKEN_JWT>' \
  -H 'Content-Type: application/json' \
  -d '{
    "currentPassword": "MiContrasena123",
    "newPassword": "NuevaContrasena456",
    "confirmNewPassword": "NuevaContrasena456"
  }'
```

**Respuesta exitosa (204 No Content):** sin body

---

## Perfil de Usuario

### Actualizar perfil

`PUT /api/users/me`

Actualiza los datos personales del usuario autenticado. Solo se actualizan los campos enviados.

**Body:**

```json
{
  "firstName": "Carlos",
  "lastName": "Ramírez",
  "phone": "3001234567"
}
```

**Ejemplo curl:**

```bash
curl -X PUT \
  'http://localhost:9000/api/users/me' \
  -H 'Authorization: Bearer <TOKEN_JWT>' \
  -H 'Content-Type: application/json' \
  -d '{
    "firstName": "Carlos",
    "lastName": "Ramírez",
    "phone": "3001234567"
  }'
```

**Respuesta exitosa (200 OK):**

```json
{
  "userUuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "email": "carlos@email.com",
  "firstName": "Carlos",
  "lastName": "Ramírez",
  "phone": "3001234567"
}
```

---

# Business API

Base URL: `http://localhost:8080`

---

## Cliente

### Inicializar perfil de cliente

`POST /api/client/init`

Inicializa el perfil del cliente después del primer login. El frontend debe llamar este endpoint una sola vez tras autenticarse.

**Ejemplo curl:**

```bash
curl -X POST \
  'http://localhost:8080/api/client/init' \
  -H 'Authorization: Bearer <TOKEN_JWT>'
```

**Respuesta exitosa (200 OK):**

```json
{
  "firstName": "Carlos",
  "lastName": "Ramírez",
  "email": "carlos@email.com",
  "phone": "3001234567"
}
```

---

### Obtener perfil de cliente

`GET /api/client/profile`

Retorna el perfil del cliente autenticado.

**Ejemplo curl:**

```bash
curl -X GET \
  'http://localhost:8080/api/client/profile' \
  -H 'Authorization: Bearer <TOKEN_JWT>'
```

**Respuesta exitosa (200 OK):**

```json
{
  "firstName": "Carlos",
  "lastName": "Ramírez",
  "email": "carlos@email.com",
  "phone": "3001234567"
}
```

---

### Buscar barberías

`GET /api/client/barbershops/search?name={nombre}`

Busca barberías por nombre.

**Ejemplo curl:**

```bash
curl -X GET \
  'http://localhost:8080/api/client/barbershops/search?name=Elegante' \
  -H 'Authorization: Bearer <TOKEN_JWT>'
```

**Respuesta exitosa (200 OK):**

```json
[
  {
    "id": 1,
    "barberShopName": "Barbería Elegante",
    "address": "Calle 123 #45-67",
    "phone": "3009876543",
    "status": "ACTIVO"
  }
]
```

---

### Listar barberos de una barbería

`GET /api/client/barbershops/{barbershopId}/barbers`

Retorna los barberos activos de una barbería.

**Ejemplo curl:**

```bash
curl -X GET \
  'http://localhost:8080/api/client/barbershops/1/barbers' \
  -H 'Authorization: Bearer <TOKEN_JWT>'
```

**Respuesta exitosa (200 OK):**

```json
[
  {
    "barberId": 7,
    "userId": 12,
    "email": "barbero@email.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "phone": "3001234567",
    "documentNumber": "1020304050"
  }
]
```

---

### Listar servicios de una barbería

`GET /api/client/barbershops/{barbershopId}/services`

Retorna las categorías de servicios de una barbería.

**Ejemplo curl:**

```bash
curl -X GET \
  'http://localhost:8080/api/client/barbershops/1/services' \
  -H 'Authorization: Bearer <TOKEN_JWT>'
```

**Respuesta exitosa (200 OK):**

```json
[
  {
    "id": 3,
    "name": "Cortes",
    "description": "Servicios de corte de cabello"
  }
]
```

---

### Listar subcategorías de un servicio

`GET /api/client/barbershops/{barbershopId}/services/{categoryId}/subcategories`

Retorna las subcategorías (servicios específicos) de una categoría.

**Ejemplo curl:**

```bash
curl -X GET \
  'http://localhost:8080/api/client/barbershops/1/services/3/subcategories' \
  -H 'Authorization: Bearer <TOKEN_JWT>'
```

**Respuesta exitosa (200 OK):**

```json
[
  {
    "id": 11,
    "name": "Corte clásico",
    "description": "Corte tradicional con tijera y máquina.",
    "duration": 30,
    "price": 15000.0
  },
  {
    "id": 12,
    "name": "Corte degradado",
    "description": "Degradado bajo, medio o alto según preferencia.",
    "duration": 45,
    "price": 20000.0
  }
]
```

---

## Disponibilidad

### Consultar disponibilidad de un barbero

`POST /api/client/availability/search`

Retorna los horarios disponibles de un barbero para una fecha y servicios específicos.

**Body:**

```json
{
  "barberId": 7,
  "subcategoryIds": [11, 12],
  "date": "2026-03-15"
}
```

**Ejemplo curl:**

```bash
curl -X POST \
  'http://localhost:8080/api/client/availability/search' \
  -H 'Authorization: Bearer <TOKEN_JWT>' \
  -H 'Content-Type: application/json' \
  -d '{
    "barberId": 7,
    "subcategoryIds": [11, 12],
    "date": "2026-03-15"
  }'
```

**Respuesta exitosa (200 OK):**

```json
{
  "barberId": 7,
  "barber": "Juan Pérez",
  "date": "2026-03-15",
  "selectedServices": [
    {
      "id": 11,
      "name": "Corte clásico",
      "duration": 30,
      "price": 15000.0
    },
    {
      "id": 12,
      "name": "Corte degradado",
      "duration": 45,
      "price": 20000.0
    }
  ],
  "totalDuration": 75,
  "requiredBlocks": 5,
  "totalPrice": 35000.0,
  "slots": [
    { "time": "09:00", "status": "DISPONIBLE" },
    { "time": "09:15", "status": "DISPONIBLE" },
    { "time": "10:00", "status": "NO_DISPONIBLE" }
  ]
}
```

---

### Ver agenda del barbero

`GET /api/barber/availability/slots?date={fecha}`

Retorna todos los bloques horarios del barbero para un día, indicando su estado.

**Ejemplo curl:**

```bash
curl -X GET \
  'http://localhost:8080/api/barber/availability/slots?date=2026-03-15' \
  -H 'Authorization: Bearer <TOKEN_JWT>'
```

**Respuesta exitosa (200 OK):**

```json
{
  "barberId": 7,
  "barberName": "Juan Pérez",
  "date": "2026-03-15",
  "allSlots": [
    { "time": "09:00", "status": "DISPONIBLE" },
    { "time": "09:15", "status": "OCUPADO" },
    { "time": "09:30", "status": "BLOQUEADO" }
  ]
}
```

---

## Reservaciones

### Crear reservación (Cliente)

`POST /api/client/reservations`

Crea una nueva reservación. Se envía confirmación por correo al cliente y al barbero.

**Body:**

```json
{
  "barberId": 7,
  "date": "2026-03-15",
  "startTime": "09:00",
  "subcategoryIds": [11, 12]
}
```

**Ejemplo curl:**

```bash
curl -X POST \
  'http://localhost:8080/api/client/reservations' \
  -H 'Authorization: Bearer <TOKEN_JWT>' \
  -H 'Content-Type: application/json' \
  -d '{
    "barberId": 7,
    "date": "2026-03-15",
    "startTime": "09:00",
    "subcategoryIds": [11, 12]
  }'
```

**Respuesta exitosa (201 Created):**

```json
{
  "id": 120,
  "barber": "Juan Pérez",
  "client": "Carlos Ramírez",
  "services": [
    { "id": 11, "name": "Corte clásico", "duration": 30, "price": 15000.0 },
    { "id": 12, "name": "Corte degradado", "duration": 45, "price": 20000.0 }
  ],
  "date": "2026-03-15",
  "startTime": "09:00",
  "endTime": "10:15",
  "totalPrice": 35000.0,
  "status": "PENDIENTE"
}
```

---

### Listar reservaciones del cliente

`GET /api/client/reservations`

Retorna todas las reservaciones del cliente autenticado.

**Ejemplo curl:**

```bash
curl -X GET \
  'http://localhost:8080/api/client/reservations' \
  -H 'Authorization: Bearer <TOKEN_JWT>'
```

**Respuesta exitosa (200 OK):**

```json
[
  {
    "id": 120,
    "barber": "Juan Pérez",
    "client": "Carlos Ramírez",
    "services": [...],
    "date": "2026-03-15",
    "startTime": "09:00",
    "endTime": "10:15",
    "totalPrice": 35000.00,
    "status": "PENDIENTE"
  }
]
```

---

### Cancelar reservación (Cliente)

`PATCH /api/client/reservations/{id}/cancel`

Cancela una reservación pendiente. Se notifica al barbero por correo.

**Ejemplo curl:**

```bash
curl -X PATCH \
  'http://localhost:8080/api/client/reservations/120/cancel' \
  -H 'Authorization: Bearer <TOKEN_JWT>'
```

**Respuesta exitosa (204 No Content):** sin body

---

### Listar reservaciones del barbero

`GET /api/barber/reservations?date={fecha}`

Retorna las reservaciones del barbero para una fecha específica.

**Ejemplo curl:**

```bash
curl -X GET \
  'http://localhost:8080/api/barber/reservations?date=2026-03-15' \
  -H 'Authorization: Bearer <TOKEN_JWT>'
```

**Respuesta exitosa (200 OK):**

```json
[
  {
    "id": 120,
    "barber": "Juan Pérez",
    "client": "Carlos Ramírez",
    "services": [...],
    "date": "2026-03-15",
    "startTime": "09:00",
    "endTime": "10:15",
    "totalPrice": 35000.00,
    "status": "PENDIENTE"
  }
]
```

---

### Cambiar estado de reservación (Barbero)

`PATCH /api/barber/reservations/{id}/status`

Actualiza el estado de una reservación.

> Estados disponibles: `PENDIENTE`, `EN_CURSO`, `COMPLETADA`, `CANCELADA`

**Body:**

```json
{
  "status": "EN_CURSO"
}
```

**Ejemplo curl:**

```bash
curl -X PATCH \
  'http://localhost:8080/api/barber/reservations/120/status' \
  -H 'Authorization: Bearer <TOKEN_JWT>' \
  -H 'Content-Type: application/json' \
  -d '{ "status": "EN_CURSO" }'
```

**Respuesta exitosa (204 No Content):** sin body

---

## Transacciones

### Registrar pago (Cliente)

`POST /api/client/transactions`

El cliente registra el pago de una reservación completada.

**Body:**

```json
{
  "reservationId": 120,
  "paymentMethod": "EFECTIVO",
  "totalAmount": 35000.0,
  "tip": 5000.0,
  "notes": "Pago en efectivo"
}
```

> Métodos de pago: `EFECTIVO`, `TRANSFERENCIA`, `TARJETA`

**Ejemplo curl:**

```bash
curl -X POST \
  'http://localhost:8080/api/client/transactions' \
  -H 'Authorization: Bearer <TOKEN_JWT>' \
  -H 'Content-Type: application/json' \
  -d '{
    "reservationId": 120,
    "paymentMethod": "EFECTIVO",
    "totalAmount": 35000.00,
    "tip": 5000.00,
    "notes": "Pago en efectivo"
  }'
```

**Respuesta exitosa (201 Created):**

```json
{
  "id": 1001,
  "transactionCode": "TRX-20260315-AB12",
  "reservationId": 120,
  "barberId": 7,
  "totalAmount": 35000.0,
  "tip": 5000.0,
  "paymentMethod": "EFECTIVO",
  "paymentStatus": "PENDIENTE",
  "paymentDate": "2026-03-15T10:20:00",
  "notes": "Pago en efectivo"
}
```

---

### Confirmar pago (Barbero)

`PATCH /api/barber/transactions/{id}/complete`

El barbero confirma la transacción. Genera automáticamente el registro de ingresos con el desglose de comisiones.

**Ejemplo curl:**

```bash
curl -X PATCH \
  'http://localhost:8080/api/barber/transactions/1001/complete' \
  -H 'Authorization: Bearer <TOKEN_JWT>'
```

**Respuesta exitosa (200 OK):**

```json
{
  "id": 1001,
  "transactionCode": "TRX-20260315-AB12",
  "reservationId": 120,
  "barberId": 7,
  "totalAmount": 35000.0,
  "tip": 5000.0,
  "paymentMethod": "EFECTIVO",
  "paymentStatus": "PAGADO",
  "paymentDate": "2026-03-15T10:25:00",
  "notes": "Pago en efectivo"
}
```

---

### Listar transacciones del día (Barbero)

`GET /api/barber/transactions`

Retorna las transacciones del barbero para el día actual.

**Ejemplo curl:**

```bash
curl -X GET \
  'http://localhost:8080/api/barber/transactions' \
  -H 'Authorization: Bearer <TOKEN_JWT>'
```

**Respuesta exitosa (200 OK):**

```json
[
  {
    "id": 1001,
    "transactionCode": "TRX-20260315-AB12",
    "reservationId": 120,
    "barberId": 7,
    "totalAmount": 35000.0,
    "tip": 5000.0,
    "paymentMethod": "EFECTIVO",
    "paymentStatus": "PAGADO",
    "paymentDate": "2026-03-15T10:25:00",
    "notes": "Pago en efectivo"
  }
]
```

---

## Barbero

### Obtener perfil del barbero

`GET /api/barber/profile`

Retorna el perfil del barbero autenticado.

**Ejemplo curl:**

```bash
curl -X GET \
  'http://localhost:8080/api/barber/profile' \
  -H 'Authorization: Bearer <TOKEN_JWT>'
```

**Respuesta exitosa (200 OK):**

```json
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan@email.com",
  "phone": "3001234567",
  "documentNumber": "1020304050",
  "commission": 0.7,
  "barberShopName": "Barbería Elegante"
}
```

---

### Registrar descanso

`POST /api/barber/breaks`

Registra un bloque de descanso para el barbero. Los slots del descanso quedarán bloqueados.

**Body:**

```json
{
  "start": "12:00",
  "end": "13:00",
  "date": "2026-03-15"
}
```

**Ejemplo curl:**

```bash
curl -X POST \
  'http://localhost:8080/api/barber/breaks' \
  -H 'Authorization: Bearer <TOKEN_JWT>' \
  -H 'Content-Type: application/json' \
  -d '{
    "start": "12:00",
    "end": "13:00",
    "date": "2026-03-15"
  }'
```

**Respuesta exitosa (201 Created):**

```json
{
  "id": 5,
  "start": "12:00",
  "end": "13:00",
  "date": "2026-03-15",
  "barberName": "Juan Pérez"
}
```

---

### Eliminar descanso

`DELETE /api/barber/breaks/{id}`

Elimina un descanso registrado.

**Ejemplo curl:**

```bash
curl -X DELETE \
  'http://localhost:8080/api/barber/breaks/5' \
  -H 'Authorization: Bearer <TOKEN_JWT>'
```

**Respuesta exitosa (204 No Content):** sin body

---

### Ver invitaciones pendientes (Barbero)

`GET /api/barber/invitations/pending`

Retorna las invitaciones pendientes recibidas por el barbero.

**Ejemplo curl:**

```bash
curl -X GET \
  'http://localhost:8080/api/barber/invitations/pending' \
  -H 'Authorization: Bearer <TOKEN_JWT>'
```

**Respuesta exitosa (200 OK):**

```json
[
  {
    "barberShopName": "Barbería Elegante",
    "barberShopAddress": "Calle 123 #45-67",
    "commission": 0.3,
    "documentNumber": "1020304050",
    "expiresAt": "2026-03-14T10:48:00"
  }
]
```

---

### Ver detalle de invitación (público)

`GET /api/invitations/{token}`

Retorna los detalles de una invitación por token. No requiere autenticación.

**Ejemplo curl:**

```bash
curl -X GET \
  'http://localhost:8080/api/invitations/fe245cd9-726d-4aa7-bd34-c8e0a1d6d492'
```

**Respuesta exitosa (200 OK):**

```json
{
  "barberShopName": "Barbería Elegante",
  "barberShopAddress": "Calle 123 #45-67",
  "commission": 0.3,
  "documentNumber": "1020304050",
  "expiresAt": "2026-03-14T10:48:00"
}
```

---

### Aceptar invitación

`POST /api/barber/invitations/{token}/accept`

El barbero autenticado acepta la invitación. Se crea su perfil de barbero en la barbería.

**Ejemplo curl:**

```bash
curl -X POST \
  'http://localhost:8080/api/barber/invitations/fe245cd9-726d-4aa7-bd34-c8e0a1d6d492/accept' \
  -H 'Authorization: Bearer <TOKEN_JWT>'
```

**Respuesta exitosa (204 No Content):** sin body

---

### Rechazar invitación

`POST /api/barber/invitations/{token}/reject`

El barbero autenticado rechaza la invitación.

**Ejemplo curl:**

```bash
curl -X POST \
  'http://localhost:8080/api/barber/invitations/fe245cd9-726d-4aa7-bd34-c8e0a1d6d492/reject' \
  -H 'Authorization: Bearer <TOKEN_JWT>'
```

**Respuesta exitosa (204 No Content):** sin body

---

### Dashboard del barbero

`GET /api/barber/dashboard`

Retorna el resumen completo del barbero: ingresos diarios, semanales, mensuales, comparativa y últimos 7 días.

**Ejemplo curl:**

```bash
curl -X GET \
  'http://localhost:8080/api/barber/dashboard' \
  -H 'Authorization: Bearer <TOKEN_JWT>'
```

**Respuesta exitosa (200 OK):**

```json
{
  "barberId": 7,
  "barberName": "Juan Pérez",
  "daily": {
    "barberId": 7,
    "barberName": "Juan Pérez",
    "startDate": "2026-03-15",
    "endDate": "2026-03-15",
    "totalCommission": 24500.00,
    "totalTips": 5000.00,
    "totalIncome": 29500.00,
    "transactionsCount": 3
  },
  "weekly": { ... },
  "monthly": { ... },
  "monthlyComparison": {
    "currentMonth": 580000.00,
    "previousMonth": 510000.00,
    "difference": 70000.00,
    "percentageChange": 13.72
  },
  "last7days": {
    "days": [
      { "date": "2026-03-09", "income": 85000.00 },
      { "date": "2026-03-10", "income": 92000.00 }
    ]
  },
  "workedHours": {
    "totalAppointments": 18,
    "hours": "13h 30min"
  }
}
```

---

## Barbería

### Crear perfil de barbería

`POST /api/barbershop`

Crea el perfil de la barbería para el usuario autenticado con rol `BARBERIA`.

**Body:**

```json
{
  "barberShopName": "Barbería Elegante",
  "address": "Calle 123 #45-67",
  "phone": "3009876543"
}
```

**Ejemplo curl:**

```bash
curl -X POST \
  'http://localhost:8080/api/barbershop' \
  -H 'Authorization: Bearer <TOKEN_JWT>' \
  -H 'Content-Type: application/json' \
  -d '{
    "barberShopName": "Barbería Elegante",
    "address": "Calle 123 #45-67",
    "phone": "3009876543"
  }'
```

**Respuesta exitosa (201 Created):**

```json
{
  "id": 1,
  "barberShopName": "Barbería Elegante",
  "address": "Calle 123 #45-67",
  "phone": "3009876543",
  "status": "ACTIVO"
}
```

---

### Obtener perfil de barbería

`GET /api/barbershop/my`

Retorna el perfil completo de la barbería autenticada.

**Ejemplo curl:**

```bash
curl -X GET \
  'http://localhost:8080/api/barbershop/my' \
  -H 'Authorization: Bearer <TOKEN_JWT>'
```

**Respuesta exitosa (200 OK):**

```json
{
  "id": 1,
  "barberShopName": "Barbería Elegante",
  "address": "Calle 123 #45-67",
  "phone": "3009876543",
  "status": "ACTIVO"
}
```

---

### Actualizar perfil de barbería

`PUT /api/barbershop`

Actualiza los datos de la barbería. Solo se actualizan los campos enviados.

**Body:**

```json
{
  "barberShopName": "Barbería Elegante Premium",
  "address": "Calle 456 #78-90",
  "barberShopPhone": "3001112233"
}
```

**Ejemplo curl:**

```bash
curl -X PUT \
  'http://localhost:8080/api/barbershop' \
  -H 'Authorization: Bearer <TOKEN_JWT>' \
  -H 'Content-Type: application/json' \
  -d '{
    "barberShopName": "Barbería Elegante Premium",
    "address": "Calle 456 #78-90",
    "barberShopPhone": "3001112233"
  }'
```

**Respuesta exitosa (200 OK):**

```json
{
  "id": 1,
  "barberShopName": "Barbería Elegante Premium",
  "address": "Calle 456 #78-90",
  "phone": "3001112233",
  "status": "ACTIVO"
}
```

---

### Configurar horarios de atención

`POST /api/barbershop/opening-hours`

Registra los horarios de atención de la barbería por día de la semana.

**Body:**

```json
{
  "dayOfWeek": "MONDAY",
  "startTime": "09:00",
  "endTime": "18:00"
}
```

> Días disponibles: `MONDAY`, `TUESDAY`, `WEDNESDAY`, `THURSDAY`, `FRIDAY`, `SATURDAY`, `SUNDAY`

**Ejemplo curl:**

```bash
curl -X POST \
  'http://localhost:8080/api/barbershop/opening-hours' \
  -H 'Authorization: Bearer <TOKEN_JWT>' \
  -H 'Content-Type: application/json' \
  -d '{
    "dayOfWeek": "MONDAY",
    "startTime": "09:00",
    "endTime": "18:00"
  }'
```

**Respuesta exitosa (201 Created):**

```json
{
  "id": 1,
  "dayOfWeek": "MONDAY",
  "startTime": "09:00",
  "endTime": "18:00"
}
```

---

### Crear categoría de servicio

`POST /api/barbershop/categories`

Crea una categoría de servicios para la barbería.

**Body:**

```json
{
  "name": "Cortes",
  "description": "Servicios de corte de cabello"
}
```

**Ejemplo curl:**

```bash
curl -X POST \
  'http://localhost:8080/api/barbershop/categories' \
  -H 'Authorization: Bearer <TOKEN_JWT>' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Cortes",
    "description": "Servicios de corte de cabello"
  }'
```

**Respuesta exitosa (201 Created):**

```json
{
  "id": 3,
  "name": "Cortes",
  "description": "Servicios de corte de cabello"
}
```

---

### Crear subcategoría de servicio

`POST /api/barbershop/categories/{categoryId}/subcategories`

Crea un servicio específico dentro de una categoría.

**Body:**

```json
{
  "name": "Corte degradado",
  "description": "Degradado bajo, medio o alto según preferencia.",
  "duration": 45,
  "price": 20000
}
```

**Ejemplo curl:**

```bash
curl -X POST \
  'http://localhost:8080/api/barbershop/categories/3/subcategories' \
  -H 'Authorization: Bearer <TOKEN_JWT>' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Corte degradado",
    "description": "Degradado bajo, medio o alto según preferencia.",
    "duration": 45,
    "price": 20000
  }'
```

**Respuesta exitosa (201 Created):**

```json
{
  "id": 12,
  "name": "Corte degradado",
  "description": "Degradado bajo, medio o alto según preferencia.",
  "duration": 45,
  "price": 20000.0
}
```

---

### Invitar barbero

`POST /api/barbershop/invitations`

Envía una invitación por correo a un barbero para unirse a la barbería.

**Body:**

```json
{
  "email": "juan@email.com",
  "documentNumber": "1020304050",
  "commission": 0.3
}
```

**Ejemplo curl:**

```bash
curl -X POST \
  'http://localhost:8080/api/barbershop/invitations' \
  -H 'Authorization: Bearer <TOKEN_JWT>' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "juan@email.com",
    "documentNumber": "1020304050",
    "commission": 0.30
  }'
```

**Respuesta exitosa (201 Created):** sin body

---

### Listar invitaciones enviadas

`GET /api/barbershop/invitations`

Retorna todas las invitaciones enviadas por la barbería.

**Ejemplo curl:**

```bash
curl -X GET \
  'http://localhost:8080/api/barbershop/invitations' \
  -H 'Authorization: Bearer <TOKEN_JWT>'
```

**Respuesta exitosa (200 OK):**

```json
[
  {
    "token": "fe245cd9-726d-4aa7-bd34-c8e0a1d6d492",
    "invitedEmail": "juan@email.com",
    "commission": 0.3,
    "status": "PENDING",
    "expiresAt": "2026-03-14T10:48:00"
  }
]
```

---

### Cancelar invitación

`DELETE /api/barbershop/invitations/{token}`

Cancela una invitación pendiente.

**Ejemplo curl:**

```bash
curl -X DELETE \
  'http://localhost:8080/api/barbershop/invitations/fe245cd9-726d-4aa7-bd34-c8e0a1d6d492' \
  -H 'Authorization: Bearer <TOKEN_JWT>'
```

**Respuesta exitosa (204 No Content):** sin body

---

### Listar barberos de la barbería

`GET /api/barbershop/barbers`

Retorna todos los barberos de la barbería autenticada.

**Ejemplo curl:**

```bash
curl -X GET \
  'http://localhost:8080/api/barbershop/barbers' \
  -H 'Authorization: Bearer <TOKEN_JWT>'
```

**Respuesta exitosa (200 OK):**

```json
[
  {
    "barberId": 7,
    "email": "juan@email.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "phone": "3001234567",
    "documentNumber": "1020304050",
    "commission": 0.7,
    "status": "ACTIVO"
  }
]
```

---

### Actualizar comisión de un barbero

`PATCH /api/barbershop/barbers/{barberId}/commission`

Actualiza la comisión asignada a un barbero.

**Body:**

```json
{
  "newCommission": 0.35
}
```

**Ejemplo curl:**

```bash
curl -X PATCH \
  'http://localhost:8080/api/barbershop/barbers/7/commission' \
  -H 'Authorization: Bearer <TOKEN_JWT>' \
  -H 'Content-Type: application/json' \
  -d '{ "newCommission": 0.35 }'
```

**Respuesta exitosa (204 No Content):** sin body

---

### Desactivar barbero

`PATCH /api/barbershop/barbers/{barberId}/desactivate`

Desactiva un barbero de la barbería.

**Ejemplo curl:**

```bash
curl -X PATCH \
  'http://localhost:8080/api/barbershop/barbers/7/desactivate' \
  -H 'Authorization: Bearer <TOKEN_JWT>'
```

**Respuesta exitosa (204 No Content):** sin body

---

### Activar barbero

`PATCH /api/barbershop/barbers/{barberId}/activate`

Reactiva un barbero previamente desactivado.

**Ejemplo curl:**

```bash
curl -X PATCH \
  'http://localhost:8080/api/barbershop/barbers/7/activate' \
  -H 'Authorization: Bearer <TOKEN_JWT>'
```

**Respuesta exitosa (204 No Content):** sin body

---

### Subir imagen

`POST /api/barbershop/images/upload`

Sube una imagen para la barbería. Máximo 5 imágenes por barbería.

**Ejemplo curl:**

```bash
curl -X POST \
  'http://localhost:8080/api/barbershop/images/upload' \
  -H 'Authorization: Bearer <TOKEN_JWT>' \
  -F 'file=@/ruta/imagen.jpg'
```

**Respuesta exitosa (200 OK):**

```json
{
  "id": 1,
  "imageUrl": "https://res.cloudinary.com/barberia/image/upload/v1234567890/imagen.jpg",
  "cover": false,
  "uploadedAt": "2026-03-15T10:00:00"
}
```

---

### Listar imágenes

`GET /api/barbershop/images`

Retorna todas las imágenes de la barbería autenticada.

**Ejemplo curl:**

```bash
curl -X GET \
  'http://localhost:8080/api/barbershop/images' \
  -H 'Authorization: Bearer <TOKEN_JWT>'
```

**Respuesta exitosa (200 OK):**

```json
[
  {
    "id": 1,
    "imageUrl": "https://res.cloudinary.com/barberia/image/upload/v1234567890/imagen.jpg",
    "cover": true,
    "uploadedAt": "2026-03-15T10:00:00"
  },
  {
    "id": 2,
    "imageUrl": "https://res.cloudinary.com/barberia/image/upload/v1234567890/imagen2.jpg",
    "cover": false,
    "uploadedAt": "2026-03-15T10:05:00"
  }
]
```

---

### Eliminar imagen

`DELETE /api/barbershop/images/{id}`

Elimina una imagen de la barbería.

**Ejemplo curl:**

```bash
curl -X DELETE \
  'http://localhost:8080/api/barbershop/images/1' \
  -H 'Authorization: Bearer <TOKEN_JWT>'
```

**Respuesta exitosa (200 OK):**

```json
{
  "message": "Imagen eliminada"
}
```

---

### Establecer imagen de portada

`POST /api/barbershop/images/{id}/cover`

Marca una imagen existente como portada de la barbería.

**Ejemplo curl:**

```bash
curl -X POST \
  'http://localhost:8080/api/barbershop/images/2/cover' \
  -H 'Authorization: Bearer <TOKEN_JWT>'
```

**Respuesta exitosa (200 OK):**

```json
{
  "message": "Portada actualizada"
}
```

---

### Dashboard de la barbería

`GET /api/barbershop/dashboard`

Retorna el resumen completo de ingresos y rendimiento de la barbería.

**Ejemplo curl:**

```bash
curl -X GET \
  'http://localhost:8080/api/barbershop/dashboard' \
  -H 'Authorization: Bearer <TOKEN_JWT>'
```

**Respuesta exitosa (200 OK):**

```json
{
  "barberShopId": 1,
  "barberShopName": "Barbería Elegante",
  "totalBarbers": 4,
  "daily": {
    "totalIncome": 180000.00,
    "barberShopAmount": 54000.00,
    "transactionsCount": 6
  },
  "weekly": { ... },
  "monthly": { ... },
  "monthlyComparison": {
    "currentMonth": 3200000.00,
    "previousMonth": 2900000.00,
    "difference": 300000.00,
    "percentageChange": 10.34
  },
  "topBarbers": [
    {
      "barberId": 7,
      "barberName": "Juan Pérez",
      "totalIncome": 980000.00
    }
  ]
}
```
