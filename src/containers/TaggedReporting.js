import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import Modal from 'react-native-modal';
import { Dropdown } from 'react-native-material-dropdown';
import { Table, Row, Rows, TableWrapper, Cols, Cell, Col } from 'react-native-table-component';
import DateTimePicker from "react-native-modal-datetime-picker";
import Api from '../../config/Api';
import getUserId from '../actions/getUserId';
import presentError from '../components/presentError';
import MText from '../components/MText';
import MDropDown from '../components/MDropDown';
import Colors from '../../config/Colors';
import MLoader from '../components/Loader';
import MButton from '../components/MButton';
import InputBox from '../components/InputBox';

class TaggedReporting extends Component {
  static navigationOptions = () => ({
    title: "Report - Tag Order Items",
    headerTintColor: '#ffffff'
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      prevPageUrl: null,
      nextPageUrl: null,
      widthArr: [150, 150, 200, 100, 150, 75, 75, 100],
      showFilter: false,
      displayStartDatePicker: false,
      displayEndDatePicker: false,
      startDate: null,
      endDate: null,
      tags: "",
      isApplyingFilter: false,
      isFilterApplied: false,
      itemsCount: 0
    };
  }

  componentDidMount = () => {
    this.getInitialData();
  }

  getInitialData = async () => {
    this.setState({ loading: true });
    const userId = await getUserId();
    const url = `${Api.url}/${userId}/reports/tags`;
    this.getData(url);
  }

  showError = (msg) => {
    this.setState({ loading: false }, () => {
      setTimeout(() => {
        presentError("Error", msg);
      }, 300);
    });
  }

  getData = async (url) => {
    const { data } = await axios.get(url, { headers: Api.headers }).catch((error) => {
      this.showError(error.message);
    });
    console.log(data);
    const records: [] = data.items.data;
    const rows = [];
    records.forEach((item) => {
      rows.push([
        this.formateDate(new Date(item.expected_date)),
        item.name || 'Item',
        item.tag_titles,
        item.category,
        item.vendor_name,
        item.received_quantity,
        item.quantity,
        `$${item.price}`
      ])
    })
    this.setState({ 
      data: rows, 
      itemsCount: data.itemsCount,
      prevPageUrl: data.items.prev_page_url, 
      nextPageUrl: data.items.next_page_url, 
      loading: false 
    });
  }

  formateDate = (date) => {
    const replacement = ', ';
    const temp = date.toDateString().substring(4);
    return temp.replace(/ ([^ ]*)$/, `${replacement}$1`);
  }

  hideDateTimePicker = () => {
    this.setState({ displayEndDatePicker: false, displayStartDatePicker: false });
  };

  getFormatedDate = (date: Date) => {
    if (!date) {
      return ''
    }
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();

    return `${year}-${month}-${day}`;
  }

  applyFilter = async () => {
    this.setState({ isApplyingFilter: true });
    const userId = await getUserId();
    const url = `${Api.url}/${userId}/reports/tags?q=${this.state.tags}&startdate=${this.getFormatedDate(this.state.startDate)}&enddate=${this.getFormatedDate(this.state.endDate)}`;
    await this.getData(url);
    this.setState({ isApplyingFilter: false, showFilter: false, isFilterApplied: true });
  }

  resetFilter = async () => {
    this.setState({ loading: true });
    const userId = await getUserId();
    const url = `${Api.url}/${userId}/reports/tags`;
    await this.getData(url);
    this.setState({ isFilterApplied: false });
  }

  renderModalChild = () => {
    const data = [{
      value: 'Last 7 days',
    }, {
      value: 'Last 30 days',
    }, {
      value: 'Last 6 months',
    }, {
      value: 'Last 1 year',
    }];
    return (
        <View style={styles.filterContainer}>
          <InputBox
            label="Tags"
            placeholder="Tags"
            value={this.state.tags}
            onChangeText={(tags) => this.setState({ tags })}
          />
          <MText style={{marginLeft: 20, marginTop: -5}}>Search multiple tags with comma(,) separated</MText>

          {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MText style={styles.label} bold size={18}>
              By Date range
            </MText>
          </View>
          <Dropdown
            data={data}
            labelFontSize={14}
            lineWidth={0}
            containerStyle={{
              paddingVertical: 10,
              paddingHorizontal: 20,
              marginBottom: 0,
              borderWidth: 1,
              height: 50,
              borderRadius: 50,
              borderColor: Colors.border
            }}
            dropdownOffset={{top: 0, left: 10}}
          /> */}

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MText style={styles.label} bold size={18}>
              Start Date
            </MText>
          </View>
          <TouchableOpacity
            style={{
              height: 50,
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
                displayEndDatePicker: false,
                displayStartDatePicker: !prevState.displayStartDatePicker
              }));
            }}
          >
            <MText size={18}>{(this.state.startDate === null) ? 'Select' : this.state.startDate.toLocaleDateString()}</MText>
          </TouchableOpacity>
          <DateTimePicker
            isVisible={this.state.displayStartDatePicker}
            onConfirm={(date) => {
              this.setState({
                startDate: date
              })
              this.hideDateTimePicker();
            }}
            onCancel={() => {
              this.setState({ startDate: null });
              this.hideDateTimePicker()
            }}
          />

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MText style={styles.label} bold size={18}>
              End Date
            </MText>
          </View>
          <TouchableOpacity
            style={{
              height: 50,
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
                displayStartDatePicker: false,
                displayEndDatePicker: !prevState.displayEndDatePicker
              }));
            }}
          >
            <MText size={18}>{(this.state.endDate === null) ? 'Select' : this.state.endDate.toLocaleDateString()}</MText>
          </TouchableOpacity>
          <DateTimePicker
            isVisible={this.state.displayEndDatePicker}
            onConfirm={(date) => {
              this.setState({
                endDate: date
              })
              this.hideDateTimePicker();
            }}
            onCancel={() => {
              this.setState({ endDate: null });
              this.hideDateTimePicker()
            }}
          />

          <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
            <MButton 
              text="CANCEL" 
              style={{alignSelf: 'center', marginVertical: 10}} 
              onPress={() => {
                this.setState({
                  showFilter: false
                })
              }}
              teal
            />

            <MButton 
              text="APPLY" 
              disabled={!this.state.startDate && !this.state.endDate && !this.state.tags}
              style={{alignSelf: 'center', marginVertical: 10}} 
              onPress={this.applyFilter}
              isLoading={this.state.isApplyingFilter}
            />
          </View>

        </View>
    )
  }

  render() {
    return (
      <ScrollView 
        style={styles.container}
        contentContainerStyle={{paddingBottom: 20}}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
      >
        <MLoader loading={this.state.loading} />

        <View style={{justifyContent: 'flex-end', marginVertical: 10, flexDirection: 'row', flex: 1}}>
          {
            this.state.isFilterApplied && (
              <MButton
                teal
                text="RESET"
                style={{ paddingHorizontal: 10, marginHorizontal: 10 }}
                onPress={this.resetFilter}
              />
            )
          }
          <MButton
            darkBlue
            text=" FILTER"
            iconLeft={
              <Icon name="filter" size={16} />
            }
            style={{ paddingHorizontal: 10 }}
            onPress={() => this.setState({ showFilter: true })}
          />
        </View>

        {
          this.state.isFilterApplied && (
            <View style={{alignItems: 'center', justifyContent: 'center', padding: 10}}>
              <MText size={18} style={{textAlign: 'center'}}>
                <MText pink bold>{this.state.tags}</MText>
                <MText> - search results and found - </MText>
                <MText pink bold>{this.state.itemsCount}</MText>
              </MText>
            </View> 
          )
        }

        <ScrollView>
          <View style={styles.tableContainer}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ alignItems: 'flex-start' }}
            >
              <Table
                borderStyle={{ borderColor: Colors.border }}
                style={{ borderRadius: 10 }}
                textStyle={{ fontSize: 16, fontFamily: 'nunito' }}
              >
                <Row
                  data={["Date", "Product", "Tag", "Type", "Vendor", "Received Qty", "Total Qty", "Total Price"]}
                  style={{ flexWrap: 'wrap' }}
                  textStyle={styles.headText}
                  widthArr={this.state.widthArr}
                />
                {
                  !this.state.loading && this.state.data.length === 0 ? (
                    <Row
                      data={["No Items found"]}
                      style={{ flexWrap: 'wrap' }}
                      textStyle={[styles.headText, { fontWeight: 'normal' }]}
                    />
                  ) : (
                    <Rows
                      data={this.state.data}
                      style={{ flexWrap: 'wrap' }}
                      textStyle={styles.rowText}
                      widthArr={this.state.widthArr}
                    />
                  )
                }
                
                
              </Table>
            </ScrollView>
          </View>
        </ScrollView>
        
        {
            this.state.data.length !== 0 && (!(this.state.prevPageUrl === null && this.state.nextPageUrl === null)) && (
              <View style={styles.paginationContainer}>
                <TouchableOpacity
                  style={[
                    styles.pager,
                    {
                      borderRightWidth: 1,
                      borderRightColor: Colors.border
                    }
                  ]}
                  disabled={this.state.prevPageUrl === null}
                  onPress={() => this.getData(this.state.prevPageUrl)}
                >
                  <Icon name="angle-double-left" color={(this.state.prevPageUrl !== null) ? Colors.pink : '#aaa'} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.pager
                  ]}
                  disabled={this.state.nextPageUrl === null}
                  onPress={() => this.getData(this.state.nextPageUrl)}
                >
                  <Icon name="angle-double-right" color={(this.state.nextPageUrl !== null) ? Colors.pink : '#aaa'} />
                </TouchableOpacity>
              </View>
            )
          }
          <Modal
            isVisible={this.state.showFilter}
            backdropTransitionOutTiming={0}
            avoidKeyboard={true}
            onBackdropPress={() => this.setState({ showFilter: false })}
          >
            {this.renderModalChild()}
          </Modal>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgGray,
    paddingHorizontal: 15,
    flex: 1
  },
  tableContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginBottom: 15
  },
  label: {
    marginLeft: 20,
    marginVertical: 5,
  },
  paginationContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.border,
    height: 50,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 30
  },
  pager: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50
  },
  headText: { alignSelf: 'center', fontSize: 18, fontFamily: 'nunito', fontWeight: 'bold', margin: 10 },
  rowText: { alignSelf: 'center', fontSize: 18, fontFamily: 'nunito', margin: 10 },
  filterContainer: {
    height: 'auto',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 10,
  }
});

export default TaggedReporting;
