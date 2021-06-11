import React, { Component } from 'react';
import { View, Alert } from 'react-native';
import { connect } from 'react-redux';
import { generateNewPassword } from '../actions/forgotPasswordAction';
import InputBox from '../components/InputBox';
import MButton from '../components/MButton';
import Loader from '../components/Loader';
import MText from '../components/MText';
import validate from './validateWrapper';

class FPStepOne extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      confirmPassword: '',
      passwordError: null,
      confirmPasswordError: null
    };
  }

  generateNewPassword = () => {
    const passwordError = validate("required", this.state.password, "Please enter Password");
    let confirmPasswordError = validate("required", this.state.confirmPassword, "Please enter Confirm Password");
    if (confirmPasswordError) {
      if (this.state.password !== this.state.confirmPassword) {
        confirmPasswordError = 'Password does not match'
      }
    }

    this.setState({
      passwordError,
      confirmPasswordError
    });

    if (!passwordError && !confirmPasswordError) {
      this.setState({
        passwordError: null,
        confirmPasswordError: null
      });
      const params = {
        "email": this.props.fpStepThree.email,
        "code": this.props.fpStepThree.code,
        "password": this.state.password,
        "password_confirmation": this.state.confirmPassword
      }
      this.props.generateNewPassword(params).then((isSuccess) => {
        if (isSuccess) {
          this.props.navigateToLogin();
        }
      }).catch((error) => {
        Alert.alert(
          'Error',
          error,
          [
            {
              text: 'OK'
            }
          ]
        );
      });
    }
  }

  render() {
    return (
      <View>

        <InputBox
          label="New Password"
          placeholder="Type Here"
          textContentType="password"
          secureTextEntry={true}
          value={this.state.password}
          onChangeText={(password) => this.setState({ password: password.trim() })}
        />
        {
          this.state.passwordError && (
            <View style={{ paddingLeft: 10 }}>
              <MText pink>{this.state.passwordError}</MText>
            </View>
          )
        }

        <InputBox
          label="Confirm Password"
          placeholder="Type Here"
          textContentType="password"
          secureTextEntry={true}
          value={this.state.confirmPassword}
          onChangeText={(confirmPassword) => this.setState({ confirmPassword: confirmPassword.trim() })}
        />
        {
          this.state.confirmPasswordError && (
            <View style={{ paddingLeft: 10 }}>
              <MText pink>{this.state.confirmPasswordError}</MText>
            </View>
          )
        }

        {
          this.props.fpStepThree.isGeneratingNewPasswordError && (
            <View style={{ paddingLeft: 10 }}>
              <MText pink>{this.props.fpStepThree.generatingNewPasswordError}</MText>
            </View>
          )
        }

        <Loader loading={this.props.fpStepThree.isGeneratingNewPassword} />

        <MButton
          text="RESET"
          style={{
            alignSelf: 'center',
            marginVertical: 20,
          }}
          onPress={this.generateNewPassword}
        />

      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  fpStepThree: state.forgotPasswordReducer
});

const mapDispatchToProps = (dispatch) => ({
  generateNewPassword: (params) => dispatch(generateNewPassword(params))
});

export default connect(mapStateToProps, mapDispatchToProps)(FPStepOne);
