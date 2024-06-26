import * as React from "react";
import PropTypes from "prop-types";
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
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import { visuallyHidden } from "@mui/utils";
import { Log as LogData } from "@/interfaces/Log.interface";
import axios from "@/libs/Axios";
import { dateFormate } from "@/libs/date";
import {
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
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
    id: "message",
    numeric: false,
    disablePadding: true,
    label: "Log Message",
  },
  {
    id: "type_log",
    numeric: false,
    disablePadding: false,
    label: "Type Log",
  },
  {
    id: "created",
    numeric: false,
    disablePadding: false,
    label: "Created",
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;

  const createSortHandler = (property) => (event) => {
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

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
};

export type CallBack = {
  action: "edit" | "delete";
  Log: LogData | null | any;
};

type Props = {
  Log: LogData[];
  isLoading?: boolean;
  refetch?: (data: boolean) => void;
  callback?: (data: CallBack) => void;
};

function TableLog({ Log = [], isLoading, refetch, callback }: Props) {
  const router = useRouter();
  const [order, setOrder] = React.useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = React.useState<string>("name");
  const [page, setPage] = React.useState<number>(0);
  const [dense, setDense] = React.useState<boolean>(false);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const [LogType, setLogType] = React.useState<"all" | string>("all");
  const [searchValue, setSearchValue] = React.useState<string>("");
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const handleLogType = (event) => {
    const value = event.target.value;
    setLogType(value);
  };

  const handleSearch = (event) => {
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
      ? Math.max(0, (1 + page) * rowsPerPage - (Log ? Log.length : 0))
      : 0;

  const filteredRows = Log
    ? Log.filter((row) => {
        if (searchValue === "") {
          return true;
        }
        return row.message.toLowerCase().includes(searchValue.toLowerCase());
      })
        .filter((row) => {
          if (LogType === "all") return true;
          if (LogType === row.type_log) return true;
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

  const visibleRows = React.useMemo(
    () =>
      stableSort(filteredRows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [filteredRows, order, orderBy, page, rowsPerPage]
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
          <FormControl style={{ marginRight: 50, marginLeft: 50 }}>
            <TextField
              label="🔍 Search..."
              id="search"
              value={searchValue}
              onChange={handleSearch}
              variant="outlined"
            />
          </FormControl>
          <FormControl style={{ marginRight: 50 }}>
            <InputLabel id="status-filter-label">Log Type</InputLabel>
            <Select
              labelId="status-filter-label"
              id="status-filter"
              value={LogType}
              label="Log Type"
              onChange={handleLogType}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="user">User Info</MenuItem>
              <MenuItem value="station">Station Info</MenuItem>
              <MenuItem value="charging_booth">Charging Booth Info</MenuItem>
              <MenuItem value="topup">Topup Info</MenuItem>
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
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {visibleRows.map((row: LogData) => {
                  return (
                    <TableRow key={row.id}>
                      <TableCell>
                        <Tooltip title={row.message}>
                          <span>{row.message.length > 50 ? `${row.message.substring(0, 50)}...` : row.message}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        {row.type_log === "user" ? (
                          <Chip label="User Info" color="primary" />
                        ) : row.type_log === "station" ? (
                          <Chip label="Station Info" color="warning" />
                        ) : row.type_log === "charging_booth" ? (
                          <Chip label="Charging Booth Info" color="info" />
                        ) : row.type_log === "topup" ? (
                          <Chip label="Topup Info" color="success" />
                        ) : (
                          <Chip label="Unknown" color="error" />
                        )}
                      </TableCell>
                      <TableCell>{dateFormate(row.created_at)}</TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={4} />
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
        />
      </Box>
    </LocalizationProvider>
  );
}

export default TableLog;
