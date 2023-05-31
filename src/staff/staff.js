import requiredParam from '../helpers/required-param';
import { InvalidPropertyError } from '../helpers/errors';
import isValidEmail from '../helpers/is-valid-email.js';
import upperFirst from '../helpers/upper-first';

export default function makeStaff(
    staffInfo = requiredParam('staffInfo')
){
  
    const validStaff = validate(staffInfo);
    const normalStaff = normalize(validStaff);
    return Object.freeze(normalStaff);

    function validate ({
        
        ...otherInfo
      } = {}) {
        
        return {...otherInfo }
      }
    
      function validateStaff (label, name) {
        if (name.length < 2) {
          throw new InvalidPropertyError(
            `Admin's ${label} must be at least 2 characters long.`
          )
        }
      }

      function validateEmail(email){
        if (!isValidEmail(email)) {
            throw new InvalidPropertyError('Invalid email address.')
        }
      }

      function normalize ({...otherInfo }) { 
        
        return {
          ...otherInfo
        }
      }
}
