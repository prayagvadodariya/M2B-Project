import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import getUserId from '../actions/getUserId';
import Api from '../../config/Api';
import presentError from '../components/presentError';
import MText from '../components/MText';
import Colors from '../../config/Colors';
import InputBox from '../components/InputBox';
import MButton from '../components/MButton';
import MDropDown from '../components/MDropDown';
import MLoader from '../components/Loader';
import SafeScrollView from '../components/SafeScrollView';
import showToast from '../components/showToast';

const keyBoardType = (Platform.OS === 'ios') ? 'numeric' : 'phone-pad';

class CreateMarketBudget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetchingCategories: false,
      categories: [],
      isFetchingCategoriesError: false,
      fetchingCategoriesError: '',
      selectedCategory: null,
      budget: this.props.budget || '',
      numberOfStyles: this.props.numberOfStyles || '',
      isSaving: false,
      isFetchingEvents: false,
      events: [],
      selectedEvent: '',
      isFetchingEventsError: false,
      fetchingEventsError: '',
      categoryFieldError: null,
      marketTripFieldError: null
    };
  }

  componentDidMount = () => {
    this.fetchCategories();
    this.fetchEvents();
  }

  fetchCategories = async () => {
    this.setState({ isFetchingCategories: true });
    const userId = await getUserId();
    axios.get(`${Api.url}/${userId}/category`, { headers: Api.headers }).then((response) => {
      if (response.data.status === 'success') {
        this.setState({
          categories: response.data.categories,
          isFetchingCategories: false,
          selectedCategory: response.data.categories[0]
        });
      } else {
        this.setState({
          isFetchingCategoriesError: true,
          fetchingCategoriesError: response.data.message,
          isFetchingCategories: false
        });
      }
    }).catch((error) => {
      this.setState({ isFetchingCategories: false });
      presentError("Error", error.message);
    });
  }

  fetchEvents = async () => {
    this.setState({ isFetchingEvents: true });
    const userId = await getUserId();
    axios.get(`${Api.url}/${userId}/events`, { headers: Api.headers }).then((response) => {
      this.setState({
        isFetchingEvents: false
      })
      if (response.data.status === 'success') {
        this.setState({
          events: response.data.events.data,
          selectedEvent: response.data.events.data[0]
        });
      } else {
        this.setState({
          isFetchingEventsError: true,
          fetchingEventsError: response.data.message
        });
      }
    }).catch((error) => {
      this.setState({ isFetchingEvents: false });
      presentError("Error", error.message);
    });
  }

  showError = (error) => {
    this.setState({ isSaving: false }, () => {
      setTimeout(() => {
        presentError("Error", error);
      }, 200);
    });
  }

  save = async () => {
    if (!this.props.eventId && !this.state.selectedEvent) {
      this.setState({ marketTripFieldError: "Please select Market Trip" })
    } else if (!this.state.selectedCategory) {
      this.setState({ categoryFieldError: "Please select Category" })
    } else {
      this.setState({ isSaving: true, marketTripFieldError: null, categoryFieldError: null });
      const userId = await getUserId();
      const data = {
        "budget": this.state.budget,
        "category": this.props.categoryId || this.state.selectedCategory.id,
        "qty": this.state.numberOfStyles,
        "event_id": this.props.eventId || this.state.selectedEvent.id
      }
      if (this.props.id) {
        data.id = this.props.id
      }
      axios.post(`${Api.url}/${userId}/budget/market/save`, data, { headers: Api.headers }).then((response) => {
        if (response.data.status === 'success') {
          this.setState({ isSaving: false });
          showToast(response.data.message);
          this.props.closeModal(true);
        } else {
          this.showError(response.data.message);
        }
      }).catch((error) => {
        this.showError(error.message);
      });
    }
  }

  getCurrencyFormat = (num) => {
    return `${num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
  }

  getUnitFormat = (num) => {
    return `${num.replace(/,/g, '').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
  }

  render() {
    return (
      <SafeScrollView>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          {
            this.state.isSaving && (
              <MLoader isLoading={this.state.isSaving} />
            )
          }

          <View style={styles.title}>
            <MText size={28} bold>Market Budget</MText>
            <TouchableOpacity onPress={() => this.props.closeModal(false)}>
              <Icon name="times" color="#aaa" size={18} />
            </TouchableOpacity>
          </View>
          <View style={styles.body}>
            {
              !this.props.eventId && (
                <MDropDown
                  label="Select Market Trip"
                  labelBold={true}
                  required
                  placeholder="Select Market Trip"
                  data={this.state.events}
                  searchable={true}
                  onSelectItem={(selectedEvent) => this.setState({ selectedEvent })}
                  selectedItem={this.state.selectedEvent}
                  isLoading={this.state.isFetchingEvents}
                  isError={this.state.isFetchingEventsError}
                  error={this.state.fetchingEventsError}
                />
              )
            }
            {
              this.state.marketTripFieldError && (
                <View style={{ marginLeft: 20, marginVertical: 2 }}>
                  <MText pink size={12}>{this.state.marketTripFieldError}</MText>
                </View>
              )
            }

            {
              !this.props.categoryId && (
                <MDropDown
                  label="Select Category"
                  required
                  placeholder="Select Category"
                  data={this.state.categories}
                  onSelectItem={(selectedCategory) => this.setState({ selectedCategory })}
                  searchable={true}
                  selectedItem={this.state.selectedCategory}
                  isLoading={this.state.isFetchingCategories}
                  isError={this.state.isFetchingCategoriesError}
                  error={this.state.fetchingCategoriesError}
                />
              )
            }
            {
              this.state.categoryFieldError && (
                <View style={{ marginLeft: 20, marginVertical: 2 }}>
                  <MText pink size={12}>{this.state.categoryFieldError}</MText>
                </View>
              )
            }
            <InputBox
              label="Budget $"
              placeholder="Budget"
              value={this.getUnitFormat(this.state.budget.toString())}
              onChangeText={(budget) => this.setState({ budget: this.getUnitFormat(budget) })}
              onEndEditing={(e) => {
                if (e.nativeEvent.text) {
                  const value = e.nativeEvent.text.replace(/,/g, '');
                  this.setState({
                    budget: this.getCurrencyFormat(parseFloat(value))
                  })
                }
              }}
              keyboardType={keyBoardType}
              labelNormal={true}
            />
            <InputBox
              label="Number of Styles"
              placeholder="Number of Styles"
              value={this.state.numberOfStyles.toString()}
              onChangeText={(numberOfStyles) => this.setState({ numberOfStyles })}
              keyboardType={keyBoardType}
              labelNormal={true}
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
              onPress={() => this.props.closeModal(false)}
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
  }
});

export default CreateMarketBudget;
