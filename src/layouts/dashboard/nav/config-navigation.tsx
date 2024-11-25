// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  gatepass: icon('masterconfig'),
  oparation: icon('oparation'),
  user: icon('ic_user'),
  accounts: icon('accounts'),
  report: icon('pdf'),
  utility: icon('accounts'),
  tranport: icon('transport'),
};

const navConfig = [
  {
    subheader: 'gatepass',
    items: [
      {
        title: 'GATE PASS',
        path: '',
        icon: ICONS.gatepass,
        children: [
          { title: 'REQUEST', path: PATH_DASHBOARD.request },
          { title: 'STATUS', path: PATH_DASHBOARD.status },
          { title: 'APPROVAL', path: PATH_DASHBOARD.approval },
          { title: 'CHANGE APPROVER', path: PATH_DASHBOARD.changeapproval },
          { title: 'AUDIT APPROVAL', path: PATH_DASHBOARD.auditapproval },
          { title: 'ENTRY DATA', path: PATH_DASHBOARD.entryDataCtl },
        ],
      },
    ],
  },
  {
    subheader: 'SECURITY',
    items: [
      {
        title: 'SECURITY',
        path: '',
        icon: ICONS.oparation,
        children: [
          { title: 'SECURITY CHECK', path: PATH_DASHBOARD.securitycheck },
          { title: 'FACTORY ENTRY', path: PATH_DASHBOARD.factoryentry },
          { title: 'BUS ENTRY', path: PATH_DASHBOARD.busentry },
          { title: 'AOD', path: PATH_DASHBOARD.aodreport },
        ],
      },
    ],
  },
  {
    subheader: 'REPORT',
    items: [
      {
        title: 'REPORT',
        path: '',
        icon: ICONS.user,
        children: [
          { title: 'GATEPASS REPORT', path: PATH_DASHBOARD.gatepassreport },
          { title: 'ENTRY REPORT', path: PATH_DASHBOARD.entryreport },
        ],
      },
    ],
  },
  {
    subheader: 'TRANSPORT',
    items: [
      {
        title: 'TRANSPORT',
        path: '',
        icon: ICONS.tranport,
        children: [
          { title: 'DRIVER ALLOCATION', path: PATH_DASHBOARD.driverallowcation },
          { title: 'ALLOCATION REPORT ', path: PATH_DASHBOARD.driverassignreport },
        ],
      },
    ],
  },

  //  MASTER
  // GENERAL
  // ----------------------------------------------------------------------
  // {
  //   subheader: 'general v4.1.0',
  //   items: [
  //     { title: 'One', path: PATH_DASHBOARD.one, icon: ICONS.dashboard },
  //     { title: 'Two', path: PATH_DASHBOARD.two, icon: ICONS.ecommerce },
  //     { title: 'Three', path: PATH_DASHBOARD.three, icon: ICONS.analytics },
  //   ],
  // },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  // {
  //   subheader: 'management',
  //   items: [
  //     {
  //       title: 'user',
  //       path: PATH_DASHBOARD.user.root,
  //       icon: ICONS.user,
  //       children: [
  //         { title: 'Four', path: PATH_DASHBOARD.user.four },
  //         { title: 'Five', path: PATH_DASHBOARD.user.five },
  //         { title: 'Six', path: PATH_DASHBOARD.user.six },
  //       ],
  //     },
  //   ],
  // },
];

export default navConfig;
