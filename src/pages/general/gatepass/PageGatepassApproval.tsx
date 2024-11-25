import { useCallback, useEffect, useState } from 'react';
import * as Yup from 'yup';
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardMedia,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Snackbar,
  Typography,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import Iconify from '../../../components/iconify';
import { useSettingsContext } from '../../../components/settings';
import { useAuthContext } from '../../../auth/useAuthContext';
import { RHFTextField } from '../../../components/hook-form';

export default function PageGatepassApproval() {
  const NewGatePassSchema = Yup.object().shape({
    ApproverRemarks: Yup.string().required('Remarks are required'),
  });
  interface GatepassStatusDetails {
    GatePassReqHeaderID: number;
    ReqCode: string;
    DepartmentAndSection: string;
    ImageBase64?: string;
    GatePassType: string;
    GatePassTypeID: number;
    Status: string;
    FirstApp: string;
    GatePassStatusID: number;
    SecApp: string;
    GatePassReqDetailID: number;
    Remarks: string;
  }
  interface ApprovalItem {
    GatePassTypeID: number;
    Type: string;
    EmpID: number;
    EmpNo: string;
    EmpName: string;
    Remarks: string;
    ItemID: number;
    Quantity: number;
    ItemCode: string;
    ItemDescription: string;
    DriverName: string;
    Destination: string;
    ApxTime: Date;
    PickupTime: Date;
    GatePassReqHeaderID: number;
    StatusID: number;
    ApproveUserID: number;
    GatePassReqDetailID: number;
    ApprovalStatus: string;
    ApproverRemarks: string;
  }

  interface FinalObject {
    Type: string;
    GatePassReqDetailID: number;
    GatePassReqHeaderID: number;
    GatePassTypeID: number;
    GatePassReqStatusID: number;
    ApprovedBy: number;
    ApprovalRemarks: string;
  }
  const defaultValues: Partial<ApprovalItem> = {
    GatePassTypeID: 1,
    Type: 'A',
    EmpID: 0,
    EmpNo: '',
    EmpName: '',
    Remarks: '',
    ItemID: 0,
    Quantity: 0,
    ItemCode: '',
    ItemDescription: '',
    DriverName: '',
    Destination: '',
    ApxTime: new Date(),
    PickupTime: new Date(),
    GatePassReqHeaderID: 0,
    StatusID: 0,
    ApproveUserID: 0,
    GatePassReqDetailID: 0,
    ApprovalStatus: '',
    ApproverRemarks: '',
  };

  const { themeStretch } = useSettingsContext();
  const { user } = useAuthContext();
  const [approval, setApproval] = useState<GatepassStatusDetails[]>([]);
  const [approvalDetails, setApprovalDetails] = useState<ApprovalItem[]>([]);
  const [openDialogue, setOpenDialogue] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [headId, setHeadId] = useState(0);
  const [gatepassTypeID, setGatepassTypeID] = useState(0);
  const [gatepassStatusID, setGatepassStatusID] = useState(0);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('error');
  const columnsForItems = [
    {
      field: 'checkbox',
      headerName: 'Actions',
      width: 80,
      renderCell: (params: GridRenderCellParams<ApprovalItem>) => (
        <Checkbox
          checked={selectedIds.includes(params.row.GatePassReqDetailID)}
          onChange={handleCheckboxChange(params.row.GatePassReqDetailID)}
        />
      ),
    },
    {
      field: 'ItemID',
      headerName: 'Item ID',
      width: 110,
      editable: false,
      cellClassName: 'super-app-theme--cell',
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'ItemDescription',
      headerName: 'Item Description',
      width: 450,
      editable: false,
      cellClassName: 'super-app-theme--cell',
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'Quantity',
      headerName: 'Quantity',
      headerClassName: 'super-app-theme--header',
      width: 150,
      editable: false,
      cellClassName: 'super-app-theme--cell',
    },
    {
      field: 'Remarks',
      headerName: 'Remarks',
      editable: false,
      flex: 1,
      width: 300,
      cellClassName: 'super-app-theme--cell',
      headerClassName: 'super-app-theme--header',
    },
  ];
  const methods = useForm({
    resolver: yupResolver(NewGatePassSchema),
    defaultValues,
  });
  const { watch, setValue, getValues } = methods;
  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const columnsForRequest = [
    {
      field: 'checkbox',
      headerName: 'Actions',
      width: 80,
      renderCell: (params: GridRenderCellParams<ApprovalItem>) => (
        <Checkbox
          checked={selectedIds.includes(params.row.GatePassReqDetailID)}
          onChange={handleCheckboxChange(params.row.GatePassReqDetailID)}
        />
      ),
    },
    {
      field: 'EmpNo',
      headerName: 'User No',
      width: 80,
      editable: false,
      cellClassName: 'super-app-theme--cell',
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'EmpName',
      headerName: 'Request User Name',
      width: 250,
      editable: false,
      cellClassName: 'super-app-theme--cell',
      headerClassName: 'super-app-theme--header',
    },

    {
      field: 'Remarks',
      headerName: 'Remarks',
      editable: false,
      width: 250,
      cellClassName: 'super-app-theme--cell',
      headerClassName: 'super-app-theme--header',
    },
  ];

  const columnsForDriver = [
    {
      field: 'checkbox',
      headerName: 'Actions',
      width: 80,
      renderCell: (params: GridRenderCellParams<ApprovalItem>) => (
        <Checkbox
          checked={selectedIds.includes(params.row.GatePassReqDetailID)}
          onChange={handleCheckboxChange(params.row.GatePassReqDetailID)}
        />
      ),
    },
    {
      field: 'EmpName',
      headerName: 'Request User Name',
      width: 250,
      editable: false,
      cellClassName: 'super-app-theme--cell',
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'ApxTime',
      headerName: 'Apx. Return',
      headerClassName: 'super-app-theme--header',
      width: 180,
      valueGetter: (value: any) => value && new Date(value),
      editable: false,
      cellClassName: 'super-app-theme--cell',
    },
    {
      field: 'PickupTime',
      headerName: 'Pickup Time',
      headerClassName: 'super-app-theme--header',
      width: 180,
      valueGetter: (value: any) => value && new Date(value),
      editable: false,
      cellClassName: 'super-app-theme--cell',
    },
    {
      field: 'Destination',
      headerName: 'Destination',
      headerClassName: 'super-app-theme--header',
      width: 150,
      editable: false,
      cellClassName: 'super-app-theme--cell',
    },
    {
      field: 'Remarks',
      headerName: 'Remarks',
      editable: false,
      width: 250,
      cellClassName: 'super-app-theme--cell',
      headerClassName: 'super-app-theme--header',
    },
  ];
  const handleCheckboxChange = (id: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
    }
  };
  let columns;

  if (gatepassTypeID === 1 || gatepassTypeID === 2) {
    columns = columnsForRequest;
  } else if (gatepassTypeID === 3 || gatepassTypeID === 4) {
    columns = columnsForItems;
  } else {
    columns = columnsForDriver;
  }
  const handleRequestReject = async () => {
    const approvalRm = watch('ApproverRemarks');
    const FinalList: FinalObject[] = [];

    for (let i = 0; i < selectedIds.length; i += 1) {
      const finalObject: FinalObject = {
        Type: 'R',
        GatePassReqDetailID: selectedIds[i],
        GatePassReqHeaderID: headId,
        GatePassTypeID: gatepassTypeID,
        GatePassReqStatusID: gatepassStatusID,
        ApprovedBy: user?.empID,
        ApprovalRemarks: approvalRm!,
      };
      FinalList.push(finalObject);
    }
    try {
      const response = await axios.post(
        'https://192.168.1.253:44783/NaturubWebAPI/api/Gatepass/ApprovedGatePassRequest',
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
      fetchApprovalDetails();
      setOpenDialogue(false);
    } catch (error) {
      setAlertMessage('Failed to process request.');
      setAlertSeverity('error');
      setOpenAlert(true);
    }
  };
  const handleRequestAccept = async () => {
    const approvalRm = watch('ApproverRemarks');
    const FinalList: FinalObject[] = [];
    if (!selectedIds || selectedIds.length === 0) {
      setAlertMessage('Please select the gatepass');
      setAlertSeverity('error');
      setOpenAlert(true);
      return;
    }

    for (let i = 0; i < selectedIds.length; i += 1) {
      if (selectedIds) {
        const finalObject: FinalObject = {
          Type: 'A',
          GatePassReqDetailID: selectedIds[i],
          GatePassReqHeaderID: headId,
          GatePassTypeID: gatepassTypeID,
          GatePassReqStatusID: gatepassStatusID,
          ApprovedBy: user?.empID,
          ApprovalRemarks: approvalRm!,
        };
        FinalList.push(finalObject);
      }
    }
    try {
      const response = await axios.post(
        'https://192.168.1.253:44783/NaturubWebAPI/api/Gatepass/ApprovedGatePassRequest',
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
      fetchApprovalDetails();
      setOpenDialogue(false);
    } catch (error) {
      setAlertMessage('Failed to process request.');
      setAlertSeverity('error');
      setOpenAlert(true);
    }
  };
  const fetchApprovalDetails = useCallback(async () => {
    try {
      const response = await axios.post('https://192.168.1.253:44783/NaturubWebAPI/api/Gatepass/GetPendingApproval', {
        EmpID: user?.empID,
      });
      setApproval(response.data);
    } catch (error) {
      console.error('API call failed', error);
    }
  }, [user?.empID]);

  const fetchApprovalIDetails = async (Id: number, StatusID: number) => {
    setHeadId(Id);
    try {
      const response = await axios.post(
        'https://192.168.1.253:44783/NaturubWebAPI/api/Gatepass/GetPendingApprovalDetail',
        {
          GatePassReqHeaderID: Id,
          StatusID,
          ApproveUserID: user?.empID,
        }
      );
      setApprovalDetails(response.data);
    } catch (error) {
      console.error('API call failed', error);
    }
  };
  const handleRefesh = () => {
    fetchApprovalDetails();
  };
  const handleOpenDialogue = (index: GatepassStatusDetails) => {
    setOpenDialogue(true);
    fetchApprovalIDetails(index.GatePassReqHeaderID, index.GatePassStatusID);
    setGatepassTypeID(index.GatePassTypeID);
    setGatepassStatusID(index.GatePassStatusID);
  };
  const handleCloseDialogue = () => {
    setOpenDialogue(false);
  };
  useEffect(() => {
    fetchApprovalDetails();
  }, [fetchApprovalDetails]);

  return (
    <>
      <Helmet>
        <title> Approval | Gatepass</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Approval Gatepass"
          links={[{ name: 'Gatepass' }, { name: 'Approval' }]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleRefesh}
            >
              Refresh
            </Button>
          }
        />
        <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
          <Alert onClose={handleCloseAlert} severity={alertSeverity}>
            {alertMessage}
          </Alert>
        </Snackbar>
        <Dialog open={openDialogue} maxWidth="lg" onClose={handleCloseDialogue}>
          <DialogTitle>Gatepass Details</DialogTitle>
          <FormProvider {...methods}>
            <DialogContent>
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
                rows={approvalDetails}
                getRowId={(row) => row.GatePassReqDetailID}
                columns={columns}
              />
              <Grid item xs={12} sm={6} marginTop={2}>
                <RHFTextField
                  name="ApproverRemarks"
                  multiline
                  label="Remarks"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </DialogContent>
          </FormProvider>
          <DialogActions>
            <Button variant="contained" onClick={handleRequestAccept}>
              Accept
            </Button>
            <Button variant="contained" onClick={handleRequestReject} color="error">
              Reject
            </Button>
          </DialogActions>
        </Dialog>
        <Grid container spacing={2}>
          {approval.map((item, index) => (
            <Grid item xs={3}>
              <Card
                key={index}
                style={{ margin: '20px' }}
                onClick={() => {
                  handleOpenDialogue(item);
                }}
              >
                <CardMedia
                  component="img"
                  alt={String(item.GatePassReqHeaderID)}
                  sx={{ height: 200, objectFit: 'fill' }}
                  image={`data:image/png;base64,${item.ImageBase64}`}
                  title={String(item.GatePassReqHeaderID)}
                />
                <CardContent>
                  <Typography align="center" gutterBottom variant="h5" color="gray" component="div">
                    {item.DepartmentAndSection}
                  </Typography>
                  <Typography align="center" variant="caption" color="gray" component="p">
                    {item.GatePassType}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
