import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Alert, TextInput, FlatList, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';
import Api from '../../config/Api';
import getUserId from '../actions/getUserId';
import HeaderMenuButton from '../components/HeaderMenuButton';
import HeaderSearchButton from '../components/HeaderSearchButton';
import Colors from '../../config/Colors';
import Card from '../components/Card';
import MText from '../components/MText';
import MButton from '../components/MButton';
import SafeScrollView from '../components/SafeScrollView';
import ActionButton from '../components/ActionButton';
import Loader from '../components/Loader';
import presentError from '../components/presentError';
import showToast from '../components/showToast';

class EditCategory extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Edit Category',
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
      categoryName: '',
      categoryId: '',
      sizes: [''],
      errors: [],
      isLoading: false
    };
  }

  componentDidMount = () => {
    const category = this.props.navigation.getParam("category");
    this.setState({
      categoryName: category.name,
      sizes: JSON.parse(category.sizes),
      categoryId: category.id,
      selectedWeightUnit: category.weight_unit,
      weight: category.weight
    });
  }

  renderSizes = ({ index }) => {
    return (
      <View key={index.toString()} style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
        <TextInput
          style={styles.textInput}
          value={this.state.sizes[index]}
          onChangeText={(text) => {
            const { sizes } = this.state;
            sizes[index] = text;
            this.setState({ sizes });
          }}
        />
        {
          this.state.sizes.length > 1 && (
            <ActionButton
              icon="minus"
              onPress={() => this.removeFromSizes(index)}
              color={Colors.danger}
            />
          )
        }
      </View>
    )
  }

  addSize = () => {
    const { sizes } = this.state;
    sizes.push('');
    this.setState({ sizes });
  }

  removeFromSizes = (index) => {
    const { sizes } = this.state;
    sizes.splice(index, 1);
    this.setState({ sizes });
  }

  save = async () => {
    this.setState({ isLoading: true });
    const userId = await getUserId();
    const param = {
      name: this.state.categoryName,
      sizes: this.state.sizes,
      weight_unit: this.state.selectedWeightUnit,
      weight: this.state.weight
    }

    axios.post(`${Api.url}/${userId}/settings/category/update/${this.state.categoryId}`, param, { headers: Api.headers }).then((response) => {
      if (response.data.status === 'success') {
        this.setState({ isLoading: false });
        showToast('Category updated successfully');
        this.props.navigation.state.params.onGoBack(true);
        this.props.navigation.goBack();
      } else {
        this.setState({ isLoading: false }, () => {
          setTimeout(() => {
            this.setState({ errors: response.data.message });
          }, 500);
        });

      }
    }).catch((error) => {
      this.setState({ isLoading: false }, () => {
        setTimeout(() => {
          presentError(error.message);
        }, 500);
      });
    });
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.bgGray}}>
        <View style={styles.container}>
          <SafeScrollView style={{ flex: 1 }}>

            <Loader loading={this.state.isLoading} />

            <ScrollView
              keyboardDismissMode="interactive"
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ padding: 15, paddingBottom: 50 }}
            >
              <Card style={{ padding: 20 }}>
                <View style={styles.label}>
                  <MText size={18}>Category Name<MText pink>*</MText></MText>
                </View>
                <TextInput
                  style={styles.textInput}
                  value={this.state.categoryName}
                  onChangeText={(categoryName) => this.setState({ categoryName })}
                />

                <View style={{ marginVertical: 5 }}>
                  <MText size={18} style={{ marginLeft: 20, marginVertical: 5 }}>Weight</MText>
                  <View style={{ flexDirection: 'row', flex: 1 }}>
                    <View style={{
                      borderWidth: 1, 
                      borderColor: Colors.border, 
                      borderRadius: 50,
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: 50,
                      minWidth: 100,
                      maxWidth: 100,
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0
                    }}>
                      <RNPickerSelect
                        style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 }}
                        textInputProps={{ textAlign: 'center', fontSize: 20, alignItems: 'center', justifyContent: 'center' }}
                        value={this.state.selectedWeightUnit || 'lb'}
                        onValueChange={(value) => this.setState({ selectedWeightUnit: value })}
                        items={[
                          { label: 'lb', value: 'lb' },
                          { label: 'oz', value: 'oz' },
                          { label: 'kg', value: 'kg' },
                          { label: 'g', value: 'g' }
                        ]}
                      />
                    </View>
                    <TextInput
                      value={this.state.weight}
                      onChangeText={(weight) => this.setState({ weight })}
                      onEndEditing={(e) => {
                        if (e.nativeEvent.text) {
                          this.setState({ weight: parseFloat(e.nativeEvent.text).toFixed(2) })
                        }
                      }}
                      style={[styles.textInput, { flex: 1, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, marginVertical: 0 }]}
                    />
                  </View>
                </View>

                <View style={{ marginTop: 20 }}>
                  <View style={styles.label}>
                    <MText size={18}>Sizes<MText pink>*</MText></MText>
                  </View>
                </View>
                <FlatList
                  data={this.state.sizes}
                  extraData={this.state}
                  renderItem={this.renderSizes}
                />

                <MButton
                  iconLeft={(
                    <Icon name="plus" size={16} color="#fff" />
                  )}
                  text=" ADD"
                  onPress={this.addSize}
                  style={{ alignSelf: 'stretch', alignItems: 'center', marginVertical: 10, backgroundColor: Colors.primary }}
                />

                {
                  this.state.errors.length > 0 && (
                    <View style={styles.error}>
                      {
                        this.state.errors.map((error, index) => (
                          <MText key={index.toString()} pink size={16}>{error}</MText>
                        ))
                      }
                    </View>
                  )
                }


                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                  <MButton
                    text="UPDATE"
                    teal
                    onPress={this.save}
                  />
                </View>
              </Card>
            </ScrollView>
          </SafeScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgGray,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 100,
    height: 50,
    alignItems: 'center',
    paddingHorizontal: 10,
    fontSize: 18,
    fontFamily: 'nunito',
    marginVertical: 5,
    flex: 1
  },
  label: {
    marginLeft: 10
  },
  error: {
    backgroundColor: '#f8d7da',
    padding: 10,
    borderWidth: 0.5,
    borderColor: '#f5c6cb',
    borderRadius: 10,
    marginVertical: 10
  }
});

export default EditCategory;
