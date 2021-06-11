import React, { Component } from 'react';
import { View, Alert } from 'react-native';
import { connect } from 'react-redux';
import { validateCode } from '../actions/forgotPasswordAction';
import InputBox from '../components/InputBox';
import MButton from '../components/MButton';
import Loader from '../components/Loader';
import MText from '../components/MText';

class FPStepOne extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
      codeFieldError: null
    };
  }

  validateCode = () => {
    if (this.state.code === '' || this.state.code === ' ') {
      this.setState({
        codeFieldError: 'Please enter verification code'
      });
    } else {
      this.setState({
        codeFieldError: null
      });
      const params = {
        "email": this.props.fpStepTwo.email,
        "code": this.state.code
      }
      this.props.validateCode(params).then((isSuccess) => {
        if (isSuccess) {
          this.props.onNext();
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
          label="Code"
          placeholder="Type Here"
          value={this.state.email}
          onChangeText={(code) => this.setState({ code: code.trim() })}
        />
        {
          this.state.codeFieldError && (
            <View style={{ paddingLeft: 10 }}>
              <MText pink>{this.state.codeFieldError}</MText>
            </View>
          )
        }

        <Loader loading={this.props.fpStepTwo.isValidatingCode} />

        {
          this.props.fpStepTwo.isValidatingCodeError && (
            <View style={{ paddingLeft: 10 }}>
              <MText pink>{this.props.fpStepTwo.validatingError}</MText>
            </View>
          )
        }

        <MButton
          text="VERIFY"
          style={{
            alignSelf: 'center',
            marginVertical: 20,
          }}
          onPress={this.validateCode}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  fpStepTwo: state.forgotPasswordReducer
});

const mapDispatchToProps = (dispatch) => ({
  validateCode: (params) => dispatch(validateCode(params))
});

export default connect(mapStateToProps, mapDispatchToProps)(FPStepOne);
