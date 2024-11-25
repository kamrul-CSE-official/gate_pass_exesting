import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { Helmet } from 'react-helmet-async';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import Iconify from '../../../components/iconify';
import { useSettingsContext } from '../../../components/settings';
import { useAuthContext } from '../../../auth/useAuthContext';

interface GatePass {
  ReqCode: string;
  GatePassReqHeaderID: number;
  DepartmentAndSection: string;
  GatePassReqDetailID: number;
  InTime: string;
  OutTime: string;
  OutM: number;
  InM: number;
  GatePassType: string;
  GatePassTypeID: number;
  Name: string;
  TransportNo: string;
  HelperID: number;
  Image: Uint8Array;
  ImageBase64: string;
  DriverID: number;
  Remarks: string;
  EnteredBy: number;
  Quantity: number;
  ReceivedQuantity: number;
}

export default function PageSecurityCheck() {
  const { themeStretch } = useSettingsContext();
  const { user } = useAuthContext();
  const [openAlert, setOpenAlert] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [FinalList, setFinalList] = useState<any[]>([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('error');
  const [selectedValue, setSelectedValue] = useState<number>(1);
  const [gatepassSecurity, setGatepassSecurity] = useState<GatePass[]>([]);
  const [meterValues, setMeterValues] = useState<GatePass[]>(gatepassSecurity);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = Number(event.target.value);
    setSelectedValue(numericValue);
    fetchGatepass(numericValue);
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };
  const handleEditChange = (detailsID: number, field: keyof GatePass, value: string) => {
    // Update meterValues
    const updatedMeters = meterValues.map((item) =>
      item.GatePassReqDetailID === detailsID ? { ...item, [field]: value } : item
    );

    setMeterValues(updatedMeters);

    // Update gatepassSecurity
    const updatedGatepassSecurity = gatepassSecurity.map((item) =>
      item.GatePassReqDetailID === detailsID ? { ...item, [field]: value } : item
    );

    setGatepassSecurity(updatedGatepassSecurity);

    console.log('Updated Meters:', updatedMeters);
    console.log('Updated Gatepass Security:', updatedGatepassSecurity);
  };

  useEffect(() => {
    if (meterValues.length > 0) {
      handleSaveApproval(meterValues);
    }
  }, [meterValues]);
  const handleSelectionChange = (detailsID: number) => {
    setMeterValues((prevMeterValues) => {
      const isSelected = prevMeterValues.some((item) => item.GatePassReqDetailID === detailsID);

      let updatedMeterValues;

      if (isSelected) {
        // Remove item from selection
        updatedMeterValues = prevMeterValues.filter(
          (item) => item.GatePassReqDetailID !== detailsID
        );
      } else {
        // Add item to selection
        const selectedItem = gatepassSecurity.find(
          (item) => item.GatePassReqDetailID === detailsID
        );
        if (selectedItem) {
          updatedMeterValues = [...prevMeterValues, selectedItem];
        } else {
          updatedMeterValues = prevMeterValues;
        }
      }

      return updatedMeterValues;
    });
  };
  const handleSaveApproval = async (meterValue: GatePass[]) => {
    let z = 0;

    const FinalListS: any[] = [];
    meterValue.forEach((item) => {
      const finalObject: any = {};

      if (item.GatePassTypeID === 5 && (item.OutM !== 0 || item.InM !== 0)) {
        finalObject.GatePassReqDetailID = item.GatePassReqDetailID;
        finalObject.OutM = item.OutM;
        finalObject.InM = item.InM;
        FinalListS.push(finalObject);
      } else if (
        item.GatePassTypeID !== 5 &&
        item.GatePassTypeID !== 3 &&
        item.OutM === 0 &&
        item.InM === 0
      ) {
        finalObject.GatePassReqDetailID = item.GatePassReqDetailID;
        FinalListS.push(finalObject);
      } else if (item.GatePassTypeID === 3) {
        finalObject.GatePassReqDetailID = item.GatePassReqDetailID;
        finalObject.ReceivedQuantity = item.ReceivedQuantity;
        finalObject.GatePassTypeID = item.GatePassTypeID;
        finalObject.EnteredBy = user!.empID;
        FinalListS.push(finalObject);

        if (item.ReceivedQuantity > item.Quantity) {
          z += 1;
        }
      }
    });

    if (z > 0) {
      setAlertMessage('Receive qty is wrong');
      setAlertSeverity('error');
      setOpenAlert(true);
    } else if (meterValues.length > 0) {
      setFinalList(FinalListS);
      handleDialogOpen(); // Open the dialog if there are meter values
    } else {
      await callApi(FinalList);
    }
  };
  const callApi = async (FinalListP: any[]) => {
    try {
      const response = await axios.post(
        'https://192.168.1.253:44783/NaturubWebAPI/api/GatePass/UpdateStatus',
        FinalListP,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      setAlertMessage('Updated! Please release');
      setAlertSeverity('success');
      setOpenAlert(true);
      fetchGatepass(selectedValue);
    } catch (error) {
      console.error('API call failed', error);
    } finally {
      setOpenDialog(false); // Close the dialog after the API call
    }
  };
  const handleDialogConfirm = () => {
    callApi(FinalList); // Call the API if the user confirms
  };
  const fetchGatepass = async (gatepass: number) => {
    try {
      const response = await axios.post(
        'https://192.168.1.253:44783/NaturubWebAPI/api/GatePass/GetGatePassStatusForSecurityNew',
        {
          GatePassTypeID: gatepass,
        }
      );
      setGatepassSecurity(response.data);
    } catch (error) {
      console.error('API call failed', error);
    }
  };
  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };
  useEffect(() => {
    fetchGatepass(selectedValue);
  }, [selectedValue]);
  return (
    <>
      <Helmet>
        <title> Security Check | Gatepass</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Security Indexing"
          links={[{ name: 'Gatepass' }, { name: 'Security Check' }]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="mdi:security" />}
              // onClick={handleSaveApproval}
            >
              In/Out
            </Button>
          }
        />
        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>Confirm Update</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to proceed with the update?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleDialogConfirm} color="primary" autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
          <Alert onClose={handleCloseAlert} severity={alertSeverity}>
            {alertMessage}
          </Alert>
        </Snackbar>
        <Box
          sx={{
            border: '2px dotted #E5E0E0',
            borderRadius: '16px',
            padding: 2,
            marginTop: 1,
            width: '100%',
          }}
        >
          <FormControl component="fieldset">
            <RadioGroup
              aria-label="gatepass-type"
              name="gatepass-type"
              value={selectedValue}
              onChange={handleChange}
              row
            >
              <FormControlLabel
                value="1"
                control={<Radio sx={{ color: 'green' }} />}
                label={
                  <span style={{ color: 'green' }}>
                    <AssignmentIcon style={{ verticalAlign: 'middle' }} /> General
                  </span>
                }
              />
              <FormControlLabel
                value="2"
                control={<Radio sx={{ color: 'red' }} />}
                label={
                  <span style={{ color: 'red' }}>
                    <LocalHospitalIcon style={{ verticalAlign: 'middle' }} /> Medical
                  </span>
                }
              />
              <FormControlLabel
                value="3"
                control={<Radio sx={{ color: 'orange' }} />}
                label={
                  <span style={{ color: 'orange' }}>
                    <AssignmentReturnIcon style={{ verticalAlign: 'middle' }} /> Returnable
                  </span>
                }
              />
              <FormControlLabel
                value="4"
                control={<Radio sx={{ color: 'lightseagreen' }} />}
                label={
                  <span style={{ color: 'lightseagreen' }}>
                    <AssignmentIcon style={{ verticalAlign: 'middle' }} /> Non-Returnable
                  </span>
                }
              />
              <FormControlLabel
                value="5"
                control={<Radio sx={{ color: 'purple' }} />}
                label={
                  <span style={{ color: 'purple' }}>
                    <DirectionsCarIcon style={{ verticalAlign: 'middle' }} /> Vehicle
                  </span>
                }
              />
            </RadioGroup>
          </FormControl>
        </Box>
        <Grid container spacing={2} alignItems="start" direction="row">
          <Box
            sx={{
              border: '2px dotted #E5E0E0',
              borderRadius: '16px',
              marginTop: 5,
              width: '100%',
            }}
          >
            <Grid container spacing={2}>
              {gatepassSecurity.map((item, index) => (
                <Grid item xs={12} sm={3} md={3} key={index}>
                  <Card
                    // onClick={() => handleSelectionChange(item.GatePassReqDetailID)}
                    style={{
                      margin: '5px',
                      border: meterValues.some(
                        (m) => m.GatePassReqDetailID === item.GatePassReqDetailID
                      )
                        ? '2px solid red'
                        : 'none',
                    }}
                  >
                    {item.GatePassTypeID === 3 || item.GatePassTypeID === 4 ? (
                      <CardContent
                        sx={{
                          height: '100%', // Ensures the content fills the card
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          textAlign: 'center',
                        }}
                      >
                        <Typography
                          align="center"
                          gutterBottom
                          variant="subtitle2"
                          color="gray"
                          component="div"
                        >
                          {item.Name}
                        </Typography>
                      </CardContent>
                    ) : (
                      <Grid>
                        <CardMedia
                          component="img"
                          alt={String(item.GatePassReqHeaderID)}
                          sx={{ height: 200, objectFit: 'fill' }}
                          image={`data:image/png;base64,${item.ImageBase64}`}
                          title={String(item.GatePassReqHeaderID)}
                        />
                        <Typography align="center" gutterBottom variant="subtitle2" color="gray">
                          {item.Name}
                        </Typography>
                      </Grid>
                    )}
                    <CardContent sx={{ minHeight: 150 }}>
                      <Typography align="center" gutterBottom variant="subtitle2" color="gray">
                        {item.DepartmentAndSection}
                      </Typography>
                      <Typography align="center" variant="caption" color="gray">
                        {item.GatePassType}
                      </Typography>
                      <Typography
                        align="center"
                        variant="caption"
                        color="gray"
                        sx={{ marginLeft: 2 }}
                      >
                        {item.ReqCode}
                      </Typography>
                      {item.GatePassTypeID === 5 ? (
                        <>
                          <Typography align="left" variant="caption" color="gray" component="p">
                            Meter(Out):
                            <TextField
                              variant="outlined"
                              size="small"
                              value={item.OutM || ''}
                              onChange={(e) =>
                                handleEditChange(item.GatePassReqDetailID, 'OutM', e.target.value)
                              }
                              fullWidth
                              InputProps={{ readOnly: true }}
                            />
                          </Typography>
                          <Typography align="left" variant="caption" color="gray" component="p">
                            Meter(In):
                            <TextField
                              variant="outlined"
                              size="small"
                              value={item.InM || ''}
                              onChange={(e) =>
                                handleEditChange(item.GatePassReqDetailID, 'InM', e.target.value)
                              }
                              fullWidth
                            />
                          </Typography>
                        </>
                      ) : (
                        <>
                          <Typography align="left" variant="caption" color="gray" component="p">
                            In Time:
                            <TextField
                              variant="outlined"
                              size="small"
                              value={item.InTime || ''}
                              fullWidth
                              InputProps={{ readOnly: true }}
                            />
                          </Typography>
                          <Typography align="left" variant="caption" color="gray" component="p">
                            Out Time:
                            <TextField
                              variant="outlined"
                              size="small"
                              value={item.OutTime || ''}
                              fullWidth
                              InputProps={{ readOnly: true }}
                            />
                          </Typography>
                          {item.GatePassTypeID === 3 && (
                            <Typography align="left" variant="caption" color="gray" component="p">
                              Receive Qty:
                              <TextField
                                variant="outlined"
                                size="small"
                                value={item.ReceivedQuantity || ''}
                                onChange={(e) =>
                                  handleEditChange(
                                    item.GatePassReqDetailID,
                                    'ReceivedQuantity',
                                    e.target.value
                                  )
                                }
                                fullWidth
                              />
                            </Typography>
                          )}
                        </>
                      )}
                    </CardContent>
                    <CardActions>
                      <Box display="flex" justifyContent="flex-end" width="100%">
                        <Button
                          variant="contained"
                          startIcon={<Iconify icon="mdi:security" />}
                          onClick={(event) => {
                            event.stopPropagation();
                            handleSelectionChange(item.GatePassReqDetailID);
                            // handleSaveApproval();
                          }}
                        >
                          In/Out
                        </Button>
                      </Box>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
      </Container>
    </>
  );
}
