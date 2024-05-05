import React, { useState, useEffect } from "react";
import axios from "@/libs/Axios";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { User as UserData } from "@/interfaces/User.interface";
import { useQuery } from "react-query";
import Swal from "sweetalert2";


const PermissionRequestForm = () => {
  const [role, setRole] = useState<string>('user');
  const [error, setError] = useState<string | null>(null);

  const {
    data: User,
    isLoading,
    refetch,
  } = useQuery<UserData>("users", async () => {
    const res = await axios.get("/user/me");
    const user = await res.data;
    return user;
  });


  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    setRole(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      await axios.post("/permission/request", {
        role,
      });
      Swal.fire("Success", "Request submitted successfully", "success");
      refetch();
    } catch (error) {
      setError(error.response.data.message);
    }
  }


  return (
    <Card>
      <CardHeader
        title="System for requesting rights to service providers of electric vehicle charging stations"
        titleTypographyProps={{ variant: "h6" }}
      />
      <Divider sx={{ margin: 0 }} />
      <CardContent>
        {isLoading ? (
          <Typography variant="body2">Loading...</Typography>
        ) : error ? (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        ) : (
          <form onSubmit={(e) => e.preventDefault()}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  1. Account Details
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="email"
                  label="Email"
                  disabled
                  value={User?.email}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  disabled
                  value={User?.phoneNumber}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  disabled
                  value={User?.firstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  disabled
                  value={User?.lastName}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  2. Select Role
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="role">Role</InputLabel>
                  <Select
                    labelId="role"
                    id="role"
                    value={role}
                    onChange={handleSelectChange}
                    label="Role"
                  >
                    <MenuItem value="stationadmin">
                     Service Provider / Station Admin
                    </MenuItem>
                    <MenuItem value="user">User</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </form>
        )}
      </CardContent>
      <Divider sx={{ margin: 0 }} />
      <CardActions>
        <Button size="large" type="submit" sx={{ mr: 2 }} variant="contained"
        onClick={handleSubmit}>
          Submit
        </Button>
        <Button size="large" color="secondary" variant="outlined">
          Cancel
        </Button>
      </CardActions>
    </Card>
  );
};

export default PermissionRequestForm;
