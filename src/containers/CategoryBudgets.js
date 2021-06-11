import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, SafeAreaView } from 'react-native';
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
import CardItem from '../components/CardItem';
import MButton from '../components/MButton';
import MText from '../components/MText';
import FetchingLoader from '../components/FetchingLoader';
import FetchingError from '../components/FetchingError';
import CreateCategoryBudget from './CreateCategoryBudget';

class CategoryBudgets extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Category Budgets',
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
      createCategoryBudget: false
    };
  }

  componentDidMount = () => {
    this.fetchBudgets();
  }

  fetchBudgets = async () => {
    this.setState({ isFetching: true });
    const userId = await getUserId();
    await axios.get(`${Api.url}/${userId}/budget/category`, { headers: Api.headers }).then((response) => {
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
      })
    });
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.bgGray}}>
        <View style={{ flex: 1, backgroundColor: Colors.bgGray }}>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15 }}>
            <MText size={28} bold style={{ flex: 1, flexWrap: 'wrap' }}>Category Budgets</MText>
            <MButton
              teal
              text=" CREATE"
              iconLeft={(
                <Icon name="plus" color="#fff" size={14} />
              )}
              style={{ paddingHorizontal: 10 }}
              onPress={() => this.setState({ createCategoryBudget: true })}
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
                    <CardItem
                      key={index.toString()}
                      clickable
                      style={{ borderTopWidth: (index === 0) ? 0 : 1 }}
                      onPress={() => this.props.navigation.navigate('CategoryBudgetChart', {
                        "item": item
                      })}
                    >
                      <MText size={16}>{item.title}</MText>
                    </CardItem>
                  ))
                }
              </CardBody>
            </Card>
          </ScrollView>

          <Modal
            isVisible={this.state.createCategoryBudget}
            backdropTransitionOutTiming={0}
            onBackdropPress={() => this.setState({ createCategoryBudget: false })}
          >
            <CreateCategoryBudget
              closeModal={(isAdded) => {
                this.setState({ createCategoryBudget: false })
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
  }
})

export default CategoryBudgets;
