import React from 'react';
import { useQuery } from 'react-query';
import axios from '@/libs/Axios';
import { 
  Admin as AdminData,
  Station as StationData,
  User as UserData,
  Charging as ChargingData,
} from '@/interfaces/Adminstation.interface';
import { Grid, Box, Card, Avatar, Typography, CardContent } from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import TrendingUp from 'mdi-material-ui/TrendingUp';
import DotsVertical from 'mdi-material-ui/DotsVertical';
import CellphoneLink from 'mdi-material-ui/CellphoneLink';
import AccountOutline from 'mdi-material-ui/AccountOutline';
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd';

interface DataType {
  stats: string;
  title: string;
  color: string;
  icon: React.ReactElement;
}

const StatisticsCard = () => {
  const { data: salesData } = useQuery('merdata', async () => {
    const res1 = await axios.get('/station/?limit=1000');
    const res2 = await axios.get('/charging_booth/?limit=1000');
    const res3 = await axios.get(`/station_admin/${res1.data[0].id}?limit=1000`);
    const totalStations = res1.data.length;
    const totalEnergy = res2.data.reduce((acc: number, item: ChargingData) => acc + item.charging_rate, 0);
    const totalSales = res2.data.reduce((acc: number, item: ChargingData) => acc + item.charging_rate * 10, 0);
    const data = res1.data;
    return {data, totalStations, totalSales, totalEnergy, totalCustomers: 0};
  });

  const renderStats = () => {
    if (salesData) {
      const { totalSales, totalEnergy, totalCustomers, totalStations } = salesData;
      const stats: DataType[] = [
        {
          stats: `${totalEnergy} kW`,
          title: 'Energy usage',
          color: 'primary',
          icon: <TrendingUp sx={{ fontSize: '1.75rem' }} />,
        },
        {
          stats: `👤 ${totalCustomers}`,
          title: 'Customers',
          color: 'success',
          icon: <AccountOutline sx={{ fontSize: '1.75rem' }} />,
        },
        {
          stats: `⛽️ ${totalStations}`,
          color: 'warning',
          title: 'Stations',
          icon: <CellphoneLink sx={{ fontSize: '1.75rem' }} />,
        },
        {
          stats: `฿ ${totalSales}`,
          color: 'info',
          title: 'Revenue',
          icon: <CurrencyUsd sx={{ fontSize: '1.75rem' }} />,
        },
      ];

      return stats.map((item: DataType, index: number) => (
        <Grid item xs={12} sm={3} key={index}>
          <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              variant='rounded'
              sx={{
                mr: 3,
                width: 44,
                height: 44,
                boxShadow: 3,
                color: 'common.white',
                backgroundColor: `${item.color}.main`,
              }}
            >
              {item.icon}
            </Avatar>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='caption'>{item.title}</Typography>
              <Typography variant='h6'>{item.stats}</Typography>
            </Box>
          </Box>
        </Grid>
      ));
    } else {
      return null;
    }
  };

  return (
    <Card>
      <CardHeader
        title='Statistics Card'
        action={
          <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'text.secondary' }}>
            <DotsVertical />
          </IconButton>
        }
        subheader={
          <Typography variant='body2'>
            <Box component='span' sx={{ fontWeight: 600, color: 'text.primary' }}>
              Total 48.5% growth
            </Box>{' '}
            😎 this month
          </Typography>
        }
        titleTypographyProps={{
          sx: {
            mb: 2.5,
            lineHeight: '2rem !important',
            letterSpacing: '0.15px !important',
          },
        }}
      />
      <CardContent sx={{ pt: (theme) => `${theme.spacing(3)} !important` }}>
        <Grid container spacing={[5, 0]}>
          {renderStats()}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default StatisticsCard;
