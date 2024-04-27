import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Swal from "sweetalert2";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useForm } from "react-hook-form";
import axios from "@/libs/Axios";
import { Margin } from "mdi-material-ui";
import { set } from "nprogress";

type Props = {
  // callback?: ( ) => void;
  callback?: (data: boolean) => void;
  id: string;
  userId: string;
};

type FormData = {
  userId: string;
  amount: number;
  select_topup: string;
};

export default function ReceiptDialog(props: Props) {
  const { userId, id } = props;
  const { control, reset } = useForm();
  const [open, setOpen] = React.useState(false);
  const [imageSrc, setImageSrc] = React.useState<string | null>(null); // Initialize as null
  const [loading, setLoading] = React.useState(true); // Initialize as true

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    reset({
      id: "",
      userId: "",
    });
    setOpen(false);
  };

  const fetchReceiptImage = async () => {
    try {
      const response = await axios.get(`/top_up/get_image/${id}`);
      setImageSrc(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    if (open) {
      fetchReceiptImage();
    }
  }, [open]);

  function handleSubmit() {
    try {
      setOpen(false); // ปิด Dialog ก่อนทำการยืนยัน

      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to confirm this receipt?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonColor: "red",
        cancelButtonText: "No",
      }).then(async (result) => {
        Swal.fire({
          title: "Loading...",
          didOpen: () => {
            Swal.showLoading(); // แสดง Loading ใน Swal
          },
        });
        if (result.isConfirmed) {
          try {
            setLoading(true); // เริ่มแสดง Loading
            await axios.put(`/top_up/${userId}/approve/${id}?is_approved=true`);
            Swal.fire("Confirmed!", "Receipt has been confirmed.", "success");
            props.callback && props.callback(true);
            handleClose();
          } catch (error) {
            Swal.fire("Error!", "An error occurred.", "error");
          } finally {
            setLoading(false); // หยุดแสดง Loading
          }
        } else {
          setLoading(false); // หยุดแสดง Loading
          setOpen(true); // เปิด Dialog อีกครั้งหากผู้ใช้ยกเลิกการยืนยัน
        }
      });
    } catch (error) {
      Swal.fire("Error!", "An error occurred.", "error");
    }
    
  }

  return (
    <React.Fragment>
      <Button
        variant="outlined"
        onClick={handleClickOpen}
        startIcon={<VisibilityIcon />}
      >
        Confirm
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        fullWidth
        maxWidth="md"
      >
        <DialogTitle id="form-dialog-title">Receipt</DialogTitle>
        <DialogContent
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {loading && <p>Loading...</p>} {/* แสดง Loading ถ้าโหลดรูปภาพอยู่ */}
          <img
            src={axios.defaults.baseURL + `/top_up/get_image/${id}`}
            alt="Receipt"
            style={{ width: "60%", height: "60%" }}
            onLoad={() => setLoading(false)} // เมื่อรูปโหลดเสร็จ ให้เปลี่ยน state เป็น false
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            Close
          </Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
