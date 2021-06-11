import React, { Component } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import axios from 'axios';
import Api from '../../config/Api';
import presentError from '../components/presentError';
import getUserId from '../actions/getUserId';
import HeaderMenuButton from '../components/HeaderMenuButton';
import HeaderSearchButton from '../components/HeaderSearchButton';
import Colors from '../../config/Colors';
import MText from '../components/MText';
import Card from '../components/Card';
import MDropDown from '../components/MDropDown';
import MButton from '../components/MButton';
import Loader from '../components/Loader';
import showToast from '../components/showToast';

class Setting extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Setting',
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
      locations: [],
      selectedLocation: null,
      isLoading: false,
      isFetchingLocationsError: false,
      fetchingLocationsError: '',
      selectLocationError: null,
      isFetchingLocation: false
    };
  }

  componentDidMount = () => {
    this.fetchLocations();
  }

  fetchLocations = async () => {
    this.setState({ isLoading: true });
    const userId = await getUserId();
    axios.get(`${Api.url}/${userId}/settings/locations`, { headers: Api.headers }).then((response) => {
      this.setState({ isLoading: false });
      if (response.data.status === 'success') {
        this.setState({ locations: response.data.locations }, () => this.getPrimaryLocation());
      } else {
        this.setState({ isLoading: false }, () => {
          setTimeout(() => {
            presentError("Error", response.data.message);
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

  getPrimaryLocation = async () => {
    this.setState({ isLoading: true });
    const userId = await getUserId();
    axios.get(`${Api.url}/${userId}/settings/primary-location`, { headers: Api.headers }).then((response) => {
      this.setState({ isLoading: false });
      const selectedLocation = this.state.locations.filter((element) => element.id === response.data)[0]
      this.setState({ selectedLocation });
    }).catch((error) => {
      this.setState({ isLoading: false }, () => {
        setTimeout(() => {
          presentError("Error", error.message);
        }, 500);
      });
    });
  }

  updateLocation = async () => {
    if (!this.state.selectedLocation) {
      presentError("Setting", "Please select location");
      return;
    }
    this.setState({ isLoading: true });
    const userId = await getUserId();
    axios.post(`${Api.url}/${userId}/settings/locations`, { primary_location: this.state.selectedLocation.id }, { headers: Api.headers }).then((response) => {
      if (response.data.status === 'success') {
        this.setState({ isLoading: false });
        showToast(response.data.message);
      } else {
        this.setState({ isLoading: false }, () => {
          setTimeout(() => {
            presentError("Error", response.data.message);
          }, 500);
        });
      }
    }).catch((error) => {
      this.setState({ isLoading: false }, () => {
        setTimeout(() => {
          presentError("Error", error.message);
        }, 500);
      })
    });
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.bgGray}}>
        <View style={styles.container}>
          <Loader loading={this.state.isLoading} />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              padding: 10
            }}
          >

            <Card style={{ padding: 10, paddingBottom: 20 }}>
              <MDropDown
                label="Set Primary Location"
                labelBold={false}
                required
                placeholder="Location"
                data={this.state.locations}
                searchable={true}
                onSelectItem={(selectedLocation) => {
                  this.setState({ selectedLocation })
                }}
                selectedItem={this.state.selectedLocation}
                isLoading={this.state.isFetchingLocation}
                isError={this.state.isFetchingLocationsError}
                error={this.state.fetchingLocationsError}
              />
              {
                this.state.selectLocationError && (
                  <View style={{ paddingHorizontal: 20 }}>
                    <MText size={14} pink>{this.state.selectLocationError}</MText>
                  </View>
                )
              }

              <MButton
                text="UPDATE"
                style={{ alignSelf: 'center', marginTop: 5 }}
                onPress={this.updateLocation}
              />
            </Card>

            <TouchableOpacity
              style={styles.touchableCard}
              onPress={() => this.props.navigation.navigate("CompanyProfileSetting")}
              activeOpacity={0.7}
            >
              <Image
                source={require('../assets/images/setting-company.png')}
                style={{ width: 100, height: 100 }}
                resizeMode="contain"
                resizeMethod="resize"
              />
              <MText size={24} style={{ marginVertical: 10 }}>Company Profile</MText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.touchableCard}
              onPress={() => this.props.navigation.navigate("CategoriesSetting")}
              activeOpacity={0.7}
            >
              <Image
                source={require('../assets/images/setting-categories.png')}
                style={{ width: 100, height: 100 }}
                resizeMode="contain"
                resizeMethod="resize"
              />
              <MText size={24} style={{ marginTop: 10 }}>Categories</MText>
              <MText size={20}>(Tops, Bottom, Etc.)</MText>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgGray
  },
  touchableCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 5,
    // width: 250,
    // height: 250,
    // alignSelf: 'center'
  }
});

export default Setting;
