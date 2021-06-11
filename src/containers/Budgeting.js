import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from "react-native-modal";
import Collapsible from 'react-native-collapsible';
import { connect } from 'react-redux';
import { fetchMonthlyBudgets, fetchCategoryBudgets, fetchMarketBudgets } from '../actions/budgetingAction';
import Card from '../components/Card';
import CardBody from '../components/CardBody';
import CardHeader from '../components/CardHeader';
import CardItem from '../components/CardItem';
import Colors from '../../config/Colors';
import MText from '../components/MText';
import MButton from '../components/MButton';
import HeaderMenuButton from '../components/HeaderMenuButton';
import HeaderSearchButton from '../components/HeaderSearchButton';
import Li from '../components/Li';
import FetchingLoader from '../components/FetchingLoader';
import FetchingError from '../components/FetchingError';
import CreateMonthlyBudget from './CreateMonthlyBudget';
import CreateCategoryBudget from './CreateCategoryBudget';
import CreateMarketBudget from './CreateMarketBudget';
import Hr from '../components/Hr';

class Budgeting extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Budgeting',
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
      displayMonthlyBudgets: true,
      displayCategoryBudgets: false,
      displayMarketBudgets: false,
      createMonthlyBudget: false,
      createCategoryBudget: false,
      createMarketBudget: false,
      refreshing: false,
      selectedDate: null,
      budget: null,
      selectedItemId: null
    };

    this.props.fetchMonthlyBudgets();
    this.props.fetchCategoryBudgets();
    this.props.fetchMarketBudgets();
  }

  toggleMonthlyBudgets = () => {
    this.setState({
      displayCategoryBudgets: false,
      displayMarketBudgets: false,
      displayMonthlyBudgets: !this.state.displayMonthlyBudgets
    });
  }

  toggleCategoryBudgets = () => {
    this.setState({
      displayMarketBudgets: false,
      displayMonthlyBudgets: false,
      displayCategoryBudgets: !this.state.displayCategoryBudgets
    });
  }

  toggleMarketBudgets = () => {
    this.setState({
      displayCategoryBudgets: false,
      displayMonthlyBudgets: false,
      displayMarketBudgets: !this.state.displayMarketBudgets
    });
  }

  onRefresh = async () => {
    this.setState({ refreshing: true });
    this.props.fetchMonthlyBudgets();
    this.props.fetchCategoryBudgets();
    this.props.fetchMarketBudgets();
    this.setState({ refreshing: false })
  }

  getCurrencyFormat = (num) => {
    return `${num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.bgGray}}>
        <View style={{ flex: 1, backgroundColor: Colors.bgGray }}>
          <ScrollView
            contentContainerStyle={styles.container}
            refreshControl={(
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
              />
            )}
          >

            <Card>
              <CardHeader style={(!this.state.displayMonthlyBudgets) ? {
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                borderBottomWidth: 0
              } : null}>
                <TouchableOpacity style={{ alignItems: 'center', flexDirection: 'row' }} onPress={this.toggleMonthlyBudgets}>
                  <Icon name={(this.state.displayMonthlyBudgets) ? "minus" : "plus"} size={20} />
                  <MText size={18} bold> Monthly Budgets</MText>
                </TouchableOpacity>
                <MButton
                  text=" ADD"
                  textSize={14}
                  teal
                  iconLeft={
                    <Icon name="plus" color="#ffffff" />
                  }
                  style={{ paddingHorizontal: 10, paddingVertical: 5 }}
                  onPress={() => {
                    this.setState({
                      selectedDate: null,
                      budget: null,
                      selectedItemId: null
                    }, () => this.setState({ createMonthlyBudget: true }))
                  }}
                />
              </CardHeader>

              {/* <Collapsible
                              collapsed={!this.state.displayMonthlyBudgets}
                              duration={100}
                              style={{minHeight: 100}}
                          > */}
              {
                this.state.displayMonthlyBudgets && (

                  <CardBody>
                    {/* Loader */}
                    {
                      this.props.budgeting.isFetchingMonthlyBudgets && (
                        <FetchingLoader />
                      )
                    }

                    {/* Error */}
                    {
                      this.props.budgeting.isMonthlyBudgetsError && (
                        <CardItem>
                          <FetchingError>{this.props.budgeting.monthlyBudgetsError}</FetchingError>
                        </CardItem>
                      )
                    }

                    {
                      this.props.budgeting.monthlyBudgets.map((item, index) => (
                        <CardItem key={index.toString()}>
                          <View style={{ flex: 1 }}>
                            <View style={styles.listItem}>
                              <MText size={16}>{item.title}</MText>
                              <MButton
                                text=""
                                iconLeft={
                                  <Icon name="pencil" color="#ffffff" size={18} />
                                }
                                teal
                                style={styles.editIcon}
                                onPress={() => {
                                  this.setState({
                                    selectedDate: item.title,
                                    budget: item.total,
                                    selectedItemId: item.id
                                  }, () => this.setState({ createMonthlyBudget: true }))
                                }}
                              />
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
                              <Li>Received Total</Li>
                              <MText size={16}>${item.received}</MText>
                            </View>
                            <View style={styles.listItem}>
                              <Li>Remaining Total</Li>
                              <MText size={16}>${item.remaining}</MText>
                            </View>
                            <Hr height={1} />
                            <View style={styles.listItem}>
                              <Li style={{ fontSize: 18, fontWeight: 'bold' }}>Total</Li>
                              <MText size={18} bold>${this.getCurrencyFormat(parseFloat(item.total, 10))}</MText>
                            </View>
                          </View>
                        </CardItem>
                      ))
                    }

                    {
                      this.props.budgeting.monthlyBudgets.length !== 0 && (
                        <CardItem>
                          <MButton text="SEE ALL" onPress={() => this.props.navigation.navigate('MonthlyBudgets')} />
                        </CardItem>
                      )
                    }

                  </CardBody>

                )
              }
              {/* </Collapsible> */}
            </Card>


            <Card>
              <CardHeader style={(!this.state.displayCategoryBudgets) ? {
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                borderBottomWidth: 0
              } : null}>
                <TouchableOpacity style={{ alignItems: 'center', flexDirection: 'row' }} onPress={this.toggleCategoryBudgets}>
                  <Icon name={(this.state.displayCategoryBudgets) ? "minus" : "plus"} size={20} />
                  <MText size={18} bold> Category Budgets</MText>
                </TouchableOpacity>
                <MButton
                  text=" ADD"
                  textSize={14}
                  teal
                  iconLeft={
                    <Icon name="plus" color="#ffffff" />
                  }
                  style={{ paddingHorizontal: 10, paddingVertical: 5 }}
                  onPress={() => this.setState({ createCategoryBudget: true })}
                />
              </CardHeader>

              {/* <Collapsible
                              collapsed={!this.state.displayCategoryBudgets}
                              duration={100}
                          > */}
              {
                this.state.displayCategoryBudgets && (

                  <CardBody>
                    {/* Loader */}
                    {
                      this.props.budgeting.isFetchingCategoryBudgets && (
                        <FetchingLoader />
                      )
                    }

                    {/* Error */}
                    {
                      this.props.budgeting.isCategoryBudgetsError && (
                        <CardItem>
                          <FetchingError>{this.props.budgeting.categoryBudgetsError}</FetchingError>
                        </CardItem>
                      )
                    }

                    {
                      this.props.budgeting.categoryBudgets.map((item, index) => (
                        <CardItem
                          key={index.toString()}
                          clickable
                          onPress={() => this.props.navigation.navigate('CategoryBudgetChart', {
                            "item": item
                          })}
                        >
                          <MText size={16}>{item.title}</MText>
                        </CardItem>
                      ))
                    }
                    {
                      this.props.budgeting.categoryBudgets.length !== 0 && (
                        <CardItem>
                          <MButton text="SEE ALL" onPress={() => this.props.navigation.navigate('CategoryBudgets')} />
                        </CardItem>
                      )
                    }
                  </CardBody>
                )
              }
              {/* </Collapsible> */}
            </Card>

            <Card>
              <CardHeader style={(!this.state.displayMarketBudgets) ? {
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                borderBottomWidth: 0
              } : null}>
                <TouchableOpacity style={{ alignItems: 'center', flexDirection: 'row' }} onPress={this.toggleMarketBudgets}>
                  <Icon name={(this.state.displayMarketBudgets) ? "minus" : "plus"} size={20} />
                  <MText size={18} bold> Market Budgets</MText>
                </TouchableOpacity>
                <MButton
                  text=" ADD"
                  textSize={14}
                  teal
                  iconLeft={
                    <Icon name="plus" color="#ffffff" />
                  }
                  style={{ paddingHorizontal: 10, paddingVertical: 5 }}
                  onPress={() => this.setState({ createMarketBudget: true })}
                />
              </CardHeader>

              {/* <Collapsible
                              collapsed={!this.state.displayMarketBudgets}
                              duration={100}
                          > */}
              {
                this.state.displayMarketBudgets && (

                  <CardBody>
                    {/* Loader */}
                    {
                      this.props.budgeting.isFetchingMarketBudgets && (
                        <FetchingLoader />
                      )
                    }

                    {/* Error */}
                    {
                      this.props.budgeting.isMarketBudgetsError && (
                        <CardItem>
                          <FetchingError>{this.props.budgeting.marketBudgetsError}</FetchingError>
                        </CardItem>
                      )
                    }

                    {
                      this.props.budgeting.marketBudgets.map((item, index) => (
                        <CardItem
                          key={index.toString()}
                          clickable
                          onPress={() => this.props.navigation.navigate('MarketBudgetChart', {
                            "item": item
                          })}
                        >
                          <MText size={16}>{item.name}</MText>
                        </CardItem>
                      ))
                    }
                    {
                      this.props.budgeting.marketBudgets.length !== 0 && (
                        <CardItem>
                          <MButton text="SEE ALL" onPress={() => this.props.navigation.navigate('MarketBudgets')} />
                        </CardItem>
                      )
                    }
                  </CardBody>
                )
              }
              {/* </Collapsible> */}
            </Card>
          </ScrollView>

          <Modal
            isVisible={this.state.createMonthlyBudget}
            backdropTransitionOutTiming={0}
            onBackdropPress={() => this.setState({ createMonthlyBudget: false })}
          >
            {
              (this.state.selectedDate !== null) ? (
                <CreateMonthlyBudget
                  selectedDate={this.state.selectedDate}
                  budget={this.state.budget}
                  id={this.state.selectedItemId}
                  closeModal={(isAdded) => {
                    this.setState({ createMonthlyBudget: false })
                    if (isAdded) { this.props.fetchMonthlyBudgets() }
                  }}
                />
              ) : (
                <CreateMonthlyBudget
                  closeModal={(isAdded) => {
                    this.setState({ createMonthlyBudget: false })
                    if (isAdded) { this.props.fetchMonthlyBudgets() }
                  }}
                />
              )
            }
          </Modal>

          <Modal
            isVisible={this.state.createCategoryBudget}
            backdropTransitionOutTiming={0}
            onBackdropPress={() => this.setState({ createCategoryBudget: false })}
          >
            <CreateCategoryBudget
              closeModal={(isAdded) => {
                this.setState({ createCategoryBudget: false })
                if (isAdded) { this.props.fetchCategoryBudgets() }
              }}
            />
          </Modal>

          <Modal
            isVisible={this.state.createMarketBudget}
            backdropTransitionOutTiming={0}
            onBackdropPress={() => this.setState({ createMarketBudget: false })}
          >
            <CreateMarketBudget
              closeModal={(isAdded) => {
                this.setState({ createMarketBudget: false })
                if (isAdded) { this.props.fetchMarketBudgets() }
              }}
            />
          </Modal>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgGray,
    paddingHorizontal: 15,
    marginVertical: 10
  },
  editIcon: {
    borderRadius: 50,
    paddingVertical: 0,
    paddingHorizontal: 0,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});

const mapStateToProps = (state) => ({
  budgeting: state.budgetingReducer
});

const mapDispatchToProps = (dispatch) => ({
  fetchMonthlyBudgets: () => dispatch(fetchMonthlyBudgets()),
  fetchCategoryBudgets: () => dispatch(fetchCategoryBudgets()),
  fetchMarketBudgets: () => dispatch(fetchMarketBudgets())
});

export default connect(mapStateToProps, mapDispatchToProps)(Budgeting);
