FROM golang:1.25-alpine AS builder

WORKDIR /workspace
COPY go.mod ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o customer-backend main.go

FROM alpine:3.18
RUN apk add --no-cache ca-certificates
WORKDIR /app
COPY --from=builder /workspace/customer-backend .
EXPOSE 8501
ENTRYPOINT ["./customer-backend"]
