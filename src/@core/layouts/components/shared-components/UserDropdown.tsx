// ** React Imports
import { useState, SyntheticEvent, Fragment } from "react";

// ** Next Import
import { useRouter } from "next/router";
import axios from "@/libs/Axios";
import { User as UserInfo } from "@/interfaces/User.interface";
import Swal from "sweetalert2";

// ** MUI Imports
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

// ** Icons Imports
import CogOutline from "mdi-material-ui/CogOutline";
import CurrencyUsd from "mdi-material-ui/CurrencyUsd";
import EmailOutline from "mdi-material-ui/EmailOutline";
import LogoutVariant from "mdi-material-ui/LogoutVariant";
import AccountOutline from "mdi-material-ui/AccountOutline";
import HelpCircleOutline from "mdi-material-ui/HelpCircleOutline";
import { useQuery } from "react-query";

// ** Styled Components
const BadgeContentSpan = styled("span")(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: "50%",
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
}));

function logout() {
  try {
    // Destroy token here (example: remove from localStorage)
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_type");
    localStorage.removeItem("role");
    localStorage.removeItem("user_id");
    // Redirect or do other actions as necessary
    location.href = "/";
  } catch (error) {
    console.log(error);
  }
}

const UserDropdown = () => {
  // ** States
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  // ** Hooks
  const router = useRouter();

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = (url?: string) => {
    if (url) {
      router.push(url);
    } 
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleDropdownClose("/account-settings");
  }

  const handleLogout = async () => {
    setAnchorEl(null);
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      cancelButtonColor: "red",
    }).then(async (result) => {
      if (result.isConfirmed) {
        logout();
      }
    });
  };

  const styles = {
    py: 2,
    px: 4,
    width: "100%",
    display: "flex",
    alignItems: "center",
    color: "text.primary",
    textDecoration: "none",
    "& svg": {
      fontSize: "1.375rem",
      color: "text.secondary",
    },
  };
  const { data: UserInfo } = useQuery<UserInfo>("UserInfo", async () => {
    const res = await axios.get("/user/me");
    const data = res.data;
    return data;
  });

  return (
    <Fragment>
      <Badge
        overlap="circular"
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: "pointer" }}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Avatar
          alt="John Doe"
          onClick={handleDropdownOpen}
          sx={{ width: 40, height: 40 }}
          src="/images/avatars/1.png"
        />
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ "& .MuiMenu-paper": { width: 230, marginTop: 4 } }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Box sx={{ pt: 2, pb: 3, px: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Badge
              overlap="circular"
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
              <Avatar
                alt="John Doe"
                src="/images/avatars/1.png"
                sx={{ width: "2.5rem", height: "2.5rem" }}
              />
            </Badge>
            <Box
              sx={{
                display: "flex",
                marginLeft: 3,
                alignItems: "flex-start",
                flexDirection: "column",
              }}
            >
              <Typography sx={{ fontWeight: 600 }}>{UserInfo?.firstName}</Typography>
              <Typography
                variant="body2"
                sx={{ fontSize: "0.8rem", color: "text.disabled" }}
              >
                {UserInfo?.role}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ mt: 0, mb: 1 }} />
        <MenuItem sx={{ p: 0 }} onClick={() => handleProfile()}>
          <Box sx={styles}>
            <AccountOutline sx={{ marginRight: 2 }} />
            Profile
          </Box>
        </MenuItem>
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Box sx={styles}>
            <EmailOutline sx={{ marginRight: 2 }} />
            Inbox
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Box sx={styles}>
            <CogOutline sx={{ marginRight: 2 }} />
            Settings
          </Box>
        </MenuItem>
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Box sx={styles}>
            <CurrencyUsd sx={{ marginRight: 2 }} />
            Pricing
          </Box>
        </MenuItem>
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Box sx={styles}>
            <HelpCircleOutline sx={{ marginRight: 2 }} />
            FAQ
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem sx={{ py: 2 }} onClick={() => handleLogout()}>
          <LogoutVariant
            sx={{
              marginRight: 2,
              fontSize: "1.375rem",
              color: "text.secondary",
            }}
          />
          Logout
        </MenuItem>
      </Menu>
    </Fragment>
  );
};

export default UserDropdown;
export { logout };
