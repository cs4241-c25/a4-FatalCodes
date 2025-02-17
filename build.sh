#!/bin/bash
# Install root dependencies
npm install

# Install client dependencies including dev dependencies
cd client
npm install --include=dev

# Build the client
npm run build

cd ..

# Start is handled by the start command in package.json 