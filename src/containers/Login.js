import React, { Component } from 'react';
import { View, StyleSheet, Image, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, Picker, Linking, ImageBackground, SafeAreaView } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { connect } from 'react-redux';
import authenticationAction from '../actions/authenticationAction';
import InputBox from '../components/InputBox';
import MText from '../components/MText';
import MButton from '../components/MButton';
import Logo from '../components/Logo';
import Hr from '../components/Hr';
import Colors from '../../config/Colors';
import Loader from '../components/Loader';

class Login extends Component {

  static navigationOptions = () => ({
    header: null
  });

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isLoginAttempt: false,
      isValidEmail: true,
      isValidPassword: true,
      emailErrorMsg: '',
      passwordErrorMsg: '',
    }
  }

  componentDidMount = () => {
    SplashScreen.hide();
  }

  // Login method goes here includes API,
  doLogin = () => {
    this.setState({
      isLoginAttempt: true
    });

    if (this.state.email === '') {
      this.setState({
        isValidEmail: false,
        emailErrorMsg: 'Email is required'
      });
    } else if (!this.validateEmail(this.state.email)) {
      this.setState({
        isValidEmail: false,
        emailErrorMsg: 'Please enter valid email address'
      });
    } else {
      this.setState({
        isValidEmail: true
      }, () => {
        if (this.state.password === '') {
          this.setState({
            isValidPassword: false,
            passwordErrorMsg: 'Password is required'
          })
        } else {
          this.setState({
            isValidPassword: true
          }, () => {
            this.props.doAuth(this.state.email, this.state.password).then((isAuthenticated) => {
              if (isAuthenticated) {
                this.props.navigation.navigate("Dashboard");
              }
            }).catch((error) => {
              Alert.alert(
                'Error in Login',
                error,
                [
                  {
                    text: 'OK'
                  }
                ],
                {
                  cancelable: true
                }
              );
            });
          });
        }
      });
    }
  }

  validateEmail = (email) => {
    // eslint-disable-next-line no-useless-escape
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  renderActuall = () => {
    return (
      <React.Fragment>

        {/* Background Image */}
        <ImageBackground
          source={require('../assets/images/backgroundBanner.png')}
          style={styles.backgroundImage}
        >
          <SafeAreaView style={{flex: 1}}>
            {/* Background Image overlay */}
            <View style={styles.overlay} />

            {/* Login form container */}
            <ScrollView keyboardShouldPersistTaps="always" contentContainerStyle={styles.scrollContainer}>

              <Logo />

              <View style={styles.title}>
                <MText style={{fontSize: 26, fontWeight: 'bold'}}>LOGIN</MText>
              </View>
              <Hr />

              {
                this.props.authentication.isError && (
                  <View style={{ paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' }}>
                    <MText style={{ color: 'red' }}>{this.props.authentication.error}</MText>
                  </View>
                )
              }

              <InputBox
                label="Email Address"
                placeholder="Type Here"
                returnKeyType={"next"}
                value={this.state.email}
                onSubmitEditing={() => { this.secondTextInput.focus(); }}
                blurOnSubmit={false}
                onChangeText={(email) => this.setState({ email: email.trim() })}
              />
              {
                this.state.isLoginAttempt && !this.state.isValidEmail && (
                  <View style={{ marginLeft: 20 }}>
                    <MText pink>{this.state.emailErrorMsg}</MText>
                  </View>
                )
              }
              <InputBox
                label="Password"
                placeholder="Type Here"
                textContentType="password"
                secureTextEntry={true}
                value={this.state.password}
                ref={(r) => { this.secondTextInput = r }}
                onSubmitEditing={() => { this.doLogin() }}
                onChangeText={(password) => this.setState({ password: password.trim() })}
              />
              {
                this.state.isLoginAttempt && !this.state.isValidPassword && (
                  <View style={{ marginLeft: 20 }}>
                    <MText pink>{this.state.passwordErrorMsg}</MText>
                  </View>
                )
              }

              <TouchableOpacity
                style={{ alignItems: 'center', marginTop: 20 }}
                onPress={() => this.props.navigation.navigate('ForgotPassword')}
              >
                <MText style={{
                  fontWeight: 'bold',
                  color: '#000000',
                  fontSize: 18,
                  textDecorationLine: 'underline'
                }}>
                  Forgot Your Password ?
                </MText>
              </TouchableOpacity>

              <View style={styles.submitButton}>
                <MButton
                  text="LOGIN"
                  onPress={() => this.doLogin()}
                />
              </View>
              <Loader loading={this.props.authentication.isAuthenticating} />
            </ScrollView>

            {/* Footer start here */}
            <View style={styles.footer}>
              <MText
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#ffffff',
                  textAlign: 'center'
                }}
              >
                For help with your account, please
              </MText>
              <TouchableOpacity
                onPress={() => Linking.openURL('mailto:support@market2boutique.com')}
              >
                <MText
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    paddingLeft: 5,
                  }}
                >
                  Contact Us
                </MText>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </ImageBackground>
      </React.Fragment>
    )
  }

  render() {
    if (Platform.OS === "android") {
      return (
        <View style={styles.container}>
          {this.renderActuall()}
        </View>
      );
    }
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        {this.renderActuall()}
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
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
  title: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10
  },
  submitButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  footer: {
    paddingVertical: 10,
    backgroundColor: Colors.teal,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  errorBox: {

  }
});

const mapStateToProps = (state) => {
  return {
    authentication: state.authenticationReducer
  }
}

const mapDispatchToProps = (dispatch) => ({
  doAuth: (email, password) => dispatch(authenticationAction(email, password))
})

export default connect(mapStateToProps, mapDispatchToProps)(Login);
