import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Toast from 'react-native-easy-toast'
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Api from '../../config/Api';
import getUserId from '../actions/getUserId';
import presentError from '../components/presentError';
import MText from '../components/MText';
import Colors from '../../config/Colors';
import InputBox from '../components/InputBox';
import MButton from '../components/MButton';
import Loader from '../components/Loader';
import validate from './validateWrapper';
import SafeScrollView from '../components/SafeScrollView';

class CreateMarketTrip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventName: this.props.eventName || '',
      eventNameError: null,
      isSaving: false
    };
  }

  save = async () => {
    const eventNameError = validate("required", this.state.eventName, "Event name is required");
    this.setState({
      eventNameError
    })

    if (!eventNameError) {
      this.setState({ isSaving: true });
      const userId = await getUserId();
      const param = {
        name: this.state.eventName
      }
      if (this.props.id) {
        param.id = this.props.is
      }
      axios.post(`${Api.url}/${userId}/events/save`, param, { headers: Api.headers }).then((response) => {
        if (response.data.status === 'success') {
          this.setState({ isSaving: false });
          this.props.closeModal(true);
        } else {
          this.setState({ isSaving: false }, () => {
            setTimeout(() => {
              presentError("Error", response.data.message);
            }, 500);
          });
        }
      }).catch((error) => {
        this.setState({ isSaving: false }, () => {
          setTimeout(() => {
            presentError("Error", error.message);
          }, 500);
        });
      });
    }
  }

  render() {
    return (
      <SafeScrollView>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <Loader loading={this.state.isSaving} />

          <View style={styles.title}>
            <MText size={28} bold>Event</MText>
            <TouchableOpacity onPress={() => this.props.closeModal(false)}>
              <Icon name="times" color="#aaa" size={18} />
            </TouchableOpacity>
          </View>


          <View style={styles.body}>
            <InputBox
              label="Evenet Name"
              labelNormal={true}
              require
              value={this.state.eventName.toString()}
              onChangeText={(eventName) => this.setState({ eventName })}
            />
            {
              this.state.eventNameError && (
                <View style={{ paddingHorizontal: 20 }}>
                  <MText pink>{this.state.eventNameError}</MText>
                </View>
              )
            }
          </View>


          <View style={styles.footer}>
            <MButton
              text="SAVE"
              pink
              onPress={this.save}
            />
            <MButton
              text="CLOSE"
              darkBlue
              style={{ marginRight: 10 }}
              onPress={() => this.props.closeModal(false)}
            />
          </View>

          <Toast ref={(toast) => { this.toast = toast }} />

        </ScrollView>
      </SafeScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
  },
  title: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: Colors.border,
    borderBottomWidth: 1,
    alignItems: 'center'
  },
  body: {
    paddingHorizontal: 10,
    paddingBottom: 10
  },
  footer: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    overflow: 'hidden',
    flexDirection: 'row-reverse',
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    alignItems: 'center'
  }
});

export default CreateMarketTrip;
