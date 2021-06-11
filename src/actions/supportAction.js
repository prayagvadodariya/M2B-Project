import axios from 'axios';
import Api from '../../config/Api';
import * as Types from '../constants/actionsConstants';
import presentError from '../components/presentError';

const supportAction = () => {
    return (dispatch) => {
        dispatch({
            type: Types.FETCHING_VIDEOS
        });
        return new Promise((resolve, reject) => {
            axios.get(`${Api.url}/support`, {headers: Api.headers}).then((response) => {
                if (response.data.status === 'success') {
                    dispatch({
                        type: Types.FETCHED_VIDEOS,
                        videos: response.data.videos.items
                    });
                    resolve(true);
                } else {
                    dispatch({
                        type: Types.FETCHING_VIDEOS_ERROR,
                        error: response.data.message
                    });
                    resolve(false);
                }
            }).catch((error) => {
                presentError("supportAction", error.message);
                reject(error);
            });
        });
    }
}

export default supportAction
