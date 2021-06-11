import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DraggableFlatList from 'react-native-draggable-flatlist'
import axios from 'axios';
import Modal from "react-native-modal";
import getUserId from '../actions/getUserId';
import presentError from '../components/presentError';
import HeaderMenuButton from '../components/HeaderMenuButton';
import HeaderSearchButton from '../components/HeaderSearchButton';
import Colors from '../../config/Colors';
import MButton from '../components/MButton';
import Api from '../../config/Api';
import MText from '../components/MText';
import ActionButton from '../components/ActionButton';
import ViewCategory from './ViewCategory';

console.disableYellowBox = true;


class CategoriesSetting extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Categories Setting',
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
      categories: [],
      isLoading: false,
      displayCategoryModal: false,
      selectedCategory: null,
    };
  }

  componentDidMount = () => {
    this.setUserId();
    this.fetchCategories();
  }

  setUserId = async () => {
    this.userId = await getUserId();
  }

  showError = (message) => {
    this.setState({ isLoading: false }, () => {
      setTimeout(() => {
        presentError("Error", message);
      }, 500);
    });
  }

  fetchCategories = async () => {
    this.setState({
      isLoading: true
    });
    const userId = await getUserId();
    axios.get(`${Api.url}/${userId}/category`, { headers: Api.headers }).then((response) => {
      if (response.data.status === 'success') {
        this.setState({
          categories: response.data.categories,
          isLoading: false,
        });
      } else {
        this.showError(response.data.message);
      }
    }).catch((error) => {
      this.showError(error.message);
    });
  }

  navigateToEdit = (item) => {
    this.props.navigation.navigate('EditCategory', {
      category: item,
      onGoBack: (isAdded) => {
        if (isAdded) {
          this.refresh()
        }
      }
    });
  }

  viewCategory = (item) => {
    this.setState({
      selectedCategory: item
    }, () => {
      this.setState({ displayCategoryModal: true });
    });
  }

  renderItem = ({ item, move, moveEnd }) => {
    return (
      <TouchableOpacity
        style={styles.dragableItem}
        onLongPress={move}
        onPressOut={moveEnd}
      >
        <View style={{ flexDirection: 'row' }}>
          <Icon style={{ marginRight: 10 }} name="bars" color="#000" size={20} />
          <MText size={18}>{item.name}</MText>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <ActionButton
            icon="eye"
            color={Colors.teal}
            onPress={() => this.viewCategory(item)}
          />
          <ActionButton
            icon="edit"
            color={Colors.darkGray}
            onPress={() => this.navigateToEdit(item)}
          />
        </View>
      </TouchableOpacity>
    )
  }

  refresh = () => {
    this.fetchCategories();
  }

  sort = () => {
    const param = {
      sorting: this.state.categories.map((item) => item.id)
    }
    axios.post(`${Api.url}/${this.userId}/settings/category/sort`, param, { headers: Api.headers }).then((response) => {
      // do nothing
    }).catch((error) => {
      presentError("Error", error.message);
    });
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.bgGray}}>
        <View style={styles.container}>

          <View style={styles.titleContainer}>
            <MButton
              text=" ADD CATEGORY"
              textSize={14}
              teal
              iconLeft={(<Icon name="plus" color="#fff" size={18} />)}
              onPress={() => {
                this.props.navigation.navigate('AddCategory', {
                  onGoBack: (isAdded) => {
                    if (isAdded) {
                      this.refresh()
                    }
                  }
                });
              }}
            />
          </View>

          <View style={styles.dragableContainer}>
            <DraggableFlatList
              contentContainerStyle={{ padding: 15 }}
              data={this.state.categories}
              renderItem={this.renderItem}
              keyExtractor={(item) => `${item.id}`}
              scrollPercent={5}
              onMoveEnd={({ data }) => this.setState({ categories: data }, () => this.sort())}
              refreshing={this.state.isLoading}
              onRefresh={this.fetchCategories}
            />
          </View>

          <Modal
            isVisible={this.state.displayCategoryModal}
            backdropTransitionOutTiming={0}
            onBackdropPress={() => this.setState({ displayCategoryModal: false })}
          >
            <ViewCategory
              category={this.state.selectedCategory}
              closeModal={(isAdded) => {
                this.setState({ displayCategoryModal: false })
                if (isAdded) { this.refresh() }
              }}
            />
          </Modal>

        </View>
      </SafeAreaView>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgGray,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    padding: 10,
  },
  dragableContainer: {
    flex: 1
  },
  dragableItem: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: Colors.border,
    padding: 10
  }
});

export default CategoriesSetting
