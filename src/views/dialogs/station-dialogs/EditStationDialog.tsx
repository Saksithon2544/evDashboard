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
import Swal from "sweetalert2";

// ** Form Imports
import { useForm, Controller } from "react-hook-form";

// ** Query Client Provider
import axios from "@/libs/Axios";
import { useQuery, useMutation, QueryClient } from "react-query";

type EditStationDialogProps = {
  station: Station;
  onClose?: () => void;
  onSave?: (updatedStation: Station) => void;
};

const EditStationDialog: React.FC<EditStationDialogProps> = ({
  station,
  onClose,
  onSave,
}) => {
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors }, // เพิ่มตรงนี้
  } = useForm(); // เพิ่มตรงนี้

  const [isLoading, setIsLoading] = React.useState(false);

  const handleSave = async (dataForm: Station) => {
    try {
      setIsLoading(true);

      await axios.put(`/station/${station.id}`, dataForm);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Station has been updated.",
      });

      onSave(dataForm);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error,
      });
    } finally {
      setIsLoading(false);
    }
    onClose();
  };

  React.useEffect(() => {
    if (station) {
      reset(station);
    }
  }, [station]);

  return (
    <Dialog open={station ? true : false} onClose={onClose}>
      {/* Dialog content */}
      <DialogTitle>Edit Station</DialogTitle>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit(handleSave)}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditStationDialog;
