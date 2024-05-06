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

import { type Charging } from "@/interfaces/Station.interface";
import Swal from "sweetalert2";

// ** Form Imports
import { useForm, Controller } from "react-hook-form";

// ** Query Client Provider
import axios from "@/libs/Axios";
import { useQuery, useMutation, QueryClient } from "react-query";

type EditStationDialogProps = {
  station: Charging;
  onClose?: () => void;
  onSave?: (updatedStation: Charging) => void;
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

  const handleSave = async (dataForm: any) => {
    try {
      setIsLoading(true);
      await axios.put(`/charging_booth/${dataForm.booth_id}?booth_name=${dataForm.booth_name}&station_id=${dataForm.station_id}`, dataForm);


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
        text: "Name already exists. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
    onClose();
  };

  React.useEffect(() => {
    if (station) {
      reset({
        booth_id: station.booth_id,
        booth_name: station.booth_name,
        station_id: station.station_id,
      });
    }
  }
  , [station]);

  return (
    <Dialog  open={station ? true : false} onClose={onClose} maxWidth="md" fullWidth>
      {/* Dialog content */}
      <DialogTitle>Edit Charger</DialogTitle>
      <DialogContent>
        <Controller
          name="booth_name"
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">Cancel</Button>
        <Button onClick={handleSubmit(handleSave)}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditStationDialog;
