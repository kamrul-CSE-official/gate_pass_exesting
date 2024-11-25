import { Navigate, useRoutes } from 'react-router-dom';
// auth
import AuthGuard from '../auth/AuthGuard';
import GuestGuard from '../auth/GuestGuard';
// layouts
import CompactLayout from '../layouts/compact';
import DashboardLayout from '../layouts/dashboard';
// config
import { PATH_AFTER_LOGIN } from '../config-global';
//
import {
  Page404,
  PageTwo,
  LoginPage,
  PageGatepassRequest,
  PageGatepassStatus,
  PageGatepassApproval,
  PageFactoryEntry,
  PageSecurityCheck,
  PageDriverAllocation,
  PageChangeApproval,
  PageAuditApproval,
  PageEntryCtl,
  PageThirdPartyVehicle,
  RptGatepassReport,
  RptEntryReport,
  RptAODGenerate,
  RptDriverAssign
} from './elements';


// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/',
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        {
          path: 'login',
          element: (
            <GuestGuard>
              <LoginPage />
            </GuestGuard>
          ),
        },
      ],
    },
    {
      path: '/dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'request', element: <PageGatepassRequest /> },
        { path: 'status', element: <PageGatepassStatus /> },
        { path: 'approval', element: <PageGatepassApproval /> },
        { path: 'factoryentry', element: <PageFactoryEntry /> },
        { path: 'securitycheck', element: <PageSecurityCheck /> },
        { path: 'driverallowcation', element: <PageDriverAllocation /> },
        { path: 'changeapproval', element: <PageChangeApproval /> },
        { path: 'auditapproval', element: <PageAuditApproval /> },
        { path: 'entryDataCtl', element: <PageEntryCtl /> },
        { path: 'busentry', element: <PageThirdPartyVehicle /> },
        { path: 'gatepassreport', element: <RptGatepassReport /> },
        { path: 'entryreport', element: <RptEntryReport /> },
        { path: 'aodreport', element: <RptAODGenerate /> },
        { path: 'driverassignreport', element: <RptDriverAssign /> },
        
        {
          path: 'user',
          children: [
            { element: <Navigate to="/dashboard/user/four" replace />, index: true },
            
          ],
        },
      ],
    },
    {
      element: <CompactLayout />,
      children: [{ path: '404', element: <Page404 /> }],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
