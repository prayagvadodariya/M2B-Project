import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import * as Types from '../constants/actionsConstants';
import Api from '../../config/Api';
import * as Keys from '../constants/storageKeys';

const authenticationAction = (email, password) => {
    return async (dispatch) => {
        dispatch({
            type:Types.AUTHENTICATING
        });

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': Api.token
        }
        const data = {
            "email": email,
            "password": password
        } 

        return new Promise((resolve, reject) => {
            axios.post(`${Api.url}/login`, data, {headers}).then(async (response) => {
                if (response.data.status === 'success') {
                    await AsyncStorage.setItem(Keys.IS_AUTHENTICATED_USER, Keys.USER_AUTHENTICATED);
                    await AsyncStorage.setItem(Keys.USER_DATA, JSON.stringify(response.data.data));
                    dispatch({
                        type: Types.USER_FOUND,
                        data: response.data.data
                    });
                    resolve(true);
                } else {
                    dispatch({
                        type:Types.AUTH_ERROR,
                        error: response.data.message
                    });
                    resolve(false)
                }
            }).catch((error) => {
                dispatch({
                    type:Types.AUTHENTICATED
                });
                reject(error.message);
            });
        });
    }
    
}

export default authenticationAction
