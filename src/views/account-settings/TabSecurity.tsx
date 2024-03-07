// ** React Imports
import { ChangeEvent, MouseEvent, useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

// ** MUI Imports
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";

// ** Icons Imports
import EyeOutline from "mdi-material-ui/EyeOutline";
import EyeOffOutline from "mdi-material-ui/EyeOffOutline";

import { User as UserData } from "@/interfaces/User.interface";
import { on } from "events";

interface State {
  password?: string;
  oldPassword?: string;
  showNewPassword?: boolean;
  confirmPassword?: string;
  showCurrentPassword?: boolean;
  showConfirmNewPassword?: boolean;
}

type TabSecurityProps = {
  User?: UserData;
  onSaved?: (data: State) => void;
};

const TabSecurity = ({ User, onSaved }: TabSecurityProps) => {
  const { control, handleSubmit, reset } = useForm(); // Initialize useForm hook

  // ** States
  const [values, setValues] = useState<State>({
    password: "",
    oldPassword: "",
    showNewPassword: false,
    confirmPassword: "",
    showCurrentPassword: false,
    showConfirmNewPassword: false,
  });

  // Handle Current Password
  const handleCurrentPasswordChange =
    (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };
  const handleClickShowCurrentPassword = () => {
    setValues({ ...values, showCurrentPassword: !values.showCurrentPassword });
  };
  const handleMouseDownCurrentPassword = (
    event: MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  // Handle New Password
  const handleNewPasswordChange =
    (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };
  const handleClickShowNewPassword = () => {
    setValues({ ...values, showNewPassword: !values.showNewPassword });
  };
  const handleMouseDownNewPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  // Handle Confirm New Password
  const handleConfirmNewPasswordChange =
    (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };
  const handleClickShowConfirmNewPassword = () => {
    setValues({
      ...values,
      showConfirmNewPassword: !values.showConfirmNewPassword,
    });
  };
  const handleMouseDownConfirmNewPassword = (
    event: MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const onSubmit = async () => {
    onSaved({
      oldPassword: values.oldPassword,
      password: values.password,
      confirmPassword: values.confirmPassword,
    });
  };

  useEffect(() => {
    // if  (User) {
    //   reset(User);
    // }
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CardContent sx={{ paddingBottom: 0 }}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={6}>
            <Grid container spacing={5}>
              <Grid item xs={12} sx={{ marginTop: 4.75 }}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="account-settings-current-password">
                    Current Password
                  </InputLabel>
                  <OutlinedInput
                    label="Current Password"
                    value={values.oldPassword}
                    id="account-settings-current-password"
                    type={values.showCurrentPassword ? "text" : "password"}
                    onChange={handleCurrentPasswordChange("oldPassword")}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          aria-label="toggle password visibility"
                          onClick={handleClickShowCurrentPassword}
                          onMouseDown={handleMouseDownCurrentPassword}
                        >
                          {values.showCurrentPassword ? (
                            <EyeOutline />
                          ) : (
                            <EyeOffOutline />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sx={{ marginTop: 6 }}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="account-settings-new-password">
                    New Password
                  </InputLabel>
                  <OutlinedInput
                    label="New Password"
                    value={values.password}
                    id="account-settings-new-password"
                    onChange={handleNewPasswordChange("password")}
                    type={values.showNewPassword ? "text" : "password"}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={handleClickShowNewPassword}
                          aria-label="toggle password visibility"
                          onMouseDown={handleMouseDownNewPassword}
                        >
                          {values.showNewPassword ? (
                            <EyeOutline />
                          ) : (
                            <EyeOffOutline />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="account-settings-confirm-new-password">
                    Confirm New Password
                  </InputLabel>
                  <OutlinedInput
                    label="Confirm New Password"
                    value={values.confirmPassword}
                    id="account-settings-confirm-new-password"
                    type={values.showConfirmNewPassword ? "text" : "password"}
                    onChange={handleConfirmNewPasswordChange(
                      "confirmPassword"
                    )}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          aria-label="toggle password visibility"
                          onClick={handleClickShowConfirmNewPassword}
                          onMouseDown={handleMouseDownConfirmNewPassword}
                        >
                          {values.showConfirmNewPassword ? (
                            <EyeOutline />
                          ) : (
                            <EyeOffOutline />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Grid>

          <Grid
            item
            sm={6}
            xs={12}
            sx={{
              display: "flex",
              marginTop: [7.5, 2.5],
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              width={183}
              alt="avatar"
              height={256}
              src="/images/pages/pose-m-1.png"
            />
          </Grid>
        </Grid>
      </CardContent>

      {/* <Divider sx={{ margin: 0 }} /> */}

      <CardContent>
        <Box sx={{ mt: 11 }}>
          <Button variant="contained" sx={{ marginRight: 3.5 }} type="submit">
            Save Changes
          </Button>
          <Button
            type="reset"
            variant="outlined"
            color="secondary"
            onClick={() =>
              setValues({
                ...values,
                oldPassword: "",
                password: "",
                confirmPassword: "",
              })
            }
          >
            Reset
          </Button>
        </Box>
      </CardContent>
    </form>
  );
};
export default TabSecurity;
