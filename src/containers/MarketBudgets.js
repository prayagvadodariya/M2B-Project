import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, RefreshControl, SafeAreaView } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from "react-native-modal";
import Api from '../../config/Api';
import getUserId from '../actions/getUserId';
import presentError from '../components/presentError';
import HeaderMenuButton from '../components/HeaderMenuButton';
import HeaderSearchButton from '../components/HeaderSearchButton';
import Colors from '../../config/Colors';
import Card from '../components/Card';
import CardBody from '../components/CardBody';
import MButton from '../components/MButton';
import MText from '../components/MText';
import FetchingLoader from '../components/FetchingLoader';
import FetchingError from '../components/FetchingError';
import CreateMarketBudget from './CreateMarketBudget';

class MarketBudgets extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Market Budgets',
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
      createMarketBudget: false
    };
  }

  componentDidMount = () => {
    this.fetchBudgets();
  }

  fetchBudgets = async () => {
    this.setState({ isFetching: true });
    const userId = await getUserId();
    await axios.get(`${Api.url}/${userId}/budget/market`, { headers: Api.headers }).then((response) => {
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
      this.setState({ isFetching: false }, () => {
        setTimeout(() => {
          presentError("Error", error.message);
        }, 200);
      });
    });
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.bgGray}}>
        <View style={{ flex: 1, backgroundColor: Colors.bgGray }}>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 15, marginVertical: 15 }}>
            <MText size={28} bold style={{ flex: 1, flexWrap: 'wrap' }}>Market Budgets</MText>
            <MButton
              teal
              text=" CREATE"
              iconLeft={(
                <Icon name="plus" color="#fff" size={14} />
              )}
              style={{ paddingHorizontal: 10 }}
              onPress={() => this.setState({ createMarketBudget: true })}
            />
          </View>

          <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
            refreshControl={(
              <RefreshControl
                refreshing={this.state.isFetching}
                onRefresh={this.fetchBudgets}
              />
            )}
          >
            <Card>
              <CardBody>
                {
                  this.state.fetchingError && (
                    <FetchingError>{this.state.fetchingError}</FetchingError>
                  )
                }
                {
                  this.state.data.map((item, index) => (
                    <TouchableOpacity
                      key={index.toString()}
                      style={styles.budgetItem}
                      onPress={() => this.props.navigation.navigate('MarketBudgetChart', {
                        "item": item
                      })}
                    >
                      <View style={styles.itemCount}>
                        <MText style={{ color: '#fff' }} bold>{item.count}</MText>
                      </View>
                      <MText size={16} style={{ color: Colors.blue }}>{item.name}</MText>
                    </TouchableOpacity>
                  ))
                }
              </CardBody>
            </Card>
          </ScrollView>

          <Modal
            isVisible={this.state.createMarketBudget}
            backdropTransitionOutTiming={0}
            onBackdropPress={() => this.setState({ createMarketBudget: false })}
          >
            <CreateMarketBudget
              closeModal={(isAdded) => {
                this.setState({ createMarketBudget: false }, () => this.fetchBudgets())
                if (isAdded) { this.fetchBudgets() }
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
    paddingHorizontal: 15
  },
  budgetItem: {
    flexDirection: 'row',
    backgroundColor: Colors.bgGray,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    overflow: 'hidden',
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    alignItems: 'center'
  },
  itemCount: {
    backgroundColor: Colors.darkGray,
    color: '#fff',
    height: 30,
    width: 30,
    borderWidth: 1,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  }
})

export default MarketBudgets;
