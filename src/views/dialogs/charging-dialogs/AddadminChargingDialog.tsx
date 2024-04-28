import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
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
    const res = await axios.get("/super_admin/users");
    return res.data;
  });

  const { data: stations } = useQuery<Station[]>("stations", async () => {
    const res = await axios.get("/station/");
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
        text: "Adding Charging Cabinet",
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
        },
      });

      // await axios.post(`/station_admin/${stationId}/admins/${data.user_id}`);
      await axios.post(`/charging_booth/${stationId}`, data);

      await Swal.fire({
        title: "Success",
        text: "Charging Cabinet added successfully",
        icon: "success",
      });

      callback();

      Swal.close();
    } catch (error) {
      Swal.fire("Error", "Failed to add Charging Cabinet", "error");
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
        Charging Cabinet
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Add Charger</DialogTitle>
        <DialogContent>
          <Controller
            name="booth_name"
            control={control}
            render={({ field }) => (
              <TextField
                margin="dense"
                label="Charger name"
                type="text"
                fullWidth
                {...field}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={onSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
