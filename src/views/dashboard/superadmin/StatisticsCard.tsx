import React, { useState } from "react";
import { useQuery } from "react-query";
import axios from "@/libs/Axios";
import {
  Charging as ChargingData,
  User as UserData,
  Station as StationData,
} from "@/interfaces/Adminstation.interface";
import {
  Grid,
  Box,
  Card,
  Avatar,
  Typography,
  CardContent,
  TextField,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Chip,
} from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import TrendingUp from "mdi-material-ui/TrendingUp";
import DotsVertical from "mdi-material-ui/DotsVertical";
import CellphoneLink from "mdi-material-ui/CellphoneLink";
import AccountOutline from "mdi-material-ui/AccountOutline";
import CurrencyUsd from "mdi-material-ui/CurrencyUsd";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { dateFormate } from "@/libs/date";
import { PieChart, Pie, Cell } from 'recharts';


interface DataType {
  stats: string;
  title: string;
  color: string;
  icon: React.ReactElement;
}

const StatisticsCard = () => {
  const [OpenDialogUser, setOpenDialogUserg] = useState(false);
  const [OpenDialogStation, setOpenDialogStation] = useState(false);
  const [page, setPage] = useState(0);
  const itemsPerPage = 5; // จำนวนรายการต่อหน้า

  const handleOpenDialogUser = () => {
    setOpenDialogUserg(true);
  };

  const handleCloseDialog = () => {
    setOpenDialogUserg(false);
  };

  const handleOpenDialogStation = () => {
    setOpenDialogStation(true);
  };

  const handleCloseDialogStation = () => {
    setOpenDialogStation(false);
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setPage((prevPage) => prevPage - 1);

    const startIndex = page * itemsPerPage;
    const endIndex = (page + 1) * itemsPerPage;
  };

  const {
    data: salesData,
    isLoading: totalSalesIsLoading,
    refetch: totalSalesRefetch,
  } = useQuery(
    "salesData",
    async () => {
      const res1 = (await axios.get("/charging_booth/?limit=1000")).data as ChargingData[];
      const resUsers = (await axios.get("/super_admin/users?limit=1000"))
        .data as UserData[];
      const resStations = (await axios.get("/station/?limit=1000")).data as StationData[];
      const totalSales = res1.reduce(
        (acc, curr) => acc + curr.charging_rate * 10,
        0
      );
      const totalEnergy = res1.reduce(
        (acc, curr) => acc + curr.charging_rate,
        0
      );
      const totalCustomers = (await axios.get("/super_admin/users?limit=1000")).data
        .length;
      const totalStations = (await axios.get("/station/?limit=1000")).data.length;
      return {
        totalSales,
        totalEnergy,
        totalCustomers,
        totalStations,
        resUsers,
        resStations,
      };
    },
    {
      refetchInterval: 60000,
    }
  );

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  // State สำหรับข้อมูล role และสีของ Pie Chart
  const [roleData, setRoleData] = useState([]);

  const renderStats = () => {
    if (salesData) {
      const { totalSales, totalEnergy, totalCustomers, totalStations } =
        salesData;
      const stats: DataType[] = [
        {
          stats: `${totalEnergy} kWh`,
          title: "Energy usage",
          color: "primary",
          icon: <TrendingUp sx={{ fontSize: "1.75rem" }} />,
        },
        {
          stats: `👤 ${totalCustomers}`,
          title: "Customers",
          color: "success",
          icon: (
            <AccountOutline
              sx={{ fontSize: "1.75rem" }}
              onClick={handleOpenDialogUser}
            />
          ),
        },
        {
          stats: `⛽️ ${totalStations}`,
          color: "warning",
          title: "Stations",
          icon: (
            <CellphoneLink
              sx={{ fontSize: "1.75rem" }}
              onClick={handleOpenDialogStation}
            />
          ),
        },
        {
          stats: `฿ ${totalSales}`,
          color: "info",
          title: "Revenue",
          icon: <CurrencyUsd sx={{ fontSize: "1.75rem" }} />,
        },
      ];

      return stats.map((item: DataType, index: number) => (
        <Grid item xs={12} sm={3} key={index}>
          <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              variant="rounded"
              sx={{
                mr: 3,
                width: 44,
                height: 44,
                boxShadow: 3,
                color: "common.white",
                backgroundColor: `${item.color}.main`,
              }}
            >
              {item.icon}
            </Avatar>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="caption">{item.title}</Typography>
              <Typography variant="h6">{item.stats}</Typography>
            </Box>
          </Box>
        </Grid>
      ));
    } else {
      return null;
    }

    // สร้างข้อมูลสำหรับ Pie Chart
      const roles = salesData.resUsers.map((user) => user.role);
      const roleCounts = roles.reduce((acc, role) => {
        acc[role] = (acc[role] || 0) + 1;
        return acc;
      }, {});
      const roleData = Object.keys(roleCounts).map((role) => ({
        name: role,
        value: roleCounts[role],
      }));

      setRoleData(roleData);
  };

  const [filterText, setFilterText] = useState("");
  const [filterRole, setFilterRole] = useState("");

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(event.target.value);
  };

  const handleFilterRole = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterRole(event.target.value);
  };

  return (
    <Card>
      <CardHeader
        title="Statistics Card"
        action={
          <IconButton
            size="small"
            aria-label="settings"
            className="card-more-options"
            sx={{ color: "text.secondary" }}
          >
            <DotsVertical />
          </IconButton>
        }
        subheader={
          <Typography variant="body2">
            <Box
              component="span"
              sx={{ fontWeight: 600, color: "text.primary" }}
            >
              Total growth
            </Box>{" "}
            📈 this all
          </Typography>
        }
        titleTypographyProps={{
          sx: {
            mb: 2.5,
            lineHeight: "2rem !important",
            letterSpacing: "0.15px !important",
          },
        }}
      />
      <CardContent sx={{ pt: (theme) => `${theme.spacing(3)} !important` }}>
        <Grid container spacing={[5, 0]}>
          {renderStats()}
        </Grid>
      </CardContent>
      {/* Dialog เพื่อแสดงข้อมูลผู้ใช้งาน */}
      <Dialog
        open={OpenDialogUser}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>User Information</DialogTitle>
        <DialogContent>
          <TextField
            type="text"
            value={filterText}
            onChange={handleFilterChange}
            placeholder="Search"
            variant="outlined"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {salesData?.resUsers
                  ?.filter(
                    (user) =>
                      user.firstName
                        .toLowerCase()
                        .includes(filterText.toLowerCase()) ||
                      user.lastName
                        .toLowerCase()
                        .includes(filterText.toLowerCase()) ||
                      user.email
                        .toLowerCase()
                        .includes(filterText.toLowerCase()) ||
                      user.role.toLowerCase().includes(filterText.toLowerCase())
                  )
                  .slice(
                    page * itemsPerPage,
                    page * itemsPerPage + itemsPerPage
                  )
                  .map((user: UserData) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        {user.firstName} {user.lastName}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>

                      {user.role === "superadmin" ? (
                        <TableCell>
                          <Chip
                            color="primary"
                            variant="outlined"
                            sx={{ mr: 1 }}
                            label="Super Admin"
                          />
                        </TableCell>
                      ) : user.role === "stationadmin" ? (
                        <TableCell>
                          <Chip
                            color="info"
                            variant="outlined"
                            sx={{ mr: 1 }}
                            label="Admin Station"
                          />
                        </TableCell>
                      ) : (
                        <TableCell>
                          <Chip
                            color="warning"
                            variant="outlined"
                            sx={{ mr: 1 }}
                            label="User"
                          />
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handlePrevPage}
            color="primary"
            disabled={page === 0}
          >
            Prev
          </Button>
          <Button
            onClick={handleNextPage}
            color="primary"
            disabled={
              page * itemsPerPage + itemsPerPage >= salesData?.resUsers?.length
            }
          >
            Next
          </Button>
          <Button onClick={handleCloseDialog} color="error">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog เพื่อแสดงข้อมูลสถานีชาร์จ */}
      <Dialog
        open={OpenDialogStation}
        onClose={handleCloseDialogStation}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Station Information</DialogTitle>
        <DialogContent>
          <TextField
            type="text"
            value={filterText}
            onChange={handleFilterChange}
            placeholder="Search"
            variant="outlined"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Station Name</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Created At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {salesData?.resStations
                  ?.filter((station) =>
                    station.name
                      .toLowerCase()
                      .includes(filterText.toLowerCase())
                  )
                  .slice(
                    page * itemsPerPage,
                    page * itemsPerPage + itemsPerPage
                  )
                  .map((station: StationData) => (
                    <TableRow key={station.id}>
                      <TableCell>{station.name}</TableCell>
                      <TableCell>{station.location}</TableCell>
                      <TableCell>{dateFormate(station.created_at)}</TableCell>

                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handlePrevPage}
            color="primary"
            disabled={page === 0}
          >
            Prev
          </Button>
          <Button
            onClick={handleNextPage}
            color="primary"
            disabled={
              page * itemsPerPage + itemsPerPage >= salesData?.resStations?.length
            }
          >
            Next
          </Button>
          <Button onClick={handleCloseDialogStation} color="error">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default StatisticsCard;
