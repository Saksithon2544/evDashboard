import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { type Station } from "@/pages/api/stations";
import { type User } from "@/pages/api/user";
import Swal from "sweetalert2";

// ** Form Imports
import { useForm, Controller } from "react-hook-form";

// ** Query Client Provider
import axios from "@/libs/Axios";
import { useQuery, useMutation, QueryClient } from "react-query";

type EditUserDialogProps = {
  user: User;
  onClose?: () => void;
  onSave?: (updatedUser: User) => void;
};

const EditUserDialog: React.FC<EditUserDialogProps> = ({
  user,
  onClose,
  onSave,
}) => {
  const handleSave = (dataForm: User) => {
    onSave(dataForm);
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "User has been updated.",
    });

    onClose();
  };

  const { data: Stations, isLoading } = useQuery<Station[]>("stations", () => {
    return axios.get("/stations").then((res) => res.data);
  });

  const { control, reset, handleSubmit, watch, setValue } = useForm();
  const roleWatch = watch("role");

  React.useEffect(() => {
    if (user) {
      reset(user);
    }
  }, [user]);

  return (
    <Dialog open={user ? true : false} onClose={onClose}>
      {/* Dialog content */}
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <TextField
              autoFocus
              margin="dense"
              label="First Name*"
              type="text"
              fullWidth
              {...field}
            />
          )}
        />
        <Controller
          name="lastName"
          control={control}
          render={({ field }) => (
            <TextField
              margin="dense"
              label="Last Name*"
              type="text"
              fullWidth
              {...field}
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              margin="dense"
              label="Email Address*"
              type="email"
              fullWidth
              {...field}
            />
          )}
        />
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <TextField
              margin="dense"
              label="Phone Number*"
              type="text"
              fullWidth
              {...field}
            />
          )}
        />
        <Controller
          name="role"
          control={control}
          defaultValue={"superadmin"}
          render={({ field }) => (
            <FormControl fullWidth style={{ marginTop: ".5rem" }}>
              <InputLabel id="demo-simple-select-role">Role*</InputLabel>
              <Select
                labelId="demo-simple-select-role"
                label="Role*"
                id="demo-simple-select"
                variant="outlined"
                {...field}
              >
                <MenuItem value={"superadmin"}>Super Admin</MenuItem>
                <MenuItem value={"adminstation"}>Admin Station</MenuItem>
                <MenuItem value={"user"}>User</MenuItem>
              </Select>
            </FormControl>
          )}
        />
        {roleWatch === "adminstation" && (
          <Controller
            name="station"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth style={{ marginTop: ".5rem" }}>
                <InputLabel id="demo-simple-select-station">
                  Station*
                </InputLabel>
                <Select
                  labelId="demo-simple-select-station"
                  label="Station*"
                  id="demo-simple-select"
                  defaultValue={"station1"}
                  variant="outlined"
                  {...field}
                >
                  {Stations?.map((station) => (
                    <MenuItem key={station.stationId} value={station.stationId}>
                      {station.name} ( {station.location.lat} ,{" "}
                      {station.location.lng})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        )}
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              margin="dense"
              label="Password*"
              type="password"
              fullWidth
              {...field}
            />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit(handleSave)}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserDialog;
