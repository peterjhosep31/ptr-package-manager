#!/bin/bash

# Script para crear el tarball de release
# Uso: ./scripts/package-release.sh

set -e

echo "📦 Creando release de PTR..."

# Crear directorio de releases si no existe
mkdir -p releases

# Nombre del archivo
RELEASE_FILE="releases/latest.tar.gz"

echo "🗑️  Limpiando release anterior..."
rm -f "$RELEASE_FILE"

echo "📝 Creando tarball..."

# Crear un directorio temporal para el release
TEMP_DIR=$(mktemp -d)
RELEASE_DIR="$TEMP_DIR/ptr"

# Copiar archivos necesarios
mkdir -p "$RELEASE_DIR"
cp -r CLI/ "$RELEASE_DIR/"
cp -r Server/ "$RELEASE_DIR/"
cp -r Prototype/ "$RELEASE_DIR/"
cp -r packages/ "$RELEASE_DIR/"
cp -r src/ "$RELEASE_DIR/"
cp package.json "$RELEASE_DIR/"
cp package-lock.json "$RELEASE_DIR/" 2>/dev/null || true
cp tsconfig.json "$RELEASE_DIR/"
cp registry.json "$RELEASE_DIR/"
cp README.md "$RELEASE_DIR/" 2>/dev/null || true
cp INSTALL.md "$RELEASE_DIR/" 2>/dev/null || true
cp index.ts "$RELEASE_DIR/" 2>/dev/null || true

# Crear tarball desde el directorio temporal
tar -czf "$RELEASE_FILE" -C "$TEMP_DIR" ptr/

# Limpiar directorio temporal
rm -rf "$TEMP_DIR"

echo "✅ Release creado: $RELEASE_FILE"
echo "📊 Tamaño: $(du -h "$RELEASE_FILE" | cut -f1)"
echo ""
echo "Para servir el release, asegúrate de que esté accesible en:"
echo "https://library.peterjhosep31.dev/releases/latest.tar.gz"
