import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Alert, Box, Button, Checkbox, Container, Grid, Snackbar, TextField } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Helmet } from 'react-helmet-async';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import Iconify from '../../../components/iconify';
import { useSettingsContext } from '../../../components/settings';


interface EntryData {
  EntryID: number;
  Name: string;
  Purpose: string;
  InTime: Date | string;
  OutTime: Date | string;
  isActive: boolean;
}
export default function PageEntryCtl() {
  const today = new Date();

  const lastMonth = new Date();
  lastMonth.setMonth(today.getMonth() - 1);
  const { themeStretch } = useSettingsContext();
  const [fromDate, setFromDate] = useState<Date | null>(lastMonth);
  const [toDate, setToDate] = useState<Date | null>(today);
  const [gatepassEntry, setGatepassEntry] = useState<EntryData[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('error');

  const handleOutTimeEntry = async () => {
    const lst: any[] = [];
    for (let i = 0; i < selectedIds.length; i += 1) {
      lst.push({ EntryID: selectedIds[i] });
    }
    try {
      await Promise.all(
        selectedIds.map(async (id) => {
          const response = await axios.post(
            'https://192.168.1.253:44783/NaturubWebAPI/api/Gatepass/UpdateVisibilyOfEntryDate',
            lst,
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
        })
      );

      setAlertMessage('Update Successful');
      setAlertSeverity('success');
      setOpenAlert(true);
      fatchEntryData();
    } catch (error) {
      console.error('API call failed', error);
    }
  };
  const handleCheckboxChange = (id: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
    }
  };
  const columns : GridColDef[] = [
    {
        field: 'checkbox',
        headerName: 'Actions',
        width: 80,
        renderCell: (params: GridRenderCellParams<EntryData>) => (
          <Checkbox
            checked={selectedIds.includes(params.row.EntryID)}
            onChange={handleCheckboxChange(params.row.EntryID)}
          />
        ),
      },
    {
      field: "Name",
      headerName: "Name",
      width: 200,
      editable: false,
      cellClassName: 'super-app-theme--cell',
      headerClassName: 'super-app-theme--header'
    },
    {
        field: "Purpose",
        headerName: "Purpose",
        width: 150,
        editable: false,
        cellClassName: 'super-app-theme--cell',
        headerClassName: 'super-app-theme--header'
    },
    {
      field: "InTime",
      headerName: "InTime",
      type: "dateTime",
      valueGetter: (value: any) => value && new Date(value),
      width: 200,
      editable: false,
      cellClassName: 'super-app-theme--cell',
      headerClassName: 'super-app-theme--header'
    },
    {
      field: "OutTime",
      headerName: "OutTime",
      type: "dateTime",
      valueGetter: (value: any) => value && new Date(value), 
      width: 200,
      editable: false,
      cellClassName: 'super-app-theme--cell',
      headerClassName: 'super-app-theme--header'
    },
    
    {
      field: "isActive",
      headerName: "Hide",
      editable: false,
      flex:1,
      cellClassName: 'super-app-theme--cell',
      headerClassName: 'super-app-theme--header'
    }, 
  ];
  const handleCloseAlert = () => {
    setOpenAlert(false);
  };
  const fatchEntryData = useCallback(async () => {
    try {
      const response = await axios.post('https://192.168.1.253:44783/NaturubWebAPI/api/Gatepass/GetEntryDataForHide', {
        fromDate,
        toDate,
      });
      setGatepassEntry(response.data);
    } catch (error) {
      console.error('API call failed', error);
    }
  }, [fromDate, toDate]);
  useEffect(() => {
    fatchEntryData();
  },[fatchEntryData]);
  return (
    <>
      <Helmet>
        <title>Entry Data Hide/Show | Gatepass</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Entry Data Show/Hide"
          links={[{ name: 'Gatepass' }, { name: 'Entry Data Control' }]}
          action={
            <Button variant="contained" startIcon={<Iconify icon="material-symbols:refresh" />} onClick={handleOutTimeEntry}>
              Show/Hide
            </Button>
          }
        />
        <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
          <Alert onClose={handleCloseAlert} severity={alertSeverity}>
            {alertMessage}
          </Alert>
        </Snackbar>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box
            sx={{
              border: '2px dotted #E5E0E0',
              borderRadius: '16px',
              padding: 2,
              marginTop: 1,
              width: '100%',
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Grid container spacing={2}>
                <Grid item xs={5} sm={5} md={5}>
                  <DatePicker
                    label="From Date"
                    value={fromDate}
                    onChange={(newValue) => setFromDate(newValue)}
                    slots={{
                      textField: (params) => <TextField {...params} fullWidth size="small" />,
                    }}
                  />
                </Grid>
                <Grid item xs={5} sm={5} md={5}>
                  <DatePicker
                    label="To Date"
                    value={toDate}
                    onChange={(newValue) => setToDate(newValue)}
                    slots={{
                      textField: (params) => <TextField {...params} fullWidth size="small" />,
                    }}
                  />
                </Grid>
                <Grid item xs={2}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <Button variant="contained" color="primary" fullWidth>
                      Submit
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </LocalizationProvider>
          </Box>
        </LocalizationProvider>
        <DataGrid
          sx={{
            border: '2px dotted #E5E0E0',
            borderRadius: '16px',
            padding: 2,
            marginTop: 5,

            width: '100%',
            display: 'flex',
          }}
          rows={gatepassEntry}
          getRowId={(row) => row.EntryID}
          columns={columns}
        />
      </Container>
    </>
  );
}
