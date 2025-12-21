## Modulo de barberia

---

### Obtener perfil de la barbería
`
GET /api/barbershop/profile`

Retorna la información completa del perfil de la barbería autenticada.

#### Ejemplo de uso (Curl)
```bash
curl -X GET \
  'http://localhost:8080/api/barbershop/profile' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <TOKEN_JWT>'
```

#### Respuesta exitosa (200 OK)
```json
{
  "email": "barberia@correo.com",
  "firstName": "Juan",
  "lastName": "Pérez",
  "phone": "3001234567",
  "address": "Calle 123 #45-67",
  "barberShopPhone": "3007654321",
  "barberShopName": "Barbería Elegante"
}

```

---

### Actualizar perfil de la barbería
`PUT /api/barbershop/profile`

Permite a la barbería modificar su información personal y datos comerciales.

#### Ejemplo de uso (Curl)
```bash
curl -X PUT \
  'http://localhost:8080/api/barbershop/profile' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <TOKEN_JWT>' \
  -H 'Content-Type: application/json' \
  -d '{
    "firstName": "Carlos",
    "lastName": "Ramírez",
    "phone": "3001234567",
    "barberShopName": "Barbería Elegante",
    "address": "Calle 123 #45-67",
    "barberShopPhone": "3009876543"
  }'

```

#### Respuesta Exitosa (200 OK)
```json
{
  "email": "barberia@correo.com",
  "firstName": "Carlos",
  "lastName": "Ramírez",
  "phone": "3001234567",
  "address": "Calle 123 #45-67",
  "barberShopPhone": "3009876543",
  "barberShopName": "Barbería Elegante"
}

```

---

### Vincular un barbero a la barbería
`POST /api/barbershop/barber`

Permite agregar un usuario con rol BARBERO a la barbería mediante su correo electrónico.

#### Request Body
```json
{
  "email": "barbero@correo.com",
  "barberRequest": {
    "documentNumber": "12345678",
    "commission": 0.3
  }
}
```

#### Ejemplo de uso (Curl)
```bash
curl -X POST \
  'http://localhost:8080/api/barbershop/barber' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <TOKEN_JWT>' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "barbero@correo.com",
    "barberRequest": {
      "documentNumber": "12345678",
      "commission": 0.3
    }
  }'
```

#### Errores

**403 - Acceso denegado**
```bash
{
  "timestamp": "2025-12-20T14:16:43.2958574",
  "status": 403,
  "error": "Forbidden",
  "message": "Este barbero ya pertenece a otra barbería",
  "path": "/api/barbershop/barber",
  "errors": [
    {
      "error": "BUSINESS_MISTAKE",
      "message": "Error de logica de negocio",
      "details": [
        "Este barbero ya pertenece a otra barbería"
      ]
    }
  ]
}
```

**404 – Barbero no encontrado**
```bash
{
  "timestamp": "2025-12-20T14:15:31.136939",
  "status": 404,
  "error": "Not Found",
  "message": "Barbero no encontrado",
  "path": "/api/barbershop/barber",
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

### Listar barberos de la barbería
`GET /api/barbershop/barber`

Devuelve todos los barberos vinculados a la barbería autenticada.

#### Ejemplo de uso (Curl)
```bash
curl -X GET \
  'http://localhost:8080/api/barbershop/barber' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <TOKEN_JWT>'

```
#### Respuesta exitosa (200 OK)
```json
[
  {
    "barberId": 5,
    "userId": 20,
    "email": "tuvc4pon6s@daouse.com",
    "firstName": "Ximon",
    "lastName": "Peralta",
    "phone": "3001234550",
    "documentNumber": "12345678",
    "commission": 0.35,
    "status": "ACTIVO"
  },
  {
    "barberId": 6,
    "userId": 18,
    "email": "andersondiaz0515@gmail.com",
    "firstName": "Ande",
    "lastName": "Jose",
    "phone": "3001234563",
    "documentNumber": "12345678",
    "commission": 0.35,
    "status": "ACTIVO"
  }
]

```

---

### Actualizar comisión de un barbero
`PATCH /api/barbershop/barber/{barberId}/commission`

Permite modificar el porcentaje o monto de comisión de un barbero vinculado a la barbería.

#### Request Body
```json
{
  "newCommission": 0.35
}

```

#### Ejemplo de uso (Curl)
```bash
curl -X 'PATCH' \
  'http://localhost:8080/api/barbershop/barber/5/commission' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <TOKEN_JWT>' \
  -H 'Content-Type: application/json' \
  -d '{
  "newCommission": 0.35
}'

```

#### Respuesta exitosa (200 OK)
```json
"Comisión actualizada correctamente"

```

#### Errores 

**404 – Barbero no encontrado**
```json
{
  "timestamp": "2025-12-20T14:28:41.5971745",
  "status": 404,
  "error": "Not Found",
  "message": "Barbero no encontrado",
  "path": "/api/barbershop/barber/11/commission",
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

### Consultar disponibilidad de un barbero

`GET /api/barbershop/barber/{barberId}/availability`

Consultar la disponibilidad diaria de un barbero específico. Si no se envía fecha, se toma la fecha actual.

#### Ejemplo de uso (Curl)
```bash
curl -X 'GET' \
  'http://localhost:8080/api/barbershop/barber/7/availability?date=2025-03-15' \
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
    },
    {
      "time": "09:15",
      "status": "DISPONIBLE"
    },
    {
      "time": "09:30",
      "status": "DISPONIBLE"
    }
  ]
}

```

#### Errores

**403 - Barberos que no exiten en la barberia**
```json
{
  "timestamp": "2025-12-20T14:37:06.15961",
  "status": 403,
  "error": "Forbidden",
  "message": "Este barbero no trabaja en tu barbería",
  "path": "/api/barbershop/barber/4/availability",
  "errors": [
    {
      "error": "BUSINESS_MISTAKE",
      "message": "Error de logica de negocio",
      "details": [
        "Este barbero no trabaja en tu barbería"
      ]
    }
  ]
}
```

**404 - Barbero no existe en el sistema**

```bash
{
  "timestamp": "2025-12-20T14:38:42.4112799",
  "status": 404,
  "error": "Not Found",
  "message": "Barbero no encontrado",
  "path": "/api/barbershop/barber/18/availability",
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

### Desactivar Barberia
`PUT /api/barbershop/desactivate`

Desactiva la barbería autenticada.

#### Ejemplo de uso (Curl)
```bash
curl -X 'PUT' \
  'http://localhost:8080/api/barbershop/desactivate' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <TOKEN_JWT>'

```

#### Respuesta exitosa (200 OK)
```json
"Barberia desactivada"
```

---

### Desactivar Barberia
`PUT /api/barbershop/activate`

Activa la barbería autenticada.

#### Ejemplo de uso (Curl)
```bash
curl -X 'PUT' \
  'http://localhost:8080/api/barbershop/activate' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <TU_TOKEN_JWT>'

```

#### Respuesta exitosa (200 OK)
```json
"Barberia activada"
```

---

### Activar barbero
`PUT /api/barbershop/barber/{barberId}/status/activate`

Activa un barbero específico de la barbería autenticada.

#### Ejemplo de uso (Curl)
```bash
curl -X 'PUT' \
  'http://localhost:8080/api/barbershop/barber/6/status/activate' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <TOKEN_JWT>'

```

#### Respuesta exitosa (200 OK)
```json
"Barbero activado correctamente"
```

#### Errores
**404 - Barbero no encontrado**
```json
{
  "timestamp": "2025-12-20T14:54:28.4602497",
  "status": 404,
  "error": "Not Found",
  "message": "Barbero no encontrado",
  "path": "/api/barbershop/barber/7/status/activate",
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

### Desactivar barbero
`PUT /api/barbershop/barber/{barberId}/status/desactivate`

Desactivar un barbero específico de la barbería autenticada.

#### Ejemplo de uso (Curl)
```bash
curl -X 'PUT' \
  'http://localhost:8080/api/barbershop/barber/6/status/desactivate' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <TOKEN_JWT>'

```

#### Respuesta exitosa (200 OK)
```json
"Barbero desactivado correctamente"
```

#### Errores
**404 - Barbero no encontrado**
```json
{
  "timestamp": "2025-12-20T14:54:28.4602497",
  "status": 404,
  "error": "Not Found",
  "message": "Barbero no encontrado",
  "path": "/api/barbershop/barber/7/status/desactivate",
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

### Vacaciones barbero
`PUT /api/barbershop/barber/{barberId}/status/summary`

Poner un barbero específico en vacaciones.

#### Ejemplo de uso (Curl)
```bash
curl -X 'PUT' \
  'http://localhost:8080/api/barbershop/barber/6/status/summary' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <TOKEN_JWT>'

```

#### Respuesta exitosa (200 OK)
```json
"Barbero con vacaciones correctamente"
```

#### Errores
**404 - Barbero no encontrado**
```json
{
  "timestamp": "2025-12-20T14:54:28.4602497",
  "status": 404,
  "error": "Not Found",
  "message": "Barbero no encontrado",
  "path": "/api/barbershop/barber/7/status/summary",
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

### Subir imagen
`POST /api/barbershop/images/upload`

Permite subir una imagen para la barbería. Máximo 5 imágenes por barbería. Valida tamaño y tipo de archivo.

#### Request body
`multipart/form-data`

#### Ejemplo de uso (Curl)
```bash
curl -X 'POST' \
  'http://localhost:8080/api/barbershop/images/upload' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <TOKEN_URL>' \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@imagen1.png;type=image/png'
```

#### Respuesta exitosa (200 OK)
```json
{
  "id": 10,
  "imageUrl": "https://res.cloudinary.com/dorhzs8il/image/upload/v1766260980/barbershops/4/sn7i5q26qfs0dbemkwed.png",
  "cover": false,
  "uploadedAt": "2025-12-20T15:03:00.9215253"
}
```

#### Errores

**403 - Archivo inválido o se excedió el límite**
```json
{
  "timestamp": "2025-12-20T15:05:42.2384954",
  "status": 403,
  "error": "Forbidden",
  "message": "Solo se permiten imágenes JPG y PNG",
  "path": "/api/barbershop/images/upload",
  "errors": [
    {
      "error": "BUSINESS_MISTAKE",
      "message": "Error de logica de negocio",
      "details": [
        "Solo se permiten imágenes JPG y PNG"
      ]
    }
  ]
}
```

---

### Listar imágenes
`GET /api/barbershop/images`

Devuelve todas las imágenes pertenecientes a la barbería autenticada.

### Ejemplo de uso (Curl)
```bash
curl -X 'GET' \
  'http://localhost:8080/api/barbershop/images' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <TU_TOKEN_JWT>'

```

#### Respuesta exitosa (200 OK)
```json
[
  {
    "id": 7,
    "imageUrl": "https://res.cloudinary.com/dorhzs8il/image/upload/v1765818720/barbershops/4/nrr3iavykf33angoj0uj.png",
    "cover": false,
    "uploadedAt": "2025-12-15T12:12:01"
  },
  {
    "id": 8,
    "imageUrl": "https://res.cloudinary.com/dorhzs8il/image/upload/v1765818829/barbershops/4/rb3l4k6lv0hssr2yfqmz.png",
    "cover": true,
    "uploadedAt": "2025-12-15T12:13:50"
  },
  {
    "id": 10,
    "imageUrl": "https://res.cloudinary.com/dorhzs8il/image/upload/v1766260980/barbershops/4/sn7i5q26qfs0dbemkwed.png",
    "cover": false,
    "uploadedAt": "2025-12-20T15:03:01"
  }
]

```

---

### Establecer de portada una imagen
`POST /api/barbershop/images/{id}/cover`

Marca una imagen existente como portada de la barbería.

#### Ejemplo de uso
```bash
curl -X 'POST' \
  'http://localhost:8080/api/barbershop/images/15/cover' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <TU_TOKEN_JWT>'
```

#### Respuesta exitosa (200 OK)
```json
{
  "message": "Portada actualizada"
}
```
#### Errores
**404 - Imagen no encontrada**
```json
{
  "timestamp": "2025-12-20T15:13:43.8654329",
  "status": 404,
  "error": "Not Found",
  "message": "Imagen no encontrada",
  "path": "/api/barbershop/images/18/cover",
  "errors": [
    {
      "error": "BUSINESS_MISTAKE",
      "message": "Error de logica de negocio",
      "details": [
        "Imagen no encontrada"
      ]
    }
  ]
}
```

---

### Eliminar imagen
`DELETE /api/barbershop/images/{id}`

Elimina una imagen perteneciente a la barbería del usuario autenticado.

#### Ejemplo de uso
```bash
curl -X 'POST' \
  'http://localhost:8080/api/barbershop/images/20' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <TU_TOKEN_JWT>'
```

#### Respuesta exitosa (200 OK)
```json
{
  "message": "Imagen eliminada"
}
```
#### Errores
**404 - Imagen no encontrada**
```json
{
  "timestamp": "2025-12-20T15:15:44.5144405",
  "status": 404,
  "error": "Not Found",
  "message": "Imagen no encontrada",
  "path": "/api/barbershop/images/9",
  "errors": [
    {
      "error": "BUSINESS_MISTAKE",
      "message": "Error de logica de negocio",
      "details": [
        "Imagen no encontrada"
      ]
    }
  ]
}
```

---

### Registrar horario de atención
`POST /api/barbershop/opening-hours`

Crea un nuevo horario para la barbería. No permite duplicar días ni solapar rangos de horarios existentes.

#### Request body
```json
{
  "dayOfWeek": "MONDAY",
  "startTime": "09:00",
  "endTime": "18:00"
}

```

#### Ejemplo de uso (Curl)
```bash
curl -X 'POST' \
  'http://localhost:8080/api/barbershop/opening-hours' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhaXh4YUBjb21meXRoaW5ncy5jb20iLCJyb2xlcyI6WyJCQVJCRVJJQSJdLCJwYXNzd29yZENoYW5nZWRBdCI6MTc2NTc5NTUzNSwiaWF0IjoxNzY2MjU3NTYyLCJleHAiOjE3NjYzNDM5NjJ9.5Q06_8U5iYih2CpCNMTUWrSnyBTA88L-6VLawh_cjAE' \
  -H 'Content-Type: application/json' \
  -d '{
  "dayOfWeek": "MONDAY",
  "startTime": "19:00",
  "endTime": "20:00"
}'
```

#### Respuesta exitosa (200 OK)
```json
"Horario registrado correctamente"
```

#### Errores
**400 – Datos inválidos o día duplicado / horario solapado**
```json
{
  "timestamp": "2025-12-20T15:21:40.1485566",
  "status": 400,
  "error": "Bad Request",
  "message": "El rango se solapa con otro horario existente: 19:00 - 20:00",
  "path": "/api/barbershop/opening-hours",
  "errors": [
    {
      "error": "BUSINESS_MISTAKE",
      "message": "Error de logica de negocio",
      "details": [
        "El rango se solapa con otro horario existente: 19:00 - 20:00"
      ]
    }
  ]
}
```

---

### Listar horarios de atención
`GET /api/barbershop/opening-hours`

Devuelve todos los horarios registrados por la barbería del usuario autenticado.

#### Ejemplo de uso (Curl)
```bash
curl -X 'GET' \
  'http://localhost:8080/api/barbershop/opening-hours' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <TOKEN_JWT>'

```


#### Respuesta exitosa (200 OK)
```json
[
  {
    "id": 11,
    "dayOfWeek": "MONDAY",
    "startTime": "08:00:00",
    "endTime": "13:00:00"
  },
  {
    "id": 12,
    "dayOfWeek": "MONDAY",
    "startTime": "13:30:00",
    "endTime": "19:00:00"
  },
  {
    "id": 13,
    "dayOfWeek": "TUESDAY",
    "startTime": "13:30:00",
    "endTime": "19:00:00"
  }
]

```

---

### Actualizar horario
`PUT /api/barbershop/opening-hours/{id}`

Modifica un horario existente de la barbería.

#### Request body
```json
{
  "dayOfWeek": "MONDAY",
  "startTime": "06:00",
  "endTime": "13:00"
}

```

#### Ejemplo de uso (Curl)
```bash
curl -X 'PUT' \
  'http://localhost:8080/api/barbershop/opening-hours/11' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <TOKEN_JWT>' \
  -H 'Content-Type: application/json' \
  -d '{
  "dayOfWeek": "MONDAY",
  "startTime": "06:00",
  "endTime": "13:00"
}'

```

#### Respuesta exitosa (200 OK)
```json
"Horario actualizado correctamente"

```

#### Errores
**404 – Horario no encontrado**
```json
{
  "timestamp": "2025-12-20T15:27:18.4666354",
  "status": 404,
  "error": "Not Found",
  "message": "Horario no encontrado",
  "path": "/api/barbershop/opening-hours/50",
  "errors": [
    {
      "error": "BUSINESS_MISTAKE",
      "message": "Error de logica de negocio",
      "details": [
        "Horario no encontrado"
      ]
    }
  ]
}

```

---

### Eliminar horario
`DELETE /api/barbershop/opening-hours/{id}`

Elimina un horario de atención de la barbería.


#### Ejemplo de uso (Curl)
```bash
curl -X 'DELETE' \
  'http://localhost:8080/api/barbershop/opening-hours/24' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <TOKEN_JWT>'


```

#### Respuesta exitosa (200 OK)
```json
"Horario eliminado correctamente"

```

#### Errores
**404 – Horario no encontrado**
```json

{
  "timestamp": "2025-12-20T15:32:21.9615677",
  "status": 404,
  "error": "Not Found",
  "message": "Horario no encontrado",
  "path": "/api/barbershop/opening-hours/70",
  "errors": [
    {
      "error": "BUSINESS_MISTAKE",
      "message": "Error de logica de negocio",
      "details": [
        "Horario no encontrado"
      ]
    }
  ]
}
```

---

### Crear subategoria
`POST /api/barbershop/category/{categoryId}/subcategory`

Agrega una nueva subcategoría asociada a una categoría existente de la barbería.

#### Request body
```json
{
  "name": "Corte degradado",
  "description": "Degradado bajo, medio o alto según preferencia del cliente.",
  "duration": 45,
  "price": 15000
}

```
#### Ejemplo de uso (Curl)
```bash
curl -X 'POST' \
  'http://localhost:8080/api/barbershop/category/7/subcategory' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <TOKEN_JWT>' \
  -H 'Content-Type: application/json' \
  -d '{
  "name": "Corte degradado",
  "description": "Degradado bajo, medio o alto según preferencia del cliente.",
  "duration": 45,
  "price": 15000
}'
```

#### Respuesta exitosa (200 OK)
```json
{
  "id": 8,
  "name": "Corte degradado",
  "description": "Degradado bajo, medio o alto según preferencia del cliente.",
  "duration": 45,
  "price": 15000
}
```
#### Errores
**404 - Categoría no encontrada**
```json
{
  "timestamp": "2025-12-20T15:39:28.9378738",
  "status": 404,
  "error": "Not Found",
  "message": "La categoría no existe o no pertenece a tu barbería",
  "path": "/api/barbershop/category/7/subcategory",
  "errors": [
    {
      "error": "BUSINESS_MISTAKE",
      "message": "Error de logica de negocio",
      "details": [
        "La categoría no existe o no pertenece a tu barbería"
      ]
    }
  ]
}
```

---

### Listar subcategorías
`GET /api/barbershop/category/{categoryId}/subcategory`

Devuelve todas las subcategorías relacionadas con una categoría de la barbería.


#### Ejemplo de uso (Curl)
```bash
curl -X 'GET' \
  'http://localhost:8080/api/barbershop/category/4/subcategory' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <TOKEN_JWT>'

```

#### Respuesta exitosa (200 OK)
```json
[
  {
    "id": 5,
    "name": "Taper fade",
    "description": "corte del taper fade",
    "duration": 30,
    "price": 15000
  },
  {
    "id": 6,
    "name": "Degradado bajo",
    "description": "corte del degradado bajo",
    "duration": 45,
    "price": 15000
  },
  {
    "id": 7,
    "name": "Degradado medio",
    "description": "corte del degradado medio",
    "duration": 45,
    "price": 15000
  },
  {
    "id": 8,
    "name": "Degradado alto",
    "description": "corte del degradado alto",
    "duration": 45,
    "price": 15000
  }
]

```
#### Errores
**404 - Categoría no encontrada**
```json
{
  "timestamp": "2025-12-20T15:44:54.8338529",
  "status": 404,
  "error": "Not Found",
  "message": "La categoría no existe o no pertenece a tu barbería",
  "path": "/api/barbershop/category/20/subcategory",
  "errors": [
    {
      "error": "BUSINESS_MISTAKE",
      "message": "Error de logica de negocio",
      "details": [
        "La categoría no existe o no pertenece a tu barbería"
      ]
    }
  ]
}


```

---

### Actualizar Subcategoria
`PUT /api/barbershop/category/{categoryId}/subcategory/{subcategoryId}`

Modifica los datos de una subcategoría existente asociada a una categoría de la barbería.

#### Request body
```json
{
  "name": "Taper fade",
  "description": "corte del taper fade",
  "duration": 30,
  "price": 15000
}

```

#### Ejemplo de uso (Curl)
```bash
curl -X 'PUT' \
  'http://localhost:8080/api/barbershop/category/4/subcategory/5' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <TOKEN_JWT>' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Taper fade",
    "description": "corte del taper fade",
    "duration": 30,
    "price": 15000
  }'

```

#### Respuesta exitosa (200 OK)
```json
{
  "id": 5,
  "name": "Taper fade",
  "description": "corte del taper fade",
  "duration": 30,
  "price": 15000
}

```

#### Errores
**404 -  Subcategoria no encontrada**
```json
{
  "timestamp": "2025-12-20T16:07:09.0303583",
  "status": 404,
  "error": "Not Found",
  "message": "La categoría no existe o no pertenece a tu barbería",
  "path": "/api/barbershop/category/20/subcategory/5",
  "errors": [
    {
      "error": "BUSINESS_MISTAKE",
      "message": "Error de logica de negocio",
      "details": [
        "La categoría no existe o no pertenece a tu barbería"
      ]
    }
  ]
}

```

---

### Crear servicio (categoría)
`POST /api/barbershop/category`

Registra un nuevo servicio que ofrece la barbería.

#### Request body
```json
{
  "name": "Corte de cabello",
  "description": "Corte con máquina y tijera, estilo a elección."
}


```
#### Ejemplo de uso (Curl)
```bash
curl -X 'POST' \
  'http://localhost:8080/api/barbershop/category' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <TOKEN_JWT>' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Corte de cabello",
    "description": "Corte con máquina y tijera, estilo a elección."
  }'

```

#### Respuesta exitosa (200 OK)
```json
{
  "id": 0,
  "name": "Corte de cabello",
  "description": "Corte con máquina y tijera, estilo a elección."
}

```
#### Errores
**404 - Categoría no encontrada**
```json
{
  "timestamp": "2025-12-20T15:49:20.5894284",
  "status": 400,
  "error": "BAD_REQUEST",
  "message": "Error de validación",
  "path": "/api/barbershop/category",
  "errors": [
    {
      "error": "VALIDATION_ERROR",
      "message": "Los datos de entrada son inválidos",
      "details": [
        "name: El nombre del servicio es requerido"
      ]
    }
  ]
}

```

---

### Listar Servicios
`GET /api/barbershop/category`

Devuelve la lista de servicios creados en la barbería.

#### Ejemplo de uso (Curl)
```bash
curl -X 'GET' \
  'http://localhost:8080/api/barbershop/category' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <TOKEN_JWT>'

```

#### Respuesta exitosa (200 OK)
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

---

### Actualizar servicio
`PUT /api/barbershop/category/{id}`

Modifica los datos de una categoría existente.

#### Request body
```json
{
  "name": "Corte de cabello",
  "description": "Corte con máquina y tijera, estilo a elección."
}

```

#### Ejemplo de uso (Curl)
```bash
curl -X 'PUT' \
  'http://localhost:8080/api/barbershop/category/<ID>' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <TU_TOKEN_JWT>' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Corte de cabello",
    "description": "Corte con máquina y tijera, estilo a elección."
  }'

```

#### Respuesta exitosa (200 OK)
```json
{
  "id": 4,
  "name": "Corte de cabello",
  "description": "Corte con máquina y tijera, estilo a elección."
}

```

#### Errores
**404 - Servicio no encontrado**
```json
{
  "timestamp": "2025-12-20T15:54:40.3826594",
  "status": 404,
  "error": "Not Found",
  "message": "Servicio no encontrado",
  "path": "/api/barbershop/category/25",
  "errors": [
    {
      "error": "BUSINESS_MISTAKE",
      "message": "Error de logica de negocio",
      "details": [
        "Servicio no encontrado"
      ]
    }
  ]
}

```

---

### Activar servicio
`PUT /api/barbershop/category/{serviceId}/status/activate`

Permite activar un servicio (categoría) previamente desactivado en la barbería.

#### Ejemplo de uso (Curl)
```bash
curl -X 'PUT' \
  'http://localhost:8080/api/barbershop/category/4/status/activate' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <TOKEN_JWT>'

```

#### Respuesta exitosa (200 OK)
```json
"Servicio activado correctamente"
```

#### Errores
**404**
```json
{
  "timestamp": "2025-12-20T16:01:11.6332281",
  "status": 404,
  "error": "Not Found",
  "message": "Servicio no encontrado",
  "path": "/api/barbershop/category/25/status/activate",
  "errors": [
    {
      "error": "BUSINESS_MISTAKE",
      "message": "Error de logica de negocio",
      "details": [
        "Servicio no encontrado"
      ]
    }
  ]
}

```

---

### Activar servicio
`PUT /api/barbershop/category/{serviceId}/status/desactivate`

Desactivar activar un servicio (categoría) previamente desactivado en la barbería.

#### Ejemplo de uso (Curl)
```bash
curl -X 'PUT' \
  'http://localhost:8080/api/barbershop/category/4/status/desactivate' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <TOKEN_JWT>'

```

#### Respuesta exitosa (200 OK)
```json
"Servicio desactivado correctamente"
```

#### Errores
**404**
```json
{
  "timestamp": "2025-12-20T16:01:11.6332281",
  "status": 404,
  "error": "Not Found",
  "message": "Servicio no encontrado",
  "path": "/api/barbershop/category/25/status/desactivate",
  "errors": [
    {
      "error": "BUSINESS_MISTAKE",
      "message": "Error de logica de negocio",
      "details": [
        "Servicio no encontrado"
      ]
    }
  ]
}

```

---

### Obtener resumen general de la barbería
`GET /api/barbershop/dashboard`
Devuelve estadísticas y métricas clave del panel principal de la barbería, incluyendo ingresos totales, comisiones, propinas, transacciones y reportes diarios, semanales y mensuales por barbero.

#### Ejemplo de uso (Curl)
```bash
curl -X 'GET' \
  'http://localhost:8080/api/barbershop/dashboard' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer <TU_TOKEN_JWT>'

```

#### Respuesta exitosa (200 OK)
```json
{
  "totalIncome": 105000,
  "barberShopIncome": 68250,
  "totalCommissionPaid": 36750,
  "totalTips": 20000,
  "totalTransactions": 5,
  "activeBarbers": 1,
  "monthlyComparison": {
    "difference": 105000,
    "percentage": 0,
    "currentMonthIncome": 105000,
    "previousMonthIncome": 0
  },
  "monthlyReport": {
    "startDate": "2025-12-01",
    "endDate": "2025-12-31",
    "barbers": [
      {
        "barberId": 5,
        "barberName": "ximon peralta",
        "totalCommission": 31500,
        "totalTips": 15000,
        "totalIncome": 46500,
        "transactionsCount": 4
      },
      {
        "barberId": 6,
        "barberName": "andres jose",
        "totalCommission": 5250,
        "totalTips": 5000,
        "totalIncome": 10250,
        "transactionsCount": 1
      }
    ]
  },
  "weeklyReport": {
    "startDate": "2025-12-15",
    "endDate": "2025-12-21",
    "barbers": [
      {
        "barberId": 5,
        "barberName": "ximon peralta",
        "totalCommission": 31500,
        "totalTips": 15000,
        "totalIncome": 46500,
        "transactionsCount": 4
      },
      {
        "barberId": 6,
        "barberName": "andres jose",
        "totalCommission": 5250,
        "totalTips": 5000,
        "totalIncome": 10250,
        "transactionsCount": 1
      }
    ]
  },
  "dailyReport": {
    "date": "2025-12-20",
    "barbers": []
  },
  "topBarbers": [
    {
      "barberId": 5,
      "barberName": "ximon peralta",
      "income": 46500
    },
    {
      "barberId": 6,
      "barberName": "andres jose",
      "income": 10250
    }
  ]
}

```


















