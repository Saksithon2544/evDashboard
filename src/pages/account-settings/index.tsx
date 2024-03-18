// ** React Imports
import { SyntheticEvent, useState } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import { styled } from "@mui/material/styles";
import MuiTab, { TabProps } from "@mui/material/Tab";
import Swal from "sweetalert2";

// ** Icons Imports
import AccountOutline from "mdi-material-ui/AccountOutline";
import LockOpenOutline from "mdi-material-ui/LockOpenOutline";
import InformationOutline from "mdi-material-ui/InformationOutline";

// ** Demo Tabs Imports
import TabInfo from "src/views/account-settings/TabInfo";
import TabAccount from "src/views/account-settings/TabAccount";
import TabSecurity from "src/views/account-settings/TabSecurity";

// ** Third Party Styles Imports
import "react-datepicker/dist/react-datepicker.css";

// Axios
import axios from "@/libs/Axios";

// Axios get user
import { useQuery } from "react-query";
import { User as UserData } from "@/interfaces/User.interface";

const Tab = styled(MuiTab)<TabProps>(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    minWidth: 100,
  },
  [theme.breakpoints.down("sm")]: {
    minWidth: 67,
  },
}));

const TabName = styled("span")(({ theme }) => ({
  lineHeight: 1.71,
  fontSize: "0.875rem",
  marginLeft: theme.spacing(2.4),
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));

const AccountSettings = () => {
  // ** State
  const [value, setValue] = useState<string>("account");

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const {
    data: User,
    isLoading,
    refetch,
  } = useQuery<UserData>("users", async () => {
    const res = await axios.get("/user/me");
    const data = await res.data;

    return data;
  });

  async function handleUpdate(data: UserData) {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You are about to update your data",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        cancelButtonColor: "red",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios.put(`/user/me`, data);
          refetch();

          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Data has been updated successfully!",
          });
        }
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while updating data.",
      });
    }
  }

  async function handleUpdatePassword(data: any) {
    try {
      const confirmationResult = await Swal.fire({
        title: "Are you sure?",
        text: "You are about to update your password",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        cancelButtonColor: "red",
      });

      if (confirmationResult.isConfirmed) {
        // Show loading modal
        Swal.fire({
          title: "Please wait...",
          text: "Updating password",
          allowOutsideClick: false,
          showConfirmButton: false,
          willOpen: () => {
            Swal.showLoading();
          },
        });

        // Make the password update request
        const response = await axios.post(`/user/password`, data);
        refetch();

        // Hide loading modal
        Swal.close();

        // Show success message
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Password updated successfully!",
        });
      }
    } catch (error) {
      console.log(error);
      let errorMessage = "An error occurred while updating password.";
      if (error.response && error.response.data && error.response.data.detail) {
        errorMessage = error.response.data.detail;
      }
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
    }
  }

  return (
    <Card>
      {/* {JSON.stringify(User)} */}
      <TabContext value={value}>
        <TabList
          onChange={handleChange}
          aria-label="account-settings tabs"
          sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
        >
          <Tab
            value="account"
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <AccountOutline />
                <TabName>Account</TabName>
              </Box>
            }
          />
          <Tab
            value="security"
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <LockOpenOutline />
                <TabName>Security</TabName>
              </Box>
            }
          />
        </TabList>

        {isLoading ? (
          <Typography variant="h6" align="center">
            Loading...
          </Typography>
        ) : (
          <div>
            <TabPanel sx={{ p: 0 }} value="account">
              <TabAccount User={User} onSaved={handleUpdate} />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value="security">
              <TabSecurity User={User} onSaved={handleUpdatePassword} />
            </TabPanel>
          </div>
        )}
      </TabContext>
    </Card>
  );
};

export default AccountSettings;
