// ** React Imports
import { ChangeEvent, MouseEvent, ReactNode, useState } from "react";
import axios from "@/libs/Axios";
import { useEffect } from "react";
import Swal from "sweetalert2";
import Image from "next/image";

// ** Next Imports
import Link from "next/link";
import { useRouter } from "next/router";

// ** MUI Components
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled, useTheme } from "@mui/material/styles";
import MuiCard, { CardProps } from "@mui/material/Card";
import InputAdornment from "@mui/material/InputAdornment";
import MuiFormControlLabel, {
  FormControlLabelProps,
} from "@mui/material/FormControlLabel";

// ** Icons Imports
import Google from "mdi-material-ui/Google";
import Github from "mdi-material-ui/Github";
import Twitter from "mdi-material-ui/Twitter";
import Facebook from "mdi-material-ui/Facebook";
import EyeOutline from "mdi-material-ui/EyeOutline";
import EyeOffOutline from "mdi-material-ui/EyeOffOutline";

// ** Configs
import themeConfig from "src/configs/themeConfig";

// ** Layout Import
import BlankLayout from "src/@core/layouts/BlankLayout";

// ** Demo Imports
import FooterIllustrationsV1 from "src/views/pages/auth/FooterIllustration";

interface State {
  username: string;
  password: string;
  showPassword: boolean;
  rememberMe: boolean;
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
    "& .MuiFormControlLabel-label": {
      fontSize: "0.875rem",
      color: theme.palette.text.secondary,
    },
  })
);

const LoginPage = () => {
  // ** State
  const [values, setValues] = useState<State>({
    username: "",
    password: "",
    showPassword: false,
    rememberMe: false,
  });

  // ** Hook
  const theme = useTheme();
  const router = useRouter();

  const handleChange =
    (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleRememberMeChange = () => {
    setValues({ ...values, rememberMe: !values.rememberMe });
    if (!values.rememberMe) {
      localStorage.setItem("remembered_username", values.username);
      localStorage.setItem("remembered_password", values.password);
    } else {
      localStorage.removeItem("remembered_username");
      localStorage.removeItem("remembered_password");
    }
  };

  const handleLogin = async () => {
    if (!values.username || !values.password) {
      Swal.fire({
        icon: "error",
        title: "Login Error",
        text: "Please enter your username and password.",
      });
      return;
    }

    // แสดงอนิเมชัน Loading ด้วย Swal
    Swal.fire({
      title: "Logging in...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await axios.post(
        "/token",
        new URLSearchParams({
          username: values.username,
          password: values.password,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.status === 200) {
        const { access_token, token_type } = response.data;

        // Call API to get user data
        const userResponse = await axios.get("/user/me", {
          headers: {
            Authorization: `${token_type} ${access_token}`,
          },
        });

        console.log(userResponse.data.role);
        console.log(userResponse.data.is_verify);

        // Find user with 'admin' or 'superadmin' role from the response
        const adminUser =
          userResponse.data.role === "stationadmin" ||
          userResponse.data.role === "superadmin" ||
          userResponse.data.role === "user";
        
      


        // Check if adminUser is found
        if (!adminUser) {
          Swal.fire({
            icon: "error",
            title: "Access Denied",
            text: "You do not have permission to access this page.",
          });
          return; // Exit function if role is not appropriate
        } 

        // Store the token in local storage
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("token_type", token_type);
        localStorage.setItem("role", userResponse.data.role);

        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "You have been logged in successfully.",
        });

        // Redirect to the dashboard page
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error occurred while logging in:", error);
      console.log("Error response:", error.response); // Assuming the server returns an error message
      Swal.fire({
        icon: "error",
        title: "Login Error",
        text: `${error.response.data.detail}`,
      });

      if (error.response.data.detail === "User not verified") {
        axios.post("/send-otp/", {
          email: values.username,
        });
        router.push("/verify-email?email=" + values.username);
      }
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const tokenType = localStorage.getItem("token_type");
    const rememberedUsername = localStorage.getItem("remembered_username");
    const rememberedPassword = localStorage.getItem("remembered_password");
    if (accessToken && tokenType) {
      (async () => {
        try {
          const response = await axios.get("/user/me", {
            headers: {
              Authorization: `${tokenType} ${accessToken}`,
            },
          });
          const { role } = response.data;
          const isAdmin = role === "stationadmin" || role === "superadmin" ;
          if (isAdmin) {
            router.push("/dashboard");
          }
        } catch (error) {
          console.error("Error checking user role:", error);
        }
      })();
    }
    if (rememberedUsername && rememberedPassword) {
      setValues({
        ...values,
        username: rememberedUsername,
        password: rememberedPassword,
        rememberMe: true,
      });
    }
  }, []);

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
            <Image
              src="/images/logos/kmutnb.png"
              alt="Logo"
              width={200}
              height={196}
              priority
            />

            <Typography
              variant="h6"
              sx={{
                ml: 3,
                lineHeight: 1,
                fontWeight: 600,
                textTransform: "uppercase",
                fontSize: "1.5rem !important",
              }}
            ></Typography>
          </Box>
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
              Sign in ⛽
            </Typography>
          </Box>
          <form
            noValidate
            autoComplete="off"
            onSubmit={(e) => e.preventDefault()}
            id="login-form" // เพิ่ม ID ฟอร์ม
          >
            <TextField
              autoFocus
              fullWidth
              id="username"
              label="Username"
              sx={{ marginBottom: 4 }}
              value={values.username} // Use state value for username
              autoComplete="username"
              onChange={handleChange("username")}
            />
            <FormControl fullWidth>
              <InputLabel htmlFor="auth-login-password">Password</InputLabel>
              <OutlinedInput
                label="Password"
                value={values.password} // Use state value for password
                autoComplete="current-password"
                id="auth-login-password"
                onChange={handleChange("password")}
                type={values.showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      aria-label="toggle password visibility"
                    >
                      {values.showPassword ? <EyeOutline /> : <EyeOffOutline />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>

            <Box
              sx={{
                mb: 4,
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={values.rememberMe}
                    onChange={handleRememberMeChange}
                  />
                }
                label="Remember Me"
              />
              <Link passHref href="/forgot-password">
                <LinkStyled>Forgot Password?</LinkStyled>
              </Link>
            </Box>
            <Button
              fullWidth
              size="large"
              variant="contained"
              sx={{ marginBottom: 7 }}
              onClick={handleLogin} // คำสั่งให้ปุ่ม Login เรียกใช้ฟังก์ชัน handleLogin
              type="submit" // เพิ่มประเภทเป็น submit เพื่อให้ Enter ที่กดบนฟอร์มทำการ Submit ฟอร์ม
              form="login-form" // เชื่อมโยงปุ่มกับฟอร์ม
            >
              Login
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
                If you don't have an account yet?
              </Typography>
              <Typography variant="body2">
                <Link passHref href="/register">
                  <LinkStyled>Create an account</LinkStyled>
                </Link>
              </Typography>
            </Box>
          </form>
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
    </Box>
  );
};

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;

export default LoginPage;
