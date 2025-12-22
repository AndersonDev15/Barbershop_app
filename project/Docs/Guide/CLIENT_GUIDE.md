← [Volver al API Guide General](API_GUIDE.md)


## Clientes

---

Este módulo agrupa todas las operaciones que puede realizar un usuario
con rol **CLIENTE**, desde la gestión de su perfil hasta la creación de
reservas y transacciones.

Todos los endpoints de este módulo requieren **autenticación JWT**.

---

### Obtener perfil del cliente
`GET /api/client/profile
`

Devuelve la información del cliente autenticado.

#### Ejemplo de uso (Curl)

```bash
curl -X GET \
  http://localhost:8080/api/client/profile \
  -H "accept: */*" \
  -H "Authorization: Bearer <token>
```

##### Respuesta exitosa (200 OK)
```json
{
  "email": "anjodivi15@gmail.com",
  "firstName": "Anderson Jose",
  "lastName": "Diaz",
  "phone": "3013786171",
  "preferences": "Ninguna",
  "lastVisitDate": "2025-12-15T11:18:33"
}
```

---

### Actualizar perfil del cliente

`PUT /api/client/profile
`

Permite al cliente actualizar su información personal.

#### Request Body
```json
{
  "firstName": "Carlos",
  "lastName": "Ramírez",
  "phone": "3001234567"
}
```

#### Ejemplo de uso (Curl)
```bash
curl -X PUT \
http://localhost:8080/api/client/profile \
-H "accept: */*" \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{
"firstName": "Carlos",
"lastName": "Ramírez",
"phone": "3001234567"
}'
```

---

### Buscar barbería por nombre
`GET /api/client/barbershops/search
`
Permite buscar barberías por nombre completo.

#### Ejemplo de uso (Curl)
```bash
curl -X GET \
  'http://localhost:8080/api/client/barbershops/search?name=barberia%20elegante' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <TOKEN_JWT>'

```

##### Respuesta exitosa (200 OK)
```json
{
  "id": 3,
  "name": "Barbería Elegante",
  "address": "Calle 123 #45-67, Sincelejo",
  "phone": "3001234567",
  "openNow": true,
  "todaySchedules": [
    "09:00 - 12:00",
    "14:00 - 19:00"
  ]
}
```

##### Errores
**404 – Barbería no encontrada**
```json
{
  "timestamp": "2025-12-20T10:54:32.5262131",
  "status": 404,
  "error": "Not Found",
  "message": "Barberia no encontrada",
  "path": "/api/client/barbershops/search",
  "errors": [
    {
      "error": "BUSINESS_MISTAKE",
      "message": "Error de logica de negocio",
      "details": [
        "Barberia no encontrada"
      ]
    }
  ]
}

```

---

### Obtener barberos de una barbería
Devuelve una lista de todos los barberos que trabajan en la barbería especificada por su ID.

#### Ejemplo de uso (Curl)
```bash
curl -X GET \
  'http://localhost:8080/api/client/barbershops/1/barbers' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <TOKEN_JWT>'

```

##### Respuesta exitosa (200 OK)
```json
[
  {
    "barberId": 1,
    "userId": 9,
    "email": "cbarbero@cooreo.com",
    "firstName": "Carlos",
    "lastName": "Pineda",
    "phone": "3012345671",
    "documentNumber": "123456789"
  },
  {
    "barberId": 3,
    "userId": 13,
    "email": "gafyujekna@necub.com",
    "firstName": "Carlos",
    "lastName": "Ramírez",
    "phone": "3001234567",
    "documentNumber": "1029384756"
  },
  {
    "barberId": 4,
    "userId": 15,
    "email": "jotivap945@kudimi.com",
    "firstName": "Pedro",
    "lastName": "Pérez",
    "phone": "3016549870",
    "documentNumber": "1029384756"
  }
]

```

##### Errores

**400 – ID de barbería inválido**
El ID enviado no es válido.

**404 – Barbería no encontrada**
```json
{
  "timestamp": "2025-12-20T11:00:50.3261199",
  "status": 404,
  "error": "Not Found",
  "message": "Barberia no encontrada",
  "path": "/api/client/barbershops/8/barbers",
  "errors": [
    {
      "error": "BUSINESS_MISTAKE",
      "message": "Error de logica de negocio",
      "details": [
        "Barberia no encontrada"
      ]
    }
  ]
}

```

---

### Listar servicios
`GET /api/client/barbershops/{barbershopId}/services
`
Devuelve la lista de servicios que ofrece la barbería.
#### Ejemplo de uso
```bash
curl -X GET \
  'http://localhost:8080/api/client/barbershops/4/services' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <TOKEN_JWT>'

```

##### Respuesta exitosa (200 OK)
```json
[
  {
    "id": 4,
    "name": "Corte de cabello",
    "description": "Corte con máquina y tijera, estilo a elección."
  },
  {
    "id": 5,
    "name": "Tinte de cabello",
    "description": "Tinte de pelo a color de eleccion"
  },
  {
    "id": 6,
    "name": "Aseo Facial",
    "description": "Limpiar imperfecciones de la cara"
  }
]
```

##### Errores

**404 – Barbería no encontrada**
```json
{
  "timestamp": "2025-12-20T11:07:08.982065",
  "status": 404,
  "error": "Not Found",
  "message": "Barberia no encontrada",
  "path": "/api/client/barbershops/9/services",
  "errors": [
    {
      "error": "BUSINESS_MISTAKE",
      "message": "Error de logica de negocio",
      "details": [
        "Barberia no encontrada"
      ]
    }
  ]
}
```

---

### Listar subcategorías
`GET /api/client/barbershops/{barbershopId}/{categoryId}/subcategory
`
Devuelve todas las subcategorías relacionadas con una categoría específica dentro de una barbería.

#### Ejemplo de uso (Curl)
```bash
curl -X GET \
  'http://localhost:8080/api/client/barbershops/4/6/subcategory' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <TOKEN_JWT>'

```

##### Respuesta exitosa  (200 OK)
```json
[
  {
    "id": 3,
    "name": "mascarillas para puntos negros",
    "description": "Remover los puntos negros de la nariz a través de una mascarilla negra",
    "duration": 15,
    "price": 12000
  },
  {
    "id": 4,
    "name": "Delineado de cejas",
    "description": "Recorte y forma de cejas",
    "duration": 15,
    "price": 5000
  }
]

```

---

### Buscar disponibilidad
`POST /api/client/availability/search
`
Devuelve los horarios disponibles de un barbero en una fecha específica, teniendo en cuenta los servicios seleccionados y su duración total.

#### Request Body
```json
{
  "barberId": 12,
  "subcategoryIds": [3, 5, 7],
  "date": "2025-03-15"
}

```

#### Ejemplo de uso (Curl)
```bash
curl -X POST \
  'http://localhost:8080/api/client/availability/search' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <TOKEN_JWT>' \
  -d '{
    "barberId": 12,
    "subcategoryIds": [3,5,7],
    "date": "2025-03-15"
  }'

```

##### Respuesta Exitosa (200 OK)
```json
{
  "barberId": 12,
  "barber": "Juan Pérez",
  "date": "2025-03-15",
  "selectedServices": [
    {
      "id": 5,
      "name": "Corte de cabello",
      "duration": 30,
      "price": 15000
    }
  ],
  "totalDuration": 30,
  "requiredBlocks": 2,
  "totalPrice": 15000,
  "slots": [
    {
      "time": "14:00",
      "status": "DISPONIBLE"
    }
  ]
}

```
##### Errores
**400 – Datos inválidos**
Ocurre cuando el cuerpo de la solicitud no cumple con las validaciones requeridas.
```json
{
  "timestamp": "2025-12-20T11:38:14.3448703",
  "status": 400,
  "error": "BAD_REQUEST",
  "message": "Error de validación",
  "path": "/api/client/availability/search",
  "errors": [
    {
      "error": "VALIDATION_ERROR",
      "message": "Los datos de entrada son inválidos",
      "details": [
        "date: no debe ser nulo"
      ]
    }
  ]
}
```
**404 – Barbero no encontrado**
El barberId enviado no existe o no es válido.

```json
{
  "timestamp": "2025-12-20T11:37:23.8361704",
  "status": 404,
  "error": "Not Found",
  "message": "Barbero no encontrado",
  "path": "/api/client/availability/search",
  "errors": [
    {
      "error": "BUSINESS_MISTAKE",
      "message": "Error de logica de negocio",
      "details": [
        "Barbero no encontrado"
      ]
    }
  ]
}

```

---

### Crear una reserva
`POST /api/client/reservations
`
Permite que un cliente cree una reserva seleccionando barbero, servicios, fecha y hora de inicio.

**Acción adicional:**
Al crear la reserva, se envía una notificación por correo electrónico al barbero informándole que tiene una nueva reserva.

#### Request Body
```json
{
  "barberId": 5,
  "date": "2025-01-15",
  "startTime": "14:30",
  "subcategoryIds": [1, 4, 7]
}

```

#### Ejemplo de uso (Curl)
```bash
curl -X POST \
  'http://localhost:8080/api/client/reservations' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <TOKEN_JWT>' \
  -H 'Content-Type: application/json' \
  -d '{
    "barberId": 5,
    "date": "2025-01-15",
    "startTime": "14:30",
    "subcategoryIds": [1,4,7]
  }'

```

##### Respuesta Exitosa (200 OK)
```json
{
  "id": 120,
  "barber": "Carlos Díaz",
  "client": "Anderson Morales",
  "services": [
    {
      "id": 5,
      "name": "Corte de cabello",
      "duration": 30,
      "price": 15000
    }
  ],
  "date": "2025-01-15",
  "startTime": "14:30",
  "endTime": "15:00",
  "totalPrice": 30000,
  "status": "CONFIRMADA"
}
```

##### Errores
**400 – Datos inválidos**
```json
{
  "timestamp": "2025-12-20T11:35:32.994444",
  "status": 400,
  "error": "BAD_REQUEST",
  "message": "Error de validación",
  "path": "/api/client/reservations",
  "errors": [
    {
      "error": "VALIDATION_ERROR",
      "message": "Los datos de entrada son inválidos",
      "details": [
        "subcategoryIds: no debe estar vacío"
      ]
    }
  ]
}

```

---

### Obtener mis reservas
`GET /api/client/reservations
`
Devuelve la lista de reservas del cliente autenticado.
Opcionalmente permite filtrar las reservas por su estado.

#### Ejemplos de uso (Curl)
**Sin filtro**
```bash
curl -X GET \
  'http://localhost:8080/api/client/reservations' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <TOKEN_JWT>'

```

**con filtro de estado**
```bash
curl -X GET \
  'http://localhost:8080/api/client/reservations?status=CONFIRMADA' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <TOKEN_JWT>'


```

#### Respuesta exitosa  (200 OK)
```json
[
  {
    "id": 120,
    "barber": "Carlos Díaz",
    "client": "Anderson Morales",
    "services": [
      {
        "id": 5,
        "name": "Corte de cabello",
        "duration": 30,
        "price": 15000
      }
    ],
    "date": "2025-01-15",
    "startTime": "14:30",
    "endTime": "15:00",
    "totalPrice": 15000,
    "status": "CONFIRMADA"
  }
]

```

---

### Cancelar una reserva
`PATCH /api/client/reservations/{reservationId}/cancel
`
Permite que el cliente cancele una de sus reservas existentes.

**Acción adicional:**
Al cancelar la reserva, se envía una notificación al barbero informándole que la cita fue cancelada.

#### Ejemplo de uso (Curl)
```bash
curl -X PATCH \
  'http://localhost:8080/api/client/reservations/120/cancel' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <TOKEN_JWT>'
```

##### Respuesta exitosa  (200 OK)
```json
{
  "id": 120,
  "barber": "Carlos Díaz",
  "client": "Anderson Morales",
  "services": [
    {
      "id": 5,
      "name": "Corte de cabello",
      "duration": 30,
      "price": 15000
    }
  ],
  "date": "2025-01-15",
  "startTime": "14:30",
  "endTime": "15:00",
  "totalPrice": 15000,
  "status": "CANCELADA"
}

```
##### Errores
**400 – La reserva no puede cancelarse**
```json
{
  "timestamp": "2025-12-20T11:57:29.6636955",
  "status": 403,
  "error": "Forbidden",
  "message": "La reserva ya esta cancelada",
  "path": "/api/client/reservations/26/cancel",
  "errors": [
    {
      "error": "BUSINESS_MISTAKE",
      "message": "Error de logica de negocio",
      "details": [
        "La reserva ya esta cancelada"
      ]
    }
  ]
}
```

---

### Crear una transacción
`POST /api/client/transaction
`
Permite que el cliente registre una transacción de pago asociada a una reserva previamente completada.
La reserva debe estar en estado COMPLETADA para poder crear la transacción.

#### Request Body
```json
{
  "reservationId": 6,
  "paymentMethod": "EFECTIVO",
  "totalAmount": 35000,
  "tip": 0,
  "notes": "Pago realizado en efectivo"
}

```

#### Ejemplo de uso (Curl)
```bash
curl -X POST \
  'http://localhost:8080/api/client/transaction' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <TOKEN_JWT>' \
  -H 'Content-Type: application/json' \
  -d '{
    "reservationId": 6,
    "paymentMethod": "EFECTIVO",
    "totalAmount": 35000,
    "tip": 0,
    "notes": "Pago realizado en efectivo"
  }'

```

##### Respuesta Exitosa (200 OK)
```json
{
  "id": 1001,
  "transactionCode": "TRX-20250110-AB12",
  "reservationId": 15,
  "barberId": 8,
  "totalAmount": 35000,
  "tip": 5000,
  "paymentMethod": "EFECTIVO",
  "paymentStatus": "PAGADO",
  "paymentDate": "2025-01-10T14:35:22",
  "notes": "Pago recibido sin novedades."
}

```

##### Errores
**400 – Datos inválidos**
```json
{
  "timestamp": "2025-12-20T12:05:45.6523974",
  "status": 400,
  "error": "BAD_REQUEST",
  "message": "Error de validación",
  "path": "/api/client/transaction",
  "errors": [
    {
      "error": "VALIDATION_ERROR",
      "message": "Los datos de entrada son inválidos",
      "details": [
        "totalAmount: no debe ser nulo"
      ]
    }
  ]
}
```

**403 – La reserva debe estar completada**
```json
{
  "timestamp": "2025-12-20T11:34:56.3975969",
  "status": 403,
  "error": "Forbidden",
  "message": "La reserva debe estar completada",
  "path": "/api/client/transaction",
  "errors": [
    {
      "error": "BUSINESS_MISTAKE",
      "message": "Error de logica de negocio",
      "details": [
        "La reserva debe estar completada"
      ]
    }
  ]
}

```