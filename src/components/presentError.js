import { Alert } from 'react-native';

const presentError = (title, message) => {
    Alert.alert(
        title,
        message,
        [
            {
                text: 'OK'
            }
        ]
    );
}

export default presentError
