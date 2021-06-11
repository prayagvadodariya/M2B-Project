import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
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
import SafeScrollView from '../components/SafeScrollView';
import showToast from '../components/showToast';
import YearMonthSelector from '../components/YearMonthSelector';

const keyBoardType = (Platform.OS === 'ios') ? 'numeric' : 'phone-pad';

class CreateMonthlyBudget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: '',
      isDateValid: true,
      dateError: '',
      budget: this.props.budget || '',
      isSaving: false,
    };
  }

  showPicker = () => {
    const { startYear, endYear, selectedYear, selectedMonth } = this.state;
    this.picker
      .show({ startYear, endYear, selectedYear, selectedMonth })
      .then(({ year, month }) => {
        this.setState({
          selectedYear: year,
          selectedMonth: month
        })
      })
  }

  showError = (error) => {
    this.setState({ isSaving: false }, () => {
      setTimeout(() => {
        presentError("Error", error);
      }, 200);
    });
  }

  save = async () => {
    if (!this.props.selectedDate && !this.state.selectedDate) {
      this.setState({
        isDateValid: false,
        dateError: 'Please enter valid Month/Year'
      });
    } else {
      this.setState({ isSaving: true, isDateValid: true });
      const userId = await getUserId();
      const data = {
        "date": (this.props.selectedDate) || this.state.selectedDate,
        "budget": this.state.budget.replace(/,/g, '')
      }
      if (this.props.id) {
        data.id = this.props.id
      }
      axios.post(`${Api.url}/${userId}/budget/monthly/save`, data, { headers: Api.headers }).then((response) => {
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
          // style={{flex: 1}}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          <Loader loading={this.state.isSaving} />
          <View style={styles.title}>
            <MText size={28} bold>Monthly Budget</MText>
            <TouchableOpacity onPress={() => this.props.closeModal(false)}>
              <Icon name="times" color="#aaa" size={18} />
            </TouchableOpacity>
          </View>
          <View style={styles.body}>
            {
              !this.props.selectedDate && (
                <View style={{ marginVertical: 5 }}>
                  <View style={{ marginLeft: 20, marginVertical: 5 }}>
                    <MText bold size={18}>Select Month/Year (YYYY-MM)<MText pink>*</MText></MText>
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
              label="Budget $"
              value={this.getUnitFormat(this.state.budget.toString())}
              onChangeText={(budget) => {
                this.setState({ budget: this.getUnitFormat(budget) })
              }}
              onEndEditing={(e) => {
                if (e.nativeEvent.text) {
                  const value = e.nativeEvent.text.replace(/,/g, '');
                  this.setState({
                    budget: this.getCurrencyFormat(parseFloat(value))
                  })
                }
              }}
              keyboardType={keyBoardType}
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
    // flex: 1
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

export default CreateMonthlyBudget;
