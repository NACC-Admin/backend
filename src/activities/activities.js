import requiredParam from '../helpers/required-param';
import { InvalidPropertyError } from '../helpers/errors';
import isValidEmail from '../helpers/is-valid-email.js';
import upperFirst from '../helpers/upper-first';

export default function makeActivities(
    activitiesInfo = requiredParam('activitiesInfo')
){
    
    const validTActivities = validate(activitiesInfo);
    const normalActivities = normalize(validTActivities);
    return Object.freeze(normalActivities);

    function validate ({
        /*customer_id = requiredParam('customer_id'),
        payment_id = requiredParam('payment_id'),
        status = requiredParam('status'),*/
        ...otherInfo
    } = {}) {
        
        return { ...otherInfo }
    }

    /*function validateName (label, name) {
        if (name.length < 2) {
            throw new InvalidPropertyError(
            `Property's ${label} must be at least 2 characters long.`
            )
        }
    }*/

    function normalize ({...otherInfo }) {
        return {
            ...otherInfo
        }
    }

}
