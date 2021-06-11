import * as Types from '../constants/actionsConstants';

const initialState = {
    isFetching: false,

    isError: false,
    error: '',

    from: 0,
    to: 0,
    currentPage: 0,

    data:[],

    nextPageUrl: null,
    prevPageUrl: null,

    openOrdersCount: 0,

    isFetchingAnotherPage: false,
    
    isFetchingSlider: false,
    sliderData: []
}

const openOrdersReducer = (state = initialState, action) => {

    switch (action.type) {
        case Types.FETCHING_OPEN_ORDERS: {
            return {
                ...state,
                isFetching: true
            }
        }
        case Types.FETCHED_OPEN_ORDERS: {
            return {
                ...state,
                isFetching: false,
                isError: false,
                error: '',
                from: action.from,
                to: action.to,
                currentPage: action.currentPage,
                data: action.data,
                nextPageUrl: action.nextPageUrl,
                prevPageUrl: action.prevPageUrl,
                openOrdersCount: action.openOrdersCount,
                isFetchingAnotherPage: false,
            }
        }
        case Types.FETCHING_OPEN_ORDERS_ERROR: {
            return {
                ...state,
                isError: true,
                error: action.error,
                data: []
            }
        }
        case Types.FETCHING_ANOTHER_OPEN_ORDERS_PAGE: {
            return {
                ...state,
                isFetchingAnotherPage: true
            }
        }
        case Types.FETCHING_OPEN_ORDERS_SLIDER_DATA: {
            return {
                ...state,
                isFetchingSlider: true
            }
        }
        case Types.FETCHED_OPEN_ORDERS_SLIDER_DATA: {
            return {
                ...state,
                isFetchingSlider: false,
                sliderData: action.sliderData
            }
        }
        default: {
            return state
        }
    }

}

export default openOrdersReducer
