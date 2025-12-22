← [Volver al API Guide General](API_GUIDE.md)


##  Auth

---

Todos los tipos de usuario utilizan los **mismos endpoints**, diferenciándose
por el campo `userType` enviado en el request.

---

### Registrar Usuario
`POST /api/auth/register
`

Permite registrar un nuevo usuario en el sistema según su tipo:

- **CLIENTE**
    - Se crea únicamente el usuario básico.
- **BARBERO**
    - El barbero crea su cuenta de manera independiente.
- **BARBERIA**
    - Se crea el usuario **y** la información de la barbería asociada.

> Importante:  
> Si el tipo de usuario es `CLIENTE` o `BARBERO`, **NO es obligatorio**
> enviar el objeto `barberShop`.

#### Request Body

```json
{
  "email": "cliente@correo.com",
  "password": "123456",
  "firstName": "Carlos",
  "lastName": "Ramírez",
  "phone": "3001234567",
  "userType": "CLIENTE",
  "barberShop": {
    "name": "string",
    "address": "string",
    "phone": "string"
  }
}
```

### Ejemplo de uso (Curl)

```bash
curl -X POST \
  http://localhost:8080/api/auth/register \
  -H "accept: */*" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "cliente@correo.com",
    "password": "123456",
    "firstName": "Carlos",
    "lastName": "Ramírez",
    "phone": "3001234167",
    "userType": "CLIENTE"
  }'
```
#### Respuesta Exitosa (200 OK)
Usuario registrado exitosamente como CLIENTE
>El mensaje varía según el tipo de usuario:
CLIENTE, BARBERO o BARBERIA.

#### Errores
##### 400 – Datos inválidos
```json
{
  "timestamp": "2025-12-20T09:55:40.4653802",
  "status": 400,
  "error": "BAD_REQUEST",
  "message": "Error de validación",
  "path": "/api/auth/register",
  "errors": [
    {
      "error": "VALIDATION_ERROR",
      "message": "Los datos de entrada son inválidos",
      "details": [
        "email: no debe estar vacío"
      ]
    }
  ]
}

```

#### 409 – Conflicto de negocio
```json
{
  "timestamp": "2025-12-20T09:47:01.7517338",
  "status": 409,
  "error": "Conflict",
  "message": "Ya un usuario tiene ese numero de telefono",
  "path": "/api/auth/register",
  "errors": [
    {
      "error": "BUSINESS_MISTAKE",
      "message": "Error de logica de negocio",
      "details": [
        "Ya un usuario tiene ese numero de telefono"
      ]
    }
  ]
}

```

---

### Iniciar sesión
`POST /api/auth/login
`
Permite autenticar un usuario en el sistema y obtener un **token JWT**.

El token incluye:
- Identificador del usuario
- Rol del usuario
- Fecha de emisión
- Fecha de expiración

#### Request Body

```json
{
  "email": "usuario@correo.com",
  "password": "123456"
}
```
#### Ejemplo de uso (Curl)
```bash
curl -X POST \
  http://localhost:8080/api/auth/login \
  -H "accept: */*" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "anjodivi15@gmail.com",
    "password": "1234567"
  }'

```

#### Respuesta exitosa (200 OK)
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbmpvZGl2aTE1QGdtYWlsLmNvbSIsInJvbGVzIjpbIkNMSUVOVEUiXSwicGFzc3dvcmRDaGFuZ2VkQXQiOjE3NjU3OTc2MjksImlhdCI6MTc2NjI0MzA2MywiZXhwIjoxNzY2MzI5NDYzfQ.79BXPF8DxHsKdFKuqwWDd0mM9hettx-c9_2CeyUTQsY"
}

```

#### Errores
##### 401 – Credenciales inválidas
Se presenta cuando el correo o la contraseña no coinciden.
```json
{
  "timestamp": "2025-12-20T10:03:33.4846983",
  "status": 401,
  "error": "Unauthorized",
  "message": "Credenciales inválidas",
  "path": "/api/auth/login"
}

```

##### 500 – Error interno (credenciales incorrectas)
Puede presentarse cuando el sistema detecta credenciales inválidas
a nivel de seguridad.
```json
{
  "timestamp": "2025-12-20T10:03:33.4846983",
  "status": 500,
  "error": "Internal Server Error",
  "message": "Bad credentials",
  "path": "uri=/api/auth/login",
  "errors": null
}

```
>Este error corresponde a una excepción de seguridad.
A nivel de consumo de la API, se trata como credenciales inválidas.

##### Uso del token JWT

El token debe enviarse en el header Authorization
para acceder a endpoints protegidos:

`Authorization: Bearer <token>`

---

### Validar contraseña actual y enviar código de verificación
`POST /api/password/validate`

Valida que la contraseña actual del usuario autenticado sea correcta y, si es válida, envía un código de verificación al correo para permitir el cambio de contraseña.
#### Request body
```json
{
  "currentPassword": "MiClaveActual123"
}

```

#### Ejemplo de uso (Curl)
```bash
curl -X POST http://localhost:8080/api/password/validate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "currentPassword": "MiClaveActual123"
  }'

```

#### Respuesta exitosa (200 OK)
```json
"Código enviado al correo"
```

#### Errores
**403 - Acceso negado**
```json
{
  "status": 403,
  "error": "Forbidden",
  "message": "La contraseña actual es incorrecta",
  "path": "/api/password/validate",
  "errors": [
    {
      "error": "BUSINESS_MISTAKE",
      "message": "Error de lógica de negocio",
      "details": [
        "La contraseña actual es incorrecta"
      ]
    }
  ],
  "timestamp": "2025-12-21T14:11:39.4797333"
}

```

---

### Validar código enviado al correo
`POST /api/password/validate-code`

Verifica que el código ingresado por el usuario coincide con el código enviado previamente al correo electrónico.
#### Request body
```json
{
  "code": "482915"
}

```

#### Ejemplo de uso (Curl)
```bash
curl -X POST http://localhost:8080/api/password/validate-code \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "code": "482915"
  }'

```

#### Respuesta exitosa (200 OK)
```json
"Código válido"

```

#### Errores
**404 - Datos invalidos**
```json
{
  "timestamp": "2025-12-21T19:00:33.1072416",
  "status": 404,
  "error": "Not Found",
  "message": "Código inválido",
  "path": "/api/password/validate-code",
  "errors": [
    {
      "error": "BUSINESS_MISTAKE",
      "message": "Error de logica de negocio",
      "details": [
        "Código inválido"
      ]
    }
  ]
}
```

---

### Cambiar contraseña usando código de verificación
`PUT /api/password/reset`

Permite al usuario cambiar su contraseña utilizando el código de verificación enviado previamente al correo.
#### Request body
```json
{
  "code": "482915",
  "newPassword": "NewPassword123*",
  "confirmPassword": "NewPassword123*"
}

```

#### Ejemplo de uso (Curl)
```bash
curl -X PUT http://localhost:8080/api/password/reset \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "code": "482915",
    "newPassword": "NewPassword123*",
    "confirmPassword": "NewPassword123*"
  }'

```

#### Respuesta exitosa (200 OK)
```json
"Contraseña actualizada correctamente"

```

#### Errores
**404 - Datos invalidos**
```json
{
  "timestamp": "2025-12-21T19:02:07.8836932",
  "status": 404,
  "error": "Not Found",
  "message": "Las contraseñas no coinciden",
  "path": "/api/password/reset",
  "errors": [
    {
      "error": "BUSINESS_MISTAKE",
      "message": "Error de logica de negocio",
      "details": [
        "Las contraseñas no coinciden"
      ]
    }
  ]
}
```

---