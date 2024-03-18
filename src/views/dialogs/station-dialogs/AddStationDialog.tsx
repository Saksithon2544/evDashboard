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
import { type Station } from "@/interfaces/Station.interface";
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
  callback?: () => void;
};

export default function StationDialog({ callback }) {
  const { control, reset, handleSubmit, watch, setValue } = useForm();

  const roleWatch = watch("role");

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    reset({
      name: "",
      location: [],
      status: "online",
    });
    setOpen(false);
  };

  const onSubmit = handleSubmit(async (data: Station) => {
    try {
      handleClose();

      Swal.fire({
        title: "Please wait...",
        text: "Adding Station",
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
        },
      });

      await axios.post("/station", data);

      await Swal.fire({
        title: "Success",
        text: "Station added successfully",
        icon: "success",
      });

      callback();

      Swal.close();
    } catch (error) {
      Swal.fire("Error", "Failed to add station", "error");
    }
  });

  React.useEffect(() => {
    if (roleWatch !== "adminstation") {
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
        Add Station
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Add Station</DialogTitle>
        <DialogContent>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                autoFocus
                margin="dense"
                label="Name"
                type="text"
                fullWidth
                {...field}
              />
            )}
          />
          <Controller
            name="location[0]"
            control={control}
            render={({ field }) => (
              <TextField
                margin="dense"
                label="Latitude"
                type="text"
                fullWidth
                {...field}
              />
            )}
          />
          <Controller
            name="location[1]"
            control={control}
            render={({ field }) => (
              <TextField
                margin="dense"
                label="Longitude"
                type="text"
                fullWidth
                {...field}
              />
            )}
          />
          <Controller
            name="status"
            control={control}
            defaultValue={"online"}
            render={({ field }) => (
              <FormControl fullWidth margin="dense">
                <InputLabel id="status">Status</InputLabel>
                <Select
                  labelId="status"
                  label="Status"
                  variant="outlined"
                  {...field}
                  onChange={(e: SelectChangeEvent) => {
                    field.onChange(e.target.value);
                  }}
                >
                  <MenuItem value="online">Online</MenuItem>
                  <MenuItem value="offline">Offline</MenuItem>
                </Select>
              </FormControl>
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
