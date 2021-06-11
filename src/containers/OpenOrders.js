import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import SearchBar from 'react-native-searchbar';
import Modal from "react-native-modal";
import axios from 'axios';
import getUserId from '../actions/getUserId';
import Api from '../../config/Api';
import MText from '../components/MText';
import Colors from '../../config/Colors';
import HeaderMenuButton from '../components/HeaderMenuButton';
import HeaderSearchButton from '../components/HeaderSearchButton';
import Card from '../components/Card';
import CardBody from '../components/CardBody';
import CardHeader from '../components/CardHeader';
import CardItem from '../components/CardItem';
import Li from '../components/Li';
import SlideItem from '../components/SlideItem';
import FetchingLoader from '../components/FetchingLoader';
import Loader from '../components/Loader';
import presentError from '../components/presentError';
import StatusBadge from '../components/StatusBadge';
import SlideItemModal from './SlideItemModal';
import MOptionButton from './MOptionButton';
import BtnRound from '../components/BtnRound';

class OpenOrders extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: 'Open Orders',
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
      isFetching: false,
      isFetchingError: false,
      fetchingError: '',
      data: [],
      openOrdersCount: 0,
      prevPageUrl: '',
      nextPageUrl: '',
      isFetchingSlider: false,
      prevPageTimestamp: null,
      nextPageTimestamp: null,
      sliderData: [],
      displaySlideItemModal: false,
      pressedItemTimestamp: null,

      searchKeyword: ''
    };
  }

  componentDidMount = () => {
    this.setData();
  }

  setData = async () => {
    const userId = await getUserId();
    this.path = `${Api.url}/${userId}/open-orders`;
    this.fetchOrders(this.path);
    this.fetchSlider();
  }

  doRefresh = async () => {
    this.searchBar.hide();
    const userId = await getUserId();
    this.path = `${Api.url}/${userId}/open-orders`;
    this.fetchOrders(this.path);
    this.fetchSlider();
  }

  fetchOrders = async (path) => {
    this.setState({ isFetching: true });
    this.path = path;
    this.scrollView.scrollTo({
      x: 0,
      y: 0,
      animated: true
    });
    axios.get(path, { headers: Api.headers }).then((response) => {
      this.setState({ isFetching: false });
      if (response.data.status === 'success') {
        this.setState({
          isFetchingError: false,
          fetchingError: '',
          data: response.data.orders.data,
          nextPageUrl: response.data.orders.next_page_url,
          prevPageUrl: response.data.orders.prev_page_url,
          openOrdersCount: response.data.openorderCount
        }, () => {

        });
      } else {
        this.setState({
          isFetchingError: true,
          data: [],
          nextPageUrl: '',
          prevPageUrl: '',
          fetchingError: response.data.message[0]
        });
      }
    }).catch((error) => {
      this.setState({ isFetching: false }, () => {
        setTimeout(() => {
          presentError("Error", error.message);
        }, 100);
      });
    });
  }

  fetchSlider = async () => {
    const userId = await getUserId();
    this.setState({ isFetchingSlider: true });
    axios.get(`${Api.url}/${userId}/open-order-slider/center`, { headers: Api.headers }).then((response) => {
      this.setState({ isFetchingSlider: false });
      if (response.data.status === 'success') {
        let { sliderData } = this.state;
        sliderData = sliderData.concat(response.data.data);
        this.setState({
          sliderData,
          prevPageTimestamp: response.data.timestamp,
          nextPageTimestamp: response.data.timestamp,
          isFetchingSlider: false
        });
      }
    }).catch((error) => {
      this.setState({ isFetchingSlider: false });
      presentError("Error", error.message);
    });
  }

  fetchPrevSlider = async () => {
    const userId = await getUserId();
    this.setState({ isFetchingSlider: true });
    axios.get(`${Api.url}/${userId}/open-order-slider/left?timestamp=${this.state.prevPageTimestamp}`, { headers: Api.headers }).then((response) => {
      this.setState({ isFetchingSlider: false });
      if (response.data.status === 'success') {
        const prevSlider = response.data.data.reverse();
        this.setState({
          sliderData: prevSlider.concat(this.state.sliderData),
          prevPageTimestamp: response.data.timestamp
        });
      }
    }).catch((error) => {
      this.setState({ isFetchingSlider: false });
      presentError("Error", error.message);
    });
  }

  fetchNextSlider = async () => {
    const userId = await getUserId();
    this.setState({ isFetchingSlider: true });
    axios.get(`${Api.url}/${userId}/open-order-slider/right?timestamp=${this.state.nextPageTimestamp}`, { headers: Api.headers }).then((response) => {
      this.setState({ isFetchingSlider: false });
      if (response.data.status === 'success') {
        let { sliderData } = this.state;
        sliderData = sliderData.concat(response.data.data);
        this.setState({
          sliderData,
          nextPageTimestamp: response.data.timestamp
        });
      }
    }).catch((error) => {
      this.setState({ isFetchingSlider: false });
      presentError("Error", error.message);
    });
  }

  filterOrders = async (timestamp) => {
    this.setState({ data: [] });
    const userId = await getUserId();
    const path = `${Api.url}/${userId}/open-orders?orders-by=${timestamp}`;
    this.fetchOrders(path);
  }

  renderStatus = (status) => {
    switch (status) {
      case 'ordered':
        return (<StatusBadge gray>ORDERED</StatusBadge>)
      case 'canceled':
        return (<StatusBadge danger>CANCELED</StatusBadge>)
      case 'closed':
        return (<StatusBadge primary>CLOSED</StatusBadge>)
      case 'draft':
        return (<StatusBadge teal>DRAFT</StatusBadge>)
      default:
        return <View />
    }
  }

  navigateToOrder = (status, orderId) => {
    if (status === "draft") {
      this.props.navigation.navigate("EditOrder", {
        "orderId": orderId,
        "event": this.props.navigation.getParam("event"),
        onGoBack: () => this.fetchOrders(this.path)
      });
    } else {
      this.props.navigation.navigate("ViewOrder", {
        "orderId": orderId,
        "event": this.props.navigation.getParam("event"),
        onGoBack: () => this.fetchOrders(this.path)
      });
    }
  }

  displaySlideItemModal = async (timestamp) => {
    this.setState({ pressedItemTimestamp: timestamp, displaySlideItemModal: true });
  }

  handleSearch = async () => {
    if (this.state.searchKeyword) {
      const userId = await getUserId();
      const path = `${Api.url}/${userId}/search-ordered?keyword=${this.state.searchKeyword}`;
      this.fetchOrders(path);
      this.fetchSlider();
    }
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.bgGray}}>
        <View style={styles.container}>
          {
            this.state.isFetching && (
              <Loader loading={this.state.isFetching} />
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
          <ScrollView
            showsVerticalScrollIndicator={false}
            ref={(scrollView) => { this.scrollView = scrollView }}
            keyboardDismissMode="none"
            refreshControl={(
              <RefreshControl
                refreshing={false}
                onRefresh={this.doRefresh}
              />
            )}
          >
            <BtnRound
              icon="search"
              color={Colors.darkBlue}
              iconSize={22}
              size={40}
              style={{ alignSelf: 'flex-end', marginHorizontal: 15, marginTop: 10 }}
              onPress={() => this.searchBar.show()}
            />

            <Card style={{ marginHorizontal: 15 }}>
              <CardHeader>
                <MText bold size={20}>Current Orders</MText>
                <MText bold pink size={20}>${this.state.openOrdersCount}</MText>
              </CardHeader>

              <CardBody>

                <CardItem>
                  {
                    this.state.isFetchingSlider && (
                      <FetchingLoader style={{ position: 'absolute', top: 30, left: 0, right: 0, borderTopWidth: 0 }} />
                    )
                  }
                  <ScrollView
                    horizontal={true}
                    contentContainerStyle={{ alignItems: 'center' }}
                    ref={(ref) => { this.slider = ref }}
                  >
                    <TouchableOpacity style={styles.loadMoreButton} onPress={() => this.fetchPrevSlider()}>
                      <Icon name="angle-double-left" color={Colors.pink} size={18} />
                      <MText bold size={16} pink> Load More</MText>
                    </TouchableOpacity>
                    {
                      this.state.sliderData.map((item) => (
                        <SlideItem
                          key={item.date}
                          onFilter={() => this.filterOrders(item.date)}
                          onPress={() => this.displaySlideItemModal(item.date)}
                        >
                          <MText>{item.price}</MText>
                        </SlideItem>
                      ))
                    }
                    <TouchableOpacity style={styles.loadMoreButton} onPress={() => this.fetchNextSlider()}>
                      <MText bold size={16} pink>Load Next </MText>
                      <Icon name="angle-double-right" color={Colors.pink} size={18} />
                    </TouchableOpacity>
                  </ScrollView>
                </CardItem>

                {
                  this.state.isFetchingError && (
                    <CardItem style={{ height: 100, alignItems: 'center', justifyContent: 'center' }}>
                      <MText size={14}>{this.state.fetchingError}</MText>
                    </CardItem>
                  )
                }

                {
                  this.state.data.map((order) => {
                    return (
                      <CardItem key={order.id}>
                        <View style={{ flex: 1 }}>
                          <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                          }}>
                            <View>
                              <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity
                                  style={{ flexDirection: 'row' }}
                                  onPress={() => this.navigateToOrder(order.status, order.id)}
                                >
                                  <MText size={18} bold style={{ color: '#007bff' }}>{order.name}</MText>
                                </TouchableOpacity>
                                {this.renderStatus(order.status)}
                              </View>
                              <View>
                                <MText size={12} style={{ color: '#313c41' }}>
                                  {order.created_at}
                                </MText>
                                {
                                  order.event_name !== null && (
                                    <React.Fragment>
                                      <MText size={12} bold>
                                        EVENT :
                                        <MText size={12} style={{ color: '#313c41' }}>
                                          {' '}{order.event_name}
                                        </MText>
                                      </MText>
                                    </React.Fragment>
                                  )
                                }
                              </View>
                            </View>
                            <MOptionButton
                              order={order}
                              event={this.props.navigation.getParam("event")}
                              navigation={this.props.navigation}
                              doRefresh={() => this.fetchOrders(this.path)}
                              onLoading={() => this.setState({ isFetching: true })}
                              onLoadingStop={() => this.setState({ isFetching: false })}
                            />
                          </View>
                          <View>
                            <View style={styles.listItem}>
                              <Li>Ship Date</Li>
                              <MText size={16}>{(order.shipping.date) ? order.shipping.date : '-'}</MText>
                            </View>
                            <View style={styles.listItem}>
                              <Li>OrderTotal</Li>
                              <MText size={16}>${(order.shipping.price) ? order.shipping.price : '0'}</MText>
                            </View>
                          </View>
                        </View>
                      </CardItem>
                    )
                  })
                }

              </CardBody>

            </Card>


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

            <Modal
              isVisible={this.state.displaySlideItemModal}
              backdropTransitionOutTiming={0}
              animationIn="fadeInDown"
              animationOut="fadeOutUp"
              onBackdropPress={() => this.setState({ displaySlideItemModal: false })}
            >
              <SlideItemModal timestamp={this.state.pressedItemTimestamp} closeModal={() => this.setState({ displaySlideItemModal: false })} />
            </Modal>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgGray,
    // paddingHorizontal: 15,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
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
  loadMoreButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderRadius: 10,
    paddingVertical: 20,
    borderColor: Colors.border,
    marginVertical: 20,
    width: 150,
    flexWrap: 'wrap',
    margin: 10,
    flexDirection: 'row'
  }
});

export default OpenOrders;
