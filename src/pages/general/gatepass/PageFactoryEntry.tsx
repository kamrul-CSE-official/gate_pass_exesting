import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import * as Yup from 'yup';
import Webcam from 'react-webcam';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Alert,
  Autocomplete,
  Avatar,
  Box,
  Button,
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
  IconButton,
  Radio,
  RadioGroup,
  Snackbar,
  TextField,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { CameraAlt, DirectionsCar, DirectionsWalk, PhotoCamera } from '@mui/icons-material';
import { Helmet } from 'react-helmet-async';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import Iconify from '../../../components/iconify';
import { useSettingsContext } from '../../../components/settings';

import { RHFTextField } from '../../../components/hook-form';
import { useAuthContext } from '../../../auth/useAuthContext';

export const NewGatePassSchema = Yup.object().shape({});
interface GatepassEntry {
  EntryID: number;
  Name: string;
  Purpose: string;
  InTime: string;
  OutTime: string;
  Image: string;
}
interface purpose {
  PurposeTypeID: number;
  PurposeType: string;
}
interface employee {
  EmpID: number;
  EmpName: string;
}
interface ValueGetterParams {
  value: any;
}
export default function PageFactoryEntry() {
  const { themeStretch } = useSettingsContext();
  const [imageShow, setimageShow] = useState(0);
  const [image, setImage] = useState('');
  const [openD, setOpenD] = useState(false);
  const [entryMdl, setEntryMdl] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [gatepassEntry, setGatepassEntry] = useState<GatepassEntry[]>([]);
  const [empID, setEmpID] = useState<employee[]>([]);
  const [purpose, setPurpose] = useState<purpose[]>([]);
  const { user } = useAuthContext();
  const [capturedImage, setCapturedImage] = useState('');
  const [uploadImage, setUploadImage] = useState('');
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('error');
  const [selectedValue, setSelectedValue] = useState('human');
  const [webcamOpen, setWebcamOpen] = useState(false);
  const webcamRef = useRef<Webcam | null>(null);

  const handleChange = (event: any) => {
    setSelectedValue(event.target.value);
  };
  const defaultValues = {
    purposeId: 0,
    name: '',
    driverName: '',
    vehicleNo: '',
    remarks: '',
    whomEmpID: 0,
  };
  const methods = useForm({
    resolver: yupResolver(NewGatePassSchema),
    defaultValues,
  });
  const handleWebcamOpen = () => {
    setWebcamOpen(true);
  };

  const handleRequestAccept = async () => {
    const name = getValues('name');
    const purposeId = getValues('purposeId');
    const driverName = getValues('driverName');
    const remarks = getValues('remarks');
    const whomEmpID = getValues('whomEmpID');
    try {
      const response = await axios.post('https://192.168.1.253:44783/NaturubWebAPI/api/Gatepass/SaveEntry', {
        Name: name,
        Purpose: purposeId,
        Image: uploadImage,
        ToWhom: whomEmpID,
        Remarks: remarks,
        Driver: driverName,
      });
      setAlertMessage('Entry Save');
      setAlertSeverity('success');
      setOpenAlert(true);
      setEntryMdl(false);
      fetchEntryDetails();
    } catch (e) {
      console.error('There was an error save entry:', e);
    }
  };
  const handleRequestReject = () => {};
  const capture = async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
        const blobObject = dataURLtoBlob(imageSrc); // Changed `let` to `const`
        const fdataobj = new FormData();
        fdataobj.append('name', user!.empID);
        fdataobj.append('file', blobObject);

        try {
          const response = await axios.post(
            'https://192.168.1.253:8080/FileUpload/ImageUpload',
            fdataobj,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );
          setUploadImage(response.data);
          setAlertMessage('Image Uploaded');
          setAlertSeverity('success');
          setOpenAlert(true);
          setWebcamOpen(false);
        } catch (error) {
          console.error('There was an error uploading the file:', error);
        }
      }
    }
  };

  const handleWebcamClose = () => {
    setWebcamOpen(false);
  };
  const handleClearGrid = () => {
    setSelectedIds([]);
  };
  const handleOutTimeEntry = async () => {
    const lst: any[] = [];
    for (let i = 0; i < selectedIds.length; i += 1) {
      lst.push({ EntryID: selectedIds[i] });
    }
    try {
      await Promise.all(
        selectedIds.map(async (id) => {
          const response = await axios.post(
            'https://192.168.1.253:44783/NaturubWebAPI/api/Gatepass/UpdateEntryOutTime',
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
      fetchEntryDetails();
    } catch (error) {
      console.error('API call failed', error);
    }
  };
  function imageShowFn(value: string) {
    setimageShow(1);
    setImage(`https://192.168.1.253:8080/images/${value}`);
    setOpenD(true);
  }
  const fetchEntryDetails = async () => {
    try {
      const response = await axios.get('https://192.168.1.253:44783/NaturubWebAPI/api/Gatepass/GetEntryData');
      setGatepassEntry(response.data);
    } catch (error) {
      console.error('API call failed', error);
    }
  };
  const fetchEmpDetails = async () => {
    try {
      const response = await axios.post('https://192.168.1.253:44783/NaturubWebAPI/api/User/GetAllEmp', {
        SubCostCenterID: 0,
        GatepassTypeID: 0,
      });
      setEmpID(response.data);
    } catch (error) {
      console.error('API call failed', error);
    }
  };
  const fetchPurpose = async () => {
    try {
      const response = await axios.get('https://192.168.1.253:44783/NaturubWebAPI/api/Gatepass/GetAllPurpose');
      setPurpose(response.data);
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
  function dataURLtoBlob(dataurl: any) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    const n = bstr.length;
    const u8arr = new Uint8Array(n);
    for (let i = 0; i < n; i += 1) {
      u8arr[i] = bstr.charCodeAt(i);
    }

    return new Blob([u8arr], { type: mime });
  }

  const { watch, setValue, getValues } = methods;
  useEffect(() => {
    fetchEntryDetails();
    fetchPurpose();
    fetchEmpDetails();
  }, []);
  const handleCloseAlert = () => {
    setOpenAlert(false);
  };
  const handleCloseDialogue = () => {
    setOpenD(false);
  };
  const handleCloseEntryMdl = () => {
    setEntryMdl(false);
  };
  const handleOpenEntryMdl = () => {
    setEntryMdl(true);
  };
  const columns: GridColDef[] = [
    {
      field: 'checkbox',
      headerName: 'Actions',
      width: 80,
      renderCell: (params: GridRenderCellParams<GatepassEntry>) => (
        <Checkbox
          checked={selectedIds.includes(params.row.EntryID)}
          onChange={handleCheckboxChange(params.row.EntryID)}
        />
      ),
    },
    {
      field: 'Name',
      headerName: 'Name/Vehicle',
      width: 250,
      editable: false,
    },
    {
      field: 'Purpose',
      headerName: 'Purpose',
      width: 250,
      editable: false,
    },
    {
      field: 'InTime',
      headerName: 'InTime',
      width: 200,
      type: 'dateTime',
      valueGetter: (value: any) => value && new Date(value),
      editable: false,
    },
    {
      field: 'OutTime',
      headerName: 'OutTime',
      type: 'dateTime',
      valueGetter: (params: ValueGetterParams) => {
        const value = params.value;
        if (value === '1/1/1') {
          return new Date('');
        }
        return value ? new Date(value) : undefined;
      },
      width: 150,
      editable: false,
      cellClassName: 'super-app-theme--cell',
      headerClassName: 'super-app-theme--header',
    },

    {
      field: 'Image',
      headerName: 'Image',
      flex: 1,
      renderCell: (params: any) => (
        <div>
          {params.row.Image != null ? (
            <strong>
              <Button
                variant="contained"
                color="primary"
                size="small"
                style={{ marginLeft: 16 }}
                onClick={() => {
                  imageShowFn(params.row.Image);
                }}
              >
                Open
              </Button>
            </strong>
          ) : null}
        </div>
      ),
    },
  ];
  const purposeID = watch('purposeId');
  return (
    <>
      <Helmet>
        <title> Factory Entry | Gatepass</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
          <Alert onClose={handleCloseAlert} severity={alertSeverity}>
            {alertMessage}
          </Alert>
        </Snackbar>
        <Dialog open={entryMdl} maxWidth="lg" onClose={handleCloseEntryMdl}>
          <FormProvider {...methods}>
            <DialogTitle>Create Entry Details</DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <RadioGroup
                      row
                      aria-label="entry type"
                      name="entry-type"
                      value={selectedValue}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="human"
                        control={
                          <Radio icon={<DirectionsWalk />} checkedIcon={<DirectionsWalk />} />
                        }
                        label="Human Entry"
                      />
                      <FormControlLabel
                        value="vehicle"
                        control={<Radio icon={<DirectionsCar />} checkedIcon={<DirectionsCar />} />}
                        label="Vehicle Entry"
                      />
                      <IconButton onClick={handleWebcamOpen} aria-label="open webcam">
                        <CameraAlt />
                      </IconButton>
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <RHFTextField
                      name="name"
                      size="small"
                      label="Name"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                {selectedValue === 'vehicle' ? (
                  <Grid item xs={12} sm={6}>
                  <RHFTextField
                    name="driverName"
                    size="small"
                    label="Driver Name"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                ) : null}

                <Grid item xs={12} sm={6}>
                  <RHFTextField
                    name="remarks"
                    size="small"
                    label="Remarks"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="purposeId"
                    control={methods.control}
                    render={({ field, fieldState: { error } }) => (
                      <Autocomplete
                        options={purpose}
                        getOptionLabel={(option) => option.PurposeType || ''}
                        isOptionEqualToValue={(option, value) =>
                          option.PurposeTypeID === value.PurposeTypeID
                        }
                        value={purpose.find((cust) => cust.PurposeTypeID === field.value) || null}
                        onChange={(event, newValue) => {
                          setValue('purposeId', newValue ? newValue.PurposeTypeID : 0);
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
                {purposeID === 2 || 6 ? (
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="whomEmpID"
                      control={methods.control}
                      render={({ field, fieldState: { error } }) => (
                        <Autocomplete
                          options={empID}
                          getOptionLabel={(option) => option.EmpName || ''}
                          isOptionEqualToValue={(option, value) => option.EmpID === value.EmpID}
                          value={empID.find((cust) => cust.EmpID === field.value) || null}
                          onChange={(event, newValue) => {
                            setValue('whomEmpID', newValue ? newValue.EmpID : 0);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="whom"
                              error={!!error}
                              size="small"
                              helperText={error ? error.message : ''}
                            />
                          )}
                        />
                      )}
                    />
                  </Grid>
                ) : null}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" onClick={handleRequestAccept}>
                Save
              </Button>
              <Button variant="contained" onClick={handleRequestReject} color="error">
                Close
              </Button>
            </DialogActions>
          </FormProvider>
        </Dialog>
        <Dialog open={openD} maxWidth="lg" onClose={handleCloseDialogue}>
          <DialogTitle>Entry Image</DialogTitle>
          <DialogContent>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
              }}
            >
              <img src={image} alt="Description" style={{ maxWidth: '100%', maxHeight: '100%' }} />
            </Box>
          </DialogContent>
        </Dialog>
        <CustomBreadcrumbs
          heading="Create a new Entry"
          links={[{ name: 'Gatepass' }, { name: 'Factory Entry' }]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleOpenEntryMdl}
            >
              Entry
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
            display: 'flex',
          }}
          rows={gatepassEntry}
          getRowId={(row) => row.EntryID}
          columns={columns}
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: 2,
          }}
        >
          <Button variant="contained" onClick={handleOutTimeEntry} sx={{ marginRight: 1 }}>
            Save
          </Button>
          <Button variant="contained" onClick={handleClearGrid} color="error">
            Clear
          </Button>
        </Box>
        <Dialog open={webcamOpen} onClose={handleWebcamClose}>
          <DialogContent>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                maxWidth: 1080,
                margin: '0 auto',
              }}
            >
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                  width: 1280,
                  height: 720,
                  facingMode: 'user',
                }}
                style={{
                  width: '100%',
                  borderRadius: 8,
                }}
              />
              <IconButton
                color="info"
                onClick={capture}
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  bgcolor: 'primary.main',
                  color: 'white',
                  width: 56,
                  height: 56,
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
              >
                <PhotoCamera />
              </IconButton>
            </Box>
          </DialogContent>
        </Dialog>
      </Container>
    </>
  );
}
