import makeDb from '../db';
import makeActivitiesQuery from './activities-query';
import makeActivitiesEndpointHandler from './activities-endpoint';

const database = makeDb();
const activitiesQuery = makeActivitiesQuery({ database });
const activitiesEndpointHandler = makeActivitiesEndpointHandler({ activitiesQuery });

export default activitiesEndpointHandler;