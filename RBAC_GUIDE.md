# Hướng Dẫn Sử Dụng Hệ Thống Phân Quyền (RBAC)

## Tổng Quan

Hệ thống phân quyền dựa trên vai trò (Role-Based Access Control) đã được triển khai để đồng bộ với cấu hình `SecurityConfig.java` từ back-end. Hệ thống này đảm bảo rằng:

1. Chỉ người dùng đã đăng nhập mới có thể truy cập các trang yêu cầu xác thực
2. Chỉ người dùng có vai trò `CAN_BO` mới có thể truy cập các trang quản lý
3. Menu điều hướng tự động ẩn/hiện dựa trên quyền của người dùng
4. UI elements có thể ẩn/hiện có điều kiện dựa trên vai trò

## Cấu Trúc Hệ Thống

### 1. JWT Utilities (`src/utils/jwtUtils.js`)

Các hàm tiện ích để giải mã và xử lý JWT token:

```javascript
import { decodeJWT, getRolesFromToken, getUserFromToken, isTokenExpired } from "utils/jwtUtils";

// Giải mã JWT token
const payload = decodeJWT(token);

// Lấy roles từ token
const roles = getRolesFromToken(token);

// Lấy thông tin user từ token
const user = getUserFromToken(token);

// Kiểm tra token hết hạn chưa
const expired = isTokenExpired(token);
```

### 2. Auth Service (`src/services/authService.js`)

Các hàm quản lý authentication và authorization:

```javascript
import { layRoles, coRole, laCanBo } from "services/authService";

// Lấy danh sách roles của user hiện tại
const roles = layRoles();

// Kiểm tra user có role cụ thể không
const hasRole = coRole("CAN_BO");

// Kiểm tra user có phải cán bộ không
const isCBO = laCanBo();
```

### 3. Protected Route Component (`src/components/ProtectedRoute/index.js`)

Component bảo vệ routes yêu cầu authentication hoặc role cụ thể:

```javascript
import ProtectedRoute from "components/ProtectedRoute";

// Bảo vệ route yêu cầu đăng nhập
<ProtectedRoute>
  <MyComponent />
</ProtectedRoute>

// Bảo vệ route yêu cầu role CAN_BO
<ProtectedRoute requiredRole="CAN_BO">
  <AdminComponent />
</ProtectedRoute>
```

### 4. Role-Based Render Component (`src/components/RoleBasedRender/index.js`)

Component để ẩn/hiện UI elements dựa trên role:

```javascript
import RoleBasedRender from "components/RoleBasedRender";

// Hiển thị chỉ khi đã đăng nhập
<RoleBasedRender requireAuth>
  <MDButton>Nút chỉ user đăng nhập thấy</MDButton>
</RoleBasedRender>

// Hiển thị chỉ khi có role CAN_BO
<RoleBasedRender requiredRole="CAN_BO">
  <MDButton>Nút chỉ cán bộ thấy</MDButton>
</RoleBasedRender>

// Hiển thị component thay thế nếu không đủ quyền
<RoleBasedRender 
  requiredRole="CAN_BO"
  fallback={<MDTypography>Bạn không có quyền</MDTypography>}
>
  <AdminPanel />
</RoleBasedRender>
```

## Cấu Hình Routes

### Trong `src/routes.js`:

```javascript
const routes = [
  // Route công khai - không cần đăng nhập
  {
    type: "collapse",
    name: "Đăng Nhập",
    key: "sign-in",
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  
  // Route yêu cầu đăng nhập
  {
    type: "collapse",
    name: "Gửi Phản Ánh",
    key: "gui-phan-anh",
    route: "/gui-phan-anh",
    component: <GuiPhanAnh />,
    requireAuth: true,  // Yêu cầu đăng nhập
  },
  
  // Route yêu cầu role CAN_BO
  {
    type: "collapse",
    name: "Quản Lý Chung",
    key: "quan-ly-phan-anh",
    route: "/quan-ly-phan-anh",
    component: <QuanLyPhanAnh />,
    requireAuth: true,
    requiredRole: "CAN_BO",  // Yêu cầu role CAN_BO
  },
];
```

## Phân Quyền Các Trang

### Trang Công Khai (Không yêu cầu đăng nhập)
- `/authentication/sign-in` - Đăng Nhập
- `/authentication/sign-up` - Đăng Ký
- `/forbidden` - Trang Không Có Quyền (403)

### Trang Yêu Cầu Đăng Nhập
- `/gui-phan-anh` - Gửi Phản Ánh
- `/lich-su-phan-anh` - Lịch Sử Phản Ánh
- `/chi-tiet-phan-anh/:id` - Chi Tiết Phản Ánh

### Trang Yêu Cầu Role CAN_BO
- `/xu-ly-phan-anh` - Cán Bộ Xử Lý (Xử lý nội bộ)
- `/phan-hoi` - Trả Lời Dân (Phản hồi kết quả)
- `/quan-ly-phan-anh` - Quản Lý Chung (Dashboard tổng quan)

## Tính Năng UI

### 1. Sidenav (Menu Điều Hướng)
- Tự động ẩn menu item "Đăng Nhập" và "Đăng Ký" khi đã đăng nhập
- Tự động hiện menu item "Đăng Nhập" và "Đăng Ký" khi chưa đăng nhập
- Chỉ hiển thị menu item yêu cầu `CAN_BO` cho người dùng có role đó
- Chỉ hiển thị menu item yêu cầu authentication cho người dùng đã đăng nhập

### 2. Navbar (Thanh Điều Hướng Trên)
- Hiển thị thông tin CCCD và vai trò của người dùng
- Nút "Đăng Xuất" để đăng xuất khỏi hệ thống
- Ẩn chuông thông báo khi chưa đăng nhập
- Hiển thị icon đăng nhập khi chưa xác thực

### 3. Trang Forbidden (403)
- Hiển thị khi người dùng cố truy cập trang không có quyền
- Cung cấp nút "Về Trang Chủ" và "Quay Lại"
- Giải thích rõ lý do không có quyền truy cập

## Ví Dụ Sử Dụng Trong Component

### Ẩn/hiện button dựa trên role:

```javascript
import RoleBasedRender from "components/RoleBasedRender";
import MDButton from "components/MDButton";

function MyComponent() {
  return (
    <div>
      {/* Button này chỉ CAN_BO thấy */}
      <RoleBasedRender requiredRole="CAN_BO">
        <MDButton variant="gradient" color="success">
          Phân Công Xử Lý
        </MDButton>
      </RoleBasedRender>
      
      {/* Button này ai đã đăng nhập đều thấy */}
      <RoleBasedRender requireAuth>
        <MDButton variant="outlined" color="info">
          Xem Thông Tin
        </MDButton>
      </RoleBasedRender>
    </div>
  );
}
```

### Kiểm tra role trong logic:

```javascript
import { laCanBo, coRole } from "services/authService";

function MyComponent() {
  const handleAction = () => {
    if (laCanBo()) {
      // Logic cho cán bộ
      console.log("Người dùng là cán bộ");
    } else {
      // Logic cho người dân
      console.log("Người dùng là người dân");
    }
  };
  
  // Hoặc kiểm tra role cụ thể
  if (coRole("CAN_BO")) {
    // Có role CAN_BO
  }
}
```

## Luồng Xác Thực

1. **Đăng Nhập:**
   - User nhập CCCD và mật khẩu
   - Backend trả về JWT token kèm thông tin roles
   - Token được lưu vào localStorage
   - Roles được decode từ JWT và lưu vào AuthContext
   - User được chuyển đến trang `/gui-phan-anh`

2. **Kiểm Tra Quyền:**
   - Mỗi khi truy cập route, `ProtectedRoute` kiểm tra authentication
   - Nếu chưa đăng nhập → chuyển đến `/authentication/sign-in`
   - Nếu không có role yêu cầu → chuyển đến `/forbidden`
   - Nếu đủ điều kiện → hiển thị trang

3. **Đăng Xuất:**
   - User click "Đăng Xuất" trong menu user
   - Token và user info bị xóa khỏi localStorage
   - AuthContext được reset
   - User được chuyển đến trang đăng nhập

## Lưu Ý Quan Trọng

1. **Token Expiration:** Token được kiểm tra hết hạn mỗi khi load trang. Nếu hết hạn, user sẽ bị đăng xuất tự động.

2. **Role Format:** Backend Spring Security trả về roles trong JWT với format: `["CAN_BO"]` hoặc `["USER"]`

3. **Axios Interceptor:** Token tự động được thêm vào header `Authorization: Bearer <token>` cho mọi request API.

4. **401 Handling:** Khi nhận response 401 từ backend, user tự động bị đăng xuất và chuyển đến trang đăng nhập.

## Bảo Mật

- JWT token được lưu trong localStorage (có thể cân nhắc dùng httpOnly cookie để bảo mật hơn)
- Mọi route protection chỉ là UI guard, backend vẫn phải validate quyền
- Token expiration được kiểm tra ở client-side để UX tốt hơn
- Không nên lưu thông tin nhạy cảm trong JWT payload

## Mở Rộng

Để thêm role mới hoặc permission mới:

1. Thêm role vào backend Spring Security
2. Cập nhật JWT payload để include role mới
3. Thêm route với `requiredRole` trong `routes.js`
4. Sử dụng `RoleBasedRender` để ẩn/hiện UI elements mới

## Troubleshooting

**Vấn đề:** Đã đăng nhập nhưng vẫn bị chuyển đến trang login
- Kiểm tra token có tồn tại trong localStorage không
- Kiểm tra token có hết hạn không với `isTokenExpired()`
- Kiểm tra AuthContext có được khởi tạo đúng không

**Vấn đề:** Có role CAN_BO nhưng vẫn bị redirect đến /forbidden
- Kiểm tra format roles trong user object: `user.roles`
- Kiểm tra JWT payload có chứa roles không
- Verify backend có trả về đúng roles trong response không

**Vấn đề:** Menu không ẩn/hiện đúng theo role
- Clear localStorage và đăng nhập lại
- Kiểm tra Sidenav component có sử dụng AuthContext không
- Kiểm tra route config có đúng `requiredRole` không
