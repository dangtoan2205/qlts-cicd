## Chạy dự án sau khi clone images từ Docker Hub

### Bước 1: Clone repository
```bash
docker pull toandnseta/qlts-cicd:latest
cd qlts
```

### Bước 2: 
Tạo file `docker-compose.yml`

```bash
services:
  postgres:
    image: postgres:15-alpine
    container_name: qlts_postgres
    environment:
      POSTGRES_DB: qlts_assets
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backend/database/schema.sql:/docker-entrypoint-initdb.d/01-schema.sql:ro
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d qlts_assets"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s
    networks:
      - qlts_network

  app:
    image: toandnseta/qlts-cicd:latest
    container_name: qlts_app
    environment:
      NODE_ENV: production
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: qlts_assets
      DB_USER: postgres
      DB_PASSWORD: password
      JWT_SECRET: qlts_jwt_secret_key_2024_change_in_production
      PORT: 5000
    ports:
      - "8080:5000"
    depends_on:
      postgres:
        condition: service_healthy
    restart: unless-stopped
    networks:
      - qlts_network

networks:
  qlts_network:
    driver: bridge

volumes:
  postgres_data:
    driver: local
```

### Bước 3: Cài Docker + Compose

> Cài Docker (gói docker.io của Ubuntu)
```bash
sudo apt update
sudo apt install -y docker.io
sudo systemctl enable --now docker
```

> Cài Compose
```bash
sudo add-apt-repository -y universe
sudo apt update
```

```bash
sudo apt install -y docker-compose-v2
```

> Cho user hiện tại chạy docker không cần sudo
```bash
sudo usermod -aG docker $USER
```

> Áp dụng ngay trong phiên shell hiện tại (không cần logout):
```bash
newgrp docker
```

### Bước 4: Chạy Docker Compose
```bash
docker-compose up -d
```

> Nếu có lỗi xảy ra khi kết nối database thì kiểm tra sau khi chạy `docker compose up -d` xong thì truy cập vào đường dẫn hiện tại `backend/database/schema.sql` file `schema.sql` đang là dạng file hay thư mục.

> Nếu là thư mục thì xóa thư mục `schema.sql` này và tạo thành file `schema.sql`

> Cập nhật nội dung file `schema.sql` mới

### Bước 5: Đợi các services khởi động
Kiểm tra trạng thái:
```bash
docker-compose ps
```

Xem logs nếu cần:
```bash
docker-compose logs -f
```

### Bước 6: Truy cập ứng dụng
- **Frontend**: http://localhost
- **Backend API**: http://localhost:5000/api/health

### Tài khoản đăng nhập mặc định
- **Username**: admin
- **Password**: password

## Troubleshooting

### Nếu backend không khởi động được:
```bash
# Xem logs backend
docker-compose logs backend

# Rebuild backend
docker-compose up -d --build backend
```

### Nếu database không kết nối được:
```bash
# Xem logs database
docker-compose logs postgres

# Kiểm tra database đã sẵn sàng
docker-compose exec postgres pg_isready -U postgres
```

### Nếu frontend không hiển thị:
```bash
# Xem logs frontend
docker-compose logs frontend

# Rebuild frontend
docker-compose up -d --build frontend
```

### Xóa tất cả và bắt đầu lại:
```bash
docker-compose down -v
docker-compose up -d --build
```

### Nếu gặp lỗi "Permission denied" với PostgreSQL:
```bash
# Xóa volume cũ và tạo lại
docker-compose down -v
sudo rm -rf postgres_data
docker-compose up -d
```
