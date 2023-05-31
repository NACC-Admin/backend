import makeDb from '../db';
import makeAuthQuery from './auth-query';
import makeAuthEndpointHandler from './auth-endpoint';

const database = makeDb();
const authQuery = makeAuthQuery({ database });
const authEndpointHandler = makeAuthEndpointHandler({ authQuery });

export default authEndpointHandler;