import React, { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import { useQuery } from "react-query";
import axios from "@/libs/Axios";

import { User as UserData } from "@/interfaces/User.interface";
import { dateFormate } from "@/libs/date";

const DashboardTable = () => {
  const [selectedUser, setSelectedUser] = useState<UserData | undefined>(
    undefined
  );

  // const {
  //   data: users,
  //   isLoading,
  //   refetch,
  // } = useQuery<UserData[]>("users", async () => {
  //   const res = await axios.get<UserData[]>("/super_admin/users");
  //   const data = res.data;
  //   return data.slice(0, 10);
  // });

  const {
    data: users,
    isLoading,
    refetch,
  } = useQuery<UserData[]>("users", async () => {
    const res = await axios.get<UserData[]>("/super_admin/users");
    const data = res.data;
    const sortedUsers = data.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ); // เรียงจากวันที่ล่าสุดอยู่บนสุด
    const latestUsers = sortedUsers.slice(0, 8); // เลือกข้อมูลเพียง 8 คนล่าสุด
    return latestUsers;
  });

  function handleCloseModal() {
    setSelectedUser(undefined);
  }

  return (
    <Card>
      <TableContainer>
        <Table sx={{ minWidth: 800 }} aria-label="table in dashboard">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users?.map((row) => (
              <TableRow
                hover
                key={row.id}
                sx={{ "&:last-of-type td, &:last-of-type th": { border: 0 } }}
              >
                <TableCell>
                  {row.firstName} {row.lastName}
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
                ) : row.role === "adminstation" ? (
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

                <TableCell>{dateFormate(row.created_at)}</TableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default DashboardTable;
