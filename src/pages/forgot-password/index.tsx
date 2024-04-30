// ** React Imports
import { useState, Fragment, ChangeEvent, MouseEvent, ReactNode } from "react";
import router from "next/router";

// ** Next Imports
import Link from "next/link";

// ** MUI Components
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import { styled, useTheme } from "@mui/material/styles";
import MuiCard, { CardProps } from "@mui/material/Card";
import MuiFormControlLabel, {
  FormControlLabelProps,
} from "@mui/material/FormControlLabel";

// ** Configs
import themeConfig from "src/configs/themeConfig";

// ** Layout Import
import BlankLayout from "src/@core/layouts/BlankLayout";

// ** Demo Imports
import FooterIllustrationsV1 from "src/views/pages/auth/FooterIllustration";
import { Grid } from "@mui/material";
import axios from "@/libs/Axios";
import Swal from "sweetalert2";

interface State {
  password: string;
  showPassword: boolean;
}

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up("sm")]: { width: "28rem" },
}));

const LinkStyled = styled("a")(({ theme }) => ({
  fontSize: "0.875rem",
  textDecoration: "none",
  color: theme.palette.primary.main,
}));

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(
  ({ theme }) => ({
    marginTop: theme.spacing(1.5),
    marginBottom: theme.spacing(4),
    "& .MuiFormControlLabel-label": {
      fontSize: "0.875rem",
      color: theme.palette.text.secondary,
    },
  })
);

const ForgotPasswordPage = () => {
  // ** States
  interface State {
    email: string;
  }

  const [values, setValues] = useState<State>({
    email: "",
  });

  // ** Hook
  const theme = useTheme();

  const handleResetPassword = async () => {
    try {
      // ส่งค่าอีเมลไปยัง API สำหรับรีเซ็ตรหัสผ่าน
      const response = await axios.post('/reset_password/?email=', {
        email: values.email,
      });

      // ตรวจสอบว่าส่งคำร้องสำเร็จหรือไม่
      if (response.status === 200) {
        // If the response status is 200 (success)
        Swal.fire({
          // Display a SweetAlert with a success icon
          icon: "success",
          title: "Success!",
          // Include a message indicating success with styled email
          html: `Please check the link. Password reset sent to email <span style="color: red;">${values.email}</span>`,
          confirmButtonColor: "#ff0000", // Set the confirm button color to red
          confirmButtonText: "OK", // Set the text for the confirm button
        }).then(() => {
          router.push("/"); // Redirect the user to the login page
        });
      }
       else {
        // แสดง Swal แจ้งเตือนไม่สำเร็จ
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong. Please try again later.",
        });
      }
    } catch (error) {
      // แสดง Swal แจ้งเตือนเมื่อเกิดข้อผิดพลาดในการส่งคำร้อง
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong. Please try again later.",
      });
    }
  };

  return (
    <Box className="content-center">
      <Card sx={{ zIndex: 1 }}>
        <CardContent
          sx={{ padding: (theme) => `${theme.spacing(12, 9, 7)} !important` }}
        >
          <Box
            sx={{
              mb: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width={35}
              height={29}
              version="1.1"
              viewBox="0 0 30 23"
              xmlns="https://www.w3.org/2000/svg"
              xmlnsXlink="https://www.w3.org/1999/xlink"
            >
              <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <image
                  x="0"
                  y="0"
                  width="35"
                  height="29"
                  xlinkHref="/images/logos/logo.png"
                />
              </g>
            </svg>
            <Typography
              variant="h6"
              sx={{
                ml: 3,
                lineHeight: 1,
                fontWeight: 600,
                textTransform: "uppercase",
                fontSize: "1.5rem !important",
              }}
            >
              {themeConfig.templateName}
            </Typography>
          </Box>
          <Box sx={{ mb: 6, textAlign: "center" }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, marginBottom: 1.5 }}
            >
              Forgot Password 🔐
            </Typography>
          </Box>
          <FormControl
            fullWidth
            variant="outlined"
            sx={{ marginBottom: 4 }}
            size="small"
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  id="email"
                  type="email"
                  label="Email"
                  fullWidth
                  sx={{ marginBottom: 4 }}
                  value={values.email}
                  onChange={(e) =>
                    setValues({ ...values, email: e.target.value })
                  }
                />
              </Grid>
            </Grid>

            <Button
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              sx={{ marginBottom: 7 }}
              onClick={handleResetPassword}
            >
              Send Reset Instructions
            </Button>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <Typography variant="body2" sx={{ marginRight: 2 }}>
                If you change your mind and want to go to
              </Typography>
              <Typography variant="body2">
                <Link passHref href="/">
                  <LinkStyled>Sign in instead</LinkStyled>
                </Link>
              </Typography>
            </Box>
          </FormControl>
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
    </Box>
  );
};

ForgotPasswordPage.getLayout = (page: ReactNode) => (
  <BlankLayout>{page}</BlankLayout>
);

export default ForgotPasswordPage;
function push(arg0: string) {
  throw new Error("Function not implemented.");
}

