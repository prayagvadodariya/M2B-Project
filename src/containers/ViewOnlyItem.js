import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, TextInput, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';
import Loader from '../components/Loader';
import getUserId from '../actions/getUserId';
import presentError from '../components/presentError';
import Api from '../../config/Api';
import Colors from '../../config/Colors';
import MText from '../components/MText';
import Card from '../components/Card';
import CardBody from '../components/CardBody';
import CardHeader from '../components/CardHeader';
import MButton from '../components/MButton';
import InputBox from '../components/InputBox';
import MDropDown from '../components/MDropDown';
import ToggleInputBox from '../components/ToggleInputBox';
import ViewOnlyTag from '../components/ViewOnlyTag';
import StatusBadge from '../components/StatusBadge';
import ActionButton from '../components/ActionButton';

class ViewOnlyItem extends Component {
  selectedCategory = null;

  itemId = '';

  constructor(props) {
    super(props);
    this.state = {
      display: false,

      itemName: '',
      selectedPictures: [],
      sku: '',

      selectedCategory: null,
      categories: [],

      colors: [],
      sizes: [],
      variants: [],

      selectedShipDate: null,
      description: '',

      isAvailable: this.props.isAvailable,
      selectedLocation: '',

      isLoading: false,
      selectedWeightUnit: '',
      weight: '',
      barcode: '',
      tags: []
    };
  }

  componentDidMount = () => {
    this.fetchCategories();
    if (this.state.isAvailable) {
      const { item } = this.props;
      console.log(item);
      this.setState({
        itemName: item.name || '',
        selectedPictures: item.pictures || [],
        sku: item.sku || '',
        colors: JSON.parse(item.colors) || [],
        sizes: JSON.parse(item.sizes) || [],
        tags: item.tags || [],
        description: item.description || '',
        selectedShipDate: (item.expected_date !== null) ? new Date(item.expected_date) : null,
        variants: item.variations || [],
        barcode: item.barcode,
        selectedWeightUnit: item.weight_unit,
        weight: item.weight
      });
    }
  }

  componentWillReceiveProps = (props) => {
    if (props.display === true) {
      this.setState({ isLoading: true });
      setTimeout(() => {
        this.setState({ display: props.display, isLoading: false });
      }, 50);
    } else {
      this.setState({ display: props.display });
    }
  }

  fetchCategories = async () => {
    const userId = await getUserId();
    axios.get(`${Api.url}/${userId}/category`, { headers: Api.headers }).then((response) => {
      if (response.data.status === 'success') {
        this.setState({
          categories: response.data.categories
        }, () => {
          if (!this.state.isAvailable) {
            this.setState({
              sizes: JSON.parse(response.data.categories[0].sizes),
              selectedCategory: this.state.categories[0]
            });
          } else {
            const { item } = this.props;
            const temp = this.state.categories.filter((e) => e.id === item.category_id);
            if (temp.length > 0) {
              this.setState({
                selectedCategory: temp[0]
              });
            } else {
              this.setState({
                sizes: JSON.parse(response.data.categories[0].sizes),
                selectedCategory: this.state.categories[0]
              });
            }
          }
        })
      }
    }).catch((error) => {
      presentError("fetchCategories", error.message);
    });
  }

  getCurrencyFormat = (num) => {
    return `${num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
  }

  getUnitFormat = (num) => {
    return `${num.replace(/,/g, '').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
  }


  render() {
    return (
      <Card style={{ marginHorizontal: 15, marginTop: 10, marginBottom: 10 }}>
        <CardHeader style={(this.state.display) ? { height: 130 } : { height: 130, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap:'wrap', margin:10 }}>
            <MButton
              text={` ${(this.state.itemName ? this.state.itemName : 'Item')} - ${this.state.sku}`}
              darkBlue
              iconLeft={(
                <Icon name={(this.state.display) ? "minus" : "plus"} color="#fff" />
              )}
              onPress={() => this.props.onPress()}
            />
            <ActionButton color={Colors.pink} iconColor="#fff" icon="edit" />
            <MButton
              text="CLOSE ITEM?"
              darkBlue
              textSize={14}
            />
            <MButton
              text="RECEIVED?"
              gray
              textSize={14}
            />
            <ActionButton color={Colors.danger} iconColor="#fff" icon="ban" />
          </View>
        </CardHeader>

        <Loader loading={this.state.isLoading} />

        {
          this.state.display && (

            <CardBody
              style={{ padding: 10, borderTopLeftRadius: 0, borderTopRightRadius: 0, borderTopWidth: 1, borderTopColor: Colors.border }}
            >

              {/* -------------- Form start Here --------------- */}
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MText style={styles.label} size={18}>
                  Picture
								</MText>
              </View>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                {
                  this.state.selectedPictures.map((image, index) => (
                    <View
                      style={{
                        flex: 0.33,
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignSelf: 'center',
                        marginHorizontal: 10,
                        marginVertical: 30,
                      }}
                      key={index.toString()}
                    >
                      <Image
                        source={{ uri: image }}
                        style={{ borderWidth: 2, borderColor: Colors.border, height: 100, width: '100%' }}
                      />
                    </View>
                  ))
                }
              </View>

              <InputBox
                labelNormal
                label="Item Name"
                value={this.state.itemName}
                editable={false}
                style={{ backgroundColor: '#e9ecef' }}
              />

              <InputBox
                labelNormal
                label="Sku"
                value={this.state.sku}
                require
                editable={false}
                style={{ backgroundColor: '#e9ecef' }}
              />

              <MDropDown
                label="Category"
                placeholder="Select Category"
                selectedItem={this.state.selectedCategory}
                disabled={true}
                touchableStyle={{ backgroundColor: '#e9ecef' }}
              />

              <View style={{ marginVertical: 10, marginLeft: 20, justifyContent: 'center' }}>
                <MText size={18}>Sizes</MText>
              </View>
              <ViewOnlyTag
                tags={this.state.sizes}
              />

              <View style={{ marginVertical: 10, marginLeft: 20, justifyContent: 'center' }}>
                <MText size={18}>Colors</MText>
              </View>
              <ViewOnlyTag
                tags={this.state.colors}
              />


              {/* ----------------- Table start here ------------ */}

              <ScrollView horizontal={true} style={styles.tableContainer}>
                <View>

                  <View style={styles.tableHeader}>
                    <View style={styles.colFirst}>
                      <MText bold size={18}>Variant</MText>
                    </View>
                    <View style={styles.col}>
                      <MText bold size={18}>Quantity</MText>
                    </View>
                    <View style={styles.col}>
                      <MText bold size={18}>Cost</MText>
                    </View>
                    <View style={styles.col}>
                      <MText bold size={18}>Price</MText>
                    </View>
                    <View style={styles.col}>
                      <MText bold size={18}>Received</MText>
                    </View>
                    <View style={styles.col}>
                      <MText bold size={18}>Extra Received</MText>
                    </View>
                    <View style={styles.col}>
                      <MText bold size={18}>Total Received</MText>
                    </View>
                  </View>

                  <View style={styles.tableBody}>
                    {
                      this.state.variants.map((item, index) => (
                        <View style={styles.tableRow} key={index.toString()}>
                          <View style={styles.colFirst}>
                            <MText size={18}>{item.size}{(item.color) ? " - " : ""}{item.color}</MText>
                          </View>
                          <View style={styles.col}>
                            <TextInput
                              style={styles.tableInput}
                              value={String(item.quantity) || 0}
                              editable={false}
                            />
                          </View>
                          <View style={styles.col}>
                            <TextInput
                              style={styles.tableInput}
                              value={String(this.getCurrencyFormat(parseFloat(item.variant_price, 10)) || 0)}
                              editable={false}
                            />
                          </View>
                          <View style={styles.col}>
                            <TextInput
                              style={styles.tableInput}
                              value={String(this.getCurrencyFormat(parseFloat(item.markup_price, 10)) || 0)}
                              editable={false}
                            />
                          </View>
                          <View style={styles.col}>
                            {
                              // eslint-disable-next-line no-nested-ternary
                              (item.received_quantity == null || parseInt(item.received_quantity, 0) === 0) ? (
                                <StatusBadge pink>PENDING</StatusBadge>
                              ) : (
                                  (item.quantity !== item.received_quantity) ? (
                                    <StatusBadge warning fontColor="#000">{`${item.received_quantity} RECEIVED`}</StatusBadge>
                                  ) : (
                                      <StatusBadge primary>{`${item.received_quantity} RECEIVED`}</StatusBadge>
                                    )
                                )
                            }
                          </View>
                          <View style={styles.col}>
                            {
                              (item.extra_quantity == null || parseInt(item.extra_quantity, 0) === 0) ? (
                                <MText>-</MText>
                              ) : (
                                  <StatusBadge warning fontColor="#000">{`${item.extra_quantity} RECEIVED`}</StatusBadge>
                                )
                            }
                          </View>
                          <View style={styles.col}>
                            {
                              // eslint-disable-next-line no-nested-ternary
                              (item.received_quantity !== null && item.extra_quantity !== null)
                                ? ((parseInt(item.received_quantity, 0) + parseInt(item.extra_quantity, 0)) === 0) ? (
                                  <StatusBadge pink>PENDING</StatusBadge>
                                ) : (
                                    <StatusBadge primary>{`${parseInt(item.received_quantity, 0) + parseInt(item.extra_quantity, 0)} RECEIVED`}</StatusBadge>
                                  ) : (
                                  <StatusBadge pink>PENDING</StatusBadge>
                                )
                            }
                          </View>
                        </View>
                      ))
                    }
                  </View>

                </View>
              </ScrollView>

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
                    borderBottomRightRadius: 0,
                    backgroundColor: '#e9ecef'
                  }}>
                    <RNPickerSelect
                      disabled={true}
                      style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5, backgroundColor: '#e9ecef' }}
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
                    value={this.state.weight || parseFloat(0).toFixed(2)}
                    editable={false}
                    onChangeText={(weight) => this.setState({ weight })}
                    onEndEditing={(e) => {
                      if (e.nativeEvent.text) {
                        this.setState({ weight: parseFloat(e.nativeEvent.text).toFixed(2) })
                      }
                    }}
                    style={[styles.textInput, { flex: 1, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }]}
                  />
                </View>
              </View>

              <View style={{ marginVertical: 10, marginLeft: 20, justifyContent: 'center' }}>
                <MText size={18}>Tags</MText>
              </View>
              <ViewOnlyTag
                tags={this.state.tags}
              />

              <InputBox
                labelNormal
                label="Barcode"
                editable={false}
                style={{ backgroundColor: '#e9ecef' }}
                value={this.state.barcode}
                onChangeText={(barcode) => this.setState({ barcode })}
              />

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MText style={styles.label} size={18}>
                  Expected Ship Date
                </MText>
              </View>
              <View style={styles.selectBox}>
                <MText size={18}>{(this.state.selectedShipDate === null) ? 'Select Date' : this.state.selectedShipDate.toLocaleDateString()}</MText>
              </View>

              <MDropDown
                label="Location"
                placeholder="Select Location"
                selectedItem={this.state.selectedLocation}
                disabled={true}
                touchableStyle={{ backgroundColor: '#e9ecef' }}
              />

              <ToggleInputBox
                label="Description"
                value={this.state.description}
                disabled={true}
              />

            </CardBody>
          )
        }
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgGray,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  label: {
    marginLeft: 20,
    marginVertical: 5,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 10
  },
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tableBody: {
    padding: 10
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10
  },
  tableInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 50,
    width: 100,
    height: 50,
    marginHorizontal: 10,
    backgroundColor: '#e9ecef'
  },
  colFirst: {
    width: 150,
  },
  col: {
    width: 100,
    alignItems: 'center',
    marginHorizontal: 5
  },
  searchResult: {
    position: 'absolute',
    zIndex: 2,
    backgroundColor: '#fff',
    top: 110,
    left: 10,
    right: 10
  },
  searchResultMT: {
    position: 'absolute',
    backgroundColor: '#fff',
    top: 190,
    left: 10,
    right: 10
  },
  searchResultCat: {
    position: 'absolute',
    backgroundColor: '#fff',
    top: 380,
    left: 10,
    right: 10
  },
  sizesContainer: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    flexDirection: 'row',
    padding: 5,
    flexWrap: 'wrap'
  },
  sizesLabel: {
    marginLeft: 20,
    marginVertical: 5
  },
  sizesInput: {
    borderWidth: 0,
    flex: 1,
    justifyContent: 'center',
    height: 30,
    margin: 5,
    minWidth: 100
  },
  selectBox: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.disabled,
    borderColor: Colors.border,
    borderWidth: 1,
  },
  tagContainer: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    minHeight: 50,
  },
  tag: {
    height: 30,
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 5,
    padding: 5,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: Colors.bgGray
  },
  textInput: {
    backgroundColor: '#e9ecef',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 50,
    fontFamily: 'nunito',
    height: 50,
    paddingVertical: 5,
    paddingHorizontal: 20,
    fontSize: 18
  },
});

export default ViewOnlyItem;
