import { modules } from '../../mocks/modules';

export default server => server.get('_/proxy/tenants/diku/modules', modules, 200);
