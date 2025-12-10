# Role-Based Access Control Implementation Summary

## Mục Tiêu Đã Đạt Được

Triển khai thành công hệ thống phân quyền dựa trên vai trò (RBAC) ở front-end, đồng bộ với `SecurityConfig.java` từ back-end.

## Các Yêu Cầu Đã Hoàn Thành

### ✅ 1. Đọc vai trò (role) từ JWT

**Đã triển khai:**
- File `src/utils/jwtUtils.js` với các hàm decode JWT token
- Hàm `decodeJWT()` - giải mã JWT token với xử lý padding đúng chuẩn
- Hàm `getRolesFromToken()` - lấy danh sách roles từ token
- Hàm `getUserFromToken()` - lấy thông tin user từ token
- Hàm `isTokenExpired()` - kiểm tra token có hết hạn không

**Cách sử dụng:**
```javascript
import { getUserFromToken } from "utils/jwtUtils";

const user = getUserFromToken(token);
console.log(user.roles); // ["CAN_BO"] hoặc []
```

**Lưu trữ:**
- Token được lưu trong `localStorage` với key `"token"`
- Thông tin user (bao gồm roles) được lưu trong `localStorage` với key `"user"`
- AuthContext quản lý state authentication toàn ứng dụng

### ✅ 2. Bảo vệ Route (Route Guarding)

**Đã triển khai:**
- Component `ProtectedRoute` bảo vệ các routes
- Cấu hình routes với `requireAuth` và `requiredRole` trong `routes.js`
- Tự động redirect đến `/authentication/sign-in` nếu chưa đăng nhập
- Tự động redirect đến `/forbidden` nếu không có quyền

**Routes được bảo vệ:**

| Route | Yêu Cầu | Mô Tả |
|-------|---------|-------|
| `/xu-ly-phan-anh` | CAN_BO | Xử lý nội bộ phản ánh |
| `/phan-hoi` | CAN_BO | Phản hồi kết quả cho dân |
| `/quan-ly-phan-anh` | CAN_BO | Quản lý tổng quan phản ánh |
| `/gui-phan-anh` | Đăng nhập | Gửi phản ánh mới |
| `/lich-su-phan-anh` | Đăng nhập | Xem lịch sử phản ánh |

**Cách sử dụng:**
```javascript
import ProtectedRoute from "components/ProtectedRoute";

// Bảo vệ route yêu cầu CAN_BO
<Route path="/admin" element={
  <ProtectedRoute requiredRole="CAN_BO">
    <AdminPanel />
  </ProtectedRoute>
} />
```

### ✅ 3. Hiển thị UI có điều kiện

**Đã triển khai:**
- Component `RoleBasedRender` để ẩn/hiện UI elements
- Sidenav tự động lọc menu items dựa trên role
- Navbar hiển thị thông tin user và role
- Nút logout trong user menu

**Sidenav (Menu điều hướng):**
- Ẩn "Đăng Nhập" và "Đăng Ký" khi đã đăng nhập
- Hiện "Đăng Nhập" và "Đăng Ký" khi chưa đăng nhập
- Chỉ hiển thị menu CAN_BO cho người có quyền
- Chỉ hiển thị menu yêu cầu authentication cho user đã đăng nhập

**Navbar (Thanh trên):**
- Hiển thị icon account với menu dropdown
- Menu chứa CCCD và vai trò của user
- Nút "Đăng Xuất" để logout
- Ẩn chuông thông báo khi chưa đăng nhập

**Cách sử dụng:**
```javascript
import RoleBasedRender from "components/RoleBasedRender";

// Hiển thị chỉ cho CAN_BO
<RoleBasedRender requiredRole="CAN_BO">
  <MDButton>Phân Công</MDButton>
</RoleBasedRender>

// Hiển thị chỉ cho user đã đăng nhập
<RoleBasedRender requireAuth>
  <MDButton>Xem Chi Tiết</MDButton>
</RoleBasedRender>
```

## Cấu Trúc File

```
src/
├── utils/
│   └── jwtUtils.js                 # JWT decoding utilities
├── services/
│   └── authService.js              # Authentication & authorization functions
├── components/
│   ├── ProtectedRoute/
│   │   └── index.js                # Route protection component
│   └── RoleBasedRender/
│       └── index.js                # Conditional UI rendering
├── layouts/
│   └── forbidden/
│       └── index.js                # 403 Forbidden page
├── examples/
│   ├── Sidenav/
│   │   └── index.js                # Modified: Role-based menu filtering
│   └── Navbars/
│       └── DashboardNavbar/
│           └── index.js            # Modified: User menu with logout
├── context/
│   └── authContext.js              # Enhanced: Authentication context
├── routes.js                       # Modified: Added role requirements
└── App.js                          # Modified: Integrated ProtectedRoute
```

## Các Hàm Tiện Ích

### authService.js

| Hàm | Mô Tả |
|-----|-------|
| `layRoles()` | Lấy danh sách roles của user hiện tại |
| `coRole(role, user?)` | Kiểm tra user có role cụ thể không |
| `laCanBo()` | Kiểm tra user có phải CAN_BO không |
| `taoUserTuJWTResponse(response)` | Tạo user object từ JWT response |
| `layTenHienThiRole(roles)` | Lấy tên hiển thị role (tiếng Việt) |
| `kiemTraDaDangNhap()` | Kiểm tra user đã đăng nhập chưa |

### jwtUtils.js

| Hàm | Mô Tả |
|-----|-------|
| `decodeJWT(token)` | Giải mã JWT token thành payload |
| `getRolesFromToken(token)` | Lấy roles từ JWT token |
| `getUserFromToken(token)` | Lấy thông tin user từ JWT token |
| `isTokenExpired(token)` | Kiểm tra token có hết hạn không |

## Luồng Hoạt Động

### 1. Đăng Nhập
```
User nhập CCCD + Password
    ↓
Backend trả về JWT token + roles
    ↓
Token lưu vào localStorage
    ↓
Roles decode từ JWT hoặc từ response
    ↓
AuthContext được update
    ↓
Redirect đến /gui-phan-anh
```

### 2. Truy Cập Route Được Bảo Vệ
```
User truy cập route (ví dụ: /quan-ly-phan-anh)
    ↓
ProtectedRoute kiểm tra isAuthenticated
    ↓
Nếu FALSE → Redirect đến /authentication/sign-in
    ↓
Nếu TRUE → Kiểm tra requiredRole (CAN_BO)
    ↓
Nếu không có role → Redirect đến /forbidden
    ↓
Nếu có role → Hiển thị component
```

### 3. Đăng Xuất
```
User click "Đăng Xuất"
    ↓
Token + user info xóa khỏi localStorage
    ↓
AuthContext được reset
    ↓
Redirect đến /authentication/sign-in
```

## Tính Năng Bảo Mật

1. **Token Validation:**
   - Kiểm tra token expiration mỗi khi load trang
   - Tự động đăng xuất khi token hết hạn

2. **Axios Interceptor:**
   - Tự động thêm `Authorization: Bearer <token>` vào mọi request
   - Tự động xử lý lỗi 401 và đăng xuất user

3. **Role Checking:**
   - Kiểm tra role ở nhiều tầng: route, component, UI element
   - Ngăn chặn truy cập trái phép ngay từ UI

4. **Security Scanning:**
   - Đã chạy CodeQL security checker
   - Không phát hiện lỗ hổng bảo mật

## Hướng Dẫn Sử Dụng

Xem file `RBAC_GUIDE.md` để biết chi tiết về:
- Cách sử dụng từng component
- Ví dụ code cụ thể
- Troubleshooting
- Best practices
- Mở rộng hệ thống

## Testing

### Các Trường Hợp Cần Test

1. **Đăng nhập thành công với user thường:**
   - Kiểm tra có thể truy cập /gui-phan-anh
   - Kiểm tra có thể truy cập /lich-su-phan-anh
   - Kiểm tra KHÔNG thể truy cập /quan-ly-phan-anh (redirect /forbidden)

2. **Đăng nhập thành công với CAN_BO:**
   - Kiểm tra có thể truy cập tất cả routes
   - Kiểm tra menu hiển thị đầy đủ các mục CAN_BO
   - Kiểm tra role hiển thị "Cán Bộ" trong user menu

3. **Chưa đăng nhập:**
   - Kiểm tra truy cập route bảo vệ → redirect /authentication/sign-in
   - Kiểm tra menu chỉ hiển thị "Đăng Nhập" và "Đăng Ký"

4. **Token hết hạn:**
   - Kiểm tra tự động đăng xuất
   - Kiểm tra redirect đến trang login

## Notes

- JWT token được lưu trong localStorage (có thể cân nhắc httpOnly cookie để bảo mật hơn trong tương lai)
- Mọi route protection ở front-end chỉ là UI guard, backend vẫn phải validate quyền
- Role format từ backend: `["CAN_BO"]` hoặc `[]`
- Hỗ trợ mở rộng thêm roles mới dễ dàng

## Kết Luận

Hệ thống RBAC đã được triển khai hoàn chỉnh, đáp ứng đầy đủ yêu cầu trong problem statement. Code được tổ chức tốt, dễ bảo trì và mở rộng. Không có lỗ hổng bảo mật được phát hiện.
