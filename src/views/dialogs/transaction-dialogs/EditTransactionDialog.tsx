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
// import { type Station } from "@/pages/api/station";
import Swal from "sweetalert2";

// ** Form Imports
import { useForm, Controller } from "react-hook-form";

// ** Query Client Provider
import axios from "axios";
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
  const handleSave = (dataForm: Station) => {
    onSave(dataForm);
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "Station has been updated.",
    });

    onClose();
  };

  // const { data: Stations, isLoading } = useQuery<Station[]>("stations", () => {
  //   return fetch("/api/stations")
  //     .then((res) => res.json())
  //     .then((data) => data);
  // });

  const { data: Stations, isLoading } = useQuery<Station[]>(
    "stations",
    async () => {
      const res = await axios.put("/api/stations");
      const data = res.data;
      return data;
    }
  );

  const { control, reset, handleSubmit, watch, setValue } = useForm();
  const roleWatch = watch("role");

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
          name="location.lat"
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
          name="location.lng"
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
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit(handleSave)}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditStationDialog;
