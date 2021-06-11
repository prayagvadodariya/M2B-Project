import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, ScrollView, Alert, TextInput } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Modal from "react-native-modal";
import Api from '../../config/Api';
import getUserId from '../actions/getUserId';
import presentError from '../components/presentError';
import MText from '../components/MText';
import Colors from '../../config/Colors';
import InputBox from '../components/InputBox';
import MButton from '../components/MButton';
import Loader from '../components/Loader';
import SearchableSelect from '../components/SearchableSelect';
import MDropDown from '../components/MDropDown';
import countries from './countries';
import validate from './validateWrapper';
import SafeScrollView from '../components/SafeScrollView';
import showToast from '../components/showToast';

const FormError = (props) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: -10 }}>
      <MText style={styles.label} size={16} pink>{props.children}</MText>
    </View>
  )
}

class CreateVendor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSaving: false,

      vendor: '',

      displayVendorList: false,
      vendorError: null,
      selectedVendor: null,

      contactFirstName: '',
      firstNameError: null,
      contactLastName: '',
      lastNameError: null,
      email: '',
      phone: '',
      fax: '',
      address: '',
      city: '',
      state: '',

      isFetchingCountry: false,
      selectedCounty: null,
      isFetchingCountryError: false,
      fetchingCountryError: null,
      createdVendor: null
    };
  }

  save = async () => {
    const vendorError = validate("required", this.state.vendor, "Vendor is required");
    const selectedVendorError = validate("required", this.state.selectedVendor, "Vendor is required");
    let firstNameError;
    let lastNameError;
    if (this.state.selectedVendor !== null && this.state.selectedVendor !== undefined) {
      firstNameError = validate("required", this.state.contactFirstName, "The firstname field is required.");
      lastNameError = validate("required", this.state.contactLastName, "The lastname field is required.");

      this.setState({
        firstNameError,
        lastNameError
      });
    }

    if (vendorError && selectedVendorError) {
      this.setState({
        vendorError
      });
    } else {
      this.setState({
        vendorError: null
      });
    }



    if (!firstNameError && !lastNameError && (!vendorError || !selectedVendorError)) {
      this.setState({ isSaving: true });
      this.setState({
        firstNameError: null,
        lastNameError: null
      });

      const userId = await getUserId();
      const param = {
        "new_company": this.state.vendor,
        "company": (this.state.selectedVendor) ? this.state.selectedVendor.id : null,
        "firstname": this.state.contactFirstName,
        "lastname": this.state.contactLastName,
        "email": this.state.email,
        "phone": this.state.phone,
        "fax": this.state.fax,
        "address": this.state.address,
        "city": this.state.city,
        "state": this.state.state,
        "country": (this.state.selectedCounty) ? this.state.selectedCounty.code : null
      }
      axios.post(`${Api.url}/${userId}/vendor/create`, param, { headers: Api.headers }).then((response) => {
        if (response.data.status === 'success') {
          const { id, name } = response.data;
          this.setState({ isSaving: false, createdVendor: { id, name } }, () => {
            showToast(response.data.message);
            this.props.closeModal(this.state.createdVendor);
          });
        } else {
          this.setState({ isSaving: false }, () => {
            setTimeout(() => {
              presentError("Error", response.data.message[0]);
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
          keyboardDismissMode="interactive"
        >
          <Loader loading={this.state.isSaving} />

          <View style={styles.title}>
            <MText size={28} bold>Create Vendor</MText>
            <TouchableOpacity onPress={() => this.props.closeModal()}>
              <Icon name="times" color="#aaa" size={18} />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            <InputBox
              label="Create New Vendor"
              labelNormal
              required
              placeholder="Vendor"
              onChangeText={(vendor) => this.setState({ vendor })}
            />

            <MText bold pink style={{ alignSelf: 'center', justifyContent: 'center' }}>
              ---OR---
						</MText>

            <View style={{ marginVertical: 5 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MText style={styles.label} size={18}>
                  Select Vendor
								</MText>
                <MText bold size={20} pink>*</MText>
              </View>
              <TouchableOpacity
                style={styles.vendorOpener}
                activeOpacity={1.0}
                onPress={() => {
                  this.setState(prevState => ({
                    displayVendorList: !prevState.displayVendorList
                  }));
                }}
              >
                <MText size={18}>{(this.state.selectedVendor === null) ? 'Select Vendor' : this.state.selectedVendor.name}</MText>
                <Icon name={(this.state.displayVendorList) ? "caret-up" : "caret-down"} />
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
							this.state.displayVendorList && (
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

            <InputBox
              label="Contact First Name"
              labelNormal
              placeholder="Contact First Name"
              onSubmitEditing={() => { this.lastNameField.focus() }}
              blurOnSubmit={false}
              onChangeText={(contactFirstName) => this.setState({ contactFirstName })}
            />
            {
              this.state.firstNameError && (
                <FormError>{this.state.firstNameError}</FormError>
              )
            }


            <InputBox
              label="Contact Last Name"
              labelNormal
              placeholder="Contact Last Name"
              ref={(ref) => { this.lastNameField = ref }}
              onSubmitEditing={() => { this.emailField.focus() }}
              blurOnSubmit={false}
              onChangeText={(contactLastName) => this.setState({ contactLastName })}
            />
            {
              this.state.lastNameError && (
                <FormError>{this.state.lastNameError}</FormError>
              )
            }

            <InputBox
              label="Email"
              labelNormal
              placeholder="Email"
              ref={(ref) => { this.emailField = ref }}
              onSubmitEditing={() => { this.phoneField.focus() }}
              blurOnSubmit={false}
              onChangeText={(email) => this.setState({ email })}
            />

            <InputBox
              label="Phone"
              labelNormal
              placeholder="Phone"
              ref={(ref) => { this.phoneField = ref }}
              onSubmitEditing={() => { this.faxField.focus() }}
              blurOnSubmit={false}
              onChangeText={(phone) => this.setState({ phone })}
            />

            <InputBox
              label="Fax"
              labelNormal
              placeholder="Fax"
              ref={(ref) => { this.faxField = ref }}
              onSubmitEditing={() => { this.addressField.focus() }}
              blurOnSubmit={false}
              onChangeText={(fax) => this.setState({ fax })}
            />

            <View style={{ marginVertical: 5 }}>
              <MText style={styles.inputBoxLabel}>
                Address
							</MText>
              <TextInput
                placeholder="Addess"
                multiline={true}
                style={styles.textbox}
                ref={(ref) => { this.addressField = ref }}
                blurOnSubmit={false}
                onChangeText={(address) => this.setState({ address })}
              />
            </View>

            <InputBox
              label="City"
              labelNormal
              placeholder="City"
              ref={(ref) => { this.cityField = ref }}
              onSubmitEditing={() => { this.stateField.focus() }}
              blurOnSubmit={false}
              onChangeText={(city) => this.setState({ city })}
            />

            <InputBox
              label="State"
              labelNormal
              placeholder="State"
              ref={(ref) => { this.stateField = ref }}
              blurOnSubmit={true}
              onChangeText={(state) => this.setState({ state })}
            />

            <MDropDown
              label="Country"
              labelBold={false}
              placeholder="Select Country"
              data={countries}
              searchable={true}
              onSelectItem={(selectedCounty) => {
                this.setState({ selectedCounty })
              }}
              isLoading={this.state.isFetchingCountry}
              isError={this.state.isFetchingCountryError}
              error={this.state.fetchingCountryError}
            />

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
              onPress={() => this.props.closeModal()}
            />
          </View>

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
  },
  label: {
    marginLeft: 20,
    marginVertical: 5,
  },
  vendorOpener: {
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
  },
  searchResult: {
    zIndex: 200,
    backgroundColor: '#fff'
  },
  textbox: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 50,
    fontFamily: 'nunito',
    height: 50,
    paddingVertical: 5,
    paddingHorizontal: 20,
    fontSize: 18
  },
  inputBoxLabel: {
    fontFamily: 'nunito',
    fontSize: 18,
    marginLeft: 20,
    marginVertical: 5,
  }
});

export default CreateVendor;
