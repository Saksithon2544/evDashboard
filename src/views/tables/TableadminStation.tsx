import React, {useRef} from "react"; 
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
import { Button } from "@mui/material";
import { visuallyHidden } from "@mui/utils";

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
    id: "stationName",
    numeric: false,
    disablePadding: true,
    label: "Station Name",
  },
  {
    id: "userName",
    numeric: false,
    disablePadding: false,
    label: "User Name",
  },
  {
    id: "email",
    numeric: false,
    disablePadding: false,
    label: "Email Admin Station",
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

interface Props {
  data: {
    stationName: string;
    userName: string;
    email: string;
    id?: string;
    userId: string;
    stationId: string;
    status: string;
    created_at: string;
  }[];
  callback: (station: any) => void;
  refetch: () => void;
}

function TableadminStation({ data, callback, refetch }: Props) {
  const router = useRouter();
  const [order, setOrder] = React.useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = React.useState<string>("name");
  const [page, setPage] = React.useState<number>(0);
  const [dense, setDense] = React.useState<boolean>(false);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const refetchTimer = useRef(null);

  // React.useEffect(() => {
  //   refetchTimer.current = setInterval(() => {
  //     refetch();
  //   }, 100000);

  //   return () => {
  //     clearInterval(refetchTimer.current);
  //   };
  // }, []);

  const handleDeleteClick = async (data: any) => {
    try {
      const confirmationResult = await Swal.fire({
        title: "Are you sure?",
        html:
          "Do you want to remove <span style='color:red;'>" +
          data.userName +
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
        await axios.delete(`/stations/${data.stationId}/admins/${data.userId}`);
        refetch();

        // Close the loading modal
        Swal.close();

        // Show success message
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Station has been deleted successfully.",
        });
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


  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(data, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [data, order, orderBy, page, rowsPerPage]
  );

  return (
    <Box style={{ width: "100%" }}>
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
              rowCount={data.length}
            />

            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.stationName}</TableCell>
                  <TableCell>{row.userName}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  {row.status === "online" ? (
                    <TableCell>
                      <Badge color="success" variant="dot" sx={{ mr: 2 }} />
                      {row.status}
                    </TableCell>
                  ) : (
                    <TableCell>
                      <Badge color="error" variant="dot" sx={{ mr: 2 }} />
                      {row.status}
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
          <Button onClick={refetch}>Refresh</Button>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
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
