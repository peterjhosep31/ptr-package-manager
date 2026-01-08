# PTR - Package Manager

Gestor de paquetes personalizado con registry propio y servidor HTTP para distribución remota.

## 🚀 Instalación

### Opción 1: Desde el servidor (Remoto)

```bash
# Configurar PTR para usar el servidor remoto
ptr config set-remote https://library.peterjhosep31.dev

# Instalar paquetes
ptr install files
```

### Opción 2: Instalación Local (Desarrollo)

```bash
git clone <repository>
cd libraryes
npm install
npm link  # Crea el comando global 'ptr'
```

## 📦 Comandos Disponibles

### Gestión de Proyectos

```bash
# Inicializar un nuevo proyecto PTR
ptr init [nombre-proyecto]

# Instalar un paquete
ptr install <package-name> [version]

# Desinstalar un paquete
ptr uninstall <package-name>

# Listar paquetes instalados
ptr list

# Listar paquetes disponibles
ptr list -a
```

### Configuración

```bash
# Ver configuración actual
ptr config

# Configurar registry remoto
ptr config set-remote https://library.peterjhosep31.dev

# Volver a registry local
ptr config set-local
```

### Ayuda

```bash
# Ver todos los comandos
ptr --help
```

## 🌐 Servidor API

### Iniciar el servidor localmente

```bash
npm run dev
```

El servidor se ejecuta en el puerto **3105**.

### Endpoints disponibles

```bash
# Listar todos los paquetes
GET https://library.peterjhosep31.dev/api/packages

# Información de un paquete específico
GET https://library.peterjhosep31.dev/api/packages/files

# Descargar un paquete
GET https://library.peterjhosep31.dev/api/packages/files/1.0.0/download

# Descargar un archivo específico
GET https://library.peterjhosep31.dev/api/packages/files/1.0.0/files/Files.ts
```

## 🐳 Docker

### Construcción

```bash
docker build -t ptr-library .
```

### Ejecución

```bash
docker-compose up -d
```

El servidor estará disponible en `http://localhost:3105`.

## 📚 Paquetes Disponibles

- **directory**: Gestión de directorios
- **files**: Gestión de archivos (depende de `directory`)
- **encripted**: Sistema de encriptación
- **timestamp**: Gestión de timestamps

## 🔧 Estructura del Proyecto

```
libraryes/
├── CLI/              # Interfaz de línea de comandos
├── Server/           # Servidor HTTP con API REST
├── packages/         # Paquetes distribuibles
│   ├── directory/
│   ├── files/
│   ├── encripted/
│   └── timestamp/
├── registry.json     # Registro de paquetes
└── src/              # Código fuente de desarrollo
```

## 🔐 Configuración de Cloudflare Tunnel

Si despliegas en tu propio servidor con Cloudflare Tunnel:

```bash
# Ya tienes el tunnel configurado en library.peterjhosep31.dev
# Solo asegúrate de que apunte al puerto 3105
```

## 📝 Ejemplo de Uso

```bash
# 1. Crear un nuevo proyecto
mkdir mi-proyecto
cd mi-proyecto
ptr init

# 2. Configurar para usar el servidor remoto
ptr config set-remote https://library.peterjhosep31.dev

# 3. Instalar paquetes
ptr install files    # Instala 'files' y su dependencia 'directory'
ptr install timestamp

# 4. Usar en tu código
# Los paquetes se instalan en ptr_modules/
```

## 🛠️ Desarrollo

### Compilar TypeScript

```bash
npm run build
```

### Ejecutar tests

```bash
npm test
```

### Modo desarrollo con watch

```bash
npm run dev
```

## 📄 Licencia

ISC
