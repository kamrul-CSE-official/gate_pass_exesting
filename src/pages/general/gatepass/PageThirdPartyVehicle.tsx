import { useState } from 'react';
import axios from 'axios';
import { Box, Button, Container, FormControl, Grid, TextField } from '@mui/material';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Helmet } from 'react-helmet-async';
import * as Yup from 'yup';
import Lottie from 'lottie-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import Iconify from '../../../components/iconify';
import { useSettingsContext } from '../../../components/settings';
import { RHFAutocomplete, RHFTextField } from '../../../components/hook-form';

import empty from '../../../assets/illustrations/bus.json';
import { useAuthContext } from '../../../auth/useAuthContext';

export const NewGatePassSchema = Yup.object().shape({
  Busno: Yup.string().required('Bus No is required'),
  Location: Yup.string().required('Location is required'),
});
export default function PageThirdPartyVehicle() {
  const today = new Date();
  const { user } = useAuthContext();
  const { themeStretch } = useSettingsContext();
  const [fromDate, setFromDate] = useState<Date | null>(today);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('error');
  const [toDate, setToDate] = useState<Date | null>(() => {
    const toTime = new Date(today);
    toTime.setMinutes(today.getMinutes() + 15);
    return toTime;
  });

  const defaultValues = {
    BusNo: '',
    Location: '',
    InTime: '',
    OutTime: '',
  };
  const methods = useForm({
    resolver: yupResolver(NewGatePassSchema),
    defaultValues,
  });
  const { handleSubmit } = methods; 
  const handleSave = async (data:any) => {
    const obj = {
      BusNo: data.BusNo,
      Location: data.Location,
      InTime: data.InTime,
      OutTime: data.OutTime,
      EnterOn: today,
      EnterBy: user?.empID,
    };

    try {
      const response = await axios.post('http://localhost:8880/api/GatePass/SaveExternalBus', obj, {
        headers: { 'Content-Type': 'application/json' },
      });
      setAlertMessage('Updated! Please release');
      setAlertSeverity('success');
    } catch (error) {
      console.error('API call failed', error);
    }
  };


  return (
    <>
      <Helmet>
        <title>External Bus Entry | Gatepass</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Create a new Approver"
          links={[{ name: 'Gatepass' }, { name: 'External Bus Entry' }]}
          action={
            <Button variant="contained" startIcon={<Iconify icon="material-symbols:refresh" />}>
              Add
            </Button>
          }
        />
        <Box>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleSave)}>
              <Grid container spacing={2} padding={2}>
                <Grid item xs={2} sm={2} md={2}>
                  <RHFTextField
                    name="BusNo"
                    size="small"
                    label="Bus No"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={2} sm={2} md={2}>
                  <RHFTextField
                    name="Location"
                    size="small"
                    label="Location"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Grid item xs={2} sm={2} md={2}>
                    <TimePicker
                      label="From Date"
                      value={fromDate}
                      onChange={(newValue) => setFromDate(newValue)}
                      slots={{
                        textField: (params) => <TextField {...params} fullWidth size="small" />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={2} sm={2} md={2}>
                    <TimePicker
                      label="To Date"
                      value={toDate}
                      onChange={(newValue) => setToDate(newValue)}
                      slots={{
                        textField: (params) => <TextField {...params} fullWidth size="small" />,
                      }}
                    />
                  </Grid>
                </LocalizationProvider>
                <Grid item xs={2} sm={2} md={2}>
                  <Button type="submit" variant="contained">
                    Save
                  </Button>
                </Grid>
              </Grid>
            </form>
          </FormProvider>
        </Box>
      </Container>
    </>
  );
}
