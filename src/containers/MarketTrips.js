import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import Modal from "react-native-modal";
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
import Loader from '../components/Loader';
import CreateMarketTrip from './CreateMarketTrip';

class MarketTrips extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Market Trips',
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
      isFetchingEvents: false,
      isFetchingEventsError: false,
      fetchingEventsError: null,
      events: [],
      nextPageUrl: null,
      prevPageUrl: null,
      displayCreateMTModal: false,
      selectedEventId: null,
      selectedEventName: null
    };
  }

  componentDidMount = async () => {
    const userId = await getUserId();
    const path = `${Api.url}/${userId}/events`;
    this.fetchEvents(path);
  }

  doRefresh = async () => {
    this.setState({ isFetchingEvents: true });
    const userId = await getUserId();
    const path = `${Api.url}/${userId}/events`;
    this.fetchEvents(path);
  }

  fetchEvents = async (path) => {
    this.setState({
      isFetchingEvents: true
    });

    await axios.get(path, { headers: Api.headers }).then((response) => {
      this.setState({
        isFetchingEvents: false
      });
      if (response.data.status === 'success') {
        this.setState({
          events: response.data.events.data,
          prevPageUrl: response.data.events.prev_page_url,
          nextPageUrl: response.data.events.next_page_url,
          isFetchingEventsError: false,
          fetchingEventsError: null
        });
      } else {
        this.setState({
          isFetchingEventsError: true,
          fetchingEventsError: response.data.message,
          events: []
        });
      }
    }).catch((error) => {
      this.setState({
        isFetchingEvents: false
      });
      presentError("fetchEvets", error.message);
    });
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.bgGray}}>
        <View style={styles.container}>

          <Loader loading={this.state.isFetchingEvents} />

          <View style={styles.titleContainer}>
            <MButton
              text=" CREATE"
              textSize={14}
              teal
              style={{ paddingHorizontal: 10, alignSelf: 'flex-end' }}
              iconLeft={(<Icon name="plus" color="#fff" size={18} />)}
              onPress={() => {
                this.setState({ displayCreateMTModal: true });
              }}
            />
          </View>

          <ScrollView
            contentContainerStyle={{ backgroundColor: "transparent", paddingHorizontal: 15 }}
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
            refreshControl={(
              <RefreshControl
                refreshing={false}
                onRefresh={this.doRefresh}
              />
            )}
          >
            <Card style={{ marginBottom: 20 }}>
              <CardBody>
                {
                  this.state.isFetchingEventsError && (
                    <FetchingError>{this.state.fetchingEventsError}</FetchingError>
                  )
                }
                {
                  this.state.events.map((item, index) => (
                    <CardItem
                      key={item.id}
                      style={
                        index === 0 ? {
                          borderTopLeftRadius: 10,
                          borderTopRightRadius: 10,
                          borderTopWidth: 0,
                        } : {}
                      }
                    >
                      <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('EventsOrders', {
                          event: item
                        })}
                      >
                        <MText size={20} bold>{item.name}</MText>
                        <MText>{item.created_at}</MText>
                      </TouchableOpacity>

                      <MButton
                        text="CREATE ORDER"
                        teal
                        textSize={14}
                        style={{ paddingHorizontal: 10 }}
                        onPress={() => {
                          this.props.navigation.navigate("CreateOrder", {
                            "event": item
                          });
                        }}
                      />
                    </CardItem>
                  ))
                }
              </CardBody>
            </Card>

            {
              !this.state.isFetchingEvents && (!(this.state.prevPageUrl === null && this.state.nextPageUrl === null)) && (
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
                    onPress={() => this.fetchEvents(this.state.prevPageUrl)}
                  >
                    <Icon name="angle-double-left" color={(this.state.prevPageUrl !== null) ? Colors.pink : '#aaa'} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.pager
                    ]}
                    disabled={this.state.nextPageUrl === null}
                    onPress={() => this.fetchEvents(this.state.nextPageUrl)}
                  >
                    <Icon name="angle-double-right" color={(this.state.nextPageUrl !== null) ? Colors.pink : '#aaa'} />
                  </TouchableOpacity>
                </View>
              )
            }

          </ScrollView>

          <Modal
            isVisible={this.state.displayCreateMTModal}
            backdropTransitionOutTiming={0}
            onBackdropPress={() => this.setState({ displayCreateMTModal: false })}
          >
            <CreateMarketTrip
              eventName={this.state.selectedEventName}
              id={this.state.selectedEventId}
              closeModal={(isAdded) => {
                this.setState({ displayCreateMTModal: false })
                if (isAdded) { this.doRefresh() }
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
    flex: 1
  },
  titleContainer: {
    flexDirection: 'row-reverse',
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
    alignSelf: 'center'
  },
  pager: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50
  }
});

export default MarketTrips;
