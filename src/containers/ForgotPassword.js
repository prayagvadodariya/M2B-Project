import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView, ImageBackground } from 'react-native';
import Swiper from 'react-native-swiper';
import FPStepOne from './FPStepOne';
import FPStepTwo from './FPStepTwo';
import FPStepThree from './FPStepThree';
import SafeScrollView from '../components/SafeScrollView';
import MText from '../components/MText';
import Logo from '../components/Logo';
import Hr from '../components/Hr';
import Colors from '../../config/Colors';

class ForgotPassword extends Component {

  static navigationOptions = () => ({
    header: null
  });

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  slideToNext = () => {
    this.swiper.scrollBy(1, true);
  }

  slideToPrev = () => {
    this.swiper.scrollBy(-1, true);
  }

  navigateToLogin = () => {
    this.props.navigation.navigate("Login");
  }

  render() {
    return (
      <SafeScrollView style={styles.container}>
        {/* Background Image */}
        <ImageBackground
          source={require('../assets/images/backgroundBanner.png')}
          style={styles.backgroundImage}
        >

          <SafeAreaView style={{flex: 1}}>
            {/* Background Image overlay */}
            <View style={styles.overlay} />

            {/* Login form container */}
            <ScrollView contentContainerStyle={styles.scrollContainer}>

              <Logo />

              <View style={styles.title}>
                <MText
                  style={{
                    fontSize: 26,
                    fontWeight: 'bold'
                  }}
                >
                  RESET PASSWORD
                  </MText>
              </View>

              <Hr />

              <Swiper
                style={{}}
                ref={(swiper) => { this.swiper = swiper; }}
                containerStyle={{ flex: 1 }}
                showsButtons={false}
                showsPagination={false}
                loop={false}
                removeClippedSubviews={false}
                scrollEnabled={false}
              >
                <FPStepOne onNext={this.slideToNext} />
                <FPStepTwo onNext={this.slideToNext} onPrev={this.slideToPrev} />
                <FPStepThree onNext={this.slideToNext} onPrev={this.slideToPrev} navigateToLogin={this.navigateToLogin} />
              </Swiper>



            </ScrollView>

            {/* Footer start here */}
            <View style={styles.footer}>
              <MText
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#ffffff'
                }}
              >
                Already have a password?
                </MText>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Login')}
              >
                <MText
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    paddingLeft: 5,
                  }}
                >
                  Login
                  </MText>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </ImageBackground>
      </SafeScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  backgroundImage: {
    height: '100%',
    width: '100%'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.50)'
  },
  scrollContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10
  },
  footer: {
    paddingVertical: 10,
    backgroundColor: Colors.teal,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default ForgotPassword;
