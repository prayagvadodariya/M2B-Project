import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import Api from '../../config/Api';
import getUserId from '../actions/getUserId';
import Colors from '../../config/Colors';
import MText from '../components/MText';
import Card from '../components/Card';
import CardBody from '../components/CardBody';
import CardItem from '../components/CardItem';
import HeaderMenuButton from '../components/HeaderMenuButton';
import presentError from '../components/presentError';
import FetchingLoader from '../components/FetchingLoader';
import FetchingError from '../components/FetchingError';
import Loader from '../components/Loader';
import StatusBadge from '../components/StatusBadge';

class Search extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Search',
    headerLeft: (
      <HeaderMenuButton onPress={() => navigation.toggleDrawer()} />
    )
  })

  constructor(props) {
    super(props);
    this.state = {
      isFetchingOrders: false,
      isFetchingOrdersError: false,
      fetchingOrdersError: null,
      orders: [],
      nextPageUrl: '',
      prevPageUrl: '',
      keyword: '',
      currentPage: 1,
      isSearched: false,
      searchError: null
    };
  }

  doSearch = async () => {
    if (this.state.keyword.length === 0) {
      this.setState({
        searchError: 'Please enter keyword'
      });
    } else {
      this.setState({ searchError: null });
      this.setState({ currentPage: 1 });
      const userId = await getUserId();
      const path = `${Api.url}/${userId}/search?keyword=${this.state.keyword}`;
      this.fetchOrders(path);
    }
  }

  fetchOrders = async (path) => {
    this.setState({
      isFetchingOrders: true
    });

    axios.get(path, { headers: Api.headers }).then((response) => {
      this.setState({
        isFetchingOrders: false,
        isSearched: true
      });
      if (response.data.status === 'success') {
        this.setState({
          isFetchingOrdersError: false,
          fetchingOrdersError: null,
          orders: response.data.orders.data,
          nextPageUrl: response.data.orders.next_page_url,
          prevPageUrl: response.data.orders.prev_page_url
        });
        this.scrollView.scrollTo({ y: 0, x: 0, animated: true });
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
      presentError("fetchOrders", error.message);
    });
  }

  fetchNextPage = () => {
    this.setState({
      currentPage: this.state.currentPage + 1
    }, async () => {
      const userId = await getUserId();
      const path = `${Api.url}/${userId}/search?keyword=${this.state.keyword}&page=${this.state.currentPage}`;
      this.fetchOrders(path);
    });
  }

  fetchPrevPage = () => {
    this.setState({
      currentPage: this.state.currentPage - 1
    }, async () => {
      const userId = await getUserId();
      const path = `${Api.url}/${userId}/search?keyword=${this.state.keyword}&page=${this.state.currentPage}`;
      this.fetchOrders(path);
    });
  }

  renderStatus = (status) => {
    switch (status) {
      case 'draft': {
        return <StatusBadge teal>DRAFT</StatusBadge>
      }
      case 'closed': {
        return <StatusBadge primary>CLOSED</StatusBadge>
      }
      case 'ordered': {
        return <StatusBadge gray>ORDERED</StatusBadge>
      }
      case 'canceled': {
        return <StatusBadge danger>CANCELED</StatusBadge>
      }
      default: {
        return <StatusBadge teal>DRAFT</StatusBadge>
      }
    }
  }

  navigateToOrder = (status, orderId) => {
    if (status === "draft") {
      this.props.navigation.navigate("EditOrder", {
        "orderId": orderId,
        "event": this.props.navigation.getParam("event"),
        onGoBack: () => this.doSearch()
      });
    } else {
      this.props.navigation.navigate("ViewOrder", {
        "orderId": orderId,
        "event": this.props.navigation.getParam("event")
      });
    }
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.bgGray}}>
        <View style={styles.container}>

          <ScrollView
            style={{ backgroundColor: 'transparent', padding: 15 }}
            showsVerticalScrollIndicator={false}
            ref={(scView) => { this.scrollView = scView }}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="always"
          >

            <View style={styles.searchContainer}>
              <TextInput
                placeholder="Search"
                onChangeText={(keyword) => this.setState({ keyword })}
                onSubmitEditing={() => this.doSearch()}
                style={styles.searchInput}
              />
              <TouchableOpacity
                style={styles.searchButton}
                onPress={() => this.doSearch()}
              >
                <MText style={{ color: "#fff" }} bold size={14}>SEARCH</MText>
              </TouchableOpacity>
            </View>
            {
              this.state.searchError && (
                <View>
                  <MText pink>{this.state.searchError}</MText>
                </View>
              )
            }

            <Loader loading={this.state.isFetchingOrders} />

            {
              this.state.isSearched && (
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
                                <MText style={{ color: "#0056b3" }} size={18} bold>{item.name}</MText>
                              </View>
                              {this.renderStatus(item.status)}
                            </View>
                            <MText>{item.created_at}</MText>
                          </TouchableOpacity>

                        </CardItem>
                      ))
                    }

                  </CardBody>

                </Card>
              )
            }

            {
              this.state.isSearched && this.state.orders.length !== 0 && (
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
                    onPress={() => this.fetchPrevPage()}
                  >
                    <Icon name="angle-double-left" color={(this.state.prevPageUrl !== null) ? Colors.pink : '#aaa'} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.pager
                    ]}
                    disabled={this.state.nextPageUrl === null}
                    onPress={() => this.fetchNextPage()}
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
    flex: 1,
    backgroundColor: Colors.bgGray
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: 15
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
  searchContainer: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center'
  },
  searchInput: {
    height: 50,
    borderWidth: 1,
    borderColor: Colors.border,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    padding: 10,
    alignItems: 'center',
    flex: 1,
    fontSize: 18,
    fontFamily: 'nunito'
  },
  searchButton: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    backgroundColor: Colors.darkGray,
    paddingHorizontal: 10,
    borderLeftWidth: 0
  }
});

export default Search;
