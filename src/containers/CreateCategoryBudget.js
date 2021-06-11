import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
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
import Loader from '../components/Loader';
import SafeScrollView from '../components/SafeScrollView';
import showToast from '../components/showToast';
import YearMonthSelector from '../components/YearMonthSelector';

const keyBoardType = (Platform.OS === 'ios') ? 'numeric' : 'phone-pad';

class CreateCategoryBudget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetchingCategories: false,
      categories: [],
      isFetchingCategoriesError: false,
      fetchingCategoriesError: '',
      selectedCategory: null,
      budget: this.props.budget || '',
      selectedDate: '',
      isDateValid: true,
      dateError: '',
      numberOfStyles: this.props.numberOfStyles || '',
      isSaving: false,
      categoryFieldError: null
    };
  }

  componentDidMount = () => {
    this.fetchCategories();
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

  showError = (error) => {
    this.setState({ isSaving: false }, () => {
      setTimeout(() => {
        presentError("Error", error.message);
      }, 200);
    });
  }

  save = async () => {
    if (!this.state.selectedCategory) {
      this.setState({
        categoryFieldError: 'Please select category'
      });
    } else if (!this.props.withoutDate && !this.state.selectedDate) {
      this.setState({
        isDateValid: false,
        dateError: 'Please enter valid Month/Year'
      });
    } else {
      this.setState({ isSaving: true, isDateValid: true, categoryFieldError: null });
      const userId = await getUserId();
      const data = {
        "date": (this.props.withoutDate) ? this.props.selectedDate : this.state.selectedDate,
        "budget": this.state.budget,
        "category": (this.props.forEdit) ? this.props.categoryId : this.state.selectedCategory.id,
        "qty": this.state.numberOfStyles
      }
      if (this.props.forEdit) {
        data.id = this.props.id
      }
      axios.post(`${Api.url}/${userId}/budget/category/save`, data, { headers: Api.headers }).then((response) => {
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
          <Loader loading={this.state.isSaving} />

          <View style={styles.title}>
            <MText size={28} bold>Category Budget</MText>
            <TouchableOpacity onPress={() => this.props.closeModal(false)}>
              <Icon name="times" color="#aaa" size={18} />
            </TouchableOpacity>
          </View>
          <View style={styles.body}>
            {
              !this.props.forEdit && (
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
            {
              !this.props.withoutDate && (
                <View style={{ marginVertical: 5 }}>
                  <View style={{ marginLeft: 20, marginVertical: 5 }}>
                    <MText size={18}>Select Month/Year<MText pink>*</MText></MText>
                  </View>
                  <YearMonthSelector
                    placeholder="Select"
                    onChange={(selectedDate) => this.setState({ selectedDate })}
                  />
                  {
                    !this.state.isDateValid && (
                      <View style={{ marginLeft: 20, marginVertical: 2 }}>
                        <MText pink size={16}>{this.state.dateError}</MText>
                      </View>
                    )
                  }
                </View>
              )
            }

            <InputBox
              label="Number of Styles"
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

export default CreateCategoryBudget;
