import axios from 'axios';
import Api from '../../config/Api';
import * as Types from '../constants/actionsConstants';
import getUserId from './getUserId';
import presentError from '../components/presentError';

export const openOrdersAction = () => {
    return async (dispatch) => {
        dispatch({
            type: Types.FETCHING_OPEN_ORDERS
        });

        const userId = await getUserId();

        return new Promise((resolve, reject) => {
            axios.get(`${Api.url}/${userId}/open-orders`, {headers: Api.headers}).then((response) => {
                if (response.data.status === 'success') {
                    dispatch({
                        type: Types.FETCHED_OPEN_ORDERS,
                        data: response.data.orders.data,
                        currentPage: response.data.orders.current_page,
                        from: response.data.orders.from,
                        to: response.data.orders.to,
                        nextPageUrl: response.data.orders.next_page_url,
                        prevPageUrl: response.data.orders.prev_page_url,
                        openOrdersCount: response.data.openorderCount
                    });
                    resolve(true);
                } else {
                    dispatch({
                        type: Types.FETCHING_OPEN_ORDERS_ERROR,
                        error: response.data.message
                    });
                    resolve(false);
                }
            }).catch((error) => {
                presentError("Open Order Action", error.message);
                reject(error.message);
            });
        });
    }
}

export const fetchPage = (pageUrl) => {
    return (dispatch) => {
        dispatch({
            type: Types.FETCHING_ANOTHER_OPEN_ORDERS_PAGE
        });
        return new Promise((resolve, reject) => {
            axios.get(pageUrl, {headers: Api.headers}).then((response) => {
                if (response.data.status === 'success') {
                    dispatch({
                        type: Types.FETCHED_OPEN_ORDERS,
                        data: response.data.orders.data,
                        currentPage: response.data.orders.current_page,
                        from: response.data.orders.from,
                        to: response.data.orders.to,
                        nextPageUrl: response.data.orders.next_page_url,
                        prevPageUrl: response.data.orders.prev_page_url,
                        openOrdersCount: response.data.openorderCount
                    });
                    resolve(true);
                } else {
                    dispatch({
                        type: Types.FETCHING_OPEN_ORDERS_ERROR,
                        error: response.data.message
                    });
                    resolve(false);
                }
            }).catch((error) => {
                presentError("Another Page", error.message);
                reject(error);
            });
        });
    }
}

export const fetchSliderData = (position) => {
    return (dispatch) => {
        dispatch({
            type: Types.FETCHING_OPEN_ORDERS_SLIDER_DATA
        });

        return new Promise(async (resolve, reject) => {
            const userId = await getUserId();
            
        });
    }
}
