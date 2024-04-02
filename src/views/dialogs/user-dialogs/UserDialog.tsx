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
import { User } from "@/interfaces/User.interface";
import Swal from "sweetalert2";

//  Icons Imports
import AddIcon from "@mui/icons-material/Add";

//  Form Imports
import { useForm, Controller } from "react-hook-form";


//  Query Client Provider
import axios from "@/libs/Axios";
import { useQuery, useMutation, QueryClient } from "react-query";

type Props = {
  callback?: () => void;
};

export default function UserDialog({ callback }) {

  const queryClient = new QueryClient();

  const { mutate } = useMutation<User>({
    mutationFn: async (article) => {
      return await axios.post("/super_admin/register/user", article);
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
      phoneNumber: "",
      role: "superadmin",
      password: "",
      confirmPassword: "",
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
            name="phoneNumber"
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
                  <MenuItem value={"stationadmin"}>Admin Station</MenuItem>
                  <MenuItem value={"user"}>User</MenuItem>
                </Select>
              </FormControl>
            )}
          />
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
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <TextField
                margin="dense"
                label="Confirm Password"
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
