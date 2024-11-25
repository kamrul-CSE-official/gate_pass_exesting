// ----------------------------------------------------------------------

function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  login: '/login',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  request:path(ROOTS_DASHBOARD, '/request'),
  status:path(ROOTS_DASHBOARD, '/status'),
  approval:path(ROOTS_DASHBOARD, '/approval'),
  securitycheck:path(ROOTS_DASHBOARD, '/securitycheck'),
  factoryentry:path(ROOTS_DASHBOARD, '/factoryentry'),
  driverallowcation:path(ROOTS_DASHBOARD, '/driverallowcation'),
  changeapproval:path(ROOTS_DASHBOARD, '/changeapproval'),
  auditapproval:path(ROOTS_DASHBOARD, '/auditapproval'),
  entryDataCtl:path(ROOTS_DASHBOARD, '/entryDataCtl'),
  busentry:path(ROOTS_DASHBOARD, '/busentry'),
  gatepassreport:path(ROOTS_DASHBOARD, '/gatepassreport'),
  entryreport:path(ROOTS_DASHBOARD, '/entryreport'),
  aodreport:path(ROOTS_DASHBOARD, '/aodreport'),
  approverassign:path(ROOTS_DASHBOARD, '/approverassign'),
  driverassignreport:path(ROOTS_DASHBOARD, '/driverassignreport'),
  rate: path(ROOTS_DASHBOARD, '/rateadd'),
  two: path(ROOTS_DASHBOARD, '/two'),
  three: path(ROOTS_DASHBOARD, '/three'),
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
  },
};
