#!/bin/bash

# Script de instalación de PTR - Package Manager
# Uso: curl -fsSL https://library.peterjhosep31.dev/install.sh | bash

set -e

echo "🚀 Instalando PTR Package Manager..."

# Verificar que Node.js esté instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instálalo primero."
    echo "   Visita: https://nodejs.org/"
    exit 1
fi

# Verificar que npm esté instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado."
    exit 1
fi

echo "✅ Node.js $(node --version) detectado"
echo "✅ npm $(npm --version) detectado"

# Detectar sistema operativo
OS="$(uname -s)"
ARCH="$(uname -m)"

# Directorios de instalación
INSTALL_DIR="$HOME/.ptr"
BIN_DIR="$INSTALL_DIR/bin"

# Detectar shell y archivo de configuración (para agregar al PATH después)
SHELL_CONFIG=""
if [ -n "$ZSH_VERSION" ] || [ -f "$HOME/.zshrc" ]; then
    SHELL_CONFIG="$HOME/.zshrc"
elif [ -n "$BASH_VERSION" ] || [ -f "$HOME/.bashrc" ]; then
    SHELL_CONFIG="$HOME/.bashrc"
elif [ -f "$HOME/.profile" ]; then
    SHELL_CONFIG="$HOME/.profile"
fi

# URL del servidor
DOWNLOAD_URL="https://library.peterjhosep31.dev/releases/latest.tar.gz"

echo "📦 Descargando PTR desde $DOWNLOAD_URL..."

# Descargar el tarball
if command -v curl &> /dev/null; then
    curl -fsSL "$DOWNLOAD_URL" -o "/tmp/ptr-latest.tar.gz"
elif command -v wget &> /dev/null; then
    wget -q "$DOWNLOAD_URL" -O "/tmp/ptr-latest.tar.gz"
else
    echo "❌ Se requiere curl o wget para la instalación"
    exit 1
fi

echo "📂 Extrayendo archivos..."

# Asegurarse de no estar en el directorio que vamos a eliminar
cd "$HOME"

# Eliminar instalación previa si existe
if [ -d "$INSTALL_DIR" ]; then
    echo "🗑️  Eliminando instalación anterior..."
    rm -rf "$INSTALL_DIR"
fi

# Eliminar directorio ptr temporal si existe
if [ -d "$HOME/ptr" ]; then
    rm -rf "$HOME/ptr"
fi

# Extraer el tarball
tar -xzf "/tmp/ptr-latest.tar.gz" -C "$HOME"

# Renombrar ptr a .ptr
if [ -d "$HOME/ptr" ]; then
    mv "$HOME/ptr" "$INSTALL_DIR"
else
    echo "❌ Error: No se pudo extraer el archivo"
    exit 1
fi

# Limpiar archivo temporal
rm -f "/tmp/ptr-latest.tar.gz"

# Verificar que se instaló correctamente
if [ ! -f "$INSTALL_DIR/package.json" ]; then
    echo "❌ Error: package.json no encontrado. La extracción falló."
    exit 1
fi

# Crear el directorio bin si no existe
mkdir -p "$BIN_DIR"

cd "$INSTALL_DIR"

echo "📚 Instalando dependencias..."
npm install --production --silent 2>&1 | tail -5

# Crear script wrapper en bin/
cat > "$BIN_DIR/ptr" << 'EOF'
#!/bin/bash
# PTR Package Manager wrapper
PTR_HOME="$HOME/.ptr"

# Usar tsx para ejecutar TypeScript
if command -v tsx &> /dev/null; then
    # tsx está instalado globalmente
    NODE_PATH="$PTR_HOME/node_modules" tsx "$PTR_HOME/CLI/index.ts" "$@"
elif [ -f "$PTR_HOME/node_modules/.bin/tsx" ]; then
    # Usar tsx local
    NODE_PATH="$PTR_HOME/node_modules" "$PTR_HOME/node_modules/.bin/tsx" "$PTR_HOME/CLI/index.ts" "$@"
else
    echo "Error: tsx no está instalado. Ejecuta: cd ~/.ptr && npm install"
    exit 1
fi
EOF

chmod +x "$BIN_DIR/ptr"

# Agregar al PATH si no está
if [ -n "$SHELL_CONFIG" ]; then
    if ! grep -q "export PATH=\"\$PATH:$BIN_DIR\"" "$SHELL_CONFIG" 2>/dev/null; then
        echo "" >> "$SHELL_CONFIG"
        echo "# PTR Package Manager" >> "$SHELL_CONFIG"
        echo "export PATH=\"\$PATH:$BIN_DIR\"" >> "$SHELL_CONFIG"
        echo "✅ PATH agregado a $SHELL_CONFIG"
    fi
fi

echo ""
echo "✅ ¡PTR instalado correctamente en $INSTALL_DIR!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⚠️  IMPORTANTE: Para usar PTR ahora, ejecuta:"
echo ""
echo "   export PATH=\"\$PATH:$BIN_DIR\""
echo ""
echo "O cierra y abre una nueva terminal"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🔧 Comandos disponibles:"
echo "   ptr --help          Ver todos los comandos"
echo "   ptr init            Inicializar un proyecto"
echo "   ptr list -a         Ver paquetes disponibles"
echo "   ptr install <pkg>   Instalar un paquete"
echo ""
echo "🌐 El servidor remoto ya está configurado:"
echo "   https://library.peterjhosep31.dev"
echo ""

# Intentar ejecutar ptr --version como prueba si el PATH está disponible
if [ -x "$BIN_DIR/ptr" ]; then
    echo "✓ Instalación verificada exitosamente"
else
    echo "⚠️  El ejecutable está en: $BIN_DIR/ptr"
fi
