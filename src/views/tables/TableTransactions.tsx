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

interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent, property: string) => void;
  order: "asc" | "desc";
  orderBy: string;
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

  // const isSelected = (id: string) => selected.indexOf(id) !== -1;

  const emptyRows =
    page > 0
      ? Math.max(
          0,
          (1 + page) * rowsPerPage - (Transactions ? Transactions.length : 0)
        )
      : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(Transactions || [], getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [Transactions, order, orderBy, page, rowsPerPage]
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
              order={order}
              orderBy={orderBy}
              // onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {visibleRows.map((row: TransactionData) => {

                return (
                  <TableRow key={row.id}>
                    <TableCell>{row.firstName}  {row.lastName}</TableCell>
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
          count={Transactions.length}
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

export default TableTransactions;
