#!/bin/bash

if ! command -v node &> /dev/null
then
    echo "Node.js не встановлено. Будь ласка, встановіть Node.js для продовження."
    exit 1
fi

if ! command -v npm &> /dev/null
then
    echo "NPM не встановлено. Будь ласка, встановіть NPM для продовження."
    exit 1
fi

echo "Installing backend dependencies..."
cd backend
npm install
cd ..

echo "Installing frontend dependencies..."
cd frontend/vue-project
npm install
cd ../..

echo "Installation complete!"
