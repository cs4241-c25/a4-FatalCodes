#!/bin/bash
# Install dependencies
npm install

# Build client
cd client
npm install
npm run build
cd ..

# Start server
npm start 