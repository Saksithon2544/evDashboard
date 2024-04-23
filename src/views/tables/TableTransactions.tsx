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
import { Transaction as TransactionData } from "@/interfaces/Transaction.interface";
import axios from "@/libs/Axios";
import { dateFormate } from "@/libs/date";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
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
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Name",
  },
  {
    id: "email",
    numeric: false,
    disablePadding: false,
    label: "Email",
  },
  {
    id: "amount",
    numeric: false,
    disablePadding: false,
    label: "Amount",
  },
  {
    id: "transactionType",
    numeric: false,
    disablePadding: false,
    label: "Transaction Type",
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
  Transaction: TransactionData | null | any;
};

type Props = {
  Transactions: TransactionData[];
  isLoading?: boolean;
  refetch?: (data: boolean) => void;
  callback?: (data: CallBack) => void;
};

function TableTransactions({
  Transactions = [],
  isLoading,
  refetch,
  callback,
}: Props) {
  const router = useRouter();
  const [order, setOrder] = React.useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = React.useState<string>("name");
  const [page, setPage] = React.useState<number>(0);
  const [dense, setDense] = React.useState<boolean>(false);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const [transactionType, setTransactionType] = React.useState<
    "all" | "cash" | "mastercard" | "visa" | "paypal"
  >("all");
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

  const handleTransactionType = (event) => {
    setTransactionType(
      event.target.value as "all" | "cash" | "mastercard" | "visa" | "paypal"
    );
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
      ? Math.max(
          0,
          (1 + page) * rowsPerPage - (Transactions ? Transactions.length : 0)
        )
      : 0;

  const filteredRows = Transactions
    ? Transactions.filter((row) => {
        if (searchValue === "") {
          return true;
        }
        return (
          row.firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
          row.lastName.toLowerCase().includes(searchValue.toLowerCase()) ||
          row.email.toLowerCase().includes(searchValue.toLowerCase()) ||
          row.amount
            .toString()
            .toLowerCase()
            .includes(searchValue.toLowerCase())
        );
      })
        .filter((row) => {
          if (transactionType === "all") return true;
          if (transactionType === row.transactionType) return true;
          return false;
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
          <FormControl style={{ marginRight: 50 }}>
            <TextField
              label="🔍 Search..."
              id="search"
              value={searchValue}
              onChange={handleSearch}
              variant="outlined"
            />
          </FormControl>
          <FormControl style={{ marginRight: 50 }}>
            <InputLabel id="status-filter-label">Transaction Type</InputLabel>
            <Select
              labelId="status-filter-label"
              id="status-filter"
              value={transactionType}
              label="Transaction Type"
              onChange={handleTransactionType}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="cash">Cash</MenuItem>
              <MenuItem value="mastercard">Mastercard</MenuItem>
              <MenuItem value="visa">Visa</MenuItem>
              <MenuItem value="paypal">Paypal</MenuItem>
            </Select>
          </FormControl>
          <FormControl style={{ marginRight: 20 }}>
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
                {visibleRows.map((row: TransactionData) => {
                  return (
                    <TableRow key={row.id}>
                      <TableCell>
                        {row.firstName} {row.lastName}
                      </TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row.amount}</TableCell>
                      {row.transactionType === "cash" ? (
                        <TableCell>
                          <Badge color="success" variant="dot" sx={{ mr: 2 }} />
                          {row.transactionType}
                        </TableCell>
                      ) : row.transactionType === "mastercard" ? (
                        <TableCell>
                          <Badge color="warning" variant="dot" sx={{ mr: 2 }} />
                          {row.transactionType}
                        </TableCell>
                      ) : row.transactionType === "visa" ? (
                        <TableCell>
                          <Badge color="primary" variant="dot" sx={{ mr: 2 }} />
                          {row.transactionType}
                        </TableCell>
                      ) : row.transactionType === "paypal" ? (
                        <TableCell>
                          <Badge color="info" variant="dot" sx={{ mr: 2 }} />
                          {row.transactionType}
                        </TableCell>
                      ) : (
                        <TableCell>
                          <Badge color="default" variant="dot" sx={{ mr: 2 }} />
                          {row.transactionType}
                        </TableCell>
                      )}

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

export default TableTransactions;
