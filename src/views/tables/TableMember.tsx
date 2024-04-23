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
import Swal from "sweetalert2";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { SelectChangeEvent } from "@mui/material/Select";

import { visuallyHidden } from "@mui/utils";
import { User as UserData } from "@/interfaces/User.interface";
import axios from "@/libs/Axios";
import { Chip, TextField } from "@mui/material";
import { dateFormate } from "@/libs/date";

import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Margin } from "mdi-material-ui";

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
    id: "email",
    numeric: false,
    disablePadding: false,
    label: "Email",
  },
  {
    id: "role",
    numeric: false,
    disablePadding: false,
    label: "Role",
  },
  {
    id: "created_at",
    numeric: false,
    disablePadding: false,
    label: "Created",
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "Status",
  },
  {
    id: "action",
    numeric: false,
    disablePadding: false,
    label: "Action",
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

export type CallBack = {
  action: "edit" | "delete";
  user: UserData | null | any;
};

interface Props {
  Users: UserData[];
  isLoading?: boolean;
  refetch?: () => void;
  callback?: (data: CallBack) => void;
}

function TableMember({ Users, isLoading, refetch, callback }: Props) {
  const [order, setOrder] = React.useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = React.useState<string>("name");
  const [page, setPage] = React.useState<number>(0);
  const [dense, setDense] = React.useState<boolean>(false);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const [statusFilter, setStatusFilter] = React.useState<
    "active" | "inactive" | "all"
  >("all");
  const [roleFilter, setRoleFilter] = React.useState<
    "all" | "superadmin" | "stationadmin" | "user"
  >("all");
  const [searchValue, setSearchValue] = React.useState<string>("");
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);

  const handleEditClick = (user: UserData) => {
    callback({
      action: "edit",
      user,
    });
  };

  const handleDeleteClick = async (user: UserData) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        html:
          "Do you want to remove " +
          "<span style='color:red;'>" +
          user.firstName +
          " " +
          user.lastName +
          "</span> from the system ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });

      if (result.isConfirmed) {
        const { data } = await axios.put(
          `/super_admin/users/${user.id}/disable`
        );

        if (data) {
          Swal.fire(
            "Success!",
            "Your imaginary file has been deleted.",
            "success"
          );
          if (refetch) refetch();
        }
      }
    } catch (error) {
      console.error("error", error);
    }

    callback({
      action: "delete",
      user,
    });
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

  const handleStatusFilterChange = (
    event: SelectChangeEvent<"active" | "inactive" | "all">
  ) => {
    setStatusFilter(event.target.value as "active" | "inactive" | "all");
  };

  const handleRoleFilterChange = (
    event: SelectChangeEvent<"all" | "superadmin" | "stationadmin" | "user">
  ) => {
    setRoleFilter(
      event.target.value as "all" | "superadmin" | "stationadmin" | "user"
    );
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
      ? Math.max(0, (1 + page) * rowsPerPage - (Users ? Users.length : 0))
      : 0;

  const filteredRows = Users
    ? Users.filter((user) => {
        if (statusFilter === "all") return true;
        if (statusFilter === "active") return user.is_active;
        if (statusFilter === "inactive") return !user.is_active;
        return true;
      })
        .filter((user) => {
          if (roleFilter === "all") return true;
          if (roleFilter === "superadmin") return user.role === "superadmin";
          if (roleFilter === "stationadmin")
            return user.role === "stationadmin";
          if (roleFilter === "user") return user.role === "user";
          return true;
        })
        .filter(
          (user) =>
            user.firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchValue.toLowerCase()) ||
            user.email.toLowerCase().includes(searchValue.toLowerCase())
        )
        .filter((user) => {
          if (!startDate && !endDate) return true;

          // Convert dates to a single day by ignoring time
          const rowDate = new Date(user.created_at);
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
              onChange={handleSearchChange}
              variant="outlined"
            />
          </FormControl>
          <FormControl style={{ marginRight: 50 }}>
            <InputLabel id="role-filter-label">Role</InputLabel>
            <Select
              labelId="role-filter-label"
              label="Role"
              id="role-filter"
              value={roleFilter}
              onChange={handleRoleFilterChange}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="superadmin">Super Admin</MenuItem>
              <MenuItem value="stationadmin">Admin Station</MenuItem>
              <MenuItem value="user">User</MenuItem>
            </Select>
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
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
          <FormControl style={{ marginRight: 20, marginLeft: 50}}>
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
                {visibleRows.map((row: UserData) => {
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
                        {row.firstName + " " + row.lastName}
                      </TableCell>
                      <TableCell>{row.email}</TableCell>
                      {/* <TableCell>{row.role}</TableCell> */}
                      {row.role === "superadmin" ? (
                        <TableCell>
                          <Chip
                            color="primary"
                            variant="outlined"
                            sx={{ mr: 1 }}
                            label="Super Admin"
                          />
                        </TableCell>
                      ) : row.role === "stationadmin" ? (
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

                      <TableCell> {dateFormate(row.created_at)} </TableCell>
                      {row.is_active ? (
                        <TableCell>
                          <Chip
                            color="success"
                            variant="filled"
                            sx={{ mr: 2 }}
                            label="Active"
                          />
                        </TableCell>
                      ) : (
                        <TableCell>
                          <Chip
                            color="error"
                            variant="filled"
                            sx={{ mr: 2 }}
                            label="Inactive"
                          />
                        </TableCell>
                      )}
                      <TableCell>
                        <IconButton
                          aria-label="edit"
                          onClick={() => handleEditClick(row)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          onClick={() => handleDeleteClick(row)}
                        >
                          <DeleteIcon />
                        </IconButton>
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
                    <TableCell colSpan={5} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={(filteredRows && filteredRows.length) || 0} // Added null check
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

export default TableMember;
