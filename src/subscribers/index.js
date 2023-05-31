import makeDb from '../db';
import makeSubscribersQuery from './subscribers-query';
import makeSubscribersEndpointHandler from './subscribers-endpoint';

const database = makeDb();
const subscribersQuery = makeSubscribersQuery({ database });
const subscribersEndpointHandler = makeSubscribersEndpointHandler({ subscribersQuery });

export default subscribersEndpointHandler;