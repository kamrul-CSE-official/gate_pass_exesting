import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import Lottie from 'lottie-react';
import axios from 'axios';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import {
  Alert,
  Autocomplete,
  Avatar,
  Box,
  Button,
  Card,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  makeStyles,
  Snackbar,
  Step,
  StepLabel,
  Stepper,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import Receipt from '@mui/icons-material/Receipt';
import ADD from '@mui/icons-material/Add';
import Person from '@mui/icons-material/Person';
import Person2 from '@mui/icons-material/Person2';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSettingsContext } from '../../components/settings';
import { RHFAutocomplete, RHFTextField } from '../../components/hook-form';
import Iconify from '../../components/iconify';
import empty from '../../assets/illustrations/request.json';
import emptyI from '../../assets/illustrations/empty.json';
import { useAuthContext } from '../../auth/useAuthContext';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';

export const NewGatePassSchema = Yup.object().shape({
  empno: Yup.string()
    .required('Employee No is required')
    .matches(/^[0-9]+$/, 'Employee No must be a number'),
  type: Yup.string().required('Type is required'),
  remarks: Yup.string().required('Remarks are required'),
});
interface Employee {
  Id: number;
  Company: string;
  CompanyID: number;
  CostCenter: string;
  CostCenterID: number;
  EMPNO: string | null;
  FullName: string;
  Image: string;
  StoreID: number;
  ItemID: number;
  ItemDsc: string;
  Qty: number;
  ImageBase64: string;
  ItemImage: string | null;
  Location: string;
  SectionName: string;
  GatepassID: number;
  SubCostCenter: string;
  SubCostCenterID: number;
  GRP_EMP_NO: number;
  FirstSubCostRequisitionApprovalID: number;
  SecondSubCostRequisitionApprovalID: number;
}
interface SectionWiseApproval {
  SubCostRequisitionApprovalID: number;
  ApproveUser: string;
  EmpBase64?: string;
}
interface store {
  StoresID: number;
  Stores: string;
}
interface UserDetails {
  Id: number;
  CostCenterID: number;
  EMPNO: string;
  EmpBase64?: string;
  FullName: string;
  Grpno: number;
  SubCostCenterID: number;
  SubCostCenter: string;
  ItemID: number;
  ItemDescription: string;
  StoreID: number;
  StoreName: string;
  EmpID: number;
  Qty: number;
  ApxPickup: string;
  ApxReturn: string;
  Destination: string;
  remarks: string;
}
interface Item {
  ItemID: number;
  ItemCode: string;
  ItemDescription: string;
  StoreID: number;
  StoreName: string;
  Qty: number;
  Remarks: number;
}

export default function PageGatepassRequest() {
  const { themeStretch } = useSettingsContext();
  const [employyeDetails, setEmployyeDetails] = useState<Employee[]>([]);
  const [firstApprover, setFirstApprover] = useState<SectionWiseApproval[]>([]);
  const [secondApprover, setSecondApprover] = useState<SectionWiseApproval[]>([]);
  const [firstApprovalIndex, setFirstApprovalIndex] = useState(-1);
  const [secondApprovalIndex, setSecondApprovalIndex] = useState(-1);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const [stores, setStores] = useState<store[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [openAlert, setOpenAlert] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('error');
  const [detailsArray, setDetailsArray] = useState<UserDetails[]>([]);
  const { user } = useAuthContext();
  const columnsForEmp: GridColDef[] = [
    { field: 'EMPNO', headerName: 'Employee No', width: 120 },
    {
      field: 'ImageBase64',
      headerName: 'Image',
      width: 80,
      renderCell: (params) => {
        const base64String = params.row.EmpBase64 || '';
        return (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100%',
            }}
          >
            <Avatar
              src={`data:image/png;base64,${base64String}`}
              alt="Request Image"
              sx={{
                width: 56, // Adjust the width to desired size
                height: 56, // Adjust the height to desired size
                objectFit: 'cover', // Use cover to maintain aspect ratio
                borderRadius: '50%',
              }}
            />
          </Box>
        );
      },
    },
    { field: 'FullName', headerName: 'Full Name', flex: 1 },
    { field: 'SubCostCenter', headerName: 'Section', flex: 1 },
    { field: 'remarks', headerName: 'Remarks', flex: 1 },
  ];
  const columnsItem: GridColDef[] = [
    { field: 'StoreName', headerName: 'Store', width: 130 },
    { field: 'ItemDescription', headerName: 'Item Description', width: 600 },
    { field: 'Qty', headerName: 'Qty', flex: 1 },
    { field: 'remarks', headerName: 'Remarks', flex: 1 },
  ];
  const columnsForVehicle: GridColDef[] = [
    { field: 'EMPNO', headerName: 'Employee No', width: 120 },
    {
      field: 'ImageBase64',
      headerName: 'Image',
      width: 80,
      renderCell: (params) => {
        const base64String = params.row.EmpBase64 || '';
        return (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100%',
            }}
          >
            <Avatar
              src={`data:image/png;base64,${base64String}`}
              alt="Request Image"
              sx={{
                width: 56, // Adjust the width to desired size
                height: 56, // Adjust the height to desired size
                objectFit: 'cover', // Use cover to maintain aspect ratio
                borderRadius: '50%',
              }}
            />
          </Box>
        );
      },
    },
    { field: 'FullName', headerName: 'Full Name', flex: 1 },
    { field: 'SubCostCenter', headerName: 'Section', flex: 1 },
    { field: 'ApxPickup', headerName: 'Pickup Time', flex: 1 },
    { field: 'ApxReturn', headerName: 'Return Time', flex: 1 },
    { field: 'Destination', headerName: 'Destination', flex: 1 },
    { field: 'remarks', headerName: 'Remarks', flex: 1 },
  ];
  const defaultValues = {
    empno: '',
    apxPickup: '',
    apxReturn: '',
    destination: '',
    company: '',
    companyID: '',
    storeId: 0,
    storename: '',
    itemId: 0,
    costCenter: '',
    costCenterID: 0,
    fullName: '',
    image: '',
    itemID: 0,
    itemDsc: '',
    qty: 0,
    remarks: '',
    imageBase64: '',
    itemImage: '',
    location: '',
    grpno: '',
    EmpID: '',
    sectionName: '',
    subCostCenter: '',
    gatepassID: 0,
    subCostCenterID: 0,
    firstSubCostRequisitionApprovalID: '',
    secondSubCostRequisitionApprovalID: '',
  };
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleGatePass = (int: number) => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setValue('gatepassID', int);
    fetchData();
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    handleClearGrid();
  };

  const handleFirstApprovalClick = (index: any) => {
    console.log('First approval selected:', index);
    handleNext();
    setFirstApprovalIndex(index);
    setValue('firstSubCostRequisitionApprovalID', index.SubCostRequisitionApprovalID);
  };
  const handleSaveApproval = async () => {
    const firstSubCostRequisitionApprovalID = watch('firstSubCostRequisitionApprovalID');
    const secondSubCostRequisitionApprovalID = watch('secondSubCostRequisitionApprovalID');

    let requestListData = [];
    requestListData = detailsArray;
    const payload = {
      objReq: {
        CompanyID: employyeDetails[0].CompanyID,
        ServiceDepartmentID: 0,
        CostCenterID: detailsArray[0].CostCenterID,
        SubCostCenterID: detailsArray[0].SubCostCenterID,
        LocationID: 0,
        FirstAppUserID: firstSubCostRequisitionApprovalID,
        SecAppUserID: secondSubCostRequisitionApprovalID,
        GatePassTypeID: gatepassID,
        GatePassStatusID: 1,
        EnteredBy: user!.empID,
      },
      lstReqDetail: requestListData,
    };

    const response = await axios.post(
      'https://192.168.1.253:44783/NaturubWebAPI/api/Gatepass/SaveGatePassRequest',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    setAlertMessage(`Request processed successfully.${response.data}`);
    setAlertSeverity('success');
    setOpenAlert(true);
    setDetailsArray([]);
    setEmployyeDetails([]);
    requestListData = [];
    setActiveStep(0);
    setOpenDialog(false);
  };

  const handleClearGrid = () => {
    setDetailsArray([]);
    setEmployyeDetails([]);
    setActiveStep(0);
  };
  const handleSecondApprovalClick = (index: any) => {
    console.log('Second approval selected:', index);
    handleNext();
    setSecondApprovalIndex(index);
    setValue('secondSubCostRequisitionApprovalID', index.SubCostRequisitionApprovalID);
  };

  const methods = useForm({
    resolver: yupResolver(NewGatePassSchema),
    defaultValues,
  });
  const addDetail = (employeeDetails: any) => {
    const remarks = watch('remarks');
    if (remarks === '') {
      setAlertMessage(`Please add remarks`);
      setAlertSeverity('error');
      setOpenAlert(true);
    } else {
      const storeId = watch('storeId');
      const storename = watch('storename');
      const itemId = watch('itemId');
      const itemDsc = watch('itemDsc');
      const qty = watch('qty');
      const apxPickup = watch('apxPickup');
      const apxReturn = watch('apxReturn');
      const destination = watch('destination');
      const newDetail: UserDetails = {
        Id: employeeDetails[0]?.Id || 0,
        CostCenterID: employeeDetails[0]?.CostCenterID || 0,
        EMPNO: employeeDetails[0]?.EMPNO || '',
        EmpBase64: employeeDetails[0]?.ImageBase64 || '',
        FullName: employeeDetails[0]?.FullName || '',
        SubCostCenterID: employeeDetails[0]?.SubCostCenterID || 0,
        SubCostCenter: employeeDetails[0]?.SubCostCenter || '',
        Grpno: employeeDetails[0]?.GRP_EMP_NO || 0,
        EmpID: employeeDetails[0]?.GRP_EMP_NO || 0,
        remarks,
        ItemDescription: itemDsc,
        StoreID: storeId,
        StoreName: storename,
        Qty: qty,
        ItemID: itemId,
        ApxPickup: apxPickup,
        ApxReturn: apxReturn,
        Destination: destination,
      };

      setDetailsArray((prev) => {
        const isDuplicate = prev.some((detail) => detail.Grpno === newDetail.Grpno);
        if (isDuplicate) {
          return prev.map((detail) => (detail.Grpno === newDetail.Grpno ? newDetail : detail));
        }
        return [...prev, newDetail];
      });

      setValue('empno', '');
      setValue('remarks', '');
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
    setActiveStep(0);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  useEffect(() => {
    const fetchloggerDetails = async () => {
      try {
        const response = await axios.post(
          'https://192.168.1.253:44783/NaturubWebAPI/api/User/GetRequesterDetails',
          {
            empid: user?.empID,
            empno: '',
          }
        );
        setEmployyeDetails(response.data);
      } catch (error) {
        console.error('API call failed', error);
      }
    };
    fetchloggerDetails();
    fatchStore();
  }, [user?.empID]);

  const fatchStore = async () => {
    try {
      const [firstApprsResponse] = await Promise.all([
        axios.get<store[]>('https://192.168.1.253:44783/NaturubWebAPI/api/Gatepass/GetStores'),
      ]);
      setStores(firstApprsResponse.data);
    } catch (e) {
      console.log(e);
    }
  };
  const fatchItem = async () => {
    const StoresID = getValues('storeId');
    console.log("Stores id: ",StoresID);
    try {
      const [firstApprsResponse] = await Promise.all([
        axios.post<Item[]>(
          'https://192.168.1.253:44783/NaturubWebAPI/api/User/GetItemDescriptionGatepass',
          {
            StoresID,
          }
        ),
      ]);
      setItems(firstApprsResponse.data);
    } catch (e) {
      console.log(e);
    }
  };
  const fetchData = async () => {
    const gatepassID = watch('gatepassID');
    const firstPerm = {
      ApprovalStatusID: 1,
      SubCostCenterID: employyeDetails.length !== 0 ? employyeDetails[0].SubCostCenterID : 1064,
      GatepassType: gatepassID,
    };
    const secondPerm = {
      ApprovalStatusID: 2,
      SubCostCenterID: employyeDetails.length !== 0 ? employyeDetails[0].SubCostCenterID : 1064,
      GatepassType: gatepassID,
    };
    try {
      const [firstApprsResponse, transporterRes] = await Promise.all([
        axios.post<SectionWiseApproval[]>(
          'https://192.168.1.253:44783/NaturubWebAPI/api/User/GetApprovalUserGatepass',
          firstPerm
        ),
        axios.post<SectionWiseApproval[]>(
          'https://192.168.1.253:44783/NaturubWebAPI/api/User/GetApprovalUserGatepass',
          secondPerm
        ),
      ]);

      setFirstApprover(firstApprsResponse.data);
      setSecondApprover(transporterRes.data);
      setOpen(true);
    } catch (error) {
      console.error(`Error fetching data: ${error}`);
    }
  };

  const handleKeyPress = async (data: any) => {
    const empnoValue = watch('empno');

    try {
      const response = await axios.post(
        'https://192.168.1.253:44783/NaturubWebAPI/api/User/GetRequesterDetails',
        {
          empno: empnoValue,
        }
      );
      setEmployyeDetails(response.data);
    } catch (error) {
      console.error('API call failed', error);
    }
  };
  const buttons = [
    { icon: 'akar-icons:reciept', title: 'General', color: 'green', id: 1 },
    { icon: 'jam:medical', title: 'Medical', color: 'red', id: 2 },
    { icon: 'streamline:return-2-solid', title: 'Returnable', color: 'orange', id: 3 },
    { icon: 'material-symbols:place-item-rounded', title: 'Non-Returnable', color: 'blue', id: 4 },
    { icon: 'material-symbols:transportation-outline', title: 'Vehicle', color: 'purple', id: 5 },
  ];
  const { watch, setValue, getValues } = methods;
  const gatepassID = watch('gatepassID');

  let columns;

  if (gatepassID === 1 || gatepassID === 2) {
    columns = columnsForEmp;
  } else if (gatepassID === 3 || gatepassID === 4) {
    columns = columnsItem;
  } else {
    columns = columnsForVehicle;
  }
  return (
    <>
      <Helmet>
        <title> Request | Gatepass Request</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Create a new Gatepass"
          links={[{ name: 'Gatepass' }, { name: 'Request' }]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleClickOpen}
            >
              New Request
            </Button>
          }
        />
        <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
          <Alert onClose={handleCloseAlert} severity={alertSeverity}>
            {alertMessage}
          </Alert>
        </Snackbar>
        <FormProvider {...methods}>
          <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Request Process</DialogTitle>
            <DialogContent>
              <Stepper
                activeStep={activeStep}
                alternativeLabel
                sx={{
                  borderRadius: '10px',
                  padding: '20px',
                }}
              >
                <Step>
                  <StepLabel
                    StepIconComponent={({ active, completed, className }) => (
                      <Receipt
                        className={className}
                        sx={{ color: active || completed ? 'primary.main' : 'text.disabled' }}
                      />
                    )}
                    sx={{ color: 'text.primary' }}
                  >
                    Gate-Pass
                  </StepLabel>
                </Step>
                <Step>
                  <StepLabel
                    StepIconComponent={({ active, completed, className }) => (
                      <Person
                        className={className}
                        sx={{ color: active || completed ? 'primary.main' : 'text.disabled' }}
                      />
                    )}
                    sx={{ color: 'text.primary' }}
                  >
                    First Approver
                  </StepLabel>
                </Step>
                <Step>
                  <StepLabel
                    StepIconComponent={({ active, completed, className }) => (
                      <Person2
                        className={className}
                        sx={{ color: active || completed ? 'primary.main' : 'text.disabled' }}
                      />
                    )}
                    sx={{ color: 'text.primary' }}
                  >
                    Second Approver
                  </StepLabel>
                </Step>
                <Step>
                  <StepLabel
                    StepIconComponent={({ active, completed, className }) => (
                      <ADD
                        className={className}
                        sx={{ color: active || completed ? 'red' : 'text.disabled' }}
                      />
                    )}
                    sx={{ color: 'text.primary' }}
                  >
                    Person/Item
                  </StepLabel>
                </Step>
              </Stepper>
              <Grid container spacing={2} alignItems="center" justifyContent="center">
                {activeStep === 0 && (
                  <>
                    {buttons.map((button, index) => (
                      <Grid item xs={12} sm={6} md={2.3} key={index}>
                        <Box display="flex" flexDirection="column" alignItems="center">
                          <Button
                            size="large"
                            style={{ padding: '20px' }}
                            onClick={() => {
                              handleGatePass(button.id);
                            }}
                          >
                            <Iconify
                              icon={button.icon}
                              width={50}
                              height={50}
                              style={{ color: button.color }}
                            />
                          </Button>
                          <Typography
                            variant="body1"
                            style={{ marginTop: '10px', fontSize: '12px', fontWeight: 'bolder' }}
                          >
                            {button.title}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </>
                )}
                {activeStep === 1 && (
                  <>
                    {firstApprover.map((first, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            marginBottom: '10px',
                          }}
                          onClick={() => handleFirstApprovalClick(first)}
                        >
                          <div style={{ position: 'relative' }}>
                            <img
                              src={`data:image/jpeg;base64,${first.EmpBase64}`}
                              alt="Rounded"
                              style={{
                                width: '150px',
                                height: '150px',
                                objectFit: 'cover',
                                borderRadius: '50%',
                                border: `2px dotted ${
                                  firstApprovalIndex === index ? 'green' : '#E5E0E0'
                                }`,
                              }}
                            />
                          </div>
                          <Typography
                            variant="body1"
                            sx={{
                              textAlign: 'center',
                              fontSize: '11px',
                              fontWeight: 'bold',
                              color: '#333',
                              marginTop: '5px',
                            }}
                          >
                            {first.ApproveUser}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </>
                )}
                {activeStep === 2 && (
                  <>
                    {secondApprover.map((button, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            cursor: 'pointer',
                            marginBottom: '10px',
                          }}
                          onClick={() => handleSecondApprovalClick(button)}
                        >
                          <div style={{ position: 'relative' }}>
                            <img
                              src={`data:image/jpeg;base64,${button.EmpBase64}`}
                              alt="Rounded"
                              style={{
                                width: '150px',
                                height: '150px',
                                objectFit: 'cover',
                                borderRadius: '50%',
                                border: `2px dotted ${
                                  secondApprovalIndex === index ? 'green' : '#E5E0E0'
                                }`,
                              }}
                            />
                          </div>
                          <Typography
                            variant="body1"
                            sx={{
                              textAlign: 'center',
                              fontSize: '11px',
                              fontWeight: 'bold',
                              color: '#333',
                              marginTop: '5px',
                            }}
                          >
                            {button.ApproveUser}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </>
                )}
                {activeStep === 3 && (
                  <>
                    {gatepassID === 1 || gatepassID === 2 ? (
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={3}>
                          <RHFTextField
                            name="empno"
                            size="small"
                            label="Employee No"
                            InputLabelProps={{ shrink: true }}
                            onBlur={handleKeyPress}
                          />
                        </Grid>
                        <Grid item xs={12} sm={7}>
                          <RHFTextField
                            name="remarks"
                            size="small"
                            label="Remarks"
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Button
                            variant="contained"
                            startIcon={<Iconify icon="lets-icons:add-duotone" color="white" />}
                            fullWidth
                            onClick={() => {
                              addDetail(employyeDetails);
                            }}
                          >
                            Add
                          </Button>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                          <Card
                            sx={{
                              border: '2px dotted #E5E0E0',
                              borderRadius: '16px',
                              padding: 2,
                              marginTop: 1,
                              width: '100%', // Ensure the Card fills the available width
                              margin: '0 auto', // Center the Card horizontally

                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <Grid container justifyContent="center" alignItems="center" spacing={2}>
                              {employyeDetails.length !== 0 ? (
                                <>
                                  <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    justifyContent="center"
                                    alignItems="center"
                                    sx={{ display: 'flex' }}
                                  >
                                    <Box
                                      sx={{
                                        width: 150,
                                        height: 150,
                                        borderRadius: '50%',
                                        border: '2px dotted #E5E0E0',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        position: 'relative',
                                      }}
                                    >
                                      <Box
                                        component="img"
                                        src={`data:image/png;base64,${
                                          employyeDetails[0]?.ImageBase64 || ''
                                        }`}
                                        alt="Rounded"
                                        sx={{
                                          width: '100%',
                                          height: '100%',
                                          objectFit: 'fill',
                                          borderRadius: '50%',
                                        }}
                                      />
                                    </Box>
                                  </Grid>
                                  <Grid item xs={12} sm={12}>
                                    <Card
                                      sx={{
                                        textAlign: 'center',
                                        border: '2px dotted #E5E0E0',
                                        padding: 2,
                                      }}
                                    >
                                      <Typography variant="h6">
                                        {employyeDetails[0]?.FullName}
                                      </Typography>
                                      <Typography variant="body2">
                                        {employyeDetails[0]?.CostCenter}
                                      </Typography>
                                      <Typography variant="body2">
                                        {employyeDetails[0]?.SubCostCenter}
                                      </Typography>
                                      <Typography variant="body2">
                                        {employyeDetails[0]?.Company}
                                      </Typography>
                                      <Typography variant="body2">
                                        {employyeDetails[0]?.EMPNO}
                                      </Typography>
                                    </Card>
                                  </Grid>
                                </>
                              ) : (
                                <Lottie animationData={empty} loop />
                              )}
                            </Grid>
                          </Card>
                        </Grid>
                      </Grid>
                    ) : gatepassID === 3 || gatepassID === 4 ? (
                      <Grid container spacing={2} padding={2}>
                        <Grid item xs={12} sm={5}>
                          <Controller
                            name="storeId"
                            control={methods.control}
                            render={({ field, fieldState: { error } }) => (
                              <Autocomplete
                                options={stores}
                                getOptionLabel={(option) => option.Stores || ''}
                                isOptionEqualToValue={(option, value) =>
                                  option.StoresID === value.StoresID
                                }
                                value={stores.find((cust) => cust.StoresID === field.value) || null}
                                onChange={(event, newValue) => {
                                  setValue('storeId', newValue ? newValue.StoresID : 0);
                                  setValue('storename', newValue ? newValue.Stores : '');
                                  fatchItem();
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Stores"
                                    error={!!error}
                                    size="small"
                                    helperText={error ? error.message : ''}
                                  />
                                )}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Controller
                            name="itemId"
                            control={methods.control}
                            render={({ field, fieldState: { error } }) => (
                              <Autocomplete
                                options={items}
                                getOptionLabel={(option) => option.ItemDescription || ''}
                                isOptionEqualToValue={(option, value) =>
                                  option.ItemDescription === value.ItemDescription
                                }
                                onChange={(event, newValue) => {
                                  setValue('itemId', newValue ? newValue.ItemID : 0);
                                  setValue('itemDsc', newValue ? newValue.ItemDescription : '');
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="item"
                                    error={!!error}
                                    size="small"
                                    helperText={error ? error.message : ''}
                                  />
                                )}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <RHFTextField
                            name="qty"
                            size="small"
                            type="number"
                            label="qty"
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={7}>
                          <RHFTextField
                            name="remarks"
                            size="small"
                            multiline
                            label="Remarks"
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Button
                            variant="contained"
                            startIcon={<Iconify icon="lets-icons:add-duotone" color="white" />}
                            fullWidth
                            onClick={() => {
                              const remarks = watch('remarks');
                              if (remarks !== '') {
                                addDetail(employyeDetails);
                              } else {
                                setAlertMessage(`Please add remarks`);
                                setAlertSeverity('error');
                                setOpenAlert(true);
                              }
                            }}
                          >
                            Add
                          </Button>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                          <Card
                            sx={{
                              border: '2px dotted #E5E0E0',
                              borderRadius: '16px',
                              padding: 2,
                              marginTop: 1,
                              width: '100%',
                              margin: '0 auto',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <Grid container justifyContent="center" alignItems="center" spacing={2}>
                              <Grid
                                item
                                xs={12}
                                sm={12}
                                justifyContent="center"
                                alignItems="center"
                                sx={{ display: 'flex' }}
                              >
                                <Lottie animationData={empty} loop />
                              </Grid>
                            </Grid>
                          </Card>
                        </Grid>
                      </Grid>
                    ) : (
                      <>
                        <Grid item xs={12} sm={3}>
                          <RHFTextField
                            name="empno"
                            size="small"
                            label="Employee No"
                            InputLabelProps={{ shrink: true }}
                            onBlur={handleKeyPress}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <RHFTextField
                            name="apxPickup"
                            size="small"
                            label="Apx. Pickup Time"
                            type="datetime-local"
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <RHFTextField
                            name="apxReturn"
                            size="small"
                            label="Apx. Return Time"
                            type="datetime-local"
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <RHFTextField
                            name="destination"
                            size="small"
                            label="Destination"
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <RHFTextField
                            name="remarks"
                            size="small"
                            label="Remarks"
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Button
                            variant="contained"
                            startIcon={<Iconify icon="lets-icons:add-duotone" color="white" />}
                            fullWidth
                            onClick={() => {
                              addDetail(employyeDetails);
                            }}
                          >
                            Add
                          </Button>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                          <Card
                            sx={{
                              border: '2px dotted #E5E0E0',
                              borderRadius: '16px',
                              padding: 2,
                              marginTop: 1,
                              width: '100%', // Ensure the Card fills the available width
                              margin: '0 auto', // Center the Card horizontally

                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <Grid container justifyContent="center" alignItems="center" spacing={2}>
                              {employyeDetails.length !== 0 ? (
                                <>
                                  <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    justifyContent="center"
                                    alignItems="center"
                                    sx={{ display: 'flex' }}
                                  >
                                    <Box
                                      sx={{
                                        width: 150,
                                        height: 150,
                                        borderRadius: '50%',
                                        border: '2px dotted #E5E0E0',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        position: 'relative',
                                      }}
                                    >
                                      <Box
                                        component="img"
                                        src={`data:image/png;base64,${
                                          employyeDetails[0]?.ImageBase64 || ''
                                        }`}
                                        alt="Rounded"
                                        sx={{
                                          width: '100%',
                                          height: '100%',
                                          objectFit: 'fill',
                                          borderRadius: '50%',
                                        }}
                                      />
                                    </Box>
                                  </Grid>
                                  <Grid item xs={12} sm={12}>
                                    <Card
                                      sx={{
                                        textAlign: 'center',
                                        border: '2px dotted #E5E0E0',
                                        padding: 2,
                                      }}
                                    >
                                      <Typography variant="h6">
                                        {employyeDetails[0]?.FullName}
                                      </Typography>
                                      <Typography variant="body2">
                                        {employyeDetails[0]?.CostCenter}
                                      </Typography>
                                      <Typography variant="body2">
                                        {employyeDetails[0]?.SubCostCenter}
                                      </Typography>
                                      <Typography variant="body2">
                                        {employyeDetails[0]?.Company}
                                      </Typography>
                                      <Typography variant="body2">
                                        {employyeDetails[0]?.EMPNO}
                                      </Typography>
                                    </Card>
                                  </Grid>
                                </>
                              ) : (
                                <Lottie animationData={empty} loop />
                              )}
                            </Grid>
                          </Card>
                        </Grid>
                      </>
                    )}
                  </>
                )}
              </Grid>
            </DialogContent>

            <DialogActions>
              <Button onClick={handleClose}>Close</Button>
              <Button onClick={handleClose} autoFocus>
                Save
              </Button>
            </DialogActions>
          </Dialog>
          {detailsArray.length !== 0 ? (
            <DataGrid
              sx={{
                border: '2px dotted #E5E0E0',
                borderRadius: '16px',
                padding: 2,
                marginTop: 1,

                width: '100%',
                margin: '0 auto',
                display: 'flex',
              }}
              rows={detailsArray}
              getRowId={(row) => row.Grpno}
              columns={columns}
            />
          ) : (
            <Grid
              sx={{
                border: '2px dotted #E5E0E0',
                borderRadius: '16px',
                padding: 2,
                marginTop: 1,

                width: '100%',
                display: 'flex',
              }}
            >
              <Lottie width="100%" height="50%" animationData={emptyI} loop />
            </Grid>
          )}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: 2,
            }}
          >
            <Button variant="contained" color="primary" sx={{
              marginRight:2
            }} onClick={handleDialogOpen}>
              Save
            </Button>

            <Dialog open={openDialog} onClose={handleDialogClose}>
              <DialogTitle>Confirm Save</DialogTitle>
              <DialogContent>
                <Typography>Are you sure you want to save this gatepass?</Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDialogClose} color="secondary">
                  Cancel
                </Button>
                <Button onClick={handleSaveApproval} color="primary" autoFocus>
                  Confirm
                </Button>
              </DialogActions>
            </Dialog>
            <Button variant="contained" onClick={handleClearGrid} color="error">
              Clear
            </Button>
          </Box>
        </FormProvider>
      </Container>
    </>
  );
}
