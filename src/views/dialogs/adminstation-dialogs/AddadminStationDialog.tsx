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
import { type Station, User, Admin } from "@/interfaces/Adminstation.interface";
// import { Station } from "@/pages/api/user";
import Swal from "sweetalert2";

// ** Icons Imports
import AddIcon from "@mui/icons-material/Add";

// ** Form Imports
import { useForm, Controller } from "react-hook-form";

// ** Query Client Provider
import axios from "@/libs/Axios";
import { useQuery, useMutation, QueryClient } from "react-query";
import { ok } from "assert";

type Props = {
  stationId: string;
  callback?: () => void;
};

type FormData = {
  user_id: string;
  station_id: string;
};

export default function StationDialog({ callback, stationId }: Props) {
  const { control, reset, handleSubmit, watch, setValue } = useForm();

  const roleWatch = watch("role");

  const [open, setOpen] = React.useState(false);

  const { data: users } = useQuery<User[]>("users", async () => {
    const res = await axios.get("/super_admin/users?limit=1000");
    return res.data;
  });

  const { data: stations } = useQuery<Station[]>("stations", async () => {
    const res = await axios.get("/station/?limit=1000");
    return res.data;
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    reset({
      user_id: "",
      // station_id: "",
    });
    setOpen(false);
  };

  const onSubmit = handleSubmit(async (data: FormData) => {
    try {
      handleClose();

      Swal.fire({
        title: "Please wait...",
        text: "Adding Admin Station",
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
        },
      });

      await axios.post(`/station_admin/${stationId}/admins/${data.user_id}`);

      await Swal.fire({
        title: "Success",
        text: "Admin Station added successfully",
        icon: "success",
      });

      callback();

      Swal.close();
    } catch (error) {
      Swal.fire("Error", "Failed to add station", "error");
    }
  });

  React.useEffect(() => {
    if (roleWatch !== "stationadmin") {
      setValue("station", "");
    }
  }, [roleWatch]);

  return (
    <React.Fragment>
      <Button
        variant="contained"
        sx={{ marginBottom: 7 }}
        onClick={handleClickOpen}
        startIcon={<AddIcon />}
      >
        Admin Station
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Add Admin Station</DialogTitle>
        <DialogContent>
          <Controller
            name="user_id"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth margin="dense">
                <InputLabel id="user_id">User</InputLabel>
                <Select
                  labelId="user_id"
                  label="user_id"
                  variant="outlined"
                  {...field}
                >
                  {users?.map(
                    (user) =>
                      (user?.role === "adminstation" || user?.role === "stationadmin" ||
                        user?.role === "superadmin") && (
                        <MenuItem key={user.id} value={user.id}>
                          {`${user.email} [${user.firstName} ${user.lastName}]`}
                        </MenuItem>
                      )
                  )}
                </Select>
              </FormControl>
            )}
          />

          {/* <Controller
            name="station_id"
            control={control}
            defaultValue={""}
            render={({ field }) => (
              <FormControl fullWidth margin="dense">
                <InputLabel id="station_id">station</InputLabel>
                <Select
                  labelId="station_id"
                  label="station_id"
                  variant="outlined"
                  {...field}
                >
                  {stations?.map((station) => (
                    <MenuItem value={station.id}>{station.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          /> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={onSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
