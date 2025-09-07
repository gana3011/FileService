# Base Stage
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# Test Stage  
FROM node:20-alpine AS test
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm test

# Production Stage
FROM node:20-alpine AS production
WORKDIR /app
COPY --from=base /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["npm", "start"]