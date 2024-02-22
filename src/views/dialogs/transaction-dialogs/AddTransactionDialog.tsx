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
import { Station } from "@/pages/api/stations";
// import { Station } from "@/pages/api/user";
import Swal from "sweetalert2";

// ** Icons Imports
import AddIcon from "@mui/icons-material/Add";

// ** Form Imports
import { useForm, Controller } from "react-hook-form";

// ** Query Client Provider
import axios from "axios";
import { useQuery, useMutation, QueryClient } from "react-query";

type Props = {
  callback?: () => void;
};

export default function StationDialog({ callback }) {
  //ดึงข้อมูลจาก api/stations มาแสดง
  const { data: Stations, isLoading } = useQuery<Station[]>("stations", async () => {
    const res = await fetch("/api/stations");
    const data = await res.json();
    return data;
  });

  // สร้าง queryClient ขึ้นมา เพื่อใช้ในการ invalidateQueries หลังจาก mutate แล้ว จะได้ render ใหม่ แสดงข้อมูลล่าสุด
  const queryClient = new QueryClient();

  // สร้าง mutation ขึ้นมา เพื่อใช้ในการเรียก api/user และ invalidateQueries เพื่อให้ render ใหม่
  const { mutate } = useMutation<Station>({
    mutationFn: async (article) => {
      return await axios.post("/api/stations", article);
    },
    onSuccess: async (data) => {
      console.log("data", data); // data is displayed, onSuccess is called
      // refetch data after mutation other queries
      
      await queryClient.refetchQueries(["posts"], { active: true });
      
      if(callback) callback(true);

      handleClose();
    },
  });

  const { control, reset, handleSubmit, watch, setValue } = useForm();

  const roleWatch = watch("role");

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    reset({
      name: "",
      location: {
        lat: "",
        lng: "",
      },
      status: "online",
      created: "",
    });
    setOpen(false);
  };

  const onSubmit = handleSubmit((data: Station) => {
    try {
      const payload: Station = {
        ...data,
      };
      console.log(payload);

      //@ts-ignore
      mutate(payload);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Station has been added.",
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong.",
      });
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
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={onSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
