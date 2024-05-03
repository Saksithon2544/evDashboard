import React, { useRef, useState } from "react";
import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from "next/router";

import Swal from "sweetalert2";
import axios from "@/libs/Axios";
import { visuallyHidden } from "@mui/utils";

import type { Charging } from "@/interfaces/Adminstation.interface";
import { dateFormate } from "@/libs/date";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

function descendingComparator(a: any, b: any, orderBy: any) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order: any, orderBy: any) {
  return order === "desc"
    ? (a: any, b: any) => descendingComparator(a, b, orderBy)
    : (a: any, b: any) => -descendingComparator(a, b, orderBy);
}

function stableSort(array: any, comparator: any) {
  if (!Array.isArray(array)) {
    return [];
  }

  const stabilizedThis = array.map((el: any, index: any) => [el, index]);
  stabilizedThis.sort((a: any, b: any) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el: any) => el[0]);
}

const headCells = [
  {
    id: "Name",
    numeric: false,
    disablePadding: true,
    label: "Name",
  },
  {
    id: "Charging Rate",
    numeric: false,
    disablePadding: false,
    label: "Charging Rate (kWh.)",
  },
  {
    id: "updated_at",
    numeric: false,
    disablePadding: false,
    label: "Last Updated",
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "Status",
  },
  {
    id: "actions",
    numeric: false,
    disablePadding: false,
    label: "Actions",
  },
];

interface EnhancedTableProps {
  classes: any;
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof any
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: "asc" | "desc";
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;

  const createSortHandler = (property: string) => (event: React.MouseEvent) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="left"
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.prototype = {
  numSelected: 0,
  onRequestSort: () => {},
  onSelectAllClick: () => {},
  order: "asc",
  orderBy: "calories",
  rowCount: 0,
};

export type CallBack = {
  action: "edit" | "delete";
  station: any;
};
interface UserData {
  id: string;
  name: string;
  email: string;
}
// อินเทอร์เฟซของ TableCharging ที่ปรับปรุงแล้ว
interface Props {
  mergedData: Charging[];
  callback: () => void;
  refetch: () => void;
}

function TableCharging({
  mergedData,
  callback,
  refetch,
}: // stationId,
Props) {
  const router = useRouter();
  const refetchTimer = useRef<any>(null);
  const [order, setOrder] = React.useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [dense, setDense] = React.useState(false);
  const [statusFilter, setStatusFilter] = React.useState<
    "online" | "offline" | "charging" | "all"
  >("all");
  const [searchValue, setSearchValue] = React.useState("");
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);

  // React.useEffect(() => {
  //   refetchTimer.current = setInterval(() => {
  //     refetch();
  //   }, 100000);

  //   return () => {
  //     clearInterval(refetchTimer.current);
  //   };
  // }, []);

  const handleDeleteClick = async (data: any) => {
    // console.log(stationId);
    console.log(mergedData);
    try {
      const confirmationResult = await Swal.fire({
        title: "Are you sure?",
        html:
          "Do you want to remove <span style='color:red;'>" +
          data.booth_name +
          "</span> from the system?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        cancelButtonColor: "red",
      });

      if (confirmationResult.isConfirmed) {
        // Show loading modal
        Swal.fire({
          title: "Please wait...",
          text: "Deleting station",
          allowOutsideClick: false,
          showConfirmButton: false,
          willOpen: () => {
            Swal.showLoading();
          },
        });
        await axios.delete(`/charging_booth/${data.booth_id}`);

        // Close the loading modal
        Swal.close();

        // Show success message
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Station has been deleted successfully.",
        });

        // Refetch data
        refetch();
      }
    } catch (error) {
      console.log(error);
      let errorMessage = "An error occurred while deleting station.";
      if (error.response && error.response.data) {
        errorMessage = error.response.data.detail;
      }
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
    }
  };

  const handleRequestSort = (event: React.MouseEvent, property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const handleStatusFilterChange = (
    event: SelectChangeEvent<"online" | "offline" | "charging" | "all">
  ) => {
    setStatusFilter(
      event.target.value as "online" | "offline" | "charging" | "all"
    );
  };

  const handSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleStartDateChange = (newValue) => {
    if (newValue && endDate && newValue > endDate) {
      setStartDate(null);
      setEndDate(null);
      Swal.fire("Start Date cannot be after End Date");
      return;
    }
    setStartDate(newValue);
  };

  const handleEndDateChange = (newValue) => {
    if (newValue && startDate && newValue < startDate) {
      setStartDate(null);
      setEndDate(null);
      Swal.fire("End Date cannot be before Start Date");
      return;
    }
    setEndDate(newValue);
  };

  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - (mergedData?.length || 0))
      : 0;

  const filteredRows = mergedData
    ? mergedData
        .filter((row) => {
          if (statusFilter === "all") return true;
          if (statusFilter === "online") return row.status === "online";
          if (statusFilter === "offline") return row.status === "offline";
          if (statusFilter === "charging") return row.status === "charging";
          return true;
        })
        .filter((row) => {
          if (searchValue === "") return true;
          return row.booth_name
            .toLowerCase()
            .includes(searchValue.toLowerCase());
        })
        .filter((row) => {
          if (!startDate && !endDate) return true;

          // Convert dates to a single day by ignoring time
          const rowDate = new Date(row.created_at);
          const rowDateWithoutTime = new Date(
            rowDate.getFullYear(),
            rowDate.getMonth(),
            rowDate.getDate()
          );

          const startDateTime = startDate ? startDate.getTime() : null;
          const endDateTime = endDate ? endDate.getTime() : null;
          const rowDateTime = rowDateWithoutTime.getTime();

          if (startDateTime === rowDateTime && endDateTime === rowDateTime) {
            // When start date and end date are the same, include data only for that day
            return true;
          }

          if (startDateTime && endDateTime) {
            return rowDateTime >= startDateTime && rowDateTime <= endDateTime;
          }

          if (startDateTime && !endDateTime) {
            return rowDateTime >= startDateTime;
          }

          if (!startDateTime && endDateTime) {
            return rowDateTime <= endDateTime;
          }

          return false;
        })
    : [];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box style={{ width: "100%" }}>
        <Box
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 10,
          }}
        >
          <FormControl style={{ marginRight: 50 }}>
            <TextField
              id="search"
              label="🔍 Charger Search..."
              variant="outlined"
              value={searchValue}
              onChange={handSearchChange}
            />
          </FormControl>
          <FormControl style={{ marginRight: 50 }}>
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              label="Status"
              id="status-filter"
              value={statusFilter}
              onChange={handleStatusFilterChange}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="online">Online</MenuItem>
              <MenuItem value="offline">Offline</MenuItem>
              <MenuItem value="charging">Charging</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 10,
          }}
        >
          <FormControl style={{ marginRight: 20, marginLeft: 50 }}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={handleStartDateChange}
            />
          </FormControl>
          <FormControl style={{ marginRight: 50 }}>
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={handleEndDateChange}
            />
          </FormControl>
        </Box>

        <Paper style={{ width: "100%", marginBottom: 2 }}>
          <TableContainer component={Paper}>
            <Table
              style={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? "small" : "medium"}
            >
              <EnhancedTableHead
                classes={{}}
                numSelected={0}
                onSelectAllClick={() => {}}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={(mergedData && mergedData.length) || 0} // Added null check
              />

              <TableBody>
                {filteredRows &&
                  filteredRows.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.booth_name}</TableCell>
                      <TableCell>{row.charging_rate} / kWh</TableCell>
                      <TableCell>{dateFormate(row.updated_at)}</TableCell>
                      {row.status === "online" ? (
                        <TableCell>
                          <Badge color="success" variant="dot" sx={{ mr: 2 }} />
                          Online
                        </TableCell>
                      ) : row.status === "charging" ? (
                        <TableCell>
                          <Badge color="warning" variant="dot" sx={{ mr: 2 }} />
                          Charging
                        </TableCell>
                      ) : (
                        <TableCell>
                          <Badge color="error" variant="dot" sx={{ mr: 2 }} />
                          Offline
                        </TableCell>
                      )}
                      <TableCell>
                        <IconButton
                          aria-label="delete"
                          onClick={() => handleDeleteClick(row)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={(mergedData && mergedData.length) || 0} // Added null check
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        <FormControlLabel
          control={<Switch checked={dense} onChange={handleChangeDense} />}
          label="Dense padding"
        />
      </Box>
    </LocalizationProvider>
  );
}

export default TableCharging;
