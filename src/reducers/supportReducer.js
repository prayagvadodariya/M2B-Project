import * as Types from '../constants/actionsConstants';

const initialState = {
    isFetching: false,
    videos: [],
    isError: false,
    error: ''
}

const supportReducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.FETCHING_VIDEOS: {
            return {
                ...state,
                isFetching: true
            }
        }
        case Types.FETCHED_VIDEOS: {
            return {
                ...state,
                isFetching: false,
                videos: action.videos
            }
        }
        case Types.FETCHING_VIDEOS_ERROR: {
            return {
                ...state,
                isFetching: false,
                videos: [],
                isError: true,
                error: action.error
            }
        }
        default: {
            return state
        }
    }
}

export default supportReducer
