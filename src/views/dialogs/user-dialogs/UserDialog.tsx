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
import { User } from "@/pages/api/user";
import Swal from "sweetalert2";

//  Icons Imports
import AddIcon from "@mui/icons-material/Add";

//  Form Imports
import { useForm, Controller } from "react-hook-form";

//  Query Client Provider
import axios from "axios";
import { useQuery, useMutation, QueryClient } from "react-query";

type Props = {
  callback?: () => void;
};

export default function UserDialog({ callback }) {
  //ดึงข้อมูลจาก api/stations มาแสดง
  const { data: Stations, isLoading } = useQuery<Station[]>("stations", async () => {
    const res = await fetch("/api/stations");
    const data = await res.json();
    return data;
  });

  // สร้าง queryClient ขึ้นมา เพื่อใช้ในการ invalidateQueries หลังจาก mutate แล้ว จะได้ render ใหม่ แสดงข้อมูลล่าสุด
  const queryClient = new QueryClient();

  // สร้าง mutation ขึ้นมา เพื่อใช้ในการเรียก api/user และ invalidateQueries เพื่อให้ render ใหม่
  const { mutate } = useMutation<User>({
    mutationFn: async (article) => {
      return await axios.post("/api/user", article);
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
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "superadmin",
      station: "",
      password: "",
    });
    setOpen(false);
  };

  const onSubmit = handleSubmit((data: User) => {
    try {
      const payload: User = {
        ...data,
      };
      console.log(payload);

      //@ts-ignore
      mutate(payload);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "User has been added.",
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
        Add User
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Add User</DialogTitle>
        <DialogContent>
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <TextField
                autoFocus
                margin="dense"
                label="First Name"
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
                label="Last Name"
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
                label="Email Address"
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
                label="Phone Number"
                type="text"
                fullWidth
                {...field}
              />
            )}
          />
          <Controller
            name="role"
            control={control}
            defaultValue={" "}
            render={({ field }) => (
              <FormControl fullWidth style={{ marginTop: ".5rem" }}>
                <InputLabel id="select-role">Role</InputLabel>
                <Select
                  labelId="select-role"
                  label="Role"
                  id="select"
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
                  <InputLabel id="select-station">
                    Station
                  </InputLabel>
                  <Select
                    labelId="select-station"
                    label="Station"
                    id="select"
                    defaultValue={"station1"}
                    variant="outlined"
                    {...field}
                  >
                    {Stations?.map((station) => (
                      <MenuItem
                        key={station.stationId}
                        value={station.stationId}
                      >
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
                label="Password"
                type="password"
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
