import requiredParam from '../helpers/required-param';
import { InvalidPropertyError } from '../helpers/errors';
import isValidEmail from '../helpers/is-valid-email.js';
import upperFirst from '../helpers/upper-first';

export default function makeUser(
    userInfo = requiredParam('userInfo')
){
  
    const validUser = validate(userInfo);
    const normalUser= normalize(validUser);
    return Object.freeze(normalUser);

    function validate ({
        
        ...otherInfo
      } = {}) {
        
        return {...otherInfo }
      }
    
      function validateUser (label, name) {
        if (name.length < 2) {
          throw new InvalidPropertyError(
            `User's ${label} must be at least 2 characters long.`
          )
        }
      }

      function validateUser(email){
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
