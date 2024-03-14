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
import { type User } from "@/interfaces/User.interface";
// import { Transaction } from "@/pages/api/user";
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

type FormData = {
  user_id: string;
  amount: number;
  // Transaction_id: string;
};

export default function TransactionDialog({ callback }) {
  const { control, reset, handleSubmit, watch, setValue } = useForm();

  const roleWatch = watch("role");

  const [open, setOpen] = React.useState(false);

  const { data: users } = useQuery<User[]>("users", async () => {
    const res = await axios.get("/users");
    return res.data;
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    reset({
      user_id: "",
      Transaction_id: "",
    });
    setOpen(false);
  };

  const onSubmit = handleSubmit(async (data: FormData) => {
    try {
      handleClose();

      Swal.fire({
        title: "Please wait...",
        text: "Top up processing",
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
        },
      });

      // console.log(data);

      await axios.put(`/users/${data.user_id}/topup?amount=${data.amount}`);

      await Swal.fire({
        title: "Success",
        text: "Top up success",
        icon: "success",
      });

      callback();

      Swal.close();
    } catch (error) {
      Swal.fire("Error", "Failed to Top up", "error");
    }
  });

  React.useEffect(() => {
    if (roleWatch !== "adminTransaction") {
      setValue("Transaction", "");
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
        Top up
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Top up</DialogTitle>
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
                  {users?.map((user) => (
                    <MenuItem value={user.id}>
                      {user.email} [{user.firstName} {user.lastName}]
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <TextField
                margin="dense"
                label="Amount"
                type="number"
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
