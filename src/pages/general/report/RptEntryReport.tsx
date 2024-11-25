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
interface purpose {
  PurposeTypeID: number;
  PurposeType: string;
}
const RptEntryReport: React.FC = () => {
  const { themeStretch } = useSettingsContext();
  const [gatepassTypeID, setGatepassTypeID] = useState<number | string>('');
  const [inTime, setInTime] = useState<string>('');
  const [outTime, setOutTime] = useState<string>('');
  const [section, setSection] = useState<number | string>('');
  const [empID, setEmpID] = useState<number | string>('');
  const [gatePassTypes, setGatePassTypes] = useState<GatePassType[]>([]);
  const [purpose, setPurpose] = useState<purpose[]>([]);
  const [sections, setSections] = useState<CostCenter[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchPurpose = async () => {
    try {
      const response = await axios.get<purpose[]>(
        'https://192.168.1.253:44783/NaturubWebAPI/api/GatePass/GetAllPurpose'
      );
      setPurpose(response.data);
    } catch (errorS) {
      setError('Failed to fetch gate pass types.');
    }
  };

  useEffect(() => {
    fetchPurpose();
  }, []);
  const handleViewReport = () => {
    // Base URL for the report server and specific report
    const reportServerUrl = 'http://192.168.1.251/ReportServer/Pages/ReportViewer.aspx';
    const reportPath = '%2fGatepassEntry'; // This represents the report path (encoded "/GatepassEntry")

    // Construct the full URL with the report path and parameters
    const reportUrl =
      `${reportServerUrl}?${reportPath}&rs:Command=Render` +
      `&PurposeTypeID=${encodeURIComponent(gatepassTypeID)}` +
      `&FromDate=${encodeURIComponent(inTime)}` +
      `&ToDate=${encodeURIComponent(outTime)}`;

    // Open the report in a new tab
    window.open(reportUrl, '_blank');
  };

  return (
    <>
      <Helmet>
        <title>View Entry Report | Gatepass</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="View Entry Report"
          links={[{ name: 'Report' }, { name: 'Entry Report' }]}
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
                  Purpose
                </InputLabel>
                <Select
                  labelId="gatepassTypeID-label"
                  id="gatepassTypeID"
                  value={gatepassTypeID}
                  size="small"
                  onChange={(e) => setGatepassTypeID(e.target.value)}
                  label="Gatepass Type"
                >
                  {purpose.map((type) => (
                    <MenuItem key={type.PurposeTypeID} value={type.PurposeTypeID}>
                      {type.PurposeType}
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
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default RptEntryReport;
