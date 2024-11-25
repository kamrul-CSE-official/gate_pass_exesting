import { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { DataGrid, GridColDef, GridRenderCellParams, GridRowParams } from "@mui/x-data-grid";
import { Button, Container, FormControl, InputLabel, OutlinedInput, Select, MenuItem as ManuI, SelectChangeEvent, Checkbox, Box } from "@mui/material";
import { useSettingsContext } from "../../../components/settings";
import CustomBreadcrumbs from "../../../components/custom-breadcrumbs";
import Iconify from "../../../components/iconify";
import { useAuthContext } from "../../../auth/useAuthContext";



interface GatePassDetail {
    GatePassReqDetailID: number; // ID
    ReqCode: string; // Request Code
    Name: string; // Requested For
    DepartmentAndSection: string; // Section
    Status: string; // Status
    FirstApp: string | null; // First Approval
    SecApp: string | null; // Second Approval
    FirstGatePassApprovalID: number | null; // First Approval ID
    SecondGatePassApprovalID: number | null; // Second Approval ID
    GatePassType: string; // Gatepass Type
    GatePassStatusID: number; // Gatepass Type ID
    FirstApprovalEmpList: { SubCostRequisitionApprovalID: number; Name: string }[]; // List of Employees for First Approval
    SecondApprovalEmpList: { SubCostRequisitionApprovalID: number; Name: string }[]; // List of Employees for Second Approval
  }

  

export default function PageChangeApproval() {
 const { themeStretch } = useSettingsContext();
 const { user } = useAuthContext();
 const [gatepassApproval, setGatepassApproval] = useState<GatePassDetail[]>([]);
 const [selectedIds, setSelectedIds] = useState<number[]>([]);
 const [openAlert, setOpenAlert] = useState(false);
 const [alertMessage, setAlertMessage] = useState('');
 const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('error');

 const fatchGatepass = async () =>{
    try {
        const response = await axios.post(
          'https://192.168.1.253:44783/NaturubWebAPI/api/User/GetReqDetailsForChangeApp',{RequestBy:user!.empID}
        );
        setGatepassApproval(response.data);
      } catch (error) {
        console.error('API call failed', error);
      }
    
}
const handleSaveApprover = async () => {
  const FinalList = selectedIds.map((rowId) => {
    const row = gatepassApproval.find((r) => r.GatePassReqDetailID === rowId);
    if (row) {
      return {
        GatePassReqDetailID: row.GatePassReqDetailID,
        FirstApp: row.FirstApp,
        SecApp: row.SecApp,
        FirstGatePassApprovalID: row.FirstGatePassApprovalID,
        SecondGatePassApprovalID: row.SecondGatePassApprovalID,
      };
    }
    return null;
  }).filter(Boolean); // Filter out null values

  if (FinalList.length > 0) {
    try {
      const response = await axios.post(
        'https://192.168.1.253:44783/NaturubWebAPI/api/User/UpdateReqDetailsForAuth',
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
      fatchGatepass();
    } catch (error) {
      setAlertMessage('Failed to process request.');
      setAlertSeverity('error');
      setOpenAlert(true);
    }
  }
};

const handleChangeFirstApp = (event: SelectChangeEvent<any>,FAID:number,GRDID:number) =>{
    gatepassApproval.forEach((item) => {
        if (item.GatePassReqDetailID === GRDID && item.FirstGatePassApprovalID === FAID) {
          Object.assign(item, {FirstApp: event.target.value});
          setGatepassApproval(gatepassApproval);
        }
      });

  }
  const handleChangeSecondApp = (event: SelectChangeEvent<any>,FAID:number,GRDID:number) =>{
    gatepassApproval.forEach((item) => {
        if (item.GatePassReqDetailID === GRDID && item.SecondGatePassApprovalID === FAID) {
          Object.assign(item, {SecApp: event.target.value});
          setGatepassApproval(gatepassApproval);
        }
      });
  }
const handleClearGrid = async () => {
}
 useEffect(()=>{
    fatchGatepass();
 },[fatchGatepass])

 const handleCheckboxChange = (id: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
    }
  };

 const getRowClassName = (params: GridRowParams) => {
    if (params.row.GatePassStatusID === 1) {
      return 'non-null-row';
    }
    return 'null-row';
  };
 const columns : GridColDef[] = [
    {
        field: 'checkbox',
        headerName: 'Actions',
        width: 80,
        renderCell: (params: GridRenderCellParams<GatePassDetail>) => (
          <Checkbox
            checked={selectedIds.includes(params.row.GatePassReqDetailID)}
            onChange={handleCheckboxChange(params.row.GatePassReqDetailID)}
          />
        ),
      },
    {
      field: "ReqCode",
      headerName: "Request Code",
      width: 100,
      editable: false,
      cellClassName: 'super-app-theme--cell',
      headerClassName: 'super-app-theme--header',
    },
    {
        field: "Name",
        headerName: "Requested For",
        width: 300,
        editable: false,
        cellClassName: 'super-app-theme--cell',
        headerClassName: 'super-app-theme--header',
      },
    {
      field: "DepartmentAndSection",
      headerName: "Section",
      width: 150,
      editable: false,
      cellClassName: 'super-app-theme--cell',
      headerClassName: 'super-app-theme--header',
    },
    {
      field: "Status",
      headerName: "Status",
      width: 200,
      editable: false,
      cellClassName: 'super-app-theme--cell',
      headerClassName: 'super-app-theme--header',
    },
    {
      field: "FirstApp",
      headerName: "First Approval",
      width: 370,
      editable: false,
      renderCell: (item: any) => (
        <div
          className="d-flex justify-content-between align-items-center"
          style={{ cursor: "pointer" }}
        >
          <FormControl sx={{ width: 400, height: 50, marginTop: "3px" }}>
            <InputLabel sx={{ height: 50 }} id="demo-multiple-name-label">
              First Approval
            </InputLabel>
            <Select
              labelId="demo-multiple-name-label"
              id="demo-multiple-name"
              value={item.row.FirstApp}
              disabled={item.row.GatePassStatusID !== 1} 
              sx={{ height: 40, width: 350, fontSize: 12 }}
              onChange={(e) => {
                handleChangeFirstApp(
                  e,
                  item.row.FirstGatePassApprovalID,
                  item.row.GatePassReqDetailID
                );
              }}
              input={<OutlinedInput label="First Approval" />}
            >
              {item.row.FirstApprovalEmpList.map(
                (
                  type: { SubCostRequisitionApprovalID: string; Name: string },
                  index: number
                ) => (
                  <ManuI
                    key={index}
                    value={type.SubCostRequisitionApprovalID}
                    style={{ fontSize: 12 }}
                  >
                    {type.Name}
                  </ManuI>
                )
              )}
            </Select>
          </FormControl>
        </div>
      ),
      cellClassName: "super-app-theme--cell",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "SecApp",
      headerName: "Second Approval",
      width: 370,
      renderCell: (item: any) => (

          <div
            className="d-flex justify-content-between align-items-center"
            style={{ cursor: "pointer" }}
          >
            <FormControl sx={{ width: 400, height: 50, marginTop: "3px" }}>
              <InputLabel sx={{ height: 50 }} id="demo-multiple-name-label">
              Second Approval
              </InputLabel>
              <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                value={item.row.SecApp}
                disabled={!(item.row.GatePassStatusID === 1 || item.row.GatePassStatusID === 2)}
                sx={{ height: 40, width: 350, fontSize: 12 }}
                onChange={(e) => {
                    handleChangeSecondApp(e,item.row.SecondGatePassApprovalID,item.row.GatePassReqDetailID)
                }}
                input={<OutlinedInput label="Second Approval" />}
              >
                {item.row.SecondApprovalEmpList.map((type: { SubCostRequisitionApprovalID: string; Name: string }, index: number) => (
                  <ManuI key={index} value={type.SubCostRequisitionApprovalID} style={{ fontSize: 12 }}>
                    {type.Name}
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
      field: "GatePassType",
      headerName: "Gatepass Type",
      editable: false,
      width: 150,
      cellClassName: 'super-app-theme--cell',
      headerClassName: 'super-app-theme--header',
    },
  ];
    return (
      <>
        <Helmet>
          <title> Change Approval | Gatepass</title>
        </Helmet>
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <CustomBreadcrumbs
            heading="Change Gatepass Approver"
            links={[{ name: 'Gatepass' }, { name: 'Change Approval' }]}
            action={
              <Button variant="contained" startIcon={<Iconify icon="material-symbols:refresh" />}>
                Add
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
          <Button variant="contained" onClick={handleSaveApprover} sx={{ marginRight: 1 }}>
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