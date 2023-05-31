
import makeDb from '../db';
import makeMailerQuery from './mailer-query';
import makeMailerEndpointHandler from './mailer-endpoint';

const database = makeDb();
const mailerQuery = makeMailerQuery({ database });
const mailerEndpointHandler = makeMailerEndpointHandler({ mailerQuery });

export default mailerEndpointHandler;