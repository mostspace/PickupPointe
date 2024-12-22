import { Helmet } from 'react-helmet-async';
// Sections
import { IntegrationsView } from 'src/sections/merchant/settings/integrations/view';

const Integrations = () => {
  return (
    <>
      <Helmet>
        <title>Integrations</title>
      </Helmet>

      <IntegrationsView />
    </>
  );
};

export default Integrations;
