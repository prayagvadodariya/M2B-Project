import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import * as Keys from '../constants/storageKeys';

class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  bootstrapAsync = async () => {
    const user = await AsyncStorage.getItem(Keys.IS_AUTHENTICATED_USER);

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate((user === Keys.USER_AUTHENTICATED) ? 'Dashboard' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }
}

export default AuthLoadingScreen
