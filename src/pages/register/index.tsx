// ** React Imports
import { useState, Fragment, ChangeEvent, MouseEvent, ReactNode } from "react";

// ** Next Imports
import Link from "next/link";
import Image from "next/image";
import { Router, useRouter } from "next/router";
import axios from "@/libs/Axios";

// ** MUI Components
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
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
import EyeOutline from "mdi-material-ui/EyeOutline";
import EyeOffOutline from "mdi-material-ui/EyeOffOutline";

// ** Configs
import themeConfig from "src/configs/themeConfig";

// ** Layout Import
import BlankLayout from "src/@core/layouts/BlankLayout";

// ** Demo Imports
import FooterIllustrationsV1 from "src/views/pages/auth/FooterIllustration";
import { Grid } from "@mui/material";
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

// ** States
interface State {
  email: string;
  password: string;
  confirmPassword: string;
  showPassword: boolean;
  showconfirmPassword: boolean;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

const RegisterPage = () => {
  
  const [values, setValues] = useState<State>({
    email: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
    showconfirmPassword: false,
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });

  // ** Hook
  const theme = useTheme();
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [e.target.id]: e.target.value,
    });
  }

  const handleSignUp = async (e: MouseEvent) => {
    e.preventDefault();

    try {
      const registerResponse = await axios.post("/register", { ...values });
      const sentOtpResponse = await axios.post("/send-otp/", { email: values.email });

      router.push({
        pathname: "/verify-email",
        query: { email: values.email },
      });

      Swal.fire({
        icon: "success",
        title: "Sign Up Success",
        text: "Please check your email for verification code.",
        showConfirmButton: false,
        timer: 3000,
      });
    } catch (error) {
      console.error("Error signing up:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${error.response.data.detail}`,
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
              Create an account 🚀
            </Typography>
          </Box>
          <FormControl
            fullWidth
            variant="outlined"
            sx={{ marginBottom: 4 }}
            size="small"
          >
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  id="firstName"
                  label="First Name"
                  fullWidth
                  sx={{ marginBottom: 4 }}
                  value={values.firstName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="lastName"
                  label="Last Name"
                  fullWidth
                  sx={{ marginBottom: 4 }}
                  value={values.lastName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="email"
                  type="email"
                  label="Email"
                  fullWidth
                  sx={{ marginBottom: 4 }}
                  value={values.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="phoneNumber"
                  label="Phone Number"
                  fullWidth
                  sx={{ marginBottom: 4 }}
                  value={values.phoneNumber}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="password"
                  type={values.showPassword ? "text" : "password"}
                  label="Password"
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={() =>
                            setValues({
                              ...values,
                              showPassword: !values.showPassword,
                            })
                          }
                        >
                          {values.showPassword ? (
                            <EyeOutline />
                          ) : (
                            <EyeOffOutline />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ marginBottom: 4 }}
                  value={values.password}
                  onChange={handleChange}      
                />

                <TextField
                  id="confirmPassword"
                  type={values.showconfirmPassword ? "text" : "password"}
                  label="Confirm Password"
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={() =>
                            setValues({
                              ...values,
                              showconfirmPassword: !values.showconfirmPassword,
                            })
                          }
                        >
                          {values.showconfirmPassword ? (
                            <EyeOutline />
                          ) : (
                            <EyeOffOutline />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ marginBottom: 4 }}
                  value={values.confirmPassword}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            <FormControlLabel
              control={<Checkbox />}
              label={
                <Fragment>
                  <span>I agree to </span>
                  <Link href="/" passHref>
                    <LinkStyled>privacy policy & terms</LinkStyled>
                  </Link>
                </Fragment>
              }
            />
            <Button
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              sx={{ marginBottom: 7 }}
              onClick={handleSignUp}
            >
              Sign up
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
                Already have an account?
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

RegisterPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;

export default RegisterPage;
