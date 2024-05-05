import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
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
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useRouter } from "next/router";
import { dateFormate } from "@/libs/date";
import Swal from "sweetalert2";
import { visuallyHidden } from "@mui/utils";
import axios from "@/libs/Axios";
import { Button, FormControl, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import MapIcon from "@mui/icons-material/Map";

function descendingComparator(a: any, b: any, orderBy: string) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order: "asc" | "desc", orderBy: string) {
  return order === "desc"
    ? (a: any, b: any) => descendingComparator(a, b, orderBy)
    : (a: any, b: any) => -descendingComparator(a, b, orderBy);
}

function stableSort(array: any[], comparator: any) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Name",
  },
  {
    id: "location",
    numeric: false,
    disablePadding: false,
    label: "Location",
  },
  {
    id: "income",
    numeric: true,
    disablePadding: false,
    label: "Income",
  },
  {
    id: "created_at",
    numeric: false,
    disablePadding: false,
    label: "Created",
  },
  {
    id: "actions",
    numeric: false,
    disablePadding: false,
    label: "Actions",
  },
  {
    id: "view",
    numeric: false,
    disablePadding: false,
    label: "View Station",
  },
];

interface EnhancedTableHeadProps {
  onRequestSort: (property: string) => void;
  order: "asc" | "desc";
  orderBy: string;
}

function EnhancedTableHead(props: EnhancedTableHeadProps) {
  const { order, orderBy, onRequestSort } = props;

  const createSortHandler = (property: string) => (event: React.MouseEvent) => {
    onRequestSort(property);
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

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
};

export interface StationData {
  id: string;
  name: string;
  location: [number, number];
  created_at: string;
  total_charging_booth: number;
  total_charging_rate: number;
}

export interface ChargingData {
  id: string;
  station_id: string;
  charging_rate: number;
  created_at: string;
}

export interface AdminData {
  user_id: string;
  station_id: string;
}

export type CallBack = {
  action: "edit" | "delete";
  station: StationData | null | any;
};

interface Props {
  Stations: {
    latestStations: StationData[];
    data: StationData[];
  };
  isLoading?: boolean;
  refetch?: () => void;
  callback?: (data: CallBack) => void;
}

function TableStation({ Stations, isLoading, refetch, callback }: Props) {
  const [order, setOrder] = React.useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = React.useState<string>("created_at");
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState<boolean>(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const router = useRouter();
  const [searchValue, setSearchValue] = React.useState("");
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);

  const handleEditClick = (station: StationData) => {
    callback &&
      callback({
        action: "edit",
        station,
      });
  };

  const handleDeleteClick = async (station: StationData) => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Are you sure?",
        html:
          "Do you want to remove <span style='color:red;'>" +
          station.name +
          "</span> from the system?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        cancelButtonColor: "red",
      });

      if (confirmationResult.isConfirmed) {
        Swal.fire({
          title: "Please wait...",
          text: "Deleting station",
          allowOutsideClick: false,
          showConfirmButton: false,
          willOpen: () => {
            Swal.showLoading();
          },
        });
        await axios.delete(`/station/${station.id}`);
        refetch && refetch();

        Swal.close();
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Station has been deleted successfully.",
        });
      }
    } catch (error) {
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

  const handleRequestSort = (property: string) => {
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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      ? Math.max(
          0,
          (1 + page) * rowsPerPage - (Stations.latestStations.length || 0)
        )
      : 0;

  const filteredRows = Stations.latestStations
    ? Stations.latestStations
        .filter((station) => {
          return (
            station.name.toLowerCase().includes(searchValue.toLowerCase()) ||
            station.location[0].toString().includes(searchValue) ||
            station.location[1].toString().includes(searchValue) ||
            station.total_charging_rate.toString().includes(searchValue) ||
            dateFormate(station.created_at).includes(searchValue)
          );
        })
        .filter((station) => {
          if (!startDate && !endDate) return true;

          // Convert dates to a single day by ignoring time
          const rowDate = new Date(station.created_at);
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

  const visibleRows = React.useMemo(
    () =>
      stableSort(filteredRows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [filteredRows, order, orderBy, page, rowsPerPage]
  );

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
              label="🔍 Search..."
              id="search"
              value={searchValue}
              onChange={handleSearchChange}
              variant="outlined"
            />
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
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? "small" : "medium"}
            >
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {visibleRows.map((row) => {
                  const labelId = `enhanced-table-checkbox-${row.userId}`;
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.userId}
                    >
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.name}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          onClick={() => {
                            const lat = row.location[0]; // ละติจูด
                            const lng = row.location[1]; // ลองติจูด
                            const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
                            window.open(mapsUrl, "_blank");
                            {
                              console.log(mapsUrl);
                            }
                          }}
                          startIcon={<MapIcon color="error" />}
                        >
                          view
                        </Button>
                      </TableCell>
                      <TableCell>{row.total_charging_rate}</TableCell>
                      <TableCell>{dateFormate(row.created_at)}</TableCell>
                      <TableCell>
                        <IconButton
                          aria-label="edit"
                          onClick={() => handleEditClick(row)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          onClick={() => handleDeleteClick(row)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outlined"
                          onClick={() => router.push(`/stations/${row.id}`)}
                          startIcon={<VisibilityIcon />}
                        >
                          Click
                        </Button>

                      </TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        <FormControlLabel
          control={<Switch checked={dense} onChange={handleChangeDense} />}
          label="Dense padding"
          style={{ marginLeft: 10 }}
        />
      </Box>
    </LocalizationProvider>
  );
}

export default TableStation;
