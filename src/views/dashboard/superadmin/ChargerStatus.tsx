import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { useTheme } from "@mui/material/styles";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import React, { useState, useEffect } from "react";

// Icons Imports
import DotsVertical from "mdi-material-ui/DotsVertical";

// Third Party Imports
import { ApexOptions } from "apexcharts";

// Custom Components Imports
import ReactApexcharts from "src/@core/components/react-apexcharts";

// ===========================|| DASHBOARD - CHARGER STATUS ||=========================== //
import axios from "@/libs/Axios";
import {
  Badge,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
} from "@mui/material";
import { dateFormate } from "@/libs/date";

const ChargerStatus = () => {
  // Hook
  const theme = useTheme();
  const [chargerStatus, setChargerStatus] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/charging_booth");
        // เรียงลำดับข้อมูลตามวันที่
        const sortedData = response.data.sort((olddate:any, newdate:any) => new Date(newdate.updated_at).getTime() - new Date(olddate.updated_at).getTime());
        setChargerStatus(sortedData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData(); // เรียกใช้งานฟังก์ชัน fetchData เมื่อ Component ถูกโหลด
  }, []); // dependencies array เป็น []

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "22px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 600,
              color: undefined,
              offsetY: -10,
            },
            value: {
              show: true,
              fontSize: "16px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 400,
              color: undefined,
              offsetY: 16,
              formatter: (val: any) => {
                return val;
              },
            },
            total: {
              show: true,
              label: "Total",
              color: theme.palette.text.primary,
              fontSize: "22px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 400,
              formatter: (w: any) => {
                return w.globals.seriesTotals.reduce((a: any, b: any) => {
                  return a + b;
                }, 0);
              },
            },
          },
        },
      },
    },
    colors: [
      theme.palette.success.main,
      theme.palette.error.main,
      theme.palette.warning.main,
    ],
    labels: ["Online", "Offline", "Charging"],
  };

  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [filterText, setFilterText] = useState("");
  const itemsPerPage = 5; // จำนวนรายการต่อหน้า

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setPage((prevPage) => prevPage - 1);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(event.target.value);
  };

  const filteredChargers = chargerStatus.filter(
    (charger) =>
      charger.booth_name.toLowerCase().includes(filterText.toLowerCase()) ||
      charger.status.toLowerCase().includes(filterText.toLowerCase())
  );

  const startIndex = page * itemsPerPage;
  const endIndex = (page + 1) * itemsPerPage;

  return (
    <Card>
      <CardHeader
        title="Charger Status"
        titleTypographyProps={{
          sx: {
            lineHeight: "5rem !important",
            letterSpacing: "0.15px !important",
          },
        }}
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
      />
      <CardContent>
        <ReactApexcharts
          type="donut"
          height={205}
          options={options}
          series={[
            chargerStatus.filter((item: any) => item.status === "online")
              .length,
            chargerStatus.filter((item: any) => item.status === "offline")
              .length,
            chargerStatus.filter((item: any) => item.status === "charging")
              .length,
          ]}
        />
        <Box sx={{ mt: 3, display: "flex", alignItems: "center" }}>
          <Typography variant="h5" sx={{ mr: 4 }}>
            {
              chargerStatus.filter((item: any) => item.status === "online")
                .length
            }
            %
          </Typography>
          <Typography variant="body2">
            Chargers are currently available
          </Typography>
        </Box>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleClickOpen}
        >
          View Chargers
        </Button>

        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>Chargers Information</DialogTitle>
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
                <TableBody>
                  {/* ตัวอย่างข้อมูลสำหรับแสดงในตาราง */}
                  <TableRow>
                    <TableCell>Booth Name</TableCell>
                    <TableCell>Charging Rate (kW)</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Last Update</TableCell>
                  </TableRow>
                  {/* แสดงข้อมูลในตาราง */}
                  {filteredChargers
                    .slice(startIndex, endIndex)
                    .map((charger: any) => (
                      <TableRow key={charger.booth_id}>
                        <TableCell>{charger.booth_name}</TableCell>
                        <TableCell>{charger.charging_rate}</TableCell>
                        {charger.status === "online" ? (
                          <TableCell>
                            <Badge
                              color="success"
                              variant="dot"
                              sx={{ mr: 2 }}
                            />
                            Online
                          </TableCell>
                        ) : charger.status === "offline" ? (
                          <TableCell>
                            <Badge color="error" variant="dot" sx={{ mr: 2 }} />
                            Offline
                          </TableCell>
                        ) : (
                          <TableCell>
                            <Badge
                              color="warning"
                              variant="dot"
                              sx={{ mr: 2 }}
                            />
                            Charging
                          </TableCell>
                        )}
                        <TableCell>{dateFormate(charger.updated_at)}</TableCell>
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
              disabled={endIndex >= filteredChargers.length}
            >
              Next
            </Button>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ChargerStatus;
