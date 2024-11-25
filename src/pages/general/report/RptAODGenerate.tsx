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
    GatepassNo: string;
}
interface CostCenter {
  SubCostCenterID: number;
  SubCostCenter: string;
}
interface employee {
  EmpID: number;
  EmpName: string;
}
const RptAODGenerate: React.FC = () => {
  const { themeStretch } = useSettingsContext();
  const [gatepassTypeID, setGatepassTypeID] = useState<number | string>('');
  const [fromDate, setFromDate] = useState<string>('');
  const [todate, setToDate] = useState<string>('');
  const [section, setSection] = useState<number | string>('');
  const [empID, setEmpID] = useState<number | string>('');
  const [gatePassTypes, setGatePassTypes] = useState<GatePassType[]>([]);
  const [employee, setEmployee] = useState<employee[]>([]);
  const [sections, setSections] = useState<CostCenter[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchGatePassTypes = async () => {
    try {
      const response = await axios.post<GatePassType[]>(
        'https://192.168.1.253:44783/NaturubWebAPI/api/Gatepass/GetGoodsDeliveryGatepass',
        {
            "FromDate":fromDate,
            "ToDate":todate
        }
      );
      setGatePassTypes(response.data);
    } catch (errorS) {
      setError('Failed to fetch gate pass types.');
    }
  };
  const fetchCompanyDetails = async () => {
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

  useEffect(() => {
    
  }, []);
  const handleViewReport = () => {
    const reportServerUrl = 'http://192.168.1.251/ReportServer/Pages/ReportViewer.aspx';
    const reportPath = '%2fAODReport'; // This represents the report path (encoded "/AODReport")

    const reportUrl =
      `${reportServerUrl}?${reportPath}&rs:Command=Render` +
      `&GatepassNo=${encodeURIComponent(gatepassTypeID)}`

    window.open(reportUrl, '_blank');
  };

  return (
    <>
      <Helmet>
        <title>Goods Delivery AOD | Gatepass</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Goods Delivery AOD"
          links={[{ name: 'Report' }, { name: 'Goods Delivery AOD' }]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="line-md:document-report" />}
              onClick={handleViewReport}
            >
              AOD Report
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
                <InputLabel size="small" id="gatepassTypeNo-label">
                  Gatepass No
                </InputLabel>
                <Select
                  labelId="gatepassTypeNo-label"
                  id="gatepassTypeNo"
                  value={gatepassTypeID}
                  size="small"
                  onChange={(e) => setGatepassTypeID(e.target.value)}
                  label="Gatepass Type"
                >
                  {gatePassTypes.map((type) => (
                    <MenuItem key={type.GatepassNo} value={type.GatepassNo}>
                      {type.GatepassNo}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={2} sm={2} md={2}>
              <TextField
                id="fromDate"
                label="From Date"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
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
                value={todate}
                onChange={(e) => {
                    setToDate(e.target.value);
                    fetchGatePassTypes();
                }}
                size="small"
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default RptAODGenerate;
