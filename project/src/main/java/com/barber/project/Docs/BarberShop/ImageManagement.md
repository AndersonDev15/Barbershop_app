# Gestion de Images de Barberia
El módulo de gestión de imágenes permite que el dueño de una barbería:

- Suba imágenes a Cloudinary
- Liste las imágenes registradas
- Elimine imágenes
- Establezca una imagen como portada
- Tenga un máximo de 5 imágenes
- Conserve validaciones de tipo y tamaño

El sistema asocia automáticamente las imágenes con la barbería del usuario autenticado.

---
## Estructura General
```markdown
Controller/
    BarberShopImageController.java

Service/
    BarberShopImageService.java

Entity/
    BarberShop.java
    BarberShopImage.java

Repository/
    BarberShopImageRepository.java

config/
    CloudinaryConfig.java

```

## Diagrama de flujo
```mermaid
flowchart TD
%% SUBIR IMAGEN
    SUBIR[POST /upload] --> VALIDAR{Archivo válido?}
    VALIDAR -->|No| ERROR1[400: Bad Request]
    VALIDAR -->|Sí| CLOUD[Subir a Cloudinary]
    CLOUD --> GUARDAR[Guardar en Base de Datos]
    GUARDAR --> EXITO1[201: Imagen subida]

%% OBTENER IMÁGENES
    OBTENER[GET /images] --> CONSULTAR[Consultar Base de Datos]
    CONSULTAR --> LISTA[Retornar lista de imágenes]

%% ELIMINAR IMAGEN
    ELIMINAR[DELETE /images/id] --> AUTORIZAR{Usuario autorizado?}
    AUTORIZAR -->|No| ERROR2[403: No autorizado]
    AUTORIZAR -->|Sí| BORRAR[Eliminar de Cloudinary y DB]
    BORRAR --> EXITO2[200: Imagen eliminada]

%% ESTABLECER PORTADA
    PORTADA[POST /images/id/cover] --> VERIFICAR{Usuario autorizado?}
    VERIFICAR -->|No| ERROR3[403: No autorizado]
    VERIFICAR -->|Sí| ACTUALIZAR[Actualizar portada en DB]
    ACTUALIZAR --> EXITO3[200: Portada actualizada]
```

## Endpoints del módulo
### POST /images/upload
Sube una imagen a Cloudinary y la registra.
#### Reglas:
- Máximo 5 imágenes por barbería.
- Solo formatos permitidos: PNG, JPG, JPEG, WEBP.
- Tamaño máximo sugerido: 2MB.

#### Ejemplo POSTMAN

**Tipo:** Form-Data

**Key:** file (tipo file)

**Value:** seleccionar imagen

### GET /images
Lista todas las imágenes de la barbería del usuario autenticado.
#### Respuesta ejemplo:
```json
[
{
"id": 10,
"url": "https://res.cloudinary.com/...",
"publicId": "barberias/abc123",
"isCover": true
}
]
```

### DELETE /images/{id}
Elimina la imagen tanto de Cloudinary como de la base de datos.
#### Respuesta ejemplo:
```json
{ "message": "Imagen eliminada" }
```

## Reglas importantes
- Cada barbería puede tener máximo 5 imágenes.
- Solo una imagen puede estar marcada como portada.
- Las imágenes se guardan en Cloudinary para evitar ocupar espacio local.
- Los usuarios solo pueden gestionar imágenes pertenecientes a su barbería.
- Se realizan validaciones de tipo y tamaño antes de subir.