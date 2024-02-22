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
import { type Transactions, transactions } from "@/pages/api/transactions";
// import { type Transaction } from "@/pages/api/transaction";
import Swal from "sweetalert2";

// ** Form Imports
import { useForm, Controller } from "react-hook-form";

// ** Query Client Provider
import axios from "axios";
import { useQuery, useMutation, QueryClient } from "react-query";

type EditTransactionDialogProps = {
  transaction: Transactions;
  onClose?: () => void;
  onSave?: (updatedTransaction: Transactions) => void;
};

const EditTransactionDialog: React.FC<EditTransactionDialogProps> = ({
  transaction,
  onClose,
  onSave,
}) => {
  const handleSave = (dataForm: Transactions) => {
    onSave(dataForm);
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "Transaction has been updated.",
    });

    onClose();
  };

  // // const { data: Transactions, isLoading } = useQuery<Transaction[]>("transactions", () => {
  // //   return fetch("/api/transactions")
  // //     .then((res) => res.json())
  // //     .then((data) => data);
  // // });

  // const { data: Transactions, isLoading } = useQuery<Transactions[]>(
  //   "transactions",
  //   async () => {
  //     const res = await axios.put("/api/transactions");
  //     const data = res.data;
  //     return data;
  //   }
  // );

  const { control, reset, handleSubmit, watch, setValue } = useForm();
  const roleWatch = watch("role");

  React.useEffect(() => {
    if (transaction) {
      reset(transaction);
    }
  }, [transaction]);

  return (
    <Dialog open={transaction ? true : false} onClose={onClose}>
      {/* Dialog content */}
      <DialogTitle>Edit Transaction</DialogTitle>
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

export default EditTransactionDialog;
