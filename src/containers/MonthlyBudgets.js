import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, Alert, SafeAreaView } from 'react-native';
import axios from 'axios';
import Modal from "react-native-modal";
import Icon from 'react-native-vector-icons/FontAwesome';
import Api from '../../config/Api';
import getUserId from '../actions/getUserId';
import presentError from '../components/presentError';
import HeaderMenuButton from '../components/HeaderMenuButton';
import HeaderSearchButton from '../components/HeaderSearchButton';
import Colors from '../../config/Colors';
import Card from '../components/Card';
import CardBody from '../components/CardBody';
import CardItem from '../components/CardItem';
import MButton from '../components/MButton';
import MText from '../components/MText';
import Li from '../components/Li';
import FetchingError from '../components/FetchingError';
import CreateMonthlyBudget from './CreateMonthlyBudget';
import Hr from '../components/Hr';
import Loader from '../components/Loader';
import showToast from '../components/showToast';

class MonthlyBudgets extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Monthly Budgets',
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
      data: [],
      isFetching: false,
      fetchingError: null,
      createMonthlyBudget: false,
      selectedItemId: null,
      selectedItemDate: null,
      selectedItemBudget: null
    };
  }

  componentDidMount = () => {
    this.fetchBudgets();
  }

  showError = (error) => {
    this.setState({ isFetching: false }, () => {
      setTimeout(() => {
        presentError("Error", error);
      }, 200);
    });
  }

  fetchBudgets = async () => {
    this.setState({ isFetching: true });
    const userId = await getUserId();
    await axios.get(`${Api.url}/${userId}/budget/monthly`, { headers: Api.headers }).then((response) => {
      this.setState({ isFetching: false });
      if (response.data.status === 'success') {
        this.setState({
          data: response.data.budgets.data,
          fetchingError: null
        });
      } else {
        this.setState({ fetchingError: response.data.message });
      }
    }).catch((error) => {
      this.showError(error.message);
    });
  }

  deleteBudget = async (id, index) => {
    Alert.alert(
      'Confirm',
      'Are you sure you want to delete ?',
      [
        {
          text: 'OK',
          onPress: async () => {
            this.setState({ isFetching: true });
            const userId = await getUserId();
            axios.get(`${Api.url}/${userId}/budget/monthly/delete/${id}`, { headers: Api.headers }).then((response) => {
              if (response.data.status === 'success') {
                const { data } = this.state;
                data.splice(index, 1);
                this.setState({ data, isFetching: false });
                showToast(response.data.message);
              } else {
                this.showError(response.data.message[0]);
              }
            }).catch((error) => {
              this.showError(error.message);
            });
          }
        },
        {
          text: 'CANCEL',
        }
      ],
      {
        cancelable: true
      }
    )

  }

  getCurrencyFormat = (num) => {
    return `${num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.bgGray}}>
        <View style={{ flex: 1, backgroundColor: Colors.bgGray }}>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 15, marginVertical: 15 }}>
            <MText size={28} bold style={{ flex: 1, flexWrap: 'wrap' }}>Monthly Budgets</MText>
            <MButton
              teal
              text=" CREATE"
              iconLeft={(
                <Icon name="plus" color="#fff" size={14} />
              )}
              style={{ paddingHorizontal: 10 }}
              onPress={() => {
                this.setState({
                  selectedItemBudget: null,
                  selectedItemDate: null,
                  selectedItemId: null
                }, () => this.setState({ createMonthlyBudget: true }))
              }}
            />
          </View>

          <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
            refreshControl={(
              <RefreshControl
                refreshing={false}
                onRefresh={this.fetchBudgets}
              />
            )}
          >
            <Card>
              <CardBody>
                {
                  this.state.isFetching && (
                    <Loader />
                  )
                }
                {
                  this.state.fetchingError && (
                    <FetchingError>{this.state.fetchingError}</FetchingError>
                  )
                }
                {
                  this.state.data.map((item, index) => (
                    <CardItem key={index.toString()} style={{ borderTopWidth: (index === 0) ? 0 : 1 }}>
                      <View style={{ flex: 1 }}>
                        <View style={styles.listItem}>
                          <MText size={16}>{item.title}</MText>
                          <View style={{ flexDirection: 'row' }}>
                            <MButton
                              text=""
                              iconLeft={
                                <Icon name="pencil" color="#ffffff" size={18} />
                              }
                              teal
                              style={styles.itemIcon}
                              onPress={() => {
                                this.setState({
                                  selectedItemBudget: item.total,
                                  selectedItemDate: item.title,
                                  selectedItemId: item.id
                                }, () => this.setState({ createMonthlyBudget: true }))
                              }}
                            />
                            <MButton
                              text=""
                              iconLeft={
                                <Icon name="trash" color="#ffffff" size={18} />
                              }
                              pink
                              style={styles.itemIcon}
                              onPress={() => this.deleteBudget(item.id, index)}
                            />
                          </View>
                        </View>
                        <View style={styles.listItem}>
                          <Li>Draft Total</Li>
                          <MText size={16}>${item.draft}</MText>
                        </View>
                        <View style={styles.listItem}>
                          <Li>Ordered Total</Li>
                          <MText size={16}>${item.ordered}</MText>
                        </View>
                        <View style={styles.listItem}>
                          <Li>Receive Total</Li>
                          <MText size={16}>${item.received}</MText>
                        </View>
                        <View style={styles.listItem}>
                          <Li>Remaining Total</Li>
                          <MText size={16}>${item.remaining}</MText>
                        </View>
                        <Hr height={1} />
                        <View style={styles.listItem}>
                          <Li style={{ fontSize: 18, fontWeight: 'bold' }}>Total</Li>
                          <MText size={18} bold>${this.getCurrencyFormat(parseFloat(item.total))}</MText>
                        </View>
                      </View>
                    </CardItem>
                  ))
                }
              </CardBody>
            </Card>
          </ScrollView>

          <Modal
            isVisible={this.state.createMonthlyBudget}
            backdropTransitionOutTiming={0}
            onBackdropPress={() => this.setState({ createMonthlyBudget: false })}
          >
            {
              (this.state.selectedItemDate !== null) ? (
                <CreateMonthlyBudget
                  selectedDate={this.state.selectedItemDate}
                  budget={this.state.selectedItemBudget}
                  id={this.state.selectedItemId}
                  closeModal={(isAdded) => {
                    this.setState({ createMonthlyBudget: false })
                    if (isAdded) { this.fetchBudgets() }
                  }}
                />
              ) : (
                  <CreateMonthlyBudget
                    closeModal={(isAdded) => {
                      this.setState({ createMonthlyBudget: false })
                      if (isAdded) { this.fetchBudgets() }
                    }}
                  />
                )
            }
          </Modal>

        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgGray,
    paddingHorizontal: 15
  },
  itemIcon: {
    borderRadius: 50,
    paddingVertical: 0,
    paddingHorizontal: 0,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})

export default MonthlyBudgets;
