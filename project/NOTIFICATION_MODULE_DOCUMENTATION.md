# Módulo de Notificaciones - Documentación

## Resumen
Se ha creado exitosamente el módulo de notificaciones para el proyecto Spring Boot BarberShop. El módulo está completamente integrado con los servicios existentes.

## Estructura Creada

```
notification/
├── controller/
│   └── NotificationController.java
├── service/
│   └── NotificationService.java
├── repository/
│   └── NotificationRepository.java
├── entity/
│   └── Notification.java
├── dto/
│   ├── NotificationResponse.java
│   └── UnreadCountResponse.java
└── enums/
    └── NotificationType.java
```

## Archivos Creados

### 1. NotificationType.java
Enumeración con los tipos de notificaciones soportadas:
- `INVITATION_RECEIVED` - Cuando se acepta una invitación
- `APPOINTMENT_SCHEDULED` - Cuando se agenda una cita
- `APPOINTMENT_CANCELLED` - Cuando se cancela una cita
- `APPOINTMENT_REMINDER` - Recordatorio de cita (20 minutos antes)
- `PAYMENT_CONFIRMED` - Cuando se confirma un pago

### 2. Notification.java
Entidad JPA que mapea a la tabla `notifications`:
- `id`: Long (generado)
- `userUuid`: String - UUID del usuario destinatario
- `type`: NotificationType - Tipo de notificación
- `title`: String - Título de la notificación
- `message`: String - Cuerpo del mensaje
- `read`: boolean - Estado de lectura (default: false)
- `createdAt`: LocalDateTime - Fecha de creación (auto-generada)
- `referenceId`: Long - ID de la entidad relacionada (cita, invitación, etc.)

### 3. NotificationRepository.java
Interfaz JPA con métodos personalizados:
- `findByUserUuidOrderByCreatedAtDesc()` - Obtiene notificaciones ordenadas por fecha
- `countByUserUuidAndReadFalse()` - Cuenta notificaciones no leídas
- `markAllAsRead()` - Marca todas las notificaciones como leídas

### 4. NotificationResponse.java
Record DTO para las respuestas de notificaciones con campos:
- id, type, title, message, read, createdAt, referenceId

### 5. UnreadCountResponse.java
Record DTO que retorna el conteo de notificaciones no leídas

### 6. NotificationService.java
Servicio principal con métodos:
- `createNotification()` - Crea una nueva notificación
- `getNotifications()` - Obtiene todas las notificaciones de un usuario
- `markAsRead()` - Marca una notificación como leída
- `markAllAsRead()` - Marca todas como leídas
- `getUnreadCount()` - Obtiene el conteo de no leídas

### 7. NotificationController.java
Controlador REST con endpoints:
- `GET /api/notifications` - Obtener todas las notificaciones
- `GET /api/notifications/unread-count` - Obtener conteo de no leídas
- `PUT /api/notifications/{id}/read` - Marcar como leída
- `PUT /api/notifications/read-all` - Marcar todas como leídas

Todos los endpoints están protegidos con `@PreAuthorize("isAuthenticated()")`

## Integraciones Realizadas

### 1. BarberInvitationResponseService
**Método**: `acceptInvitation()`
**Notificación enviada**: INVITATION_RECEIVED
```
Título: "Invitación aceptada"
Mensaje: "Te has unido a [nombre_barbería] exitosamente."
ReferenceId: ID de la invitación
```

### 2. ReservationService
**Método**: `sendNewReservationNotifications()`
**Notificaciones enviadas**:
- Al BARBERO: APPOINTMENT_SCHEDULED
  ```
  Título: "Nueva cita agendada"
  Mensaje: "Tienes una nueva cita el [fecha] a las [hora]"
  ReferenceId: ID de la reserva
  ```
- Al CLIENTE: APPOINTMENT_SCHEDULED
  ```
  Título: "Cita confirmada"
  Mensaje: "Tu cita en [barbería] está confirmada para el [fecha] a las [hora]"
  ReferenceId: ID de la reserva
  ```

**Método**: `sendCancellationNotifications()`
**Notificaciones enviadas**:
- Al BARBERO: APPOINTMENT_CANCELLED
  ```
  Título: "Cita cancelada"
  Mensaje: "La cita del [fecha] a las [hora] fue cancelada."
  ReferenceId: ID de la reserva
  ```
- Al CLIENTE: APPOINTMENT_CANCELLED
  ```
  Título: "Cita cancelada"
  Mensaje: "Tu cita del [fecha] a las [hora] fue cancelada."
  ReferenceId: ID de la reserva
  ```

### 3. ReservationReminderScheduler
**Método**: `send20MinuteReminders()`
**Notificaciones enviadas** (cada 20 minutos antes de la cita):
- Al BARBERO: APPOINTMENT_REMINDER
  ```
  Título: "Recordatorio de cita"
  Mensaje: "Tienes una cita en 20 minutos a las [hora]"
  ReferenceId: ID de la reserva
  ```
- Al CLIENTE: APPOINTMENT_REMINDER
  ```
  Título: "Recordatorio de cita"
  Mensaje: "Tu cita empieza en 20 minutos a las [hora]"
  ReferenceId: ID de la reserva
  ```

### 4. TransactionService
**Método**: `sendTransactionNotifications()`
**Notificaciones enviadas**:
- Al BARBERO: PAYMENT_CONFIRMED
  ```
  Título: "Pago confirmado"
  Mensaje: "Recibiste un pago de [monto] por la cita del [fecha]"
  ReferenceId: ID de la reserva
  ```
- Al CLIENTE: PAYMENT_CONFIRMED
  ```
  Título: "Pago confirmado"
  Mensaje: "Tu pago de [monto] fue confirmado."
  ReferenceId: ID de la reserva
  ```

## Notas Importantes

1. **Base de datos**: La tabla `notifications` debe existir previamente en la base de datos. La entidad mapea exactamente a esta tabla con `@Table(name = "notifications")`.

2. **Seguridad**: Todos los endpoints del controller requieren autenticación (aplica para los 3 roles: CLIENTE, BARBERO, BARBERIA).

3. **Transacciones**: Las operaciones de notificación se ejecutan dentro del contexto transaccional del servicio que las dispara.

4. **Lombok**: Se utilizó Lombok en todas las clases pertinentes (@Getter, @Setter, @NoArgsConstructor, @AllArgsConstructor, @RequiredArgsConstructor).

5. **Swagger/OpenAPI**: Se añadieron anotaciones `@Tag` y `@Operation` para documentación automática.

## Compilación

El proyecto compila exitosamente sin errores:
```bash
mvn clean compile
```
**Resultado**: BUILD SUCCESS ✓

## Endpoints Disponibles

### Obtener notificaciones
```
GET /api/notifications
Authorization: Bearer <token>
Response: List<NotificationResponse>
```

### Obtener conteo de no leídas
```
GET /api/notifications/unread-count
Authorization: Bearer <token>
Response: UnreadCountResponse { count: 5 }
```

### Marcar una como leída
```
PUT /api/notifications/{id}/read
Authorization: Bearer <token>
Response: 204 No Content
```

### Marcar todas como leídas
```
PUT /api/notifications/read-all
Authorization: Bearer <token>
Response: 204 No Content
```

## Flujo de Uso

1. **Usuario realiza acción** (acepta invitación, crea reserva, etc.)
2. **Servicio procesa la acción** y llama a `notificationService.createNotification()`
3. **Notificación se almacena** en la base de datos
4. **Usuario puede consultar** sus notificaciones a través de los endpoints REST
5. **Usuario marca como leída** cuando ve la notificación

## Extensibilidad

Para agregar nuevas notificaciones en el futuro:

1. Agregar nuevo tipo en `NotificationType.java`:
   ```java
   NEW_NOTIFICATION_TYPE,
   ```

2. Inyectar `NotificationService` en el servicio correspondiente

3. Llamar al método:
   ```java
   notificationService.createNotification(
       userUuid,
       NotificationType.NEW_NOTIFICATION_TYPE,
       "Título",
       "Mensaje",
       referenceId
   );
   ```

---

**Estado**: ✅ Implementación completada y compilación exitosa
**Fecha**: 2025-01-16
