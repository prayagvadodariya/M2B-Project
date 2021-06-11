import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, TextInput, Animated, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from "react-native-modal";
import axios from 'axios';
import DateTimePicker from "react-native-modal-datetime-picker";
import HeaderMenuButton from '../components/HeaderMenuButton';
import HeaderSearchButton from '../components/HeaderSearchButton';
import SafeScrollView from '../components/SafeScrollView';
import InputBox from '../components/InputBox';
import Colors from '../../config/Colors';
import MButton from '../components/MButton';
import MText from '../components/MText';
import SearchableSelect from '../components/SearchableSelect';
import MDropDown from '../components/MDropDown';
import validate from './validateWrapper';
import Api from '../../config/Api';
import getUserId from '../actions/getUserId';
import presentError from '../components/presentError';
import Loader from '../components/Loader';
import ToggleInputBox from '../components/ToggleInputBox';
import CreateVendor from './CreateVendor';

const FormError = (props) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: -10 }}>
      <MText style={styles.label} size={16} pink>{props.children}</MText>
    </View>
  )
}

class CreateOrder extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Create Order',
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
      displayVendorList: false,
      selectedVendor: null,
      vendorError: null,
      displayCreateVendorModal: false,

      isFetchingEvents: false,
      events: [],
      isFetchingEventsError: false,
      fetchingEventsError: null,
      selectedMarketTrip: '',
      marketTripError: null,

      displayDatePicker: false,
      selectedDate: null,

      orderNumber: '',

      boothNumber: '',

      notes: '',
      isNoteVisible: false,

      isSaving: false,
      savingError: null,

      isOrderCreatingFromEvents: false,

      animation: new Animated.Value(0)
    };

  }

  componentDidMount = () => {
    this.fetchEvents();
    const event = this.props.navigation.getParam("event");
    if (event) {
      this.setState({
        isOrderCreatingFromEvents: true,
        selectedMarketTrip: event
      });
    }
  }

  fetchEvents = async () => {
    this.setState({
      isFetchingEvents: true
    });
    const userId = await getUserId();
    axios.get(`${Api.url}/${userId}/events`, { headers: Api.headers }).then((response) => {
      console.log(response);
      this.setState({
        isFetchingEvents: false
      })
      if (response.data.status === 'success') {
        this.setState({
          events: response.data.events.data
        })
      } else {
        this.setState({
          isFetchingEventsError: true,
          fetchingEventsError: response.data.message
        })
      }
    }).catch((error) => {
      this.setState({ isFetchingEvents: false });
      presentError("fetchEvents", error.message);
    });
  }


  hideDateTimePicker = () => {
    this.setState({ displayDatePicker: false });
  };

  handleDatePicked = date => {
    this.setState({
      selectedDate: date
    })
    this.hideDateTimePicker();
  };

  getFormattedDate = (date) => {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  }

  saveOrder = async () => {
    const vendorError = validate("required", this.state.selectedVendor, "Please select vendor");
    const marketTripError = validate("required", this.state.selectedMarketTrip, "Please select Market Trip");

    this.setState({
      vendorError,
      marketTripError: null
    });

    if (!vendorError) {
      this.setState({
        isSaving: true
      });
      const userId = await getUserId();
      const param = {
        "vendor_id": this.state.selectedVendor.id,
        "notes": this.state.notes,
        "order_number": this.state.orderNumber,
        "booth_no": this.state.boothNumber,
        "event_id": (this.state.selectedMarketTrip !== null && this.state.selectedMarketTrip !== undefined) ? this.state.selectedMarketTrip.id : null,
        "global_date": (this.state.selectedDate !== null) ? this.getFormattedDate(new Date(this.state.selectedDate)) : null
      }
      axios.post(`${Api.url}/${userId}/order/store`, param, { headers: Api.headers }).then((response) => {
        this.setState({
          isSaving: false
        });
        if (response.data.status === 'success') {
          this.props.navigation.navigate("EditOrder", {
            orderId: response.data.order_id,
            isFromCreateOrder: true,
            onGoBack: () => { }
          });
        } else {
          this.setState({
            savingError: response.data.message
          });
        }
      }).catch((error) => {
        presentError("saveOrder", error.message);
      });
    }
  }

  toggleNotes = () => {
    this.setState((prevState) => {
      Animated.decay(this.state.animation, {
        toValue: prevState.isNoteVisible ? 0 : 1,
      }).start()
      return {
        isNoteVisible: !prevState.isNoteVisible
      }
    });
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.bgGray}}>
        <SafeScrollView style={{ flex: 1, backgroundColor: Colors.bgGray }}>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={true}
            keyboardDismissMode={'interactive'}
          >
            {
              this.state.isOrderCreatingFromEvents && (
                <View style={{
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.border,
                  paddingVertical: 10,
                  flexDirection: 'row',
                  alignItems: 'center'
                }}>
                  <MText bold size={18}>Event : </MText>
                  <MText size={18}>{this.state.selectedMarketTrip.name}</MText>
                </View>
              )
            }
            <Loader loading={this.state.isSaving} />
            {/* -------- Select Vendor  ------------ */}
            <View style={{ marginVertical: 5 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MText style={styles.label} bold size={18}>
                  {`Select Vendor or `}
                </MText>
                <MButton
                  style={{ paddingHorizontal: 5, paddingVertical: 0 }}
                  text="CREATE"
                  textSize={14}
                  teal
                  onPress={() => this.setState({ displayCreateVendorModal: true })}
                />
                <MText bold size={20} pink>*</MText>
              </View>
              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 100,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#ffffff',
                  borderColor: Colors.border,
                  borderWidth: 1
                }}
                activeOpacity={1.0}
                onPress={() => {
                  this.setState(prevState => ({
                    displayDatePicker: false,
                    displayVendorList: !prevState.displayVendorList
                  }));
                }}
              >
                <MText size={18}>{(this.state.selectedVendor === null) ? 'Select Vendor' : this.state.selectedVendor.name}</MText>
                <Icon name="caret-down" />
              </TouchableOpacity>
            </View>
            <Modal
              isVisible={this.state.displayVendorList}
              avoidKeyboard={true}
              backdropOpacity={0.2}
              backdropTransitionOutTiming={0}
              animationIn="fadeIn"
              animationOut="fadeOut"
              animationInTiming={100}
              animationOutTiming={100}
              onBackdropPress={() => this.setState({ displayVendorList: false })}
            >
              <SearchableSelect
                onItemSelect={(item) => {
                  this.setState({
                    selectedVendor: item,
                    displayVendorList: false
                  })
                }}
              />
            </Modal>
            {/* {
              this.state.displayVendorList
              && (
                <View style={styles.searchResult}>
                  <SearchableSelect
                    onItemSelect={(item) => {
                      this.setState({
                        selectedVendor: item,
                        displayVendorList: false
                      })
                    }}
                  />
                </View>
              )
            } */}
            {
              this.state.vendorError && (
                <FormError>{this.state.vendorError}</FormError>
              )
            }
            {/* --------------- select vendor ends --------------- */}

            {
              !this.state.isOrderCreatingFromEvents && (
                <React.Fragment>
                  <MDropDown
                    label="Add To Market Trip"
                    labelBold={true}
                    placeholder="Select Market Trip"
                    data={this.state.events}
                    searchable={true}
                    onSelectItem={(selectedMarketTrip) => {
                      this.setState({ selectedMarketTrip })
                    }}
                    isLoading={this.state.isFetchingEvents}
                    isError={this.state.isFetchingEventsError}
                    error={this.state.fetchingEventsError}
                  />
                  {
                    this.state.marketTripError && (
                      <FormError>{this.state.marketTripError}</FormError>
                    )
                  }
                </React.Fragment>
              )
            }

            <InputBox
              label="Purchase Order Number"
              placeholder="Type Here"
              returnKeyType={"next"}
              blurOnSubmit={true}
              onSubmitEditing={() => {
                this.setState(prevState => ({
                  displayDatePicker: !prevState.displayDatePicker
                }));
              }}
              onChangeText={(orderNumber) => this.setState({ orderNumber })}
            />

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MText style={styles.label} bold size={18}>
                Expected Ship Date
              </MText>
            </View>
            <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: 'row',
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 100,
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#ffffff',
                borderColor: Colors.border,
                borderWidth: 1,
              }}
              activeOpacity={1.0}
              onPress={() => {
                this.setState(prevState => ({
                  displayVendorList: false,
                  displayDatePicker: !prevState.displayDatePicker
                }));
              }}
            >
              <MText size={18}>{(this.state.selectedDate === null) ? 'Select' : this.state.selectedDate.toLocaleDateString()}</MText>
            </TouchableOpacity>
            <DateTimePicker
              isVisible={this.state.displayDatePicker}
              onConfirm={this.handleDatePicked}
              onCancel={this.hideDateTimePicker}
            />

            <InputBox
              label="Booth No"
              placeholder="Type Here"
              onChangeText={(boothNumber) => this.setState({ boothNumber })}
            />

            <ToggleInputBox
              label="Notes"
              value={this.state.notes}
              onChangeText={(notes) => this.setState({ notes })}
            />


            {
              this.state.savingError && (
                <View style={{ margin: 10, alignItems: 'center', justifyContent: 'center' }}>
                  <MText pink size={16}>{this.state.savingError}</MText>
                </View>
              )
            }

            <View style={styles.submitButton}>
              <MButton text="SAVE" onPress={this.saveOrder} />
            </View>

          </ScrollView>

          <Modal
            isVisible={this.state.displayCreateVendorModal}
            backdropTransitionOutTiming={0}
            onBackdropPress={() => this.setState({ displayCreateVendorModal: false })}
          >
            <CreateVendor closeModal={(createdVendor) => {
              this.setState({ displayCreateVendorModal: false })
              if (createdVendor) {
                this.setState({ selectedVendor: createdVendor });
              }
            }} />
          </Modal>

        </SafeScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgGray,
    paddingVertical: 10,
    paddingHorizontal: 15
  },
  submitButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  label: {
    marginLeft: 20,
    marginVertical: 5,
  },
  textbox: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 50,
    fontFamily: 'nunito',
    height: 50,
    paddingVertical: 5,
    paddingHorizontal: 20,
    fontSize: 20
  },
  searchResult: {
    position: 'absolute',
    zIndex: 200,
    backgroundColor: '#fff',
    top: 100,
    left: 0,
    right: 0
  }
});

export default CreateOrder;
