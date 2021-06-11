import AsyncStorage from '@react-native-community/async-storage';
import * as Keys from '../constants/storageKeys';

const getUserId = async () => {
    let userData = await AsyncStorage.getItem(Keys.USER_DATA);
    userData = JSON.parse(userData);
    return userData.id
}

export default getUserId
