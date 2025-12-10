/**
 * Forbidden Page (403)
 * Hiển thị khi người dùng không có quyền truy cập
 */

import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

function Forbidden() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/gui-phan-anh");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="error"
          borderRadius="lg"
          coloredShadow="error"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <Icon fontSize="large" color="inherit" sx={{ fontSize: "4rem !important" }}>
            block
          </Icon>
          <MDTypography variant="h3" fontWeight="medium" color="white" mt={2}>
            403 - Không Có Quyền Truy Cập
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Bạn không có quyền truy cập trang này
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox textAlign="center" mb={3}>
            <MDTypography variant="body2" color="text">
              Trang này chỉ dành cho cán bộ có quyền quản lý. Nếu bạn cần quyền truy cập, vui lòng
              liên hệ với quản trị viên hệ thống.
            </MDTypography>
          </MDBox>

          <MDBox display="flex" gap={2} justifyContent="center">
            <MDButton variant="gradient" color="info" onClick={handleGoHome}>
              <Icon sx={{ mr: 1 }}>home</Icon>
              Về Trang Chủ
            </MDButton>
            <MDButton variant="outlined" color="dark" onClick={handleGoBack}>
              <Icon sx={{ mr: 1 }}>arrow_back</Icon>
              Quay Lại
            </MDButton>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Forbidden;
