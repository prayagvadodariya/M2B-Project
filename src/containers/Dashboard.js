import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Alert, Picker, RefreshControl, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { connect } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import { fetchDashboardOpenOrders, fetchDashboardFavoriteVendors, fetchDashboardShippingSoon, fetchDashboardPastDueOrders } from '../actions/dashboardAction';

import Card from '../components/Card';
import CardHeader from '../components/CardHeader';
import MText from '../components/MText';
import HeaderMenuButton from '../components/HeaderMenuButton';
import HeaderSearchButton from '../components/HeaderSearchButton';
import CardItem from '../components/CardItem';
import MButton from '../components/MButton';
import Badge from '../components/Badge';
import Colors from '../../config/Colors';
import CardBody from '../components/CardBody';
import * as Keys from '../constants/storageKeys';
import FetchingLoader from '../components/FetchingLoader';
import FetchingError from '../components/FetchingError';
import Loader from '../components/Loader';

class Dashboard extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: 'Dashboard',
    headerLeft: (
      <HeaderMenuButton onPress={() => navigation.toggleDrawer()} />
    ),
    headerRight: (
      <HeaderSearchButton onPress={() => navigation.navigate("Search")} />
    )
  });

  constructor(props) {
    super(props);
    this.state = {
      refreshing: false
    };

    this.setData();
  }

  componentDidMount = () => {
    SplashScreen.hide();
  }

  setData = async () => {
    this.setState({ refreshing: true });
    this.props.fetchOpenOrders();
    this.props.fetchFavoriteVendors();
    this.props.fetchShippingSoon();
    this.props.fetchPastDueOrders();
    this.setState({ refreshing: false });
  }

  renderOpenOrders = () => {
    if (this.props.dashboard.isFetchingOpenOrders) {
      return (
        <FetchingLoader />
      )
    }
    if (this.props.dashboard.isOpenOrdersError) {
      return (
        <CardItem style={{ alignItems: 'center', justifyContent: 'center', padding: 30, height: 100 }}>
          <MText size={16}>{this.props.dashboard.openOrdersError}</MText>
        </CardItem>
      )
    }
    return (
      this.props.dashboard.openOrders.map((order) => (
        <CardItem key={order.id}>
          <MText size={16}>{order.name}</MText>
        </CardItem>
      ))
    )
  }

  renderFavoriteVendors = () => {
    if (this.props.dashboard.isFetchingFavoriteVendors) {
      return (
        <FetchingLoader />
      )
    }
    if (this.props.dashboard.isFavoriteVendorsError) {
      return (
        <CardItem style={{ alignItems: 'center', justifyContent: 'center', padding: 30, height: 100 }}>
          <MText size={16}>{this.props.dashboard.favoriteVendorsError}</MText>
        </CardItem>
      )
    }
    return (
      this.props.dashboard.favoriteVendors.map((vendor, index) => (
        <CardItem key={index.toString()}>
          <MText size={16}>{vendor}</MText>
        </CardItem>
      ))
    )
  }

  renderShippingSoon = () => {
    if (this.props.dashboard.isFetchingShippingSoon) {
      return (
        <FetchingLoader />
      )
    }
    if (this.props.dashboard.isShippingSoonError) {
      return (
        <CardItem style={{ alignItems: 'center', justifyContent: 'center', padding: 30, height: 100 }}>
          <MText size={16}>{this.props.dashboard.shippingSoonError}</MText>
        </CardItem>
      )
    }
    return (
      this.props.dashboard.shippingSoon.map((order, index) => (
        <CardItem key={index.toString()}>
          <MText size={16} style={{ flexShrink: 1 }}>{order.name}</MText>
          <Badge teal>{order.date}</Badge>
        </CardItem>
      ))
    )

  }

  renderPastDueOrders = () => {
    if (this.props.dashboard.isFetchingPastDueOrders) {
      return (
        <FetchingLoader />
      )
    }
    if (this.props.dashboard.isPastDueOrdersError) {
      return (
        <CardItem style={{ alignItems: 'center', justifyContent: 'center', padding: 30, height: 100 }}>
          <MText size={16}>{this.props.dashboard.pastDueOrdersError}</MText>
        </CardItem>
        // <FetchingError>{this.props.dashboard.pastDueOrdersError}</FetchingError>
      )
    }
    return (
      this.props.dashboard.pastDueOrders.map((order, index) => (
        <CardItem key={index.toString()}>
          <MText size={16} style={{ flexShrink: 1 }}>{order.name}</MText>
          <Badge teal>{order.date}</Badge>
        </CardItem>
      ))
    )
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.bgGray}}>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={(
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.setData}
            />
          )}
        >

          <MButton
            text=" CREATE ORDER"
            textSize={14}
            style={{ paddingHorizontal: 10, alignSelf: 'flex-end', marginTop: 10 }}
            iconLeft={(<Icon name="plus" color="#fff" size={18} />)}
            onPress={() => {
              this.props.navigation.navigate('CreateOrder');
            }}
          />

          <Card>
            <CardHeader>
              <MText size={18} bold>Open Orders</MText>
              <MText size={18} pink bold>Total : ${(this.props.dashboard.openOrdersCount) ? this.props.dashboard.openOrdersCount : '00.00'}</MText>
            </CardHeader>
            <CardBody>
              {this.renderOpenOrders()}
            </CardBody>
          </Card>

          {/* <Card>
						<CardHeader>
							<MText size={18} bold>Favorite Vendors</MText>
						</CardHeader>
						<CardBody>
							{this.renderFavoriteVendors()}
						</CardBody>
					</Card> */}

          <Card>
            <CardHeader>
              <MText size={18} bold>Shipping Soon</MText>
              {/* <MButton text="CALENDER" darkBlue textSize={12} /> */}
            </CardHeader>
            <CardBody>
              {this.renderShippingSoon()}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <MText size={18} bold>Past Due Orders</MText>
              {/* <MButton text="CALENDER" darkBlue textSize={12} /> */}
            </CardHeader>
            <CardBody>
              {this.renderPastDueOrders()}
            </CardBody>
          </Card>

        </ScrollView>
      </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: Colors.bgGray
  }
});

const mapStateToProps = (state) => ({
  dashboard: state.dashboardReducer
});

const mapDispatchToProps = (dispatch) => ({
  fetchOpenOrders: () => dispatch(fetchDashboardOpenOrders()),
  fetchFavoriteVendors: () => dispatch(fetchDashboardFavoriteVendors()),
  fetchShippingSoon: () => dispatch(fetchDashboardShippingSoon()),
  fetchPastDueOrders: () => dispatch(fetchDashboardPastDueOrders())
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
