import { ChangeEvent, useEffect, useState } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { DataGrid, GridColDef, GridRenderCellParams, GridRowParams } from '@mui/x-data-grid';
import {
  Button,
  Container,
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
  MenuItem as ManuI,
  SelectChangeEvent,
  Grid,
  TextField,
  Box,
  Checkbox,
  Snackbar,
  Alert,
} from '@mui/material';
import { useSettingsContext } from '../../../components/settings';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import Iconify from '../../../components/iconify';
import { useAuthContext } from '../../../auth/useAuthContext';

interface VehicleDetails {
  VehicleNo: String;
  VehicleID: number;
}
interface Driver {
  DriverName: String;
  DriverID: number;
}
interface Helper {
  HelperWithID: String;
  HelperID: number;
}

interface GatePassReqDetail {
  GatePassReqDetailID: number;
  ReqCode: string;
  DepartmentAndSection: string;
  GatePassType: string;
  GatePassReqHeaderID: number;
  TransportNo: string | number;
  DriverID: number;
  HelperID: number;
  Name: string;
}
export default function PageDriverAllocation() {
  const { themeStretch } = useSettingsContext();
  const { user } = useAuthContext();
  const [vehicleDetails, setVehicleDetails] = useState<VehicleDetails[]>([]);
  const [driverNames, setDriverNames] = useState<Driver[]>([]);
  const [helperDetails, setHelperDetails] = useState<Helper[]>([]);
  const [vehicleRecord, setVehicleRecord] = useState<GatePassReqDetail[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [textFieldValue, setTextFieldValue] = useState('');
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('error');

  const handleTextFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTextFieldValue(event.target.value);
  };
  const fetchDataSequentially = async () => {
    try {
      await fetchGatepassDetails();
      await fetchDriverDetails();
      await fetchHelperDetails();
      await fetchTransportDetails();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    fetchDataSequentially();
  }, []);
  const handleRequestReject = async () => {
    if (!textFieldValue) {
      setAlertMessage('Driver is not Selected.');
      setAlertSeverity('error');
      setOpenAlert(true);
      return;
    }
  
    const FinalList = selectedIds.map((rowId) => {
      const row = vehicleRecord.find((r) => r.GatePassReqDetailID === rowId);
      if (row) {
        return {
          GatePassReqDetailID: row.GatePassReqDetailID,
          Remarks: textFieldValue,
          EnteredBy: user!.empID,
        };
      }
      // If row is not found, we handle the error and return null
      setAlertMessage('Please select the gatepass');
      setAlertSeverity('error');
      setOpenAlert(true);
      return null;
    }).filter(Boolean); // Filter out null values
  
    if (FinalList.length > 0) {
      try {
        const response = await axios.post(
          'https://192.168.1.253:44783/NaturubWebAPI/api/Gatepass/RejectTransportAllocation',
          FinalList,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        setAlertMessage('Request processed successfully.');
        setAlertSeverity('success');
        setOpenAlert(true);
        fetchDataSequentially();
      } catch (error) {
        setAlertMessage('Failed to process request.');
        setAlertSeverity('error');
        setOpenAlert(true);
      }
    }
  };
  
  
  const handleCloseAlert = () => {
    setOpenAlert(false);
  };
  const handleSaveDriver = async () => {
    let FinalList: any[] = [];
  
    const rowsWithDrivers = selectedIds.map((rowId) => {
      const row = vehicleRecord.find((r) => r.GatePassReqDetailID === rowId);
      if (row) {
        if (row.DriverID === 0) {
          setAlertMessage('Driver is not Selected.');
          setAlertSeverity('error');
          setOpenAlert(true);
          FinalList = []; // Clear the list if a driver is not selected
          return null;
        }
        if (row.TransportNo != null) {
          return {
            GatePassReqDetailID: row.GatePassReqDetailID,
            TransportNo: row.TransportNo,
            Remarks: textFieldValue,
            EnteredBy: user!.empID,
            DriverID: row.DriverID,
            HelperID: row.HelperID,
          };
        }
      }
      return null;
    }).filter(Boolean); // Remove null values from the list
  
    if (FinalList.length > 0) {
      try {
        const response = await axios.post(
          'https://192.168.1.253:44783/NaturubWebAPI/api/Gatepass/UpdateTransportNo',
          FinalList,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        setAlertMessage('Request processed successfully.');
        setAlertSeverity('success');
        setOpenAlert(true);
        fetchDataSequentially();
      } catch (error) {
        setAlertMessage('Failed to process request.');
        setAlertSeverity('error');
        setOpenAlert(true);
      }
    }
  };
  
  const handleClearGrid = () => {
    fetchDataSequentially();
  };

  const fetchGatepassDetails = async () => {
    try {
      const response = await axios.post(
        'https://192.168.1.253:44783/NaturubWebAPI/api/Gatepass/GetGatePassForTransportNo'
      );
      setVehicleRecord(response.data);
    } catch (error) {
      console.error('API call failed', error);
    }
  };
  const fetchDriverDetails = async () => {
    try {
      const response = await axios.post('https://192.168.1.253:44783/NaturubWebAPI/api/Gatepass/GetDriverNames');
      setDriverNames(response.data);
    } catch (error) {
      console.error('API call failed', error);
    }
  };
  const fetchHelperDetails = async () => {
    try {
      const response = await axios.post(
        'https://192.168.1.253:44783/NaturubWebAPI/api/Gatepass/GetVehicleHelperDetails'
      );
      setHelperDetails(response.data);
    } catch (error) {
      console.error('API call failed', error);
    }
  };
  const fetchTransportDetails = async () => {
    try {
      const response = await axios.post('https://192.168.1.253:44783/NaturubWebAPI/api/Gatepass/GetAllVehicleDetails');
      setVehicleDetails(response.data);
    } catch (error) {
      console.error('API call failed', error);
    }
  };
  const handleChangeTransport = (event: SelectChangeEvent<any>, id: number) => {
    vehicleRecord.forEach((item) => {
      if (item.GatePassReqDetailID === id) {
        Object.assign(item, { TransportNo: event.target.value, DriverID: 0 });
        setVehicleRecord(vehicleRecord);
      } else if (item.GatePassReqDetailID == null) {
        Object.assign(item, { TransportNo: null });
        setVehicleRecord(vehicleRecord);
      }
    });
  };
  const handleChangeDriver = (event: SelectChangeEvent<any>, id: number) => {
    vehicleRecord.forEach((item) => {
      if (item.GatePassReqDetailID === id) {
        Object.assign(item, { DriverID: event.target.value });
        setVehicleRecord(vehicleRecord);
      } else if (item.GatePassReqDetailID == null) {
        Object.assign(item, { DriverID: null });
        setVehicleRecord(vehicleRecord);
      }
    });
  };
  const handleChangeHelper = (event: SelectChangeEvent<any>, id: number) => {
    vehicleRecord.forEach((item) => {
      if (item.GatePassReqDetailID === id) {
        Object.assign(item, { HelperID: event.target.value });
        setVehicleRecord(vehicleRecord);
      } else if (item.GatePassReqDetailID == null) {
        Object.assign(item, { HelperID: null });
        setVehicleRecord(vehicleRecord);
      }
    });
  };
  const getRowClassName = (params: GridRowParams) => {
    if (params.row.DriverID && params.row.TransportNo) {
      return 'non-null-row';
    }
    return 'null-row';
  };
  const handleCheckboxChange = (id: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
    }
  };
  const columns: GridColDef[] = [
    {
      field: 'checkbox',
      headerName: 'Actions',
      width: 80,
      renderCell: (params: GridRenderCellParams<GatePassReqDetail>) => (
        <Checkbox
          checked={selectedIds.includes(params.row.GatePassReqDetailID)}
          onChange={handleCheckboxChange(params.row.GatePassReqDetailID)}
        />
      ),
    },
    {
      field: 'ReqCode',
      headerName: 'Request Code',
      width: 140,
      editable: false,
      cellClassName: 'super-app-theme--cell',
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'DepartmentAndSection',
      headerName: 'Department & Section',
      width: 210,
      editable: false,
      cellClassName: 'super-app-theme--cell',
      headerClassName: 'super-app-theme--header',
    },

    {
      field: 'TransportNo',
      headerName: 'Transport No',
      width: 250,
      editable: true,
      renderCell: (item: any) => (
          <div
            className="d-flex justify-content-between align-items-center"
            style={{ cursor: 'pointer' }}
          >
            <FormControl sx={{ width: 400, height: 50, marginTop: '3px' }}>
              <InputLabel sx={{ height: 50 }} id="demo-multiple-name-label">
                Vehicle No
              </InputLabel>
              <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                value={item.row.TransportNo}
                sx={{ height: 40, width: 220, fontSize: 9 }}
                onChange={(e) => {
                  handleChangeTransport(e, item.row.GatePassReqDetailID);
                }}
                input={<OutlinedInput label="VehicleNo" />}
              >
                {vehicleDetails.map((type, index) => (
                  <ManuI key={index} value={String(type.VehicleNo)} style={{ fontSize: 9 }}>
                    {type.VehicleNo}
                  </ManuI>
                ))}
              </Select>
            </FormControl>
          </div>
        ),
      cellClassName: 'super-app-theme--cell',
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'DriverID',
      headerName: 'Change Driver',
      width: 250,
      editable: true,
      renderCell: (item: any) => (

          <div
            className="d-flex justify-content-between align-items-center"
            style={{ cursor: 'pointer' }}
          >
            <FormControl sx={{ width: 400, height: 50, marginTop: '3px' }}>
              <InputLabel sx={{ height: 50 }} id="demo-multiple-name-label">
                Driver Name
              </InputLabel>
              <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                // value={item.row.DriverID}
                value={item.row.DriverID === 0 ? '' : item.row.DriverID}
                sx={{ height: 40, width: 220, fontSize: 9 }}
                onChange={(e) => {
                  handleChangeDriver(e, item.row.GatePassReqDetailID);
                }}
                input={<OutlinedInput label="DriverID" />}
              >
                {driverNames.map((type, index) => (
                  <ManuI key={index} value={type.DriverID} style={{ fontSize: 9 }}>
                    {type.DriverName}
                  </ManuI>
                ))}
              </Select>
            </FormControl>
          </div>

              ),
      cellClassName: 'super-app-theme--cell',
      headerClassName: 'super-app-theme--header',
    },

    {
      field: 'HelperID',
      headerName: 'Helper',
      width: 250,
      editable: true,
      renderCell: (item: any) => (
          <div
            className="d-flex justify-content-between align-items-center"
            style={{ cursor: 'pointer' }}
          >
            <FormControl sx={{ width: 400, height: 50, marginTop: '3px' }}>
              <InputLabel sx={{ height: 50 }} id="demo-multiple-name-label">
                Helper Name
              </InputLabel>
              <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                // value={item.row.HelperID}
                value={item.row.HelperID === 0 ? '' : item.row.HelperID}
                sx={{ height: 40, width: 220, fontSize: 9 }}
                onChange={(e) => {
                  handleChangeHelper(e, item.row.GatePassReqDetailID);
                }}
                input={<OutlinedInput label="HelperID" />}
              >
                {helperDetails.map((type, index) => (
                  <ManuI key={index} value={type.HelperID} style={{ fontSize: 9 }}>
                    {/* {type.VehicleHelper} */}
                    {type.HelperWithID}
                  </ManuI>
                ))}
              </Select>
            </FormControl>
          </div>
        ),
      cellClassName: 'super-app-theme--cell',
      headerClassName: 'super-app-theme--header',
    },

    {
      field: 'Name',
      headerName: 'Request By-Destination-Remarks',
      width: 550,
      editable: false,
      cellClassName: 'super-app-theme--cell',
      headerClassName: 'super-app-theme--header',
    },
  ];
  return (
    <>
      <Helmet>
        <title> Driver allocation | Gatepass</title>
      </Helmet>
      <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
          <Alert onClose={handleCloseAlert} severity={alertSeverity}>
            {alertMessage}
          </Alert>
        </Snackbar>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Create a new Approver"
          links={[{ name: 'Gatepass' }, { name: 'Driver Allowcation' }]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="material-symbols:refresh" />}
              onClick={fetchDataSequentially}
            >
              Refresh
            </Button>
          }
        />
        <DataGrid
          sx={{
            border: '2px dotted #E5E0E0',
            borderRadius: '16px',
            padding: 2,
            marginTop: 1,
            width: '100%',
            margin: '0 auto',
            '& .MuiDataGrid-row.non-null-row': {
              backgroundColor: 'lightyellow',
              color: 'black',
              fontWeight: 'bold',
            },
            '& .MuiDataGrid-row.null-row': {
              backgroundColor: 'lightgreen',
              color: 'black',
              fontWeight: 'bold',
            },
          }}
          getRowClassName={getRowClassName}
          rows={vehicleRecord}
          getRowId={(row) => row.GatePassReqDetailID}
          columns={columns}
        />
        <Grid container spacing={2} justifyContent="center">
          <Grid
            item
            xs={12}
            sm={12}
            sx={{
              marginTop: 2,
            }}
          >
            <TextField
              label="Remarks"
              variant="outlined"
              fullWidth
              value={textFieldValue}
              onChange={handleTextFieldChange}
            />
          </Grid>
        </Grid>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: 2,
          }}
        >
          <Button variant="contained" onClick={handleSaveDriver} sx={{ marginRight: 1 }}>
            Save
          </Button>
          <Button
            variant="contained"
            onClick={handleRequestReject}
            color="info"
            sx={{ marginRight: 1 }}
          >
            Reject
          </Button>

          <Button variant="contained" onClick={handleClearGrid} color="error">
            Clear
          </Button>
        </Box>
      </Container>
    </>
  );
}
