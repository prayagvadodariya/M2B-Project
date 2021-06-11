import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import Api from '../../config/Api';
import * as Types from '../constants/actionsConstants';
import * as Keys from '../constants/storageKeys';

export const fetchDashboardOpenOrders = () => {
    return (dispatch) => {
        dispatch({
            type: Types.FETCHING_DASHBOARD_OPEN_ORDERS
        });

        return new Promise(async (resolve, reject) => {
            try {
                let userData = await AsyncStorage.getItem(Keys.USER_DATA);
                userData = JSON.parse(userData);
                axios.get(`${Api.url}/${userData.id}/home/open-orders`, {headers: Api.headers}).then((response) => {
                    if (response.data.status === 'success') {
                        dispatch({
                            type: Types.FETCHED_DASHBOARD_OPEN_ORDERS,
                            openOrders: response.data.orders,
                            openOrdersCount: response.data.openorderCount
                        });
                        resolve(true);
                    } else {
                        dispatch({
                            type: Types.FETCHING_DASHBOARD_OPEN_ORDERS_ERROR,
                            error: response.data.message
                        });
                        resolve(false);
                    }
                }).catch((error) => {
                    dispatch({
                        type: Types.FETCHING_DASHBOARD_OPEN_ORDERS_ERROR,
                        error: error.message
                    });
                    reject(error.message);
                });
            } catch (error) {
                dispatch({
                    type: Types.FETCHING_DASHBOARD_OPEN_ORDERS_ERROR,
                    error: error.message
                });
                reject(error.message);
            }
        });
    }
}

export const fetchDashboardFavoriteVendors = () => {
    return (dispatch) => {
        dispatch({
            type: Types.FETCHING_DASHBOARD_FAVORITE_VENDORS
        });

        return new Promise(async (resolve, reject) => {
            try {
                let userData = await AsyncStorage.getItem(Keys.USER_DATA);
                userData = JSON.parse(userData);
                axios.get(`${Api.url}/${userData.id}/home/top-vendors`, {headers: Api.headers}).then((response) => {
                    if (response.data.status === 'success') {
                        dispatch({
                            type: Types.FETCHED_DASHBOARD_FAVORITE_VENDORS,
                            favoriteVendors: response.data.vendors
                        });
                        resolve(true);
                    } else {
                        dispatch({
                            type: Types.FETCHING_DASHBOARD_FAVORITE_VENDORS_ERROR,
                            error: response.data.message
                        });
                        resolve(false);
                    }
                }).catch((error) => {
                    dispatch({
                        type: Types.FETCHING_DASHBOARD_FAVORITE_VENDORS_ERROR,
                        error: error.message
                    });
                    reject(error.message);
                });
            } catch (error) {
                dispatch({
                    type: Types.FETCHING_DASHBOARD_FAVORITE_VENDORS_ERROR,
                    error: error.message
                });
                reject(error);
            }
        });
    }
}

export const fetchDashboardShippingSoon = () => {
    return (dispatch) => {
        dispatch({
            type: Types.FETCHING_DASHBOARD_SHIPPING_SOON
        });

        return new Promise(async (resolve, reject) => {
            try {
                let userData = await AsyncStorage.getItem(Keys.USER_DATA);
                userData = JSON.parse(userData);
                axios.get(`${Api.url}/${userData.id}/home/shipping-soon`, {headers: Api.headers}).then((response) => {
                    if (response.data.status === 'success') {
                        dispatch({
                            type: Types.FETCHED_DASHBOARD_SHIPPING_SOON,
                            shippingSoon: response.data.data
                        });
                        resolve(true);
                    } else {
                        dispatch({
                            type: Types.FETCHING_DASHBOARD_SHIPPING_SOON_ERROR,
                            error: response.data.message
                        });
                        resolve(false);
                    }
                }).catch((error) => {
                    dispatch({
                        type: Types.FETCHING_DASHBOARD_SHIPPING_SOON_ERROR,
                        error: error.message
                    });
                    reject(error.message);
                });
            } catch (error) {
                dispatch({
                    type: Types.FETCHING_DASHBOARD_SHIPPING_SOON_ERROR,
                    error: error.message
                });
                reject(error);
            }
        });
    }
}

export const fetchDashboardPastDueOrders = () => {
    return (dispatch) => {
        dispatch({
            type: Types.FETCHING_DASHBOARD_PAST_DUE_ORDERS
        });

        return new Promise(async (resolve, reject) => {
            try {
                let userData = await AsyncStorage.getItem(Keys.USER_DATA);
                userData = JSON.parse(userData);
                axios.get(`${Api.url}/${userData.id}/home/past-orders`, {headers: Api.headers}).then((response) => {
                    if (response.data.status === 'success') {
                        dispatch({
                            type: Types.FETCHED_DASHBOARD_PAST_DUE_ORDERS,
                            pastDueOrders: response.data.data
                        });
                        resolve(true);
                    } else {
                        dispatch({
                            type: Types.FETCHING_DASHBOARD_PAST_DUE_ORDERS_ERROR,
                            error: response.data.message
                        });
                        resolve(false);
                    }
                }).catch((error) => {
                    dispatch({
                        type: Types.FETCHING_DASHBOARD_PAST_DUE_ORDERS_ERROR,
                        error: error.message
                    });
                    reject(error.message);
                });
            } catch (error) {
                dispatch({
                    type: Types.FETCHING_DASHBOARD_PAST_DUE_ORDERS_ERROR,
                    error: error.message
                });
                reject(error);
            }
        });
    }
}
