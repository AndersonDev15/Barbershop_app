# Registro diferenciado por tipo de usuario
Este módulo permite registrar y autenticar diferentes tipos de usuarios dentro de la plataforma, diferenciando su comportamiento y permisos según su rol (CLIENTE, BARBERIA, BARBERO).

El sistema está diseñado con Spring Boot + Spring Security + JWT, garantizando una autenticación segura y una gestión clara de roles.
Cada tipo de usuario puede tener datos personalizados y operaciones específicas, pero todos comparten la misma entidad base `User`.

## Descripcion General del flujo
1. **Registro de usuarios:**
   A través del endpoint `/auth/register`, se puede registrar tanto un cliente como una barbería.
   El tipo de usuario se define mediante el campo `userType`.
2. **Creación de entidades:**
   Según el tipo de usuario, el sistema crea automáticamente la entidad asociada (`Client` o `BarberShop`) y la vincula con el `User`.
3. **Autenticación con JWT:**
   Los usuarios registrados pueden iniciar sesión con `/auth/login`, obteniendo un token JWT que deben usar para acceder a los endpoints protegidos.
4. **Gestión por roles:**
   Cada tipo de usuario tiene permisos limitados.
   Por ejemplo, solo una barbería autenticada puede registrar barberos mediante `/barbershop/barber`.

## Registro Usuario

### Clientes
**Endpoint:**
```bash 
POST /auth/register
```
Registra un nuevo usuario de tipo CLIENTE con información básica.

**Ejemplo de cuerpo JSON:**
```json 
{
"email": "cliente@correo.com",
"password": "123456",
"firstName": "Carlos",
"lastName": "Ramírez",
"phone": "3001234567",
"userType": "CLIENTE",
"status": "ACTIVO"
}
```
**Respuesta (200 OK):**
```json
{
  "message": "Usuario registrado exitosamente como CLIENTE"
}
```

### Barberia

**Endpoint:**
```bash
POST /auth/register
```
Crea un usuario de tipo BARBERIA, registrando además los datos propios de la barbería.

**Ejemplo de cuerpo JSON:**
```json
{
  "email": "barberia@correo.com",
  "password": "123456",
  "firstName": "Juan",
  "lastName": "Pérez",
  "phone": "3006549870",
  "userType": "BARBERIA",
  "status": "ACTIVO",
  "barberShop": {
    "name": "Barbería Elegante",
    "address": "Calle 123 #45-67"
  }
}
```

**Respuesta (200 OK):**
```json
{
"message": "Usuario registrado exitosamente como BARBERIA"
}
```

### Barbero
**Endpoint:**
```bash
POST /barbershop/barber
```
Permite que una barbería autenticada registre a un barbero existente en el sistema, vinculándolo con su barbería.
> Este endpoint requiere autenticación con el rol `BARBERIA`.

**Encabezado:**
```bash
Authorization: Bearer <token_de_barberia>
```

**Ejemplo de cuerpo JSON:**
```json
{
  "email": "barbero@correo.com",
  "barberRequest": {
    "documentNumber": "1029384756",
    "commission": 0.15
  }
}

```
**Respuesta (200 OK):**
```json
{
"message": "Barbero registrado correctamente"
}

```

### Autenticación y Roles

El sistema usa JWT (JSON Web Token) para la autenticación.
Cada usuario obtiene un token al iniciar sesión, que debe incluir en cada solicitud protegida.

#### Iniciar Sesión

**Endpoint:**
```bash
POST /auth/login
```

**Ejemplo:**
```json
{
"email": "barberia@correo.com",
"password": "123456"
}
```

**Respuesta:**
```json
{
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```



**Uso en encabezado:**
```bash
Authorization: Bearer <token>
```





