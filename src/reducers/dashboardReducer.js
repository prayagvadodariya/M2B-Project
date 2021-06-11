import * as Types from '../constants/actionsConstants';

const initialState = {
    
    isFetchingOpenOrders: false,
    openOrders: [],
    openOrdersCount: '',
    isOpenOrdersError: false,
    openOrdersError: '',

    isFetchingFavoriteVendors: false,
    favoriteVendors: [],
    isFavoriteVendorsError: false,
    favoriteVendorsError: '',

    isFetchingShippingSoon: false,
    shippingSoon: [],
    isShippingSoonError: false,
    shippingSoonError: '',

    isFetchingPastDueOrders: false,
    pastDueOrders: [],
    isPastDueOrdersError: false,
    pastDueOrdersError: ''
    
}

const dashboardReducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.FETCHING_DASHBOARD_OPEN_ORDERS: {
            return {
                ...state,
                isFetchingOpenOrders: true
            }
        }
        case Types.FETCHED_DASHBOARD_OPEN_ORDERS: {
            return {
                ...state,
                isFetchingOpenOrders: false,
                isOpenOrdersError: false,
                openOrdersError: '',
                openOrders: action.openOrders,
                openOrdersCount: action.openOrdersCount
            }
        }
        case Types.FETCHING_DASHBOARD_OPEN_ORDERS_ERROR: {
            return {
                ...state,
                isFetchingOpenOrders: false,
                isOpenOrdersError: true,
                openOrdersError: action.error,
                openOrders: [],
                openOrdersCount: ''
            }
        }

        case Types.FETCHING_DASHBOARD_FAVORITE_VENDORS: {
            return {
                ...state,
                isFetchingFavoriteVendors: true,
            }
        }
        case Types.FETCHED_DASHBOARD_FAVORITE_VENDORS: {
            return {
                ...state,
                isFetchingFavoriteVendors: false,
                isFavoriteVendorsError: false,
                favoriteVendorsError: '',
                favoriteVendors: action.favoriteVendors
            }
        }
        case Types.FETCHING_DASHBOARD_FAVORITE_VENDORS_ERROR: {
            return {
                ...state,
                isFavoriteVendorsError: true,
                favoriteVendorsError: action.error,
                isFetchingFavoriteVendors: false,
                favoriteVendors: []
            }
        }

        case Types.FETCHING_DASHBOARD_SHIPPING_SOON: {
            return {
                ...state,
                isFetchingShippingSoon: true,
            }
        }
        case Types.FETCHED_DASHBOARD_SHIPPING_SOON: {
            return {
                ...state,
                isFetchingShippingSoon: false,
                shippingSoon: action.shippingSoon,
                isShippingSoonError: false,
                shippingSoonError: ''
            }
        }
        case Types.FETCHING_DASHBOARD_SHIPPING_SOON_ERROR: {
            return {
                ...state,
                isShippingSoonError: true,
                shippingSoonError: action.error,
                shippingSoon: [],
                isFetchingShippingSoon: false
            }
        }

        case Types.FETCHING_DASHBOARD_PAST_DUE_ORDERS: {
            return {
                ...state,
                isFetchingPastDueOrders: true,
            }
        }
        case Types.FETCHED_DASHBOARD_PAST_DUE_ORDERS: {
            return {
                ...state,
                isFetchingPastDueOrders: false,
                pastDueOrders: action.pastDueOrders,
                isPastDueOrdersError: false,
                pastDueOrdersError: ''
            }
        }
        case Types.FETCHING_DASHBOARD_PAST_DUE_ORDERS_ERROR: {
            return {
                ...state,
                isPastDueOrdersError: true,
                pastDueOrdersError: action.error,
                isFetchingPastDueOrders: false,
                pastDueOrders: []
            }
        }
        
        default: {
            return state
        }
    }
}

export default dashboardReducer
