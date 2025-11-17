# Stage 1: Build the TypeScript project
FROM node:18-alpine AS build
WORKDIR /app

# Install all dependencies including devDependencies
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build


# Stage 2: Create lightweight production image
FROM node:18-alpine
WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled dist files from build stage
COPY --from=build /app/dist ./dist

EXPOSE 5000

# Start the server
CMD ["node", "dist/server.js"]
