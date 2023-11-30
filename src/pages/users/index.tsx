// ** MUI Imports
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";

// ** Demo Components Imports
import TableMember from "src/views/tables/TableMember";
import UserDialog from "@/views/dialogs/UserDialog";

const MUITable = () => {
  return (
    <Grid container >
      <Grid item xs={12}>
        <UserDialog />
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Member" titleTypographyProps={{ variant: "h6" }} />
          {/* <TableNutrition /> */}
          <TableMember />
        </Card>
      </Grid>
    </Grid>
  );
};

export default MUITable;
