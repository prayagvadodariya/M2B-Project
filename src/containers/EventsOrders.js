import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import SearchBar from 'react-native-searchbar';
import axios from 'axios';
import HeaderMenuButton from '../components/HeaderMenuButton';
import HeaderSearchButton from '../components/HeaderSearchButton';
import Colors from '../../config/Colors';
import MText from '../components/MText';
import MButton from '../components/MButton';
import Card from '../components/Card';
import CardBody from '../components/CardBody';
import CardItem from '../components/CardItem';
import Api from '../../config/Api';
import getUserId from '../actions/getUserId';
import presentError from '../components/presentError';
import FetchingError from '../components/FetchingError';
import MLoader from '../components/Loader';
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

class EventsOrders extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Orders',
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
      isFetchingOrders: false,
      isFetchingOrdersError: false,
      fetchingOrdersError: null,
      orders: [],
      nextPageUrl: null,
      prevPageUrl: null,

      searchKeyword: ''
    };
  }

  componentDidMount = async () => {
    this.userId = await getUserId();
    this.eventId = this.props.navigation.getParam("event").id;
    this.path = `${Api.url}/${this.userId}/events/${this.eventId}/orders`;
    this.fetchOrders(this.path);
  }

  doRefresh = () => {
    this.fetchOrders(this.path);
  }

  onRefresh = async () => {
    this.setState({ refreshing: true });
    this.searchBar.hide();
    await this.doRefresh();
    this.setState({ refreshing: false });
  }

  componentWillUnmount = () => {
    this.fetchOrders = null;
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
          orders: response.data.orders.data,
          prevPageUrl: response.data.orders.prev_page_url,
          nextPageUrl: response.data.orders.next_page_url,
          isFetchingOrdersError: false,
          fetchingOrdersError: null
        });
      } else {
        this.setState({
          isFetchingOrdersError: true,
          fetchingOrdersError: response.data.message,
          orders: []
        });
      }
    }).catch((error) => {
      console.log(error);
      this.setState({
        isFetchingOrders: false
      }, () => {
        setTimeout(() => {
          presentError("fetchEvets", error.message);
        }, 100);
      });
    });
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
        onGoBack: () => this.doRefresh(),
      });
    } else {
      this.props.navigation.navigate("ViewOrder", {
        "orderId": orderId,
        "event": this.props.navigation.getParam("event"),
        onGoBack: () => this.doRefresh(),
      });
    }
  }

  handleSearch = async () => {
    if (this.state.searchKeyword) {
      this.userId = await getUserId();
      this.eventId = this.props.navigation.getParam("event").id;
      const path = `${Api.url}/${this.userId}/search-event-order/${this.eventId}?keyword=${this.state.searchKeyword}`;
      console.log(path);
      this.fetchOrders(path);
    }
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.bgGray}}>
        <View style={styles.container}>
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
            <View style={{ flexWrap: 'wrap', flexDirection: 'row', flex: 1 }}>
              <MText size={24} bold>{this.props.navigation.getParam("event").name}{" Orders"}</MText>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', margin: 0 }}>
              <BtnRound
                icon="search"
                color={Colors.darkBlue}
                iconSize={22}
                size={40}
                style={{ alignSelf: 'flex-end', marginHorizontal: 5 }}
                onPress={() => this.searchBar.show()}
              />
              <MButton
                teal
                text=" CREATE ORDER"
                textSize={14}
                iconLeft={(
                  <Icon name="plus" size={18} color="#fff" />
                )}
                style={{
                  paddingHorizontal: 10,
                  marginHorizontal: 0
                }}
                onPress={() => this.props.navigation.navigate("CreateOrder", {
                  event: this.props.navigation.getParam("event")
                })}
              />
            </View>

          </View>
          {
            this.state.isFetchingOrders && (
              <MLoader loading={this.state.isFetchingOrders} />
            )
          }
          <ScrollView
            style={{ backgroundColor: "transparent" }}
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
                      <View>
                        <View style={{ flexDirection: 'row' }}>
                          <TouchableOpacity onPress={() => this.navigateToOrder(item.status, item.id)}>
                            <MText style={{ color: "#0056b3" }} size={18} bold>{item.vendor.name}</MText>
                          </TouchableOpacity>
                          {this.renderStatus(item.status)}
                        </View>
                        <MText>{item.created_at}</MText>
                      </View>
                      <MOptionButton
                        order={item}
                        event={this.props.navigation.getParam("event")}
                        navigation={this.props.navigation}
                        doRefresh={() => this.fetchOrders(this.path)}
                        onLoading={() => this.setState({ isFetchingOrders: true })}
                        onLoadingStop={() => this.setState({ isFetchingOrders: false })}
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
              )
            }

          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgGray,
    flex: 1
  },
  titleContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5
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

export default EventsOrders;
