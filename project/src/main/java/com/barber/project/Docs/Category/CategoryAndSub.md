# Módulo de Categorías y Subcategorías
El módulo de Categorías y Subcategorías permite a cada barbería organizar sus servicios de manera jerárquica.
Una Categoría agrupa un conjunto de Subcategorías (servicios específicos).
Este módulo integra:

- Validaciones de negocio (estado activo/inactivo)
- Restricciones por barbería autenticada
- Actualizaciones controladas
- Reutilización de lógica de validación

## Categorías
1. Una categoría puede estar ACTIVA o INACTIVA
2. Si una categoría está INACTIVA:
   - NO se puede actualizar
   - NO se pueden gestionar subcategorías
3. No pueden existir categorías duplicadas por barbería.
4. Solo el dueño de la barbería autenticada puede administrarlas.

### Operaciones de Categorías
#### Crear Categoría
**POST /categories**

**Validaciones:**
- Nombre único dentro de la barbería.
- Status inicial por defecto: ACTIVO.

#### Actualizar Categoría

**PUT /categories/{categoryId}**

**Validaciones:**
- Verifica que la categoría pertenezca a la barbería autenticada.
- No permite actualizar si el estado es INACTIVO.
- Nombre único (excluyendo la misma categoría).

#### Activar/Desactivar Categoría

**PUT /categories/{categoryId}/status/activate o desactivate**

- Desactivar una categoría bloquea toda gestión de subcategorías.
- Activar la categoría la habilita nuevamente.

## SubCategorias
1. Las subcategorías siempre pertenecen a una categoría.
2. No se permiten subcategorías si la categoría está inactiva.
3. No pueden existir dos subcategorías con el mismo nombre dentro de una categoría.
4. Todas las operaciones se validan por barbería:
   - el usuario solo puede modificar subcategorías de su propia barbería.

### Operaciones de Subcategorías
#### Crear Subcategoría

**POST /categories/{categoryId}/subcategories**

**Validaciones:**
- Verifica que la categoría existe en la barbería del usuario.
- Verifica que la categoría esté activa.
- Nombre único dentro de la categoría.

#### Actualizar Subcategoría

**PUT /categories/{categoryId}/subcategories/{subCategoryId}**

**Flujo del servicio:**

- Obtener barbería del usuario.
- Obtener categoría por categoryId.
- Obtener subcategoría por subCategoryId y la categoría.
- Validar que la categoría esté activa.
- Validar nombre único excluyendo la propia subcategoría.

## Diagrama de flujo de Categorias
```mermaid
flowchart TD

A[Petición: Crear/Actualizar/Listar Categorías] --> B[Obtener Barbería Autenticada]
B --> C{¿Categoría existe?}

C -->|No existe| E[Error: Categoría no encontrada]
C -->|Sí| D[Obtener Categoría por ID y BarberShop]

D --> F{¿Barbería coincide con autenticada?}
F -->|No| G[Error: No autorizado]
F -->|Sí| H[Validar nombre duplicado]

H -->|Duplicado| I[Error: Nombre ya usado]
H -->|OK| J{¿Categoría ACTIVA?}

J -->|Inactiva| K[Error: Categoría inactiva]
J -->|Activa| L[Actualizar/Registrar Categoría]

L --> M[Guardar Cambios]
M --> N[Respuesta Exitosa]

```
## Diagrama de Flujo Subcategorias

```mermaid
flowchart TD

A[Petición: Crear/Actualizar/Listar Subcategorías] --> B[Obtener Barbería Autenticada]

B --> C[Obtener Categoría por ID y BarberShop]
C --> D{¿Existe Categoría?}
D -->|No| E[Error: Categoría no encontrada]
D -->|Sí| F{¿Categoría está ACTIVA?}

F -->|Inactiva| G[Error: No se pueden gestionar<br/>subcategorías de categoría inactiva]
F -->|Activa| H[Obtener Subcategoría<br/>solo update]

H --> I{¿Subcategoría existe?}
I -->|No| J[Error: Subcategoría no encontrada]
I -->|Sí| K[Validar nombre duplicado en categoría]

K -->|Duplicado| L[Error: Ya existe una subcategoría<br/>con ese nombre]
K -->|OK| M[Crear / Actualizar Subcategoría]

M --> N[Guardar]
N --> O[Respuesta: SubCategoryResponse]

```
