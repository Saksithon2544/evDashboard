// ** React Imports
import { useState, Fragment, ChangeEvent, MouseEvent, ReactNode } from "react";

// ** Next Imports
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import axios from "@/libs/Axios";

// ** MUI Components
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
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
import Swal from "sweetalert2";

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

const VerifyPage = () => {
  const router = useRouter();
  const { email } = router.query;

  // ** States
  interface State {
    otp: string;
    email: string;
  }

  const [values, setValues] = useState<State>({
    otp: "",
    email: "",
  });

  // ** Hook
  const theme = useTheme();

  const handVerify = async () => {
    console.log("Verify");
    try {
      const response = axios.post("/verify-otp/", {
        otp: values.otp,
        email: email,
      });

      if ((await response).status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Email verified successfully",
        });
        router.push("/");
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${(await response).data.detail}`,
        });
      }

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
              Verify your email 📨
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
                  id="otp"
                  type="text"
                  label="Enter OTP"
                  fullWidth
                  sx={{ marginBottom: 4 }}
                  value={values.otp}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setValues({ ...values, otp: e.target.value })
                  }
                />
              </Grid>
            </Grid>

            <Typography
              sx={{
                mb: 8,
                textAlign: "center",
                color: theme.palette.text.secondary,
              }}
            >
              We have sent an OTP to your email "<span style={{ color: 'red' }}>{email}</span>". Please enter the OTP
              to verify your email.
            </Typography>

            <FormControlLabel
              control={<Checkbox />}
              label={
                <Fragment>
                  <span>I agree to </span>
                  <Link href="/" passHref>
                    <LinkStyled
                      onClick={(e: MouseEvent<HTMLElement>) =>
                        e.preventDefault()
                      }
                    >
                      privacy policy & terms
                    </LinkStyled>
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
              onClick={handVerify}
            >
              Verify
            </Button>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            ></Box>
          </FormControl>
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
    </Box>
  );
};

VerifyPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;

export default VerifyPage;
