import axios from 'axios';
import Api from '../../config/Api';
import * as Types from '../constants/actionsConstants';
import getUserId from './getUserId';

export const fetchMonthlyBudgets = () => {
    return (dispatch) => {
        dispatch({
            type: Types.FETCHING_MONTHLY_BUDGETS
        });

        return new Promise(async (resolve, reject) => {
            const userId = await getUserId();

            await axios.get(`${Api.url}/${userId}/budget/monthly?partial=true`, {headers:Api.headers}).then((response) => {
                console.log(response);
                if (response.data.status === 'success') {
                    dispatch({
                        type: Types.FETCHED_MONTHLY_BUDGETS,
                        monthlyBudgets: response.data.budgets.data
                    });
                    resolve(true);
                } else {
                    dispatch({
                        type: Types.FETCHING_MONTHLY_BUDGETS_ERROR,
                        error: response.data.message
                    });
                    resolve(false);
                }   
            }).catch((error) => {
                dispatch({
                    type: Types.FETCHING_MONTHLY_BUDGETS_ERROR,
                    error: error.message
                });
                reject(error.message);
            });
        });
    }
}

export const fetchCategoryBudgets = () => {
    return (dispatch) => {
        dispatch({
            type: Types.FETCHING_CATEGORY_BUDGETS
        });

        return new Promise(async (resolve, reject) => {
            const userId = await getUserId();

            await axios.get(`${Api.url}/${userId}/budget/category?partial=true`, {headers:Api.headers}).then((response) => {
                if (response.data.status === 'success') {
                    dispatch({
                        type: Types.FETCHED_CATEGORY_BUDGETS,
                        categoryBudgets: response.data.budgets.data
                    });
                    resolve(true);
                } else {
                    dispatch({
                        type: Types.FETCHING_CATEGORY_BUDGETS_ERROR,
                        error: response.data.message
                    });
                    resolve(false);
                }   
            }).catch((error) => {
                dispatch({
                    type: Types.FETCHING_CATEGORY_BUDGETS_ERROR,
                    error: error.message
                });
                reject(error.message);
            });
        });
    }
}

export const fetchMarketBudgets = () => {
    return (dispatch) => {
        dispatch({
            type: Types.FETCHING_MARKET_BUDGETS
        });

        return new Promise(async (resolve, reject) => {
            const userId = await getUserId();

            await axios.get(`${Api.url}/${userId}/budget/market?partial=true`, {headers:Api.headers}).then((response) => {
                if (response.data.status === 'success') {
                    dispatch({
                        type: Types.FETCHED_MARKET_BUDGETS,
                        marketBudgets: response.data.budgets.data
                    });
                    resolve(true);
                } else {
                    dispatch({
                        type: Types.FETCHING_MARKET_BUDGETS_ERROR,
                        error: response.data.message
                    });
                    resolve(false);
                }   
            }).catch((error) => {
                dispatch({
                    type: Types.FETCHING_MARKET_BUDGETS_ERROR,
                    error: error.message
                });
                reject(error.message);
            });
        });
    }
}
