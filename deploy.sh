#!/bin/bash

# Script de despliegue para Tommy CDN
# Uso: bash deploy.sh

echo "🚀 Iniciando despliegue de Tommy CDN..."

# --- Variables de Configuración ---
REMOTE_HOST="root@179.43.122.184"
REMOTE_PORT="5127"
REMOTE_PATH="/var/www/tommyweb"
API_URL=""

# --- FASE 1: Compilación del Frontend ---
echo "🔨 Compilando Frontend con API_URL=$API_URL..."
cd ./client
# Pasamos la variable de entorno para que Vite la inyecte en el build
export VITE_API_URL=$API_URL
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Error en la compilación del frontend"
    exit 1
fi
cd ..

# --- FASE 2: Preparación del Servidor Remoto ---
echo "📂 Preparando carpetas en el VPS..."
ssh -p $REMOTE_PORT $REMOTE_HOST "mkdir -p $REMOTE_PATH/frontend $REMOTE_PATH/backend"

# --- FASE 3: Transferencia de Archivos ---
echo "📤 Transfiriendo archivos..."

# Frontend (dist)
scp -P $REMOTE_PORT -r ./client/dist/* $REMOTE_HOST:$REMOTE_PATH/frontend/

# Backend (server)
# Excluimos node_modules para que sea más rápido
scp -P $REMOTE_PORT -r ./server/index.js ./server/package.json ./server/data $REMOTE_HOST:$REMOTE_PATH/backend/

# --- FASE 4: Instalación y Reinicio en el VPS ---
echo "🔄 Configurando backend y reiniciando servicios..."
ssh -p $REMOTE_PORT $REMOTE_HOST "
    cd $REMOTE_PATH/backend
    npm install --production
    # Usamos PM2 para gestionar el proceso
    pm2 delete tommy-backend 2>/dev/null || true
    pm2 start index.js --name tommy-backend
    pm2 save
"

echo "✨ Despliegue completado con éxito!"
echo "🎯 Frontend disponible en el VPS (Configura Nginx para apuntar a $REMOTE_PATH/frontend)"
echo "🎯 Backend ejecutándose en el puerto 5000"
