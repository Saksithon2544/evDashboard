// ** React Imports
import { useState, ElementType, ChangeEvent, useEffect } from "react";
import { Controller, useForm } from "react-hook-form"; // Import Controller and useForm from react-hook-form

// ** MUI Imports
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";

import Button, { ButtonProps } from "@mui/material/Button";

import { User as UserData } from "@/interfaces/User.interface";
import axios from "@/libs/Axios";
import React from "react";

const ImgStyled = styled("img")(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius,
}));

const ButtonStyled = styled(Button)<
  ButtonProps & { component?: ElementType; htmlFor?: string }
>(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    textAlign: "center",
  },
}));

const ResetButtonStyled = styled(Button)<ButtonProps>(({ theme }) => ({
  marginLeft: theme.spacing(4.5),
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    marginLeft: 0,
    textAlign: "center",
    marginTop: theme.spacing(4),
  },
}));

type TabAccountProps = {
  User?: UserData;
  onSaved?: (data: UserData) => void;
};

const TabAccount = ({ User, onSaved }: TabAccountProps) => {
  const { control, handleSubmit, reset } = useForm();
  const [imgSrc, setImgSrc] = React.useState<string | null>(null); // Initialize as null
  const [loading, setLoading] = React.useState(true); // Initialize as true

  const onChange = (file: ChangeEvent) => {
    const reader = new FileReader();
    const { files } = file.target as HTMLInputElement;
    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result as string);
      reader.readAsDataURL(files[0]);
    }
  };

  const onSubmit = (data: UserData) => {
    onSaved({ ...data, avatar_img_b64: imgSrc }); // เพิ่ม imgSrc เข้าไปในข้อมูลที่ส่งไปยัง API
  };

  React.useEffect(() => {
    if (User) {
      reset(User);
    }
  }, [User, reset]);

  React.useEffect(() => {

    setImgSrc(axios.defaults.baseURL + `/image/${User?.id}`);
  }, []);

  return (
    <CardContent>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={7}>
          <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {imgSrc && (
                <ImgStyled
                  src={imgSrc}
                  alt="Profile Pic"
                  onLoad={() => setLoading(false)}
                />
              )}
              <Box>
                <ButtonStyled
                  component="label"
                  variant="contained"
                  htmlFor="account-settings-upload-image"
                >
                  Upload New Photo
                  <input
                    hidden
                    name="avatar_img_b64"
                    type="file"
                    onChange={onChange} // เพิ่ม onChange ให้กับ input file
                    accept="image/png, image/jpeg"
                    id="account-settings-upload-image"
                  />
                </ButtonStyled>

                <ResetButtonStyled
                  color="error"
                  variant="outlined"
                  onClick={() => setImgSrc("/images/avatars/1.png")}
                >
                  Reset
                </ResetButtonStyled>
                <Typography variant="body2" sx={{ marginTop: 5 }}>
                  Allowed PNG or JPEG. Max size of 800K.
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="First Name"
                  placeholder=""
                  autoFocus
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Last Name"
                  placeholder=""
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="email"
              control={control}
              disabled
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="email"
                  label="Email"
                  placeholder=""
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="tel"
                  label="Phone Number"
                  placeholder=""
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  disabled
                  fullWidth
                  label="Role"
                  placeholder=""
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" sx={{ marginRight: 3.5 }}>
              Save Changes
            </Button>
          </Grid>
        </Grid>
      </form>
    </CardContent>
  );
};

export default TabAccount;
