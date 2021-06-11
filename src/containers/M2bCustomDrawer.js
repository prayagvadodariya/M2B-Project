import React, { Component } from 'react';
import { SafeAreaView, View, ScrollView, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-community/async-storage';
import Colors from '../../config/Colors';
import MText from '../components/MText';

const menuItems = [
  { icon: 'tachometer-alt', title: 'Dashboard', key: 'Dashboard' },
  { icon: 'edit', title: 'Orders', key: 'Orders' },
  { icon: 'file-alt', title: 'Open Orders', key: 'OpenOrders' },
  { icon: 'briefcase', title: 'Budgeting', key: 'Budgeting' },
  { icon: 'shopping-cart', title: 'Market Trips', key: 'MarketTrips' },
  { icon: 'life-ring', title: 'Support', key: 'Support' },
  { icon: 'cog', title: 'Settings', key: 'Setting' },
  { icon: 'chart-bar', title: 'Reporting', key: 'Reporting' }
]

export default class M2bCustomDrawer extends Component {

  navigateToScreen = (route) => (
    () => {
      const navigateAction = NavigationActions.navigate({
        routeName: route
      });
      this.props.navigation.dispatch(navigateAction);
    })

  logout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to Logout ?',
      [
        {
          text: 'OK',
          onPress: async () => {
            await AsyncStorage.clear();
            this.props.navigation.navigate("Auth");
          }
        },
        {
          text: 'CANCEL'
        }
      ],
      {
        cancelable: true
      }
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/logoWhite.png')}
            style={{
              height: 50,
              width: null,
            }}
            resizeMode="stretch"
          />
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {
            menuItems.map((item) => (
              <TouchableOpacity
                style={[
                  styles.menuItem,
                  (this.props.activeItemKey === item.key)
                    ? styles.menuItemActive : null
                ]}
                key={item.key}
                onPress={this.navigateToScreen(item.key)}
              >
                <Icon
                  name={item.icon}
                  color={Colors.menuItem}
                  size={18}
                  style={{ width: 20 }}
                />
                <MText style={styles.menuItemText}>{item.title}</MText>
              </TouchableOpacity>
            ))
          }
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => this.logout()}
          >
            <Icon
              name={"sign-out-alt"}
              color={Colors.menuItem}
              size={18}
              style={{ width: 20 }}
            />
            <MText style={styles.menuItemText}>Logout</MText>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.menuBg,
  },
  logoContainer: {
    height: 80,
    alignContent: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(255, 255, 255, 0.5)',
  },
  menuItem: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 15,
    alignItems: 'center',
  },
  menuItemActive: {
    borderLeftWidth: 5,
    borderLeftColor: Colors.pink,
    backgroundColor: Colors.darkBlue,
    paddingHorizontal: 10,
  },
  menuItemText: {
    fontSize: 18,
    marginHorizontal: 10,
    color: Colors.menuItem,
    fontWeight: 'bold',
  }
});

