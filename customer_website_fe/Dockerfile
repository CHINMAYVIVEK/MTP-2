FROM node:18-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN apk add --no-cache curl && npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 8503
CMD ["serve", "-s", "dist", "-l", "8503", "--cors"]
