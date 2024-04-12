import React, { useRef } from "react";
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
import { useRouter } from "next/router";

import Swal from "sweetalert2";
import axios from "@/libs/Axios";
import {
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";

import type { User } from "@/interfaces/Adminstation.interface";

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
    id: "adminStation",
    numeric: false,
    disablePadding: true,
    label: "Admin Station",
  },
  {
    id: "email",
    numeric: false,
    disablePadding: false,
    label: "Email Admin Station",
  },
  {
    id: "phoneNumber",
    numeric: false,
    disablePadding: false,
    label: "Phone Number",
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
// อินเทอร์เฟซของ TableadminStation ที่ปรับปรุงแล้ว
interface Props {
  mergedData: User[];
  stationId: string;
  callback: () => void;
  refetch: () => void;
}

function TableadminStation({
  mergedData,
  callback,
  refetch,
  stationId,
}: Props) {
  const router = useRouter();
  const refetchTimer = useRef<any>(null);
  const [order, setOrder] = React.useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [dense, setDense] = React.useState(false);
  const [statusFilter, setStatusFilter] = React.useState<
    "active" | "inactive" | "all"
  >("all");
  const [searchValue, setSearchValue] = React.useState("");

  // React.useEffect(() => {
  //   refetchTimer.current = setInterval(() => {
  //     refetch();
  //   }, 100000);

  //   return () => {
  //     clearInterval(refetchTimer.current);
  //   };
  // }, []);

  const handleDeleteClick = async (data: any) => {
    console.log(stationId);
    console.log(mergedData);
    try {
      const confirmationResult = await Swal.fire({
        title: "Are you sure?",
        html:
          "Do you want to remove <span style='color:red;'>" +
          data.firstName +
          data.lastName +
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
        await axios.delete(`/station_admin/${stationId}/admins/${data.id}`);

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

  const handStatusFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStatusFilter(event.target.value as "active" | "inactive" | "all");
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - (mergedData?.length || 0))
      : 0;

  const filteredRows = mergedData
    ? mergedData
        .filter((data) => {
          if (statusFilter === "all") {
            return true;
          } else if (statusFilter === "active") {
            return data.is_active;
          } else {
            return !data.is_active;
          }
        })
        .filter((data) => {
          if (searchValue === "") {
            return true;
          } else {
            return (
              data.firstName
                .toLowerCase()
                .includes(searchValue.toLowerCase()) ||
              data.lastName.toLowerCase().includes(searchValue.toLowerCase()) ||
              data.email.toLowerCase().includes(searchValue.toLowerCase()) ||
              data.phoneNumber.toLowerCase().includes(searchValue.toLowerCase())
            );
          }
        })
    : [];

  const visibleRows = React.useMemo(
    () =>
      stableSort(filteredRows || [], getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [filteredRows, order, orderBy, page, rowsPerPage]
  );

  return (
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
        <FormControl style={{ marginRight: 50 }}>
          <InputLabel id="status-filter-label">Status</InputLabel>
          <Select
            labelId="status-filter-label"
            label="Status"
            id="status-filter"
            value={statusFilter}
            onChange={handStatusFilterChange}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
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
              {visibleRows &&
                visibleRows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {row.firstName} {row.lastName}
                    </TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.phoneNumber}</TableCell>
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
                        aria-label="delete"
                        onClick={() => handleDeleteClick(row)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
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
      />
    </Box>
  );
}

export default TableadminStation;
