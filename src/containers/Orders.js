import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import SearchBar from 'react-native-searchbar';
import axios from 'axios';
import Api from '../../config/Api';
import getUserId from '../actions/getUserId';
import Colors from '../../config/Colors';
import MText from '../components/MText';
import MButton from '../components/MButton';
import Card from '../components/Card';
import CardBody from '../components/CardBody';
import CardItem from '../components/CardItem';
import HeaderMenuButton from '../components/HeaderMenuButton';
import HeaderSearchButton from '../components/HeaderSearchButton';
import FetchingError from '../components/FetchingError';
import Loader from '../components/Loader';
import presentError from '../components/presentError';
import BtnRound from '../components/BtnRound';
import MOptionButton from './MOptionButton';

const Badge = (props) => {
  let badgeColor = Colors.pink;
  if (props.teal) {
    badgeColor = Colors.teal
  } else if (props.darkBlue) {
    badgeColor = Colors.darkBlue
  } else if (props.danger) {
    badgeColor = "#dc3545"
  } else if (props.primary) {
    badgeColor = "#28a745"
  } else if (props.gray) {
    badgeColor = "#6c757d"
  }
  return (
    <View style={[
      {
        backgroundColor: props.color || badgeColor,
        paddingVertical: 0,
        paddingHorizontal: 5,
        marginHorizontal: 5,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center'
      },
      {
        ...props.style
      }
    ]}>
      <MText style={{ color: '#ffffff' }} bold size={12}>{props.children}</MText>
    </View>
  )
}

class Orders extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Orders',
    headerLeft: (
      <HeaderMenuButton onPress={() => navigation.toggleDrawer()} />
    ),
    headerRight: (
      <HeaderSearchButton onPress={() => navigation.navigate("Search")} />
    )
  });

  touchable = [];

  constructor(props) {
    super(props);
    this.state = {
      isFetchingOrders: false,
      isFetchingOrdersError: false,
      fetchingOrdersError: null,
      orders: [],
      nextPageUrl: null,
      prevPageUrl: null,
      refreshing: false,

      searchKeyword: ''
    };
  }

  componentDidMount = async () => {
    const userId = await getUserId();
    this.path = `${Api.url}/${userId}/order/single-order`;
    this.fetchOrders(this.path);
  }

  fetchOrders = async (path) => {
    this.setState({
      isFetchingOrders: true
    });

    this.scrollView.scrollTo({ y: 0, x: 0, animated: true });
    axios.get(path, { headers: Api.headers }).then((response) => {
      this.setState({
        isFetchingOrders: false
      });
      if (response.data.status === 'success') {
        this.setState({
          isFetchingOrdersError: false,
          fetchingOrdersError: null,
          orders: response.data.orders.data,
          nextPageUrl: response.data.orders.next_page_url,
          prevPageUrl: response.data.orders.prev_page_url
        });
      } else {
        this.setState({
          isFetchingOrdersError: true,
          fetchingOrdersError: response.data.message,
          orders: []
        });
      }
    }).catch((error) => {
      this.setState({
        isFetchingOrders: false
      });
      this.setState({
        isFetchingOrdersError: true,
        fetchingOrdersError: error.message,
        orders: []
      });
    });
  }

  doRefresh = async () => {
    const userId = await getUserId();
    const path = `${Api.url}/${userId}/order/single-order`;
    await this.fetchOrders(path);
  }

  renderStatus = (status) => {
    switch (status) {
      case 'draft': {
        return <Badge teal>DRAFT</Badge>
      }
      case 'closed': {
        return <Badge primary>CLOSED</Badge>
      }
      case 'ordered': {
        return <Badge gray>ORDERED</Badge>
      }
      case 'canceled': {
        return <Badge danger>CANCELED</Badge>
      }
      default: {
        return <Badge teal>DRAFT</Badge>
      }
    }
  }

  navigateToOrder = (status, orderId) => {
    if (status === "draft") {
      this.props.navigation.navigate("EditOrder", {
        "orderId": orderId,
        "event": this.props.navigation.getParam("event"),
        onGoBack: () => {
          this.doRefresh();
        }
      });
    } else {
      this.props.navigation.navigate("ViewOrder", {
        "orderId": orderId,
        "event": this.props.navigation.getParam("event"),
        onGoBack: () => this.doRefresh()
      });
    }
  }

  onRefresh = async () => {
    this.setState({ refreshing: true });
    this.searchBar.hide();
    await this.doRefresh();
    this.setState({ refreshing: false });
  }

  showError = (error) => {
    this.setState({ isFetchingOrders: false }, () => {
      setTimeout(() => {
        presentError("Error", error);
      }, 200);
    });
  }

  handleSearch = async () => {
    if (this.state.searchKeyword) {
      const userId = await getUserId();
      const path = `${Api.url}/${userId}/search-single-order?keyword=${this.state.searchKeyword}`;
      await this.fetchOrders(path);
    }
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.bgGray }}>
        <View style={styles.container}>
          {
            this.state.isFetchingOrders && (
              <Loader loading={this.state.isFetchingOrders} />
            )
          }
          <SearchBar
            iOSPadding={false}
            heightAdjust={-5}
            onSubmitEditing={this.handleSearch}
            onBack={() => {
              this.searchBar.hide();
              this.setState({ searchKeyword: '' })
            }}
            handleChangeText={(input) => this.setState({ searchKeyword: input })}
            ref={(ref) => { this.searchBar = ref }}
          />
          <View style={styles.titleContainer}>
            <View style={{ flex: 1 }}>
              <MText bold size={24}>
                Orders
              </MText>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <BtnRound
                icon="search"
                color={Colors.darkBlue}
                iconSize={22}
                size={40}
                onPress={() => this.searchBar.show()}
              />
              <MButton
                text=" CREATE ORDER"
                textSize={14}
                style={{ paddingHorizontal: 10 }}
                iconLeft={(<Icon name="plus" color="#fff" size={18} />)}
                onPress={() => {
                  this.props.navigation.navigate('CreateOrder');
                }}
              />
            </View>
          </View>

          <ScrollView
            style={{ backgroundColor: 'transparent' }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            showsVerticalScrollIndicator={false}
            ref={(scView) => { this.scrollView = scView }}
            keyboardDismissMode="none"
            refreshControl={(
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
              />
            )}
          >
            <Card style={{ marginBottom: 20, minHeight: 100 }}>
              <CardBody style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>

                {
                  this.state.isFetchingOrdersError && (
                    <FetchingError>{this.state.fetchingOrdersError}</FetchingError>
                  )
                }
                {
                  this.state.orders.map((item, index) => (
                    <CardItem
                      key={item.id}
                      style={
                        index === 0 ? {
                          borderTopLeftRadius: 10,
                          borderTopRightRadius: 10,
                          borderTopWidth: 0,
                          paddingVertical: 20
                        } : {
                            paddingVertical: 20
                          }
                      }
                    >
                      <TouchableOpacity onPress={() => this.navigateToOrder(item.status, item.id)}>
                        <View style={{ flexDirection: 'row' }}>
                          <View>
                            <MText style={{ color: "#0056b3" }} size={18} bold>{item.vendor.name}</MText>
                          </View>
                          {this.renderStatus(item.status)}
                        </View>
                        <MText>{item.created_at}</MText>
                      </TouchableOpacity>
                      <MOptionButton
                        order={item}
                        event={this.props.navigation.getParam("event")}
                        navigation={this.props.navigation}
                        doRefresh={() => this.fetchOrders(this.path)}
                        onLoading={() => this.setState({ isFetchingOrders: true })}
                        onLoadingStop={() => this.setState({ isFetchingOrders: false })}
                        onError={(error) => this.showError(error)}
                      />
                    </CardItem>
                  ))
                }
              </CardBody>
            </Card>

            {
              !(this.state.prevPageUrl === null && this.state.nextPageUrl === null) && (
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
                    onPress={() => this.fetchOrders(this.state.prevPageUrl)}
                  >
                    <Icon name="angle-double-left" color={(this.state.prevPageUrl !== null) ? Colors.pink : '#aaa'} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.pager
                    ]}
                    disabled={this.state.nextPageUrl === null}
                    onPress={() => this.fetchOrders(this.state.nextPageUrl)}
                  >
                    <Icon name="angle-double-right" color={(this.state.nextPageUrl !== null) ? Colors.pink : '#aaa'} />
                  </TouchableOpacity>
                </View>
              )}
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgGray
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    padding: 15
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
  }
});

export default Orders;
