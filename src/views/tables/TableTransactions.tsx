// import * as React from "react";
// import PropTypes from "prop-types";
// import { alpha } from "@mui/material/styles";
// import Box from "@mui/material/Box";
// import Badge from "@mui/material/Badge";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TablePagination from "@mui/material/TablePagination";
// import TableRow from "@mui/material/TableRow";
// import TableSortLabel from "@mui/material/TableSortLabel";
// import Toolbar from "@mui/material/Toolbar";
// import Typography from "@mui/material/Typography";
// import Paper from "@mui/material/Paper";
// import IconButton from "@mui/material/IconButton";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import Switch from "@mui/material/Switch";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import Swal from "sweetalert2";

// import { visuallyHidden } from "@mui/utils";
// import { Transactions as TransactionData } from "@/pages/api/transactions";

// function createData(
//   name: string,
//   location: string,
//   status: string,
//   created: string
// ) {
//   return { name, location, status, created };
// }

// function descendingComparator(a, b, orderBy) {
//   if (b[orderBy] < a[orderBy]) {
//     return -1;
//   }
//   if (b[orderBy] > a[orderBy]) {
//     return 1;
//   }
//   return 0;
// }

// function getComparator(order, orderBy) {
//   return order === "desc"
//     ? (a, b) => descendingComparator(a, b, orderBy)
//     : (a, b) => -descendingComparator(a, b, orderBy);
// }

// function stableSort(array, comparator) {
//   const stabilizedThis = array.map((el, index) => [el, index]);
//   stabilizedThis.sort((a, b) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) {
//       return order;
//     }
//     return a[1] - b[1];
//   });
//   return stabilizedThis.map((el) => el[0]);
// }

// const headCells = [
//   {
//     id: "name",
//     numeric: false,
//     disablePadding: true,
//     label: "Name",
//   },
//   {
//     id: "location",
//     numeric: false,
//     disablePadding: false,
//     label: "Location",
//   },
//   {
//     id: "status",
//     numeric: false,
//     disablePadding: false,
//     label: "Status",
//   },
//   {
//     id: "created",
//     numeric: false,
//     disablePadding: false,
//     label: "Created",
//   },
//   {
//     id: "actions",
//     numeric: false,
//     disablePadding: false,
//     label: "Actions",
//   },
// ];

// function EnhancedTableHead(props) {
//   const {
//     onSelectAllClick,
//     order,
//     orderBy,
//     numSelected,
//     rowCount,
//     onRequestSort,
//   } = props;

//   const createSortHandler = (property) => (event) => {
//     onRequestSort(event, property);
//   };

//   return (
//     <TableHead>
//       <TableRow>
//         {headCells.map((headCell) => (
//           <TableCell
//             key={headCell.id}
//             align="left"
//             padding={headCell.disablePadding ? "none" : "normal"}
//             sortDirection={orderBy === headCell.id ? order : false}
//           >
//             <TableSortLabel
//               active={orderBy === headCell.id}
//               direction={orderBy === headCell.id ? order : "asc"}
//               onClick={createSortHandler(headCell.id)}
//             >
//               {headCell.label}
//               {orderBy === headCell.id ? (
//                 <Box component="span" sx={visuallyHidden}>
//                   {order === "desc" ? "sorted descending" : "sorted ascending"}
//                 </Box>
//               ) : null}
//             </TableSortLabel>
//           </TableCell>
//         ))}
//       </TableRow>
//     </TableHead>
//   );
// }

// EnhancedTableHead.propTypes = {
//   numSelected: PropTypes.number.isRequired,
//   onRequestSort: PropTypes.func.isRequired,
//   onSelectAllClick: PropTypes.func.isRequired,
//   order: PropTypes.oneOf(["asc", "desc"]).isRequired,
//   orderBy: PropTypes.string.isRequired,
//   rowCount: PropTypes.number.isRequired,
// };

// function EnhancedTableToolbar(props) {
//   const { numSelected } = props;

//   return (
//     <Toolbar
//       sx={{
//         pl: { sm: 2 },
//         pr: { xs: 1, sm: 1 },
//         ...(numSelected > 0 && {
//           bgcolor: (theme) =>
//             alpha(
//               theme.palette.primary.main,
//               theme.palette.action.activatedOpacity
//             ),
//         }),
//       }}
//     >
//       {numSelected > 0 ? (
//         <Typography
//           sx={{ flex: "1 1 100%" }}
//           color="inherit"
//           variant="subtitle1"
//           component="div"
//         >
//           {numSelected} selected
//         </Typography>
//       ) : (
//         <Typography
//           sx={{ flex: "1 1 100%" }}
//           variant="h6"
//           id="tableTitle"
//           component="div"
//         ></Typography>
//       )}
//     </Toolbar>
//   );
// }

// EnhancedTableToolbar.propTypes = {
//   numSelected: PropTypes.number.isRequired,
// };

// export type CallBack = {
//   action: "edit" | "delete";
//   transaction: TransactionData | null | any;
// };

// type Props = {
//   Transactions: TransactionData[];
//   isLoading?: boolean;
//   refetch?: () => void;
//   callback?: (data: CallBack) => void;
// };

// function TableTransactions({ Transactions, isLoading, refetch, callback }: Props) {
//   const [order, setOrder] = React.useState<"asc" | "desc">("asc");
//   const [orderBy, setOrderBy] = React.useState<string>("name");
//   const [selected, setSelected] = React.useState<number[]>([]);
//   const [page, setPage] = React.useState<number>(0);
//   const [dense, setDense] = React.useState<boolean>(false);
//   const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);

//   const [selectedUser, setSelectedUser] = React.useState<TransactionData | null>(
//     null
//   );

//   const handleEditClick = (transaction: TransactionData) => {
//     // console.log("transaction", transaction);
//     callback({
//       action: "edit",
//       transaction,
//     });
//   };

//   const handleDeleteClick = (transaction: TransactionData) => {
//     // console.log("transaction", transaction);
//     try {
//       Swal.fire({
//         title: "Are you sure?",
//         html:
//           "Do you want to remove " +
//           "<span style='color:red;'>" +
//           transaction.name +
//           "</span> from the system ?",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonText: "Yes",
//         cancelButtonText: "No",
//       }).then(async (result) => {
//         if (result.isConfirmed) {
//           const res = await fetch(`/api/transaction`, {
//             method: "DELETE",
//             body: JSON.stringify({
//               transactionId: transaction.transactionId,
//             }),
//           });
//           const data = await res.json();
//           // console.log("data", data);

//           if (data) {
//             Swal.fire(
//               "Success!",
//               "Your imaginary file has been deleted.",
//               "success"
//             );
//             if (refetch) refetch();
//           }
//         }
//       });
//     } catch (error) {
//       console.log("error", error);
//     }

//     callback({
//       action: "delete",
//       transaction,
//     });
//   };

//   const handleRequestSort = (event: React.MouseEvent, property: string) => {
//     const isAsc = orderBy === property && order === "asc";
//     setOrder(isAsc ? "desc" : "asc");
//     setOrderBy(property);
//   };

//   const handleChangePage = (event: unknown, newPage: number) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setDense(event.target.checked);
//   };

//   // const isSelected = (id: string) => selected.indexOf(id) !== -1;

//   const emptyRows =
//     page > 0
//       ? Math.max(0, (1 + page) * rowsPerPage - (Transactions ? Transactions.length : 0))
//       : 0;

//   const visibleRows = React.useMemo(
//     () =>
//       stableSort(Transactions || [], getComparator(order, orderBy)).slice(
//         page * rowsPerPage,
//         page * rowsPerPage + rowsPerPage
//       ),
//     [Transactions, order, orderBy, page, rowsPerPage]
//   );

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <Box style={{ width: "100%" }}>
//       <Paper style={{ width: "100%", marginBottom: 2 }}>
//         {/* <EnhancedTableToolbar numSelected={selected.length} /> */}
//         <TableContainer component={Paper}>
//           <Table
//             style={{ minWidth: 750 }}
//             aria-labelledby="tableTitle"
//             size={dense ? "small" : "medium"}
//           >
//             <EnhancedTableHead
//               numSelected={selected.length}
//               order={order}
//               orderBy={orderBy}
//               // onSelectAllClick={handleSelectAllClick}
//               onRequestSort={handleRequestSort}
//               rowCount={visibleRows.length}
//             />
//             <TableBody>
//               {visibleRows.map((row: TransactionData) => {
//                 // const isSelectedRow = isSelected(row.transactionId);
//                 const labelId = `enhanced-table-checkbox-${row.transactionId}`;

//                 return (
//                   <TableRow
//                     hover
//                     role="checkbox"
//                     tabIndex={-1}
//                     key={row.transactionId}
//                   >
//                     <TableCell
//                       component="th"
//                       id={labelId}
//                       scope="row"
//                       padding="none"
//                     >
//                       {row.name}
//                     </TableCell>
//                     <TableCell>
//                       {row.location}

//                     </TableCell>
//                     {row.status === "online" ? (
//                       <TableCell>
//                         <Badge color="success" variant="dot" sx={{mr:2}} />
//                         {row.status}
//                       </TableCell>
//                     ) : (
//                       <TableCell>
//                         <Badge color="error" variant="dot" sx={{mr:2}} />
//                         {row.status}
//                       </TableCell>
//                     )}
                    
//                     {/* <TableCell>{row.status}</TableCell> */}
//                     <TableCell>{row.created}</TableCell>
//                     <TableCell>
//                       <IconButton
//                         aria-label="edit"
//                         onClick={() => handleEditClick(row)}
//                       >
//                         <EditIcon />
//                       </IconButton>
//                       <IconButton
//                         aria-label="delete"
//                         onClick={() => handleDeleteClick(row)}
//                       >
//                         <DeleteIcon />
//                       </IconButton>
//                     </TableCell>
//                   </TableRow>
//                 );
//               })}
//               {emptyRows > 0 && (
//                 <TableRow
//                   style={{
//                     height: (dense ? 33 : 53) * emptyRows,
//                   }}
//                 >
//                   <TableCell colSpan={4} />
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//         <TablePagination
//           rowsPerPageOptions={[5, 10, 25]}
//           component="div"
//           count={0 || Transactions.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//       </Paper>
//       <FormControlLabel
//         control={<Switch checked={dense} onChange={handleChangeDense} />}
//         label="Dense padding"
//       />
//     </Box>
//   );
// }

// export default TableTransactions;
