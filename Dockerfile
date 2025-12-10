# ============================
# 1. Build Frontend
# ============================
FROM node:18-alpine AS build-frontend

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --legacy-peer-deps
COPY frontend .
RUN npm run build


# ============================
# 2. Build Backend
# ============================
FROM node:18-alpine AS build-backend

WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend .

# Copy frontend build vào backend/public
COPY --from=build-frontend /app/frontend/build ./public

EXPOSE 5000

CMD ["npm", "start"]
