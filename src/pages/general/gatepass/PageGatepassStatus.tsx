import { useCallback, useEffect, useState } from 'react';
import { Button, Container, IconButton } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import Lottie from 'lottie-react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import Iconify from '../../../components/iconify';
import { useSettingsContext } from '../../../components/settings';
import { useAuthContext } from '../../../auth/useAuthContext';

export default function PageGatepassStatus() {
  interface GatepassStatusDetails {
    GatePassReqHeaderID: number;
    
    ReqCode: string;
    DepartmentAndSection: string;
    EmpBase64?: string;
    GatePassType: string;
    Status: string;
    FirstApp: string;
    SecApp: string;
    GatePassReqDetailID: number;
    Remarks: string;
  }
  const { themeStretch } = useSettingsContext();
  const { user } = useAuthContext();
  const [gatepassStatus, setGatepassStatus] = useState<GatepassStatusDetails[]>([]);

  const fetchUserDetails = useCallback(async () => {
    try {
      const response = await axios.post(
        'https://192.168.1.253:44783/NaturubWebAPI/api/Gatepass/GetGatePassStatus',
        {
          EmpID: user?.empID,
        }
      );
      setGatepassStatus(response.data);
    } catch (error) {
      console.error('API call failed', error);
    }
  }, [user?.empID]);
  const handleRefesh = () => {
    fetchUserDetails();
  };
  const handlePrintClick = (Permerter:any) =>{
    const reportServerUrl = 'http://192.168.1.251/ReportServer/Pages/ReportViewer.aspx';
    const reportPath = '%2fGatepassReceipt'; 
    const reportUrl =
      `${reportServerUrl}?${reportPath}&rs:Command=Render` +
      `&GatepassID=${encodeURIComponent(Permerter.GatePassReqHeaderID)}` 

    // Open the report in a new tab
    window.open(reportUrl, '_blank');
  }
  const columnsStatus: GridColDef[] = [
    {
      field: 'Actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <IconButton
          color="primary"
          onClick={() => handlePrintClick(params.row)}
        >
          <Iconify icon="system-uicons:printer" />
        </IconButton>
      ),
    },
    {
      field: 'ReqCode',
      headerName: 'Request Code',
      width: 150,
    },
    {
      field: 'ImageBase64',
      headerName: 'Image',
      width: 100,
      renderCell: (params) => (
        <img
          src={`data:image/png;base64,${params.value}`}
          alt="Employee"
          style={{ width: '50px', height: '50px', borderRadius: '50%' }}
        />
      ),
    },
    {
      field: 'GatePassType',
      headerName: 'GatePass Type',
      width: 150,
    },
    {
      field: 'Status',
      headerName: 'Status',
      width: 150,
    },
    {
      field: 'FirstApp',
      headerName: 'First Approver',
      width: 150,
    },
    {
      field: 'SecApp',
      headerName: 'Second Approver',
      width: 150,
    },
    {
      field: 'Remarks',
      headerName: 'Remarks',
      width: 200,
    },
  ];
  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  return (
    <>
      <Helmet>
        <title> Status | Gatepass</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Create a new Gatepass"
          links={[{ name: 'Gatepass' }, { name: 'Request' }]}
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
          rows={gatepassStatus}
          getRowId={(row) => row.GatePassReqDetailID}
          columns={columnsStatus}
        />
      </Container>
    </>
  );
}
