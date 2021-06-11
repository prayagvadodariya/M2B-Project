import axios from 'axios';
import * as Types from '../constants/actionsConstants';
import Api from '../../config/Api';

export const sendVerificationCode = (email) => { 
    
    return (dispatch) => {
        dispatch({
            type: Types.SENDING_VERIFICATION_CODE
        });

        return new Promise((resolve, reject) => {

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': Api.token
            }
            const data = {
                "email": email
            }

            axios.post(`${Api.url}/forgot-password`, data, {headers}).then((response) => {
                console.log(response);
                if (response.data.status === 'success') {
                    dispatch({
                        type: Types.CODE_SENT,
                        email
                    });
                    resolve(true);
                } else {
                    dispatch({
                        type: Types.SENDING_VERIFICATION_CODE_ERROR,
                        error: response.data.message[0]
                    });
                    resolve(false);
                }
            }).catch((error) => {
                dispatch({
                    type: Types.CODE_SENT
                });
                reject(error);
            });
        });
    }

}

export const validateCode = (params) => {

    return (dispatch) => {
        dispatch({
            type: Types.VALIDATING_CODE
        });
       
        return new Promise((resolve, reject) => {

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': Api.token
            }
            
            axios.post(`${Api.url}/validate-code`, params, {headers}).then((response) => {
                dispatch({
                    type: Types.VALIDATED_CODE,
                    code: params.code
                });
                if (response.data.status === 'success') {
                    resolve(true);
                } else {
                    dispatch({
                        type: Types.VALIDATING_ERROR,
                        error: response.data.message[0]
                    });
                    resolve(false);
                }
            }).catch((error) => {
                dispatch({
                    type: Types.VALIDATED_CODE,
                    code: ''
                });
                reject(error.message);
            });
        });
    }

} 

export const generateNewPassword = (params) => {

    return (dispatch) => {
        dispatch({
            type:Types.GENERATING_NEW_PASSWORD
        });

        return new Promise((resolve, reject) => {

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': Api.token
            }
            
            axios.post(`${Api.url}/generate-password`, params, {headers}).then((response) => {
                dispatch({
                    type: Types.GENERATED_NEW_PASSWORD
                });
                if (response.data.status === 'success') {
                    resolve(true);
                } else {
                    dispatch({
                        type: Types.GENERATING_NEW_PASSWORD_ERROR,
                        error: response.data.message[0]
                    });
                    resolve(false);
                }
            }).catch((error) => {
                dispatch({
                    type: Types.GENERATED_NEW_PASSWORD
                });
                reject(error.message);
            });
        });
    }

}
