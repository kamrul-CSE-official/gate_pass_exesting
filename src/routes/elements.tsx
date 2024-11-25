import { Suspense, lazy, ElementType } from 'react';
// components
import LoadingScreen from '../components/loading-screen';

// ----------------------------------------------------------------------

const Loadable = (Component: ElementType) => (props: any) =>
  (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );

// ----------------------------------------------------------------------

export const LoginPage = Loadable(lazy(() => import('../pages/LoginPage')));
export const PageTwo = Loadable(lazy(() => import('../pages/PageTwo')));
export const Page404 = Loadable(lazy(() => import('../pages/Page404')));
export const PageGatepassRequest = Loadable(lazy(() => import('../pages/general/PageGatepassRequest')));
export const PageGatepassStatus = Loadable(lazy(() => import('../pages/general/gatepass/PageGatepassStatus')));
export const PageGatepassApproval = Loadable(lazy(() => import('../pages/general/gatepass/PageGatepassApproval')));
export const PageFactoryEntry = Loadable(lazy(() => import('../pages/general/gatepass/PageFactoryEntry')));
export const PageSecurityCheck = Loadable(lazy(() => import('../pages/general/gatepass/PageSecurityCheck')));
export const PageDriverAllocation = Loadable(lazy(() => import('../pages/general/gatepass/PageDriverAllocation')));
export const PageChangeApproval = Loadable(lazy(() => import('../pages/general/gatepass/PageChangeApproval')));
export const PageApproverAssign = Loadable(lazy(() => import('../pages/general/gatepass/PageApproverAssign')));
export const PageAuditApproval = Loadable(lazy(() => import('../pages/general/gatepass/PageAuditApproval')));
export const PageEntryCtl = Loadable(lazy(() => import('../pages/general/gatepass/PageEntryCtl')));
export const PageThirdPartyVehicle = Loadable(lazy(() => import('../pages/general/gatepass/PageThirdPartyVehicle')));
export const RptGatepassReport = Loadable(lazy(() => import('../pages/general/report/RptGatepassReport')));
export const RptEntryReport = Loadable(lazy(() => import('../pages/general/report/RptEntryReport')));
export const RptAODGenerate = Loadable(lazy(() => import('../pages/general/report/RptAODGenerate')));
export const RptDriverAssign = Loadable(lazy(() => import('../pages/general/report/RptDriverAssign')));





