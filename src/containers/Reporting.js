import React, { Component } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import axios from 'axios';
import HeaderMenuButton from '../components/HeaderMenuButton';
import HeaderSearchButton from '../components/HeaderSearchButton';
import Api from '../../config/Api';
import getUserId from '../actions/getUserId';
import presentError from '../components/presentError';
import Card from '../components/Card';
import CardBody from '../components/CardBody';
import CardHeader from '../components/CardHeader';
import CardItem from '../components/CardItem';
import Colors from '../../config/Colors';
import MText from '../components/MText';
import MButton from '../components/MButton';
import Hr from '../components/Hr';

class Reporting extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Reporting',
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
      isGettingTagReportsCount: true,
      tagReportsCount: 0,
      refreshing: false
    };
  }

  componentDidMount = () => {
    this.getInitialData();
  }

  navigateToTaggedReport = () => {
    this.props.navigation.navigate("TaggedReporting");
  }

  getInitialData = async () => {
    const userId = await getUserId();
    const url = `${Api.url}/${userId}/reports`;
    await this.getTagReportsCount(url);
  }

  showError = (msg) => {
    this.setState({ isGettingTagReportsCount: false }, () => {
      setTimeout(() => {
        presentError("Error", msg);
      }, 300);
    });
  }

  getTagReportsCount = async (url) => {
    const { data } = await axios.get(url, { headers: Api.headers }).catch((error) => {
      this.showError(error.message);
    });
    this.setState({
      tagReportsCount: data.tagItemsCount || 0,
      isGettingTagReportsCount: false
    });
  }

  onRefresh = async () => {
    this.setState({ isGettingTagReportsCount: true, refreshing: true });
    await this.getInitialData();
    this.setState({ isGettingTagReportsCount: false, refreshing: false });
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.bgGray}}>
        <View style={{ flex: 1, backgroundColor: Colors.bgGray }}>
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled"
            refreshControl={(
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
              />
            )}
          >
            <Card>
              <CardHeader>
                <MText bold size={20}>Tagged Open Items</MText>
              </CardHeader>
              <CardItem>
                <MText size={18}>Total Tagged Open Items</MText>
                {
                  this.state.isGettingTagReportsCount ? (
                    <ActivityIndicator color={'#555555'} size="small" />
                  ) : (
                    <MText bold size={24}>{this.state.tagReportsCount}</MText>
                  )
                }
              </CardItem>
              <CardItem>
                <MButton text="SEE MORE" onPress={this.navigateToTaggedReport} />
              </CardItem>
            </Card>
          </ScrollView>
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
  }
});

export default Reporting;
