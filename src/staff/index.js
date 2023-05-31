import makeDb from '../db';
import makeStaffQuery from './staff-query';
import makeStaffEndpointHandler from './staff-endpoint';

const database = makeDb();
const staffQuery = makeStaffQuery({database});
const staffEndpointHandler = makeStaffEndpointHandler({ staffQuery });

export default staffEndpointHandler;