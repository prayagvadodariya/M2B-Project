import * as Types from '../constants/actionsConstants';

const clearSignUpDataAction = () => {
    return (dispatch) => {
        dispatch({
            type: Types.CLEAR_SIGNUP_DATA
        });
    }
}

export default clearSignUpDataAction
