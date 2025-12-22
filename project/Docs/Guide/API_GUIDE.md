# API GUIDE

---

## Modulos de la API

### Autenticación
Endpoints relacionados con registro, login y gestión de credenciales.

Ver Guia:
[Autenticación](AUTH_GUIDE.md)

---

### Barberia
Gestión de servicios, subcategorías, barberos, dashboard e ingresos de la barbería.

Ver Guia:
[Barberia](BARBERSHOP_GUIDE.md)

---

### Barbero
Perfil del barbero, disponibilidad, reservas, transacciones y dashboard personal.

Ver Guia:
[Barbero](BARBER_GUIDE.md)

---

### Cliente
Gestión de perfil, reservas y pagos del cliente.

Ver Guia:
[Cliente](CLIENT_GUIDE.md)

---

## Errores comunes (Endpoints protegidos)

Los siguientes errores pueden presentarse en **cualquier endpoint que requiera autenticación**.

---


**401 – No autenticado**
Se devuelve cuando el token JWT no es enviado o es inválido.
```json
{
  "timestamp": "2025-12-20T20:48:36.3432818",
  "status": 401,
  "error": "Unauthorized",
  "message": "No autenticado",
  "path": "/api/endpoint"
}
```

**403 – Acceso denegado**
Se devuelve cuando el usuario está autenticado pero no tiene el rol requerido.
```json
{
  "timestamp": "2025-12-20T20:48:36.3432818",
  "status": 403,
  "error": "Forbidden",
  "message": "Acción no permitida",
  "path": "/api/endpoint",
  "errors": [
    {
      "error": "BUSINESS_MISTAKE",
      "message": "Error de lógica de negocio",
      "details": [
        "No tienes permisos para realizar esta acción"
      ]
    }
  ]
}

```