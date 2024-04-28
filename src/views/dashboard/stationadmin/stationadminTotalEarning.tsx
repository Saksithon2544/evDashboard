import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import LinearProgress from '@mui/material/LinearProgress'

// ** Icons Imports
import MenuUp from 'mdi-material-ui/MenuUp'
import DotsVertical from 'mdi-material-ui/DotsVertical'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

import axios from '@/libs/Axios'
import { 
  Station as StationData,
  Charging as ChargingData,
} from '@/interfaces/Adminstation.interface'

interface DataType {
  title: string
  imgSrc: string
  amount: string
  subtitle: string
  progress: number
  color: ThemeColor
  imgHeight: number
}

const TotalEarning = () => {
  const { data: stationData, isLoading: totalSalesIsLoading, refetch: totalSalesRefetch } = useQuery(
    'stationData',
    async () => {
      const res1 = (await axios.get('/station')).data as StationData[];
      const res2 = (await axios.get('/charging_booth/')).data as ChargingData[];
      const totalSales = res2.reduce((acc, curr) => acc + curr.charging_rate * 10, 0);
      const totalEnergy = res2.reduce((acc, curr) => acc + curr.charging_rate, 0);
      const totalCustomers = res1.length;
      const totalStations = res2.length;
      const data = res1.map((station) => {
        return {
          id: station.id,
          name: station.name,
          location: station.location,
          total_charging_booth: res2.filter((charging) => charging.station_id === station.id).length,
          total_charging_rate: res2.filter((charging) => charging.station_id === station.id).reduce((acc, curr) => acc + (curr.charging_rate * 10), 0),
        };
      }
      );
      return { totalSales, totalEnergy, totalCustomers, totalStations , data};
    },
    {
      refetchInterval: 60000,
    }
  );

  const data: DataType[] = (stationData?.data || [])
  .sort((a, b) => b.total_charging_rate - a.total_charging_rate) // เรียงลำดับจากมากไปน้อย
  .slice(0, 3) // ดึงเอาเพียง 3 อันดับแรก
  .map((station: any) => {
    const MAX_CHARGING_RATE = 1000; // ตั้งค่า MAX_CHARGING_RATE ตามต้องการ
    const totalChargingRate = station.total_charging_rate || 0; // หากไม่มีค่าให้เป็น 0
    const progress = Math.min((totalChargingRate / MAX_CHARGING_RATE) * 100, 100); // คำนวณ progress ตามต้องการ
    const growthRate = calculateGrowthRate(station); // คำนวณอัตราการเติบโต
    return {
      progress,
      imgHeight: 27, // ตั้งค่า imgHeight ตามต้องการ
      title: `${station.name}`,
      color: 'success', // ตั้งค่า color ตามต้องการ
      amount: `฿${totalChargingRate}`,
      subtitle: `${growthRate}% Growth Rate`, // ใช้อัตราการเติบโตใน subtitle
      imgSrc: '/images/cards/logo-bitbank.png' // ตั้งค่า imgSrc ตามต้องการ
    };
  }) || [];

  function calculateGrowthRate(station: any) {
    const MAX_CHARGING_RATE = 1000; // ตั้งค่า MAX_CHARGING_RATE ตามต้องการ
    const totalChargingRate = station.total_charging_rate || 0; // หากไม่มีค่าให้เป็น 0
    const growthRate = Math.min((totalChargingRate / MAX_CHARGING_RATE) * 100, 100); // คำนวณ growthRate ตามต้องการ
    return growthRate;
  }
  
  


  return (
    <Card>
      <CardHeader
        title='Total Earning'
        titleTypographyProps={{ sx: { lineHeight: '1.6 !important', letterSpacing: '0.15px !important' } }}
        action={
          <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'text.secondary' }}>
            <DotsVertical />
          </IconButton>
        }
      />
      <CardContent sx={{ pt: theme => `${theme.spacing(2.25)} !important` }}>
        <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center' }}>
          <Typography variant='h4' sx={{ fontWeight: 600, fontSize: '2.125rem !important' }}>
            ฿{stationData?.totalSales}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
            <MenuUp sx={{ fontSize: '1.875rem', verticalAlign: 'middle' }} />
            <Typography variant='body2' sx={{ fontWeight: 600, color: 'success.main' }}>
              {stationData?.totalEnergy}%
            </Typography>
          </Box>
        </Box>

        <Typography component='p' variant='caption' sx={{ mb: 10 }}>
          Compared to ฿{stationData?.totalSales - stationData?.totalEnergy} in the last 24 hours
        </Typography>

        {data.map((item: DataType, index: number) => {
          return (
            <Box
              key={item.title}
              sx={{
                display: 'flex',
                alignItems: 'center',
                ...(index !== data.length - 1 ? { mb: 8.5 } : {})
              }}
            >
              <Avatar
                variant='rounded'
                sx={{
                  mr: 3,
                  width: 40,
                  height: 40,
                  backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.04)`
                }}
              >
                <img src={item.imgSrc} alt={item.title} height={item.imgHeight} />
              </Avatar>
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box sx={{ marginRight: 2, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant='body2' sx={{ mb: 0.5, fontWeight: 600, color: 'text.primary' }}>
                    <span style={{ color: 'red' }}>{item.title} </span> Station
                  </Typography>
                  <Typography variant='caption'>{item.subtitle}</Typography>
                </Box>

                <Box sx={{ minWidth: 85, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant='body2' sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
                    {item.amount}
                  </Typography>
                  <LinearProgress color={item.color} value={item.progress} variant='determinate' />
                </Box>
              </Box>
            </Box>
          )
        })}
      </CardContent>
    </Card>
  )
}

export default TotalEarning
