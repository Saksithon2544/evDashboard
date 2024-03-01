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
import Swal from "sweetalert2";

// ** Form Imports
import { useForm, Controller } from "react-hook-form";

// ** Query Client Provider
import axios from "@/libs/Axios";

type EditUserDialogProps = {
  user: User;
  onClose?: () => void;
  onSave?: (bool:boolean) => void;
};

const EditUserDialog: React.FC<EditUserDialogProps> = ({
  user,
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

  const handleSave = async (dataForm: User) => {
    try {
      setIsLoading(true);

      await axios.put(`/users/${user.id}`, dataForm);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "User has been updated.",
      });

      onSave(true);
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
    if (user) {
      reset(user);
    }
  }, [user]);

  return (
    <Dialog open={user ? true : false} onClose={onClose}>
      {/* Dialog content */}
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
        <form>
          <Controller
            name="firstName"
            control={control}
            rules={{ required: "First Name is required" }} // เพิ่ม rules สำหรับ validation
            render={({ field }) => (
              <TextField
                autoFocus
                margin="dense"
                label="First Name"
                type="text"
                fullWidth
                {...field}
                error={!!errors.firstName} // เพิ่มส่วนนี้เพื่อแสดง error หากมีการ validate ไม่ผ่าน
                helperText={errors.firstName ? errors.firstName.message : null} // เพิ่มส่วนนี้เพื่อแสดงข้อความ error
              />
            )}
          />
          <Controller
            name="lastName"
            control={control}
            rules={{ required: "Last Name is required" }} // เพิ่ม rules สำหรับ validation
            render={({ field }) => (
              <TextField
                margin="dense"
                label="Last Name"
                type="text"
                fullWidth
                {...field}
                error={!!errors.lastName} // เพิ่มส่วนนี้เพื่อแสดง error หากมีการ validate ไม่ผ่าน
                helperText={errors.lastName ? errors.lastName.message : null} // เพิ่มส่วนนี้เพื่อแสดงข้อความ error
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            }} // เพิ่ม rules สำหรับ validation
            render={({ field }) => (
              <TextField
                margin="dense"
                label="Email Address"
                type="email"
                fullWidth
                {...field}
                error={!!errors.email} // เพิ่มส่วนนี้เพื่อแสดง error หากมีการ validate ไม่ผ่าน
                helperText={errors.email ? errors.email.message : null} // เพิ่มส่วนนี้เพื่อแสดงข้อความ error
              />
            )}
          />
          <Controller
            name="phoneNumber"
            control={control}
            rules={{ required: "Phone Number is required" }} // เพิ่ม rules สำหรับ validation
            render={({ field }) => (
              <TextField
                margin="dense"
                label="Phone Number"
                type="text"
                fullWidth
                {...field}
                error={!!errors.phoneNumber} // เพิ่มส่วนนี้เพื่อแสดง error หากมีการ validate ไม่ผ่าน
                helperText={
                  errors.phoneNumber ? errors.phoneNumber.message : null
                } // เพิ่มส่วนนี้เพื่อแสดงข้อความ error
              />
            )}
          />
          <Controller
            name="role"
            control={control}
            rules={{ required: "Role is required" }} // เพิ่ม rules สำหรับ validation
            render={({ field }) => (
              <FormControl fullWidth style={{ marginTop: ".5rem" }}>
                <InputLabel id="demo-simple-select-role">Role</InputLabel>
                <Select
                  labelId="demo-simple-select-role"
                  label="Role*"
                  id="demo-simple-select"
                  variant="outlined"
                  {...field}
                  error={!!errors.role} // เพิ่มส่วนนี้เพื่อแสดง error หากมีการ validate ไม่ผ่าน
                  // ในกรณีของ Select component จะไม่มี helperText เนื่องจากมีการแสดงชื่อตัวเลือกไว้แล้ว
                >
                  <MenuItem value={"superadmin"}>Super Admin</MenuItem>
                  <MenuItem value={"adminstation"}>Admin Station</MenuItem>
                  <MenuItem value={"user"}>User</MenuItem>
                </Select>
              </FormControl>
            )}
          />
          <Controller
            name="is_active"
            control={control}
            rules={{ required: "Status is required" }} // เพิ่ม rules สำหรับ validation
            render={({ field }) => (
              <FormControl fullWidth style={{ marginTop: ".5rem" }}>
                <InputLabel id="demo-simple-select-status">Status</InputLabel>
                <Select
                  labelId="demo-simple-select-status"
                  label="Status"
                  id="demo-simple-select"
                  variant="outlined"
                  {...field}
                  error={!!errors.is_active} // เพิ่มส่วนนี้เพื่อแสดง error หากมีการ validate ไม่ผ่าน
                  // ในกรณีของ Select component จะไม่มี helperText เนื่องจากมีการแสดงชื่อตัวเลือกไว้แล้ว
                >
                  <MenuItem value={"true"}>Active</MenuItem>
                  <MenuItem value={"false"}>Inactive</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          type="submit"
          onClick={handleSubmit(handleSave)}
          disabled={isLoading}
        >
          {isLoading ? "Loading" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserDialog;
