# Instalación de PTR en otros equipos

## Opción 1: Instalación rápida (Script) - RECOMENDADO

```bash
# IMPORTANTE: Ejecutar desde el directorio HOME
cd ~
curl -fsSL https://library.peterjhosep31.dev/install.sh | bash
```

**Después de la instalación, activa el comando ptr:**

```bash
# Opción A: Agregar al PATH temporalmente (para la sesión actual)
export PATH="$PATH:$HOME/.ptr/bin"
ptr --help

# Opción B: Recargar la configuración del shell
source ~/.bashrc   # Si usas bash
source ~/.zshrc    # Si usas zsh

# Opción C: Abrir una nueva terminal (recomendado)
```

**Si necesitas reinstalar:**
```bash
# Salir del directorio .ptr primero
cd ~
rm -rf ~/.ptr
curl -fsSL https://library.peterjhosep31.dev/install.sh | bash
```

## Opción 2: Desde NPM (si publicas el paquete)

```bash
npm install -g ptr-package-manager
```

Luego configura el servidor remoto:
```bash
ptr config set-remote https://library.peterjhosep31.dev
```

## Opción 3: Instalación manual desde Git

```bash
# Clonar el repositorio
git clone https://github.com/TU_USUARIO/libraryes.git
cd libraryes

# Instalar dependencias
npm install

# Crear enlace global
npm link

# Configurar servidor remoto
ptr config set-remote https://library.peterjhosep31.dev
```

## Opción 4: Descarga directa del tarball

```bash
# Descargar el paquete
curl -o ptr.tar.gz https://library.peterjhosep31.dev/releases/latest.tar.gz

# Extraer
tar -xzf ptr.tar.gz
cd ptr

# Instalar
npm install
npm link
```

## Verificar instalación

```bash
ptr --version
ptr --help
ptr list -a
```

## Primer uso

```bash
# Crear un nuevo proyecto
mkdir mi-proyecto
cd mi-proyecto

# Inicializar
ptr init

# Instalar paquetes
ptr install files
```
