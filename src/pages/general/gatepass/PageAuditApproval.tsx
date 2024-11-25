import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, Container, FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import Approval from '@mui/icons-material/Approval';
import AssignmentIcon from '@mui/icons-material/ApprovalTwoTone';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { Helmet } from 'react-helmet-async';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import Iconify from '../../../components/iconify';
import { useSettingsContext } from '../../../components/settings';



export interface GatePassColumn {
    GatePassReqDetailID: number;
    GatePassReqHeaderID: number;
    GatePassReqStatusID: number;
    GatePassTypeID: number;
    ReqCode: string;
    Section: string;
    ReqQuantity: number;
    ReceivedQuantity: number;
    Intime: Date | null;
    ItemDescription: string;
    Remarks: string;
  }

export default function PageAuditApproval() {
  const { themeStretch } = useSettingsContext();
  const [selectedValue, setSelectedValue] = useState<number>(12);
  const [gatepassApproval, setGatepassApproval] = useState<GatePassColumn[]>([]);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = Number(event.target.value);
    setSelectedValue(numericValue);
    fatchGatepass(numericValue);
  };

  useEffect(()=>{
    fatchGatepass(12);
  },[])

  // eslint-disable-next-line no-restricted-syntax

  const getRowClassName = (params: GridRowParams) => {
    if (params.row.GatePassReqStatusID === 12) {
      return 'non-null-row';
    }
    return 'null-row';
  };
  const handleSaveApproval = () =>{
    console.log('')
  }
  const handleClearGrid = () =>{
    console.log('')
  }
  
  const fatchGatepass = async (approval:number) => {
    try {
        const response = await axios.post(
          'https://192.168.1.253:44783/NaturubWebAPI/api/Gatepass/GetReturnableDetailsForAudit',{ApprovalState:approval}
        );
        setGatepassApproval(response.data);
      } catch (error) {
        console.error('API call failed', error);
      }
  }

  const columns : GridColDef[] = [
     {
        field: "ReqCode",
        headerName: "Request No",
        width: 100,
        editable: false,
        cellClassName: 'super-app-theme--cell',
        headerClassName: 'super-app-theme--header'
    },
    {
      field: "Section",
      headerName: "Section",
      width: 250,
      editable: false,
      cellClassName: 'super-app-theme--cell',
      headerClassName: 'super-app-theme--header'
    },
    {
        field: "ReqQuantity",
        headerName: "Request Q",
        width: 100,
        editable: false,
        cellClassName: 'super-app-theme--cell',
        headerClassName: 'super-app-theme--header',
    } ,
    {
        field: "ReceivedQuantity",
        headerName: "Receive Q",
        width: 100,
        editable: false,
        cellClassName: 'super-app-theme--cell',
        headerClassName: 'super-app-theme--header',
    } ,
    {
        field: "Intime",
        headerName: "In time",
        valueGetter: ({ value })=> 
        value && new Date(value), 
        width: 200,
        editable: false,
        cellClassName: 'super-app-theme--cell',
        headerClassName: 'super-app-theme--header',
    } ,
    {
        field: "ItemDescription",
        headerName: "Item Description",
        width: 500,
        editable: false,
        cellClassName: 'super-app-theme--cell',
        headerClassName: 'super-app-theme--header',
    } ,
    {
        field: "Remarks",
        headerName: "Remarks",
        width: 500,
        editable: false,
        cellClassName: 'super-app-theme--cell',
        headerClassName: 'super-app-theme--header',
    } 
    
    
  ];
  return (
    <>
      <Helmet>
        <title> Audit Approval | Gatepass</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Audit Approval"
          links={[{ name: 'Gatepass' }, { name: 'Audit Approval' }]}
          action={
            <Button variant="contained" startIcon={<Iconify icon="material-symbols:refresh" />}>
              Refresh
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
          <FormControl component="fieldset">
            <RadioGroup
              aria-label="gatepass-type"
              name="gatepass-type"
              value={selectedValue}
              onChange={handleChange}
              row
            >
              <FormControlLabel
                value="12"
                control={<Radio sx={{ color: 'green' }} />}
                label={
                  <span style={{ color: 'green' }}>
                    <Approval style={{ verticalAlign: 'middle' }} /> Out Approval
                  </span>
                }
              />
              <FormControlLabel
                value="4"
                control={<Radio sx={{ color: 'orange' }} />}
                label={
                  <span style={{ color: 'orange' }}>
                    <AssignmentIcon style={{ verticalAlign: 'middle' }} /> In Approval
                  </span>
                }
              />
            </RadioGroup>
          </FormControl>
        </Box>
        <DataGrid
          sx={{
            border: '2px dotted #E5E0E0',
            borderRadius: '16px',
            padding: 2,
            marginTop: 3,
            width: '100%',
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
          rows={gatepassApproval}
          getRowId={(row) => row.GatePassReqDetailID}
          columns={columns}
          />
          <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: 2,
          }}
        >
          <Button variant="contained" onClick={handleSaveApproval} sx={{ marginRight: 1 }}>
            Save
          </Button>
          <Button variant="contained" onClick={handleClearGrid} color="error">
            Clear
          </Button>
        </Box>
      </Container>
    </>
  );
}
