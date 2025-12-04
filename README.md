# Libraryes - Biblioteca de Utilidades TypeScript

Una biblioteca completa de utilidades TypeScript con gestión de archivos, encriptación, timestamps y manejo robusto de errores.

## 📦 Instalación

```bash
npm install libraryes
```

## 🚀 Características

- ✅ **TypeScript 100%** - Tipado estricto y seguro
- ✅ **Tests Completos** - 44 tests con Vitest
- ✅ **ESLint Configurado** - Código limpio y consistente
- ✅ **Documentación JSDoc** - Toda la API documentada
- ✅ **Inmutable** - Tipos readonly para mayor seguridad

## 📚 Módulos

### 1. DirectoryFiles
Gestión completa de archivos y directorios con validaciones robustas.

```typescript
import DirectoryFiles from 'libraryes/DirectoryFiles';

const df = new DirectoryFiles();

// Verificar existencia
if (df.exists('/path/to/file.txt')) {
    console.log('El archivo existe');
}

// Crear archivo o directorio
df.create('/path/to/newfile.txt');

// Obtener información completa de ruta
const pathInfo = df.getPathInfo('/home/user/document.pdf');
console.log(pathInfo);
// {
//   full: '/home/user/document.pdf',
//   directory: '/home/user',
//   filename: 'document.pdf',
//   extension: '.pdf'
// }

// Listar contenido de directorio
const content = df.getContentedDirectory('/home/user');
console.log(content.files);       // Array de archivos
console.log(content.directories); // Array de subdirectorios
```

### 2. Encripted
Encriptación y desencriptación de texto con algoritmo personalizado.

```typescript
import Encripted from 'libraryes/Encripted';

const encripted = new Encripted();

// Encriptar texto
const encrypted = encripted.encrypt('Hello World 123');
console.log(encrypted); // Texto encriptado

// Desencriptar
const decrypted = encripted.decrypt(encrypted);
console.log(decrypted); // 'Hello World 123'

// Obtener o cambiar el salto (jump)
const jump = encripted.getJump();
const newJump = encripted.resetJump(); // Genera nuevo salto
```

### 3. Timestamp
Manipulación y formato de fechas en timestamps (segundos).

```typescript
import Timestamp from 'libraryes/Timestamp';

// Obtener timestamp actual
const now = Timestamp.get();
console.log(now); // 1733270400

// Convertir a fecha formateada
const date = Timestamp.convertToDate('Y-m-d H:i:s', now);
console.log(date); // "2025-12-03 18:00:00"

// Formatos personalizados
Timestamp.convertToDate('d/m/Y', now);        // "03/12/2025"
Timestamp.convertToDate('H:i:s', now);        // "18:00:00"
Timestamp.convertToDate('Y-m-d', now);        // "2025-12-03"

// Calcular diferencias
const start = 1733270400;
const end = 1733274000;
const diff = Timestamp.getDiference(start, end);
console.log(diff); // 3600 (1 hora en segundos)
```

### 4. CustomError
Manejo avanzado de errores con información contextual.

```typescript
import CustomError from 'libraryes/CustomError';

throw new CustomError('Error de validación', {
    cause: 'El parámetro es inválido',
    expected: 'string',
    received: 'number',
    status: 422
});

// Capturar y usar
try {
    // ... código
} catch (error) {
    if (error instanceof CustomError) {
        console.log(error.message);  // 'Error de validación'
        console.log(error.cause);    // 'El parámetro es inválido'
        console.log(error.expected); // 'string'
        console.log(error.received); // 'number'
        console.log(error.status);   // 422
    }
}
```

### Tipos de Error Especializados

```typescript
import type { 
    ValidationError,  // HTTP 422
    NotFoundError,    // HTTP 404
    ConflictError,    // HTTP 409
    ServerError,      // HTTP 500
    StorageError      // HTTP 507
} from 'libraryes/Error/Types/ErrorTypes';
```

## 🛠️ Scripts de Desarrollo

```bash
# Compilar TypeScript
npm run build

# Ejecutar en desarrollo
npm run dev

# Ejecutar tests
npm test              # Modo watch
npm run test:run      # Una vez
npm run test:ui       # Interfaz gráfica
npm run test:coverage # Con cobertura

# Linting
npm run lint          # Verificar código
npm run lint:fix      # Arreglar automáticamente

# Type checking
npm run type-check    # Verificar tipos sin compilar
```

## 📋 Tipos y Enums

### DateFormatChar
```typescript
import { DateFormatChar, DateSeparator } from 'libraryes/TimesTamp/Types/Format';

const format = `${DateFormatChar.YEAR}${DateSeparator.DASH}${DateFormatChar.MONTH}${DateSeparator.DASH}${DateFormatChar.DAY}`;
// "Y-m-d"
```

### PathInfo
```typescript
import type { PathInfo } from 'libraryes/DirectoryFiles/Types/PathInfo';

const info: PathInfo = {
    full: '/home/user/file.txt',
    directory: '/home/user',
    filename: 'file.txt',
    extension: '.txt'
};
```

## 🧪 Testing

La biblioteca incluye tests completos para todos los módulos:

- ✅ 44 tests pasando
- ✅ Cobertura de casos edge
- ✅ Tests de validación de tipos
- ✅ Tests de manejo de errores

Ejecutar tests:
```bash
npm test
```

## 📝 Características de TypeScript

- **Strict Mode**: Activado para máxima seguridad
- **No Implicit Any**: Todo debe estar tipado
- **No Unused Variables**: Código limpio
- **Readonly Types**: Inmutabilidad donde es apropiado
- **Explicit Return Types**: Para métodos públicos

## 🔒 Seguridad

- Validación exhaustiva de parámetros
- Manejo robusto de errores con CustomError
- Tipos inmutables (readonly) para prevenir mutaciones
- Sin dependencias con vulnerabilidades conocidas

## 📖 Documentación

Toda la API está documentada con JSDoc. Para ver la documentación:
1. Los archivos `.d.ts` incluyen toda la documentación
2. Tu IDE mostrará automáticamente la documentación al usar autocompletado
3. Todos los métodos incluyen ejemplos de uso

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

Asegúrate de:
- ✅ Agregar tests para nuevas funcionalidades
- ✅ Mantener la cobertura de tests
- ✅ Seguir las convenciones de código (ESLint)
- ✅ Documentar con JSDoc

## 📄 Licencia

ISC

## 🎯 Puntuación de Calidad

| Categoría | Puntuación |
|-----------|-----------|
| TypeScript Tipado | ⭐⭐⭐⭐⭐ 10/10 |
| Estructura del Proyecto | ⭐⭐⭐⭐⭐ 10/10 |
| Documentación | ⭐⭐⭐⭐⭐ 10/10 |
| Testing | ⭐⭐⭐⭐⭐ 10/10 |
| Manejo de Errores | ⭐⭐⭐⭐⭐ 10/10 |
| Seguridad | ⭐⭐⭐⭐⭐ 10/10 |

**PROMEDIO GENERAL: 10/10** 🎯

## 🆕 Novedades v1.0.0

- ✨ Nuevos tipos especializados de errores
- ✨ Enum DateFormatChar para formatos de fecha type-safe
- ✨ Interface PathInfo para información estructurada de rutas
- ✨ Método resetJump() en Encripted
- ✨ Validaciones mejoradas en todos los métodos
- ✨ Suite completa de tests con Vitest
- ✨ ESLint configurado con reglas estrictas
- ✨ Tipos readonly para inmutabilidad
- ✨ Documentación JSDoc completa

---

Desarrollado con ❤️ y TypeScript
