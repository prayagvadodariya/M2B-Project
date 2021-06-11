import React, { Component } from 'react';
import { View, Alert } from 'react-native';
import { connect } from 'react-redux';
import { sendVerificationCode } from '../actions/forgotPasswordAction';
import InputBox from '../components/InputBox';
import MButton from '../components/MButton';
import Loader from '../components/Loader';
import MText from '../components/MText';

class FPStepOne extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      emailError: null
    };
  }

  sendResetCode = () => {
    if (this.state.email === '') {
      this.setState({
        emailError: 'Please enter email'
      });
    } else if (!this.validateEmail(this.state.email)) {
      this.setState({
        emailError: 'Please enter valid email address'
      });
    } else {
      this.setState({ emailError: null });
      this.props.sendVerificationCode(this.state.email).then((isSuccess) => {
        if (isSuccess) {
          this.props.onNext();
        }
      }).catch((error) => {
        Alert.alert(
          'Error',
          error.message,
          [
            {
              text: 'OK'
            }
          ]
        );
      });
    }
  }

  validateEmail = (email) => {
    // eslint-disable-next-line no-useless-escape
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <InputBox
          label="E-Mail Address"
          placeholder="Type Here"
          value={this.state.email}
          onChangeText={(email) => this.setState({ email: email.trim() })}
        />
        {
          this.state.emailError && (
            <View style={{ paddingLeft: 10 }}>
              <MText pink>{this.state.emailError}</MText>
            </View>
          )
        }

        <Loader loading={this.props.fpStepOne.isSendingVerificationCode} />

        {
          this.props.fpStepOne.isSendingVerificationCodeError && (
            <View style={{ alignItems: 'center' }}>
              <MText pink size={16}>{this.props.fpStepOne.sendingVerificationCodeError}</MText>
            </View>
          )
        }

        <MButton
          text="SEND PASSWORD RESET CODE"
          style={{
            alignSelf: 'center',
            marginVertical: 10,
          }}
          onPress={this.sendResetCode}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  fpStepOne: state.forgotPasswordReducer
});

const mapDispatchToProps = (dispatch) => ({
  sendVerificationCode: (email) => dispatch(sendVerificationCode(email))
});

export default connect(mapStateToProps, mapDispatchToProps)(FPStepOne);
