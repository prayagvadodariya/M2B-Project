import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Platform, SafeAreaView } from 'react-native';
import axios from 'axios';
import Checkbox from 'react-native-modest-checkbox';
import getUserId from '../actions/getUserId';
import presentError from '../components/presentError';
import Loader from '../components/Loader';
import HeaderMenuButton from '../components/HeaderMenuButton';
import HeaderSearchButton from '../components/HeaderSearchButton';
import Colors from '../../config/Colors';
import Card from '../components/Card';
import InputBox from '../components/InputBox';
import MButton from '../components/MButton';
import Api from '../../config/Api';
import showToast from '../components/showToast';

const keyBoardType = (Platform.OS === 'ios') ? 'numeric' : 'phone-pad';

class Setting extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Company Profile',
    headerLeft: (
      <HeaderMenuButton onPress={() => navigation.toggleDrawer()} />
    ),
    headerRight: (
      <HeaderSearchButton onPress={() => navigation.navigate("Search")} />
    )
  })

  constructor(props) {
    super(props);
    this.state = {
      markup: 0,
      quantity: 0,
      roundePrice: 0,
      duplicateBarcode: false,
      isLoading: false
    };
  }

  componentDidMount = () => {
    this.getData();
  }

  getData = async () => {
    this.setState({ isLoading: true });
    const userId = await getUserId();
    axios.get(`${Api.url}/${userId}/settings/defaults`, { headers: Api.headers }).then((response) => {
      this.setState({
        markup: response.data.markup_price,
        quantity: response.data.quantity,
        roundePrice: response.data.round_price,
        duplicateBarcode: response.data.barcode === 1,
        isLoading: false
      });
    }).catch((error) => {
      this.setState({ isLoading: false }, () => {
        setTimeout(() => {
          presentError("Error", error.message);
        }, 500);
      });
    });
  }

  save = async () => {
    this.setState({ isLoading: true });
    const userId = await getUserId();
    const param = {
      markup: this.state.markup || 0,
      quantity: this.state.quantity || 0,
      round_price: parseInt(this.state.roundePrice, 10) || 0,
      barcode: this.state.duplicateBarcode ? 1 : 0
    }
    axios.post(`${Api.url}/${userId}/settings/defaults`, param, { headers: Api.headers }).then((response) => {
      if (response.data.status === 'success') {
        this.setState({ isLoading: false });
        showToast("Settings updated successfully.");
      } else {
        this.setState({ isLoading: false }, () => {
          setTimeout(() => {
            presentError("Error", response.data.message[0]);
          }, 500);
        });
      }
    }).catch((error) => {
      this.setState({ isLoading: false }, () => {
        setTimeout(() => {
          presentError("Error", error.message);
        }, 500);
      });
    });
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.bgGray}}>
        <View style={styles.container}>
          <ScrollView>
            <Loader loading={this.state.isLoading} />

            <Card style={{padding: 10}}>
              <InputBox
                label="Markup"
                keyboardType={keyBoardType}
                value={this.state.markup.toString()}
                onChangeText={(markup) => this.setState({ markup })}
              />

              <InputBox
                label="Quantity"
                keyboardType={keyBoardType}
                value={this.state.quantity.toString()}
                onChangeText={(quantity) => this.setState({ quantity })}
              />

              <InputBox
                label="Set automatic rounding for item pricing"
                keyboardType={keyBoardType}
                value={this.state.roundePrice.toString()}
                onChangeText={(roundePrice) => this.setState({ roundePrice })}
              />

              <View style={{ marginVertical: 10, marginHorizontal: 10 }}>
                <Checkbox
                  label="Barcode - Duplicate SKU"
                  checked={this.state.duplicateBarcode}
                  onChange={({ checked }) => this.setState({ duplicateBarcode: checked })}
                />
              </View>

              <MButton
                text="SAVE"
                style={{ alignSelf: 'center' }}
                onPress={this.save}
              />
            </Card>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgGray,
    paddingHorizontal: 15
  }
});

export default Setting;
