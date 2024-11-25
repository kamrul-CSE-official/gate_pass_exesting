import { Button, Container } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import Iconify from '../../../components/iconify';
import { useSettingsContext } from '../../../components/settings';

export default function PageApproverAssign() {
  const { themeStretch } = useSettingsContext();
  return (
    <>
      <Helmet>
        <title> Approver Assign | Gatepass</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Create a new Approver"
          links={[{ name: 'Gatepass' }, { name: 'Approver Assign' }]}
          action={
            <Button variant="contained" startIcon={<Iconify icon="material-symbols:refresh" />}>
              Add
            </Button>
          }
        />
      </Container>
    </>
  );
}
