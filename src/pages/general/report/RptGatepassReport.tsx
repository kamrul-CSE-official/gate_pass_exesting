import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  Container,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useSettingsContext } from '../../../components/settings';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import Iconify from '../../../components/iconify';

interface GatePassType {
  GatePassTypeID: number;
  TypeName: string;
}
interface CostCenter {
  SubCostCenterID: number;
  SubCostCenter: string;
}
interface employee {
  EmpID: number;
  EmpName: string;
}
const RptGatepassReport: React.FC = () => {
  const { themeStretch } = useSettingsContext();
  const [gatepassTypeID, setGatepassTypeID] = useState<number | string>('');
  const [inTime, setInTime] = useState<string>('');
  const [outTime, setOutTime] = useState<string>('');
  const [section, setSection] = useState<number | string>('');
  const [empID, setEmpID] = useState<number | string>('');
  const [gatePassTypes, setGatePassTypes] = useState<GatePassType[]>([]);
  const [employee, setEmployee] = useState<employee[]>([]);
  const [sections, setSections] = useState<CostCenter[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchGatePassTypes = async () => {
    try {
      const response = await axios.get<GatePassType[]>(
        'https://192.168.1.253:44783/NaturubWebAPI/api/User/GetGatePassTypeGatepass'
      );
      setGatePassTypes(response.data);
    } catch (errorS) {
      setError('Failed to fetch gate pass types.');
    }
  };
  const fetchEmpDetails = async () => {
    try {
      const response = await axios.post(
        'https://192.168.1.253:44783/NaturubWebAPI/api/User/GetAllEmp',
        {
          SubCostCenterID: 0,
          GatepassTypeID: 0,
        }
      );
      setEmployee(response.data);
    } catch (errorS) {
      console.error('API call failed', error);
    }
  };
  const fetchCostCenter = async () => {
    try {
      const response = await axios.get<CostCenter[]>(
        'https://192.168.1.253:44783/NaturubWebAPI/api/Budget/GetSubCostCenter'
      );
      setSections(response.data);
    } catch (errorS) {
      setError('Failed to fetch gate pass types.');
    }
  };

  useEffect(() => {
    fetchGatePassTypes();
    fetchCostCenter();
    fetchEmpDetails();
  }, []);
  // const authenticate = async () => {
  //   try {
  //     const response = await axios.post('http://192.168.1.251/ReportServer', {
  //       username:"Plabon",
  //       password:"Shuva@#$5150",
  //     });
  
  //     const authToken = response.data.token; // Assuming the token is in the 'token' field
  //     return authToken;
  //   } catch (errorS) {
  //     console.error('Authentication failed:', errorS);
  //     throw new Error('Failed to obtain auth token');
  //   }
  // };
  const handleViewReport = () => {
    const reportServerUrl = 'http://192.168.1.251/ReportServer/Pages/ReportViewer.aspx';
    const reportPath = '%2fGatepass'; // This represents the report path (encoded "/GatepassEntry")

    // Construct the full URL with the report path and parameters
    const reportUrl =
      `${reportServerUrl}?${reportPath}&rs:Command=Render` +
      `&GatepassTypeID=${encodeURIComponent(gatepassTypeID)}` +
      `&InTime=${encodeURIComponent(inTime)}` +
      `&OutTime=${encodeURIComponent(outTime)}` +
      `&Section=${encodeURIComponent(section)}` +
      `&EmpID=${encodeURIComponent(empID)}`;

    // Open the report in a new tab
    window.open(reportUrl, '_blank');
  };

  return (
    <>
      <Helmet>
        <title>View Gatepass Report | Gatepass</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="View Gatepass Report"
          links={[{ name: 'Report' }, { name: 'Gatepass Report' }]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="line-md:document-report" />}
              onClick={handleViewReport}
            >
              Show/Hide
            </Button>
          }
        />
        <Box
          sx={{
            border: '2px dotted #E5E0E0',
            borderRadius: '16px',
            padding: 2,
            marginTop: 1,
            width: '100%',
          }}
        >
          
          <Grid container spacing={2}>
            <Grid item xs={3} sm={3} md={3}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel size="small" id="gatepassTypeID-label">
                  Gatepass Type
                </InputLabel>
                <Select
                  labelId="gatepassTypeID-label"
                  id="gatepassTypeID"
                  value={gatepassTypeID}
                  size="small"
                  onChange={(e) => setGatepassTypeID(e.target.value)}
                  label="Gatepass Type"
                >
                  {gatePassTypes.map((type) => (
                    <MenuItem key={type.GatePassTypeID} value={type.GatePassTypeID}>
                      {type.TypeName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={2} sm={2} md={2}>
              <TextField
                id="inTime"
                label="In Time"
                type="date"
                value={inTime}
                onChange={(e) => setInTime(e.target.value)}
                size="small"
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={2} sm={2} md={2}>
              <TextField
                id="outTime"
                label="Out Time"
                type="date"
                value={outTime}
                onChange={(e) => setOutTime(e.target.value)}
                size="small"
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={3} sm={3} md={3}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel size="small" id="gatepassTypeID-label">
                  Section
                </InputLabel>
                <Select
                  labelId="gatepassTypeID-label"
                  id="gatepassTypeID"
                  value={section}
                  size="small"
                  onChange={(e) => setSection(e.target.value)}
                  label="Gatepass Type"
                >
                  {sections.map((type) => (
                    <MenuItem key={type.SubCostCenterID} value={type.SubCostCenterID}>
                      {type.SubCostCenter}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3} sm={3} md={3}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel size="small" id="gatepassTypeID-label">
                  Employee
                </InputLabel>
                <Select
                  labelId="gatepassTypeID-label"
                  id="gatepassTypeID"
                  value={empID}
                  size="small"
                  onChange={(e) => setEmpID(e.target.value)}
                  label="Gatepass Type"
                >
                  {employee.map((type) => (
                    <MenuItem key={type.EmpID} value={type.EmpID}>
                      {type.EmpName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default RptGatepassReport;
