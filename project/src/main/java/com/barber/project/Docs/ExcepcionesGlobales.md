# Manejo Global de Excepciones
El proyecto implementa un sistema centralizado de manejo de errores mediante una clase `GlobalExceptionHandler` anotada con `@RestControllerAdvice.`
Su propósito es capturar y formatear las excepciones lanzadas por la aplicación, devolviendo respuestas coherentes y estructuradas a los clientes de la API.

## Estructura de las respuestas
### ErrorResponse
Representa la estructura general de una respuesta de error.

|   Campo   |              Tipo             |                           Descripción                           |
|:---------:|:-----------------------------:|:---------------------------------------------------------------:|
| timestamp | LocalDateTime                 | Fecha y hora en que ocurrió el error.                           |
| status    | int                           | Código de estado HTTP.                                          |
| error     | String                        | Nombre del tipo de error (por ejemplo, BAD_REQUEST, FORBIDDEN). |
| message   | String                        | Descripción general del error.                                  |
| path      | String                        | Endpoint donde ocurrió la excepción.                            |
| errors    | List<ValidationErrorResponse> | Lista de errores específicos o de negocio.                      |


### ValidationErrorResponse
Estructura que describe los detalles específicos del error.

|    Campo    |              Tipo             |                                    Descripción                                   |
|:-----------:|:-----------------------------:|:--------------------------------------------------------------------------------:|
| code        | String                        | Código que clasifica el error (por ejemplo, VALIDATION_ERROR, BUSINESS_MISTAKE). |
| description | String                        | Descripción corta del tipo de error.                                             |
| details     | List<String>                  | Lista de mensajes detallados del error.                                          |
| message     | String                        | Descripción general del error.                                                   |
| path        | String                        | Endpoint donde ocurrió la excepción.                                             |
| errors      | List<ValidationErrorResponse> | Lista de errores específicos o de negocio.                                       |

## Excepciones manejadas

### Errores de validación de datos
Captura los errores lanzados por `@Valid`  cuando los datos del request no cumplen las reglas de validación.
```java
@ExceptionHandler(MethodArgumentNotValidException.class)
```
#### Descripción:
Extrae todos los errores de validación de los campos y los agrupa en una lista.
Devuelve un JSON con código `400 BAD_REQUEST` y tipo `VALIDATION_ERROR`.

**Ejemplo de Respuesta:**
```json
{
  "timestamp": "2025-11-11T14:30:45",
  "status": 400,
  "error": "BAD_REQUEST",
  "message": "Error de validación",
  "path": "/api/users/register",
  "errors": [
    {
      "code": "VALIDATION_ERROR",
      "description": "Los datos de entrada son inválidos",
      "details": [
        "email: no debe estar vacío",
        "password: debe tener al menos 6 caracteres"
      ]
    }
  ]
}

```

### Método reutilizable BusinessMistake
El método BusinessMistake se utiliza para formatear de manera uniforme las respuestas de error relacionadas con excepciones de negocio, de validación o de acceso, permitiendo mantener consistencia en toda la API.

Este método es invocado por varios @ExceptionHandler en el GlobalExceptionHandler (por ejemplo, AccessDeniedException, etc.).

#### Implementacion.
```java
// Método reutilizable para construir respuestas de error de negocio
private ResponseEntity<ErrorResponse> BusinessMistake(
        Exception exception,
        HttpServletRequest request,
        HttpStatus status
) {
    ValidationErrorResponse mistakeResponse = new ValidationErrorResponse(
            "BUSINESS_MISTAKE",
            "Error de lógica de negocio",
            List.of(exception.getMessage())
    );

    ErrorResponse response = new ErrorResponse(
            LocalDateTime.now(),
            status.value(),
            status.getReasonPhrase(),
            exception.getMessage(),
            request.getRequestURI(),
            List.of(mistakeResponse)
    );

    return ResponseEntity.status(status).body(response);
}
```
**Descripción general**

| Parámetro |              Tipo             |                                        Descripción                                       |
|:---------:|:-----------------------------:|:----------------------------------------------------------------------------------------:|
| exception | Exception                     | Excepción capturada, de la cual se obtiene el mensaje del error.                         |
| request   | HttpServletRequest            | Permite acceder al endpoint donde ocurrió la excepción.                                  |
| status    | HttpStatus                    | Código de estado HTTP que se devolverá al cliente (por ejemplo, BAD_REQUEST, FORBIDDEN). |
| message   | String                        | Descripción general del error.                                                           |
| path      | String                        | Endpoint donde ocurrió la excepción.                                                     |
| errors    | List<ValidationErrorResponse> | Lista de errores específicos o de negocio.                                               |

**Estructura generada**

Ejemplo del JSON devuelto por este método:

```json
{
  "timestamp": "2025-11-11T11:10:00",
  "status": 400,
  "error": "BAD_REQUEST",
  "message": "Ya existe un usuario con ese correo",
  "path": "/auth/register",
  "errors": [
    {
      "code": "BUSINESS_MISTAKE",
      "description": "Error de lógica de negocio",
      "details": [
        "Ya existe un usuario con ese correo"
      ]
    }
  ]
}

```

#### Casos en los que se usa
`**AccessDeniedException**`
Se lanza cuando un usuario intenta acceder a un recurso para el cual no tiene permisos suficientes.
```java
@ExceptionHandler(AccessDeniedException.class)
public ResponseEntity<ErrorResponse> handleAccessDenied(
        AccessDeniedException exception,
        HttpServletRequest request
){
    return BusinessMistake(exception, request, HttpStatus.FORBIDDEN);
}
```
**Código HTTP:** `403 FORBIDDEN`

**Ejemplo de respuesta:**

```json
{
  "status": 403,
  "error": "FORBIDDEN",
  "message": "Acceso denegado",
  "path": "/api/barbers",
  "errors": [
    {
      "code": "BUSINESS_MISTAKE",
      "description": "Error de lógica de negocio",
      "details": ["Acceso denegado"]
    }
  ]
}

```

`**BadCredentialsException**`
Se lanza cuando las credenciales del usuario son incorrectas durante el inicio de sesión.
```java
@ExceptionHandler(BadCredentialsException.class)
public ResponseEntity<ErrorResponse> handleBadCredentials(
        BadCredentialsException exception,
        HttpServletRequest request
){
    return BusinessMistake(exception, request, HttpStatus.UNAUTHORIZED);
}

```
**Código HTTP:** `401 UNAUTHORIZED`

**Ejemplo de respuesta:**

```json
{
  "status": 401,
  "error": "UNAUTHORIZED",
  "message": "Credenciales inválidas",
  "path": "/auth/login",
  "errors": [
    {
      "code": "BUSINESS_MISTAKE",
      "description": "Error de lógica de negocio",
      "details": ["Usuario o contraseña incorrectos"]
    }
  ]
}
```

`**ResourceNotFoundException**`
Se lanza cuando un recurso solicitado no existe (por ejemplo, un barbero o cliente no encontrado).
```java
@ExceptionHandler(ResourceNotFoundException.class)
public ResponseEntity<ErrorResponse> handleNotFound(
        ResourceNotFoundException exception,
        HttpServletRequest request
){
    return BusinessMistake(exception, request, HttpStatus.NOT_FOUND);
}

```
**Código HTTP:** `404 NOT_FOUND`

**Ejemplo de respuesta:**

```json
{
  "status": 404,
  "error": "NOT_FOUND",
  "message": "Recurso no encontrado",
  "path": "/api/barbers/10",
  "errors": [
    {
      "code": "BUSINESS_MISTAKE",
      "description": "Error de lógica de negocio",
      "details": ["El barbero con ID 10 no existe"]
    }
  ]
}
```

`**DuplicateResourceException**`
Se lanza cuando se intenta registrar un recurso duplicado, como un correo o documento ya existente.
```java
@ExceptionHandler(DuplicateResourceException.class)
public ResponseEntity<ErrorResponse> handleDuplicate(
        DuplicateResourceException exception,
        HttpServletRequest request
){
    return BusinessMistake(exception, request, HttpStatus.CONFLICT);
}


```
**Código HTTP:** `409 CONFLICT`

**Ejemplo de respuesta:**

```json
{
  "status": 409,
  "error": "CONFLICT",
  "message": "Duplicidad de recurso",
  "path": "/auth/register",
  "errors": [
    {
      "code": "BUSINESS_MISTAKE",
      "description": "Error de lógica de negocio",
      "details": ["El correo ya está en uso"]
    }
  ]
}
```

