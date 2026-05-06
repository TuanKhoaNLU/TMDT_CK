# TMDT_CK

- Backend: Spring Boot (REST API)
- Frontend: React + Vite

## 1) Yeu cau moi truong

- Java 17 tro len
- Maven 3.9 tro len

Kiem tra nhanh:

```bash
java -version
mvn -version
```

## 2) Chay backend + frontend

Tu thu muc goc project:

```bash
cd D:\TMDT\TMDT_CK
mvn spring-boot:run
```

Lenh tren se tu dong build React trong `frontend/` va serve ban build qua Spring Boot.
Neu chay thanh cong, ung dung se o `http://localhost:8080`.
Toi uu da bat: chi build lai frontend khi file trong `frontend/src`, `frontend/public` hoac cac file cau hinh frontend thay doi.

## 3) Chay frontend React dev mode (tuy chon)

Tu terminal moi:

```bash
cd D:\TMDT\TMDT_CK\frontend
npm install
npm run dev
```

Frontend mac dinh chay o `http://localhost:5173`.
Vite da proxy `/api/*` ve backend `http://localhost:8080`, vi vay can bat backend neu muon goi API that.

## 4) Truy cap ung dung

Mo trinh duyet:

- Frontend React (dev mode): http://localhost:5173/
- Frontend React (Spring Boot serve): http://localhost:8080/
- Backend API: http://localhost:8080/api/products

## 5) Danh sach route giao dien React

- `/` - Card Discovery
- `/login.html` - Login
- `/customize.html` - Customize Order
- `/checkout.html` - Checkout Information
- `/order-history.html` - Order History
- `/order-confirmation.html` - Order Confirmation
- `/profile-settings.html` - Profile Settings
- `/progress-check.html` - Progress Check
- `/wishlist.html` - Wishlist

## 6) API co ban (de test)

- `GET /api/products`
- `GET /api/orders`

Co the test bang trinh duyet hoac Postman:

- http://localhost:8080/api/products
- http://localhost:8080/api/orders

## 7) Build file jar

```bash
mvn clean package
java -jar target/TMDT_CK-0.0.1-SNAPSHOT.jar
```

## 8) Loi thuong gap

- Loi `JAVA_HOME`:
  - Kiem tra bien moi truong Java da tro dung JDK.
- Loi port `8080` dang duoc su dung:
  - Doi port trong file `src/main/resources/application.properties` (vi du `server.port=8081`).
- Maven khong tai duoc dependency:
  - Kiem tra ket noi internet/proxy va chay lai `mvn -U clean package`.
- Frontend khong goi duoc API:
  - Dam bao backend dang chay o port `8080`.
- Frontend van bi build lai sau `mvn clean ...`:
  - Day la hanh vi binh thuong vi `clean` xoa file hash trong `target/`.


## 9) Quy uoc UI

Toan bo mau sac va kich thuoc giao dien da duoc dinh nghia trong `frontend/src/styles.css` bang CSS variables (`:root`).

### Design tokens (hang so)
- Mau: `--color-*` (vi du `--color-action-primary`, `--color-bg-surface`)
- Chu: `--font-*`
- Khoang cach: `--space-*`
- Bo goc / bong: `--radius-*`, `--shadow-*`
- Kich thuoc component: `--nav-height`, `--card-image-height`, `--sidebar-width`

### Component classes dung lai
- Nut: `.btn`, `.btn.ghost`
- The san pham: `.card`, `.card-body`, `.ph`
- Khung noi dung: `.panel`
- Dieu huong: `.site-header`, `.topbar`, `.main-nav`, `.utility-nav`
- Form: `input`, `textarea`

Khi them man hinh moi, uu tien dung lai token + class co san thay vi hardcode mau/kich thuoc.
