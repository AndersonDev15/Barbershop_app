← [Volver al API Guide General](API_GUIDE.md)


## Barbero

---

### Obtener perfil del barbero
`GET /api/barber/profile`

Retorna toda la información del perfil del barbero autenticado.

>Nota:
Para obtener los datos correctamente, el barbero debe estar asociado a una barbería.

#### Ejemplo de uso (Curl)
```bash
curl -X 'GET' \
  'http://localhost:8080/api/barber/profile' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <TOKEN_JWT>'
```

#### Respuesta exitosa (200 OK)
```json
{
  "email": "andersondiaz0515@gmail.com",
  "firstName": "ande",
  "lastName": "jose",
  "phone": "3001234563",
  "documentNumber": "12345678",
  "commission": 0.35,
  "barberShop": "Barbería Urbana"
}

```

---

### Actualizar perfil del barbero
`PUT /api/barber/profile`

Permite al barbero autenticado modificar su información personal.

#### Request body
```json
{
  "firstName": "Carlos",
  "lastName": "Ramírez",
  "phone": "3001234567"
}

```

#### Ejemplo de uso (Curl)
```bash
curl -X 'PUT' \
  'http://localhost:8080/api/barber/profile' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <TOKEN_JWT>' \
  -H 'Content-Type: application/json' \
  -d '{
    "firstName": "ande",
    "lastName": "jose",
    "phone": "3001234563",
  }'

```

#### Respuesta exitosa (200 OK)
```json
{
  "email": "andersondiaz0515@gmail.com",
  "firstName": "ande",
  "lastName": "jose",
  "phone": "3001234563",
  "documentNumber": "12345678",
  "commission": 0.35,
  "barberShop": "Barbería Urbana"
}

```

---

### Registrar un descanso
`POST /api/barber/break`

Permite que el barbero autenticado registre un horario de descanso para una fecha específica.
Durante este rango horario el barbero no estará disponible para reservas.


#### Request body
```json
{
  "start": "14:00",
  "end": "15:00",
  "date": "2025-12-22"
}

```

#### Ejemplo de uso (Curl)
```bash
curl -X 'POST' \
  'http://localhost:8080/api/barber/break' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <TOKEN_JWT>' \
  -H 'Content-Type: application/json' \
  -d '{
    "start": "14:00",
    "end": "15:00",
    "date": "2025-12-22"
  }'

```

#### Respuesta exitosa (200 OK)
```json
{
  "id": 8,
  "start": "14:00:00",
  "end": "15:00:00",
  "date": "2025-12-22",
  "barber": "ande"
}

```

#### Errores
**403 - No tienes rol de barbero / Error de negocio**
```json
{
  "timestamp": "2025-12-20T20:48:36.3432818",
  "status": 403,
  "error": "Forbidden",
  "message": "El barbero no está disponible porque está VACACIONES",
  "path": "/api/barber/break",
  "errors": [
    {
      "error": "BUSINESS_MISTAKE",
      "message": "Error de logica de negocio",
      "details": [
        "El barbero no está disponible porque está VACACIONES"
      ]
    }
  ]
}

```

---

### Consultar mi disponibilidad diaria
`GET /api/barber/availability`

Devuelve los bloques horarios del barbero autenticado para una fecha específica.
Si no se envía la fecha, se utiliza la fecha actual.

#### Ejemplo de uso (Curl)
```bash
curl -X 'GET' \
  'http://localhost:8080/api/barber/availability?date=2025-12-15' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <TOKEN_JWT>'

```

#### Respuesta exitosa (200 OK)
```json
{
  "barberId": 7,
  "barberName": "Carlos Mendoza",
  "date": "2025-03-15",
  "allSlots": [
    {
      "time": "09:00",
      "status": "DISPONIBLE"
    }
  ]
}

```

---

### Reservas del día (por fecha)
`GET /api/barber/reservation/daily`

Devuelve todas las reservas del barbero autenticado para la fecha indicada.
>El barbero debe estar vinculado a una barbería para poder consultar sus reservas.
#### Request body
```json
```

#### Ejemplo de uso (Curl)
```bash
curl -X 'GET' \
  'http://localhost:8080/api/barber/reservation/daily?date=2025-12-15' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <TOKEN_JWT>'

```

#### Respuesta exitosa (200 OK)
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

### Reservas de hoy
`GET /api/barber/reservation/today`

Obtiene todas las reservas del barbero autenticado correspondientes al día actual.

#### Ejemplo de uso (Curl)
```bash
curl -X 'GET' \
  'http://localhost:8080/api/barber/reservation/today' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <TOKEN_JWT>'

```

#### Respuesta exitosa (200 OK)
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
    "endTime": "15:10",
    "totalPrice": 15000,
    "status": "CONFIRMADA"
  }
]

```

---

### Cambiar estado de una reserva
`PATCH /api/barber/reservation/{reservationId}/status`

Permite que el barbero autenticado actualice el estado de una reserva
(por ejemplo: EN_CURSO, COMPLETADA, CANCELADA).
>Al actualizar el estado, se envía automáticamente un correo electrónico al cliente
notificándole el cambio de estado de su cita.
#### Request body
```json
{
  "status": "EN_CURSO"
}

```

#### Ejemplo de uso (Curl)
```bash
curl -X 'PATCH' \
  'http://localhost:8080/api/barber/reservation/120/status' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <TOKEN_JWT>' \
  -H 'Content-Type: application/json' \
  -d '{
    "status": "EN_CURSO"
  }'
```

#### Respuesta exitosa (200 OK)
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
  "status": "EN_CURSO"
}

```

#### Errores
**404 - Reserva no encontrada**
```json
{
  "timestamp": "2025-12-20T21:06:41.3509689",
  "status": 404,
  "error": "Not Found",
  "message": "Reserva no encontrada",
  "path": "/api/barber/reservation/34/status",
  "errors": [
    {
      "error": "BUSINESS_MISTAKE",
      "message": "Error de logica de negocio",
      "details": [
        "Reserva no encontrada"
      ]
    }
  ]
}
```

---

### Obtener las transacciones del día pendientes por confirmar
`GET /api/barber/transaction`

Permite al barbero autenticado listar las transacciones del día actual que están
pendientes de confirmación de pago
Estas transacciones corresponden a reservas ya atendidas cuyo pago aún requiere validación por parte del barbero.


#### Ejemplo de uso (Curl)
```bash
curl -X 'GET' \
  'http://localhost:8080/api/barber/transaction' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <TOKEN_JWT>'

```

#### Respuesta exitosa (200 OK)
```json
[
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
]

```

---

### Completar una transacción
`PUT /api/barber/transaction/{id}/complete`

Permite al barbero autenticado confirmar que el servicio fue prestado correctamente y completar la transacción.
Al completarse la transacción:

- Se confirma el pago
- Se cierra la reserva asociada
- Se envía una notificación al:
  - Cliente
  - Barbero
  - Barbería
  
#### Request body
```json
```

#### Ejemplo de uso (Curl)
```bash
curl -X 'PUT' \
  'http://localhost:8080/api/barber/transaction/1001/complete' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <TOKEN_JWT>'

```

#### Respuesta exitosa (200 OK)
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

#### Errores
**404 – Transacción no encontrada**
```json
{
  "timestamp": "2025-12-20T21:13:51.693085",
  "status": 404,
  "error": "Not Found",
  "message": "Transaccion no encontrada",
  "path": "/api/barber/transaction/1001/complete",
  "errors": [
    {
      "error": "BUSINESS_MISTAKE",
      "message": "Error de logica de negocio",
      "details": [
        "Transaccion no encontrada"
      ]
    }
  ]
}
```

---

### Obtener resumen general de los ingresos del barbero
`GET /api/barber/dashboard`

Devuelve estadísticas y métricas clave del panel principal del barbero autenticado, incluyendo ingresos diarios, semanales y mensuales, comparación mensual, rendimiento reciente y horas trabajadas.

#### Ejemplo de uso (Curl)
```bash
curl -X 'GET' \
  'http://localhost:8080/api/barber/dashboard' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <TOKEN_JWT>'

```

#### Respuesta exitosa (200 OK)
```json
{
  "barberId": 7,
  "barberName": "Carlos Mendoza",
  "daily": {
    "barberId": 7,
    "barberName": "Carlos Mendoza",
    "startDate": "2025-12-21",
    "endDate": "2025-12-21",
    "totalCommission": 18000,
    "totalTips": 5000,
    "totalIncome": 23000,
    "transactionsCount": 2
  },
  "weekly": {
    "barberId": 7,
    "barberName": "Carlos Mendoza",
    "startDate": "2025-12-15",
    "endDate": "2025-12-21",
    "totalCommission": 72000,
    "totalTips": 20000,
    "totalIncome": 92000,
    "transactionsCount": 6
  },
  "monthly": {
    "barberId": 7,
    "barberName": "Carlos Mendoza",
    "startDate": "2025-12-01",
    "endDate": "2025-12-31",
    "totalCommission": 215000,
    "totalTips": 60000,
    "totalIncome": 275000,
    "transactionsCount": 18
  },
  "monthlyComparison": {
    "difference": 85000,
    "percentage": 44.7,
    "currentMonthIncome": 275000,
    "previousMonthIncome": 190000
  },
  "last7days": {
    "days": [
      {
        "date": "2025-12-15",
        "income": 15000
      },
      {
        "date": "2025-12-16",
        "income": 30000
      }
    ]
  },
  "workedHours": {
    "totalAppointments": 18,
    "hours": "10h30m"
  }
}

```









