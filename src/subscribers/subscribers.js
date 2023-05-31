import requiredParam from '../helpers/required-param';
import { InvalidPropertyError } from '../helpers/errors';
import isValidEmail from '../helpers/is-valid-email.js';
import upperFirst from '../helpers/upper-first';

export default function makeSubscribers(
    subscribersInfo = requiredParam('subscribersInfo')
){
 
    const validSubscribers = validate(subscribersInfo);
    const normalSubscribers = normalize(validSubscribers);
    return Object.freeze(normalSubscribers);

    function validate ({
        // customer_id = requiredParam('customer_id'),
        // status = requiredParam('status'),
        ...otherInfo
      } = {}) {
        //validateName('surname', surname)
        //validateName('othernames', othernames)
        return {...otherInfo }
      }
    
      

      function normalize ({ ...otherInfo }) {
        return {
          ...otherInfo
        }
      }
}
