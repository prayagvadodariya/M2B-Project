import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import ImagePicker from 'react-native-image-picker';
import DateTimePicker from "react-native-modal-datetime-picker";
import HeaderMenuButton from '../components/HeaderMenuButton';
import HeaderSearchButton from '../components/HeaderSearchButton';
import SafeScrollView from '../components/SafeScrollView';
import InputBox from '../components/InputBox';
import Colors from '../../config/Colors';
import MButton from '../components/MButton';
import MText from '../components/MText';
import SearchableSelect from '../components/SearchableSelect';
import Card from '../components/Card';
import CardHeader from '../components/CardHeader';
import CardBody from '../components/CardBody';
import Badge from '../components/Badge';
import CardItem from '../components/CardItem';
import presentError from '../components/presentError';
import MDropDown from '../components/MDropDown';
import DeleteButton from '../components/DeleteButton';
import TrashButton from '../components/TrashButton';
import Api from '../../config/Api';
import getUserId from '../actions/getUserId';
import MTag from '../components/MTag';
import Loader from '../components/Loader';

const FormError = (props) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: -10 }}>
      <MText style={styles.label} size={16} pink>{props.children}</MText>
    </View>
  )
}

class EditOrder extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: 'Edit Order',
    headerLeft: (
      <HeaderMenuButton onPress={() => navigation.toggleDrawer()} />
    ),
    headerRight: (
      // eslint-disable-next-line no-alert
      // eslint-disable-next-line no-undef
      <HeaderSearchButton onPress={() => alert("search")} />
    )
  })

  constructor(props) {
    super(props);
    this.state = {

      displayVendorList: false,
      selectedItem: '',

      displayDatePicker: false,
      selectedDate: null,

      locations: ["Location 1", "Location 2", "Location 3", "Location 4", "Location 5"],

      orderNumber: null,
      boothNumber: null,
      notes: null,

      isFetchingCategories: false,
      categories: [],
      isFetchingCategoriesError: false,
      fetchingCategoriesError: '',

      isFetchingEvents: false,
      events: [],
      isFetchingEventsError: false,
      fetchingEventsError: '',
      selectedEvent: null,

      // Items 
      itemName: '',
      selectedPicture: '',
      selectedPictureName: null,
      selectedPictureError: null,
      sku: '',
      selectedCategory: null,
      colors: [],
      sizes: [],
      defaultQuantity: 0,
      defaultPrice: 0,
      defaultCost: 0,
      variants: [],
      displayItemDatePicker: false,
      selectedItemDate: null,
      description: '',

      isSavingItem: false,

      isItemFromMarketTrip: false
    };

  }

  componentDidMount = () => {
    this.fetchOrder();
    this.fetchCategories();
    this.fetchEvents();
  }

  fetchOrder = async () => {
    const userId = await getUserId();
    const orderId = this.props.navigation.getParam("orderId");
    axios.get(`${Api.url}/${userId}/order/get/${orderId}`, { headers: Api.headers }).then((response) => {
      if (response.data.status === 'success') {
        this.setState({
          selectedItem: response.data.order.vendor,
          selectedDate: new Date(response.data.order.expected_date),
          boothNumber: response.data.order.booth_no,
          orderNumber: response.data.order.order_number,
          notes: response.data.order.notes,
          selectedEvent: response.data.order.event
        });
      } else {
        presentError("fetchOrder", response.data.message);
      }
    }).catch((error) => {
      presentError("fetchOrder", error.message);
    });
  }

  hideDateTimePicker = () => {
    this.setState({ displayDatePicker: false, displayItemDatePicker: false });
  };

  handleDatePicked = date => {
    this.setState({
      selectedDate: date
    })
    this.hideDateTimePicker();
  };

  handleItemDatePicked = date => {
    this.setState({
      selectedItemDate: date
    })
    this.hideDateTimePicker();
  };

  chooseFile = async () => {
    const options = {
      title: 'Select Picture',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      noData: true
    };
    ImagePicker.showImagePicker(options, (response) => {
      console.log(response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else if (((response.fileSize) / 1024) < 500) {
        const source = { uri: response.uri };
        // const source = { uri: `data:image/jpeg;base64,${response.data}` };
        console.log("Source : ", source);
        this.setState({
          selectedPictureName: response.fileName,
          selectedPicture: source
        });
      } else {
        this.setState({
          selectedPictureError: 'Maximum file size is 500KB'
        });
      }
    });
  }

  fetchCategories = async () => {
    this.setState({
      isFetchingCategories: true
    });
    const userId = await getUserId();
    axios.get(`${Api.url}/${userId}/category`, { headers: Api.headers }).then((response) => {
      if (response.data.status === 'success') {
        this.setState({
          categories: response.data.categories,
          sizes: JSON.parse(response.data.categories[0].sizes),
          isFetchingCategories: false
        }, () => this.handleVariantChanges())
      } else {
        this.setState({
          isFetchingCategoriesError: true,
          fetchingCategoriesError: response.data.message,
          isFetchingCategories: false
        })
      }
    }).catch((error) => {
      presentError("fetchCategories", error.message);
    });
  }

  fetchEvents = async () => {
    this.setState({
      isFetchingEvents: true
    });
    const userId = await getUserId();
    axios.get(`${Api.url}/${userId}/events`, { headers: Api.headers }).then((response) => {
      this.setState({
        isFetchingEvents: false
      })
      if (response.data.status === 'success') {
        this.setState({
          events: response.data.events.data
        })
      } else {
        this.setState({
          isFetchingEventsError: true,
          fetchingEventsError: response.data.message
        })
      }
    }).catch((error) => {
      presentError("fetchEvents", error.message);
    });
  }

  handleOnSizesChanges = (tags) => {
    this.setState({
      sizes: tags.filter((tag) => tag !== "" && tag !== " ")
    }, () => this.handleVariantChanges());
  }

  handleOnColorsChanges = (tags) => {
    this.setState({
      colors: tags.filter((tag) => tag !== "" && tag !== " ")
    }, () => this.handleVariantChanges());
  }

  handleCategoryChanges = (selectedCategory) => {
    this.setState({ selectedCategory });
    this.setState({
      sizes: JSON.parse(selectedCategory.sizes)
    }, () => {
      this.handleVariantChanges();
    });
  }

  handleVariantChanges = () => {
    this.setState({
      variants: [],
      defaultQuantity: 0,
      defaultCost: 0,
      defaultPrice: 0
    });
    if (this.state.colors.length > 0) {
      if (this.state.sizes.length > 0) {
        for (let i = 0; i < this.state.colors.length; i++) {
          for (let j = 0; j < this.state.sizes.length; j++) {
            this.setState((prevState) => ({
              variants: [
                ...prevState.variants,
                {
                  variant: `${this.state.sizes[j]} - ${this.state.colors[i]}`,
                  size: this.state.sizes[j],
                  color: this.state.colors[i],
                  quantity: 0,
                  variant_price: 0,
                  markup: 0
                }
              ]
            }));
          }
        }
      } else {
        for (let i = 0; i < this.state.colors.length; i++) {
          this.setState((prevState) => ({
            variants: [
              ...prevState.variants,
              {
                variant: `${this.state.colors[i]}`,
                size: null,
                color: this.state.colors[i],
                quantity: 0,
                variant_price: 0,
                markup: 0
              }
            ]
          }));
        }
      }
    } else {
      for (let j = 0; j < this.state.sizes.length; j++) {
        this.setState((prevState) => ({
          variants: [
            ...prevState.variants,
            {
              variant: this.state.sizes[j],
              size: this.state.sizes[j],
              color: null,
              quantity: 0,
              variant_price: 0,
              markup: 0
            }
          ]
        }));
      }
    }
  }

  renderTotal = () => {
    let { variants } = this.state;
    let total = 0;
    variants.forEach(element => {
      total += (element.quantity * element.variant_price);
    });
    return (
      <MText bold size={18} style={{ alignSelf: 'flex-start' }}>
        TOTAL : ${total}
      </MText>
    )
  }

  getFormattedDate = (date) => {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  }

  saveItem = async () => {
    this.setState({
      isSavingItem: true
    });

    // eslint-disable-next-line no-undef
    const data = new FormData();
    data.append("name", this.state.itemName);
    data.append("location_id", '');
    data.append("sku", this.state.sku);
    data.append("category", this.state.selectedCategory.id);
    data.append("colors", JSON.stringify(this.state.colors));
    data.append("sizes", JSON.stringify(this.state.sizes));
    data.append("price", this.state.defaultPrice);
    data.append("description", this.state.description);
    data.append("expected_date", this.getFormattedDate(new Date(this.state.selectedDate)));
    data.append("variants", JSON.stringify(this.state.variants));
    data.append("pictures", { uri: this.state.selectedPicture.uri, name: this.state.selectedPictureName, type: 'image/*' });

    const userId = await getUserId();
    const orderId = this.props.navigation.getParam("orderId");
    const headers = {
      'Content-Type': 'multipart/form-data',
      'Authorization': Api.token
    }
    axios.post(`${Api.url}/${userId}/order/${orderId}/item`, data, { headers }).then((response) => {
      this.setState({
        isSavingItem: false
      })
    }).catch((error) => {
      this.setState({
        isSavingItem: false
      })
      presentError("saveItem", error.message);
    });

  }

  render() {
    return (
      <SafeScrollView style={{ flex: 1, backgroundColor: Colors.bgGray }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}
          keyboardDismissMode={'on-drag'}
        >
          <Loader loading={this.state.isSavingItem} />
          <Card style={{ backgroundColor: '#fff', padding: 10 }}>

            {/* -------- Select Vendor  ------------ */}
            <View style={{ marginVertical: 5 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MText style={styles.label} bold size={18}> Select Vendor </MText>
                <MText bold size={20} pink>*</MText>
              </View>
              <TouchableOpacity
                style={styles.selectBox}
                activeOpacity={1.0}
                onPress={() => {
                  this.setState(prevState => ({
                    displayDatePicker: false,
                    displayVendorList: !prevState.displayVendorList
                  }));
                }}
              >
                <MText size={18}>{(this.state.selectedItem === '') ? 'Select Vendor' : this.state.selectedItem.name}</MText>
                <Icon name="caret-down" />
              </TouchableOpacity>
            </View>
            {
              this.state.displayVendorList
              && (
                <View style={styles.searchResult}>
                  <SearchableSelect
                    onItemSelect={(item) => {
                      this.setState({
                        selectedItem: item,
                        displayVendorList: false
                      })
                    }}
                  />
                </View>
              )
            }
            {/* --------------- select vendor ends --------------- */}

            <MDropDown
              label="Add To Market Trip"
              labelBold={true}
              required
              placeholder="Select Market Trip"
              data={this.state.events}
              searchable={true}
              onSelectItem={(selectedEvent) => {
                this.setState({ selectedEvent })
              }}
              selectedItem={this.state.selectedEvent}
              isLoading={this.state.isFetchingEvents}
              isError={this.state.isFetchingEventsError}
              error={this.state.fetchingEventsError}
            />

            <InputBox
              value={this.state.orderNumber}
              label="Purchase Order Number"
              placeholder="Type Here"
              returnKeyType={"next"}
              onChangeText={(orderNumber) => this.setState({ orderNumber })}
            />

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MText style={styles.label} bold size={18}>
                Expected Ship Date
							</MText>
            </View>
            <TouchableOpacity
              style={styles.selectBox}
              activeOpacity={1.0}
              onPress={() => {
                this.setState(prevState => ({
                  displayVendorList: false,
                  displayDatePicker: !prevState.displayDatePicker
                }));
              }}
            >
              <MText size={18}>{(this.state.selectedDate === null) ? 'Select Date' : this.state.selectedDate.toLocaleDateString()}</MText>
            </TouchableOpacity>
            <DateTimePicker
              isVisible={this.state.displayDatePicker}
              onConfirm={this.handleDatePicked}
              onCancel={this.hideDateTimePicker}
            />

            <InputBox
              value={this.state.boothNumber}
              label="Booth No"
              placeholder="Type Here"
              onChangeText={(boothNumber) => this.setState({ boothNumber })}
            />

            <MButton
              text=" Notes"
              iconLeft={(
                <Icon name="plus" color={Colors.blue} />
              )}
              textColor={Colors.blue}
              style={{ backgroundColor: "transparent", paddingHorizontal: 20 }}
            />
            <TextInput
              value={this.state.notes}
              style={{ borderRadius: 50, height: 50, borderColor: Colors.border, borderWidth: 1, fontSize: 16, paddingLeft: 20 }}
              onChangeText={(notes) => this.setState({ notes })}
            />


            {/* ---------------- Item start here ----------------- */}

            <Card style={{ marginVertical: 20 }}>
              <CardHeader style={{ height: 70 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MButton
                    text={` ITEM - ${this.state.itemName}`}
                    darkBlue
                    iconLeft={(
                      <Icon name="plus" color="#fff" />
                    )}
                  />
                  <Badge color={Colors.yellow} style={{ marginHorizontal: 5, height: 30 }}>UNSAVED</Badge>
                </View>
                <DeleteButton />
              </CardHeader>
              <CardBody style={{ padding: 10, borderTopWidth: 1, borderTopColor: Colors.border }}>

                {/* -------------- Form start Here --------------- */}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MText style={styles.label} size={18}>
                    Picture
									</MText>
                </View>
                <TouchableOpacity
                  style={{ height: 50, borderWidth: 1, borderRadius: 50, justifyContent: 'center', paddingLeft: 20, borderColor: Colors.border }}
                  onPress={() => this.chooseFile()}
                >
                  <MText size={18}>{this.state.selectedPictureName || "Choose File"}</MText>
                </TouchableOpacity>
                {
                  this.state.selectedPictureError && (
                    <FormError>{this.state.selectedPictureError}</FormError>
                  )
                }

                <InputBox
                  labelNormal
                  label="Item Name"
                  value={this.state.itemName}
                  onChangeText={(itemName) => this.setState({ itemName })}
                />
                <InputBox
                  labelNormal
                  label="Sku"
                  value={this.state.sku}
                  onChangeText={(sku) => this.setState({ sku })}
                  require
                />

                <MDropDown
                  label="Category"
                  placeholder="Select Category"
                  data={this.state.categories}
                  selectedItem={this.state.categories[0]}
                  onSelectItem={(selectedCategory) => this.handleCategoryChanges(selectedCategory)}
                  searchable={true}
                  isLoading={this.state.isFetchingCategories}
                  isError={this.state.isFetchingCategoriesError}
                  error={this.state.fetchingCategoriesError}
                />

                <View style={{ marginVertical: 10, marginLeft: 20, justifyContent: 'center' }}>
                  <MText size={18}>Sizes</MText>
                </View>
                <MTag
                  initialTags={this.state.sizes}
                  placeholder="Select Size"
                  handleChanges={this.handleOnSizesChanges}
                />

                <View style={{ marginVertical: 10, marginLeft: 20, justifyContent: 'center' }}>
                  <MText size={18}>Colors</MText>
                </View>
                <MTag
                  initialTags={this.state.colors}
                  placeholder="Select Color"
                  handleChanges={this.handleOnColorsChanges}
                />

                <InputBox
                  label="Default Quantity"
                  labelNormal
                  value={this.state.defaultQuantity}
                  onChangeText={(defaultQuantity) => this.setState({ defaultQuantity })}
                  onEndEditing={(e) => {
                    const { variants } = this.state;
                    for (let i = 0; i < variants.length; i++) {
                      variants[i].quantity = e.nativeEvent.text;
                    }
                    this.setState({ variants });
                  }}
                />

                <InputBox
                  label="Default Cost"
                  labelNormal
                  value={this.state.defaultCost}
                  onChangeText={(defaultCost) => this.setState({ defaultCost })}
                  onEndEditing={(e) => {
                    const { variants } = this.state;
                    for (let i = 0; i < variants.length; i++) {
                      variants[i].variant_price = e.nativeEvent.text;
                    }
                    this.setState({ variants });
                    this.setState({
                      defaultPrice: 10
                    })
                  }}
                />

                <InputBox
                  label="Default Price"
                  labelNormal
                  value={this.state.defaultPrice}
                  onChangeText={(defaultPrice) => this.setState({ defaultPrice })}
                  onEndEditing={(e) => {
                    const { variants } = this.state;
                    for (let i = 0; i < variants.length; i++) {
                      variants[i].markup = e.nativeEvent.text;
                    }
                    this.setState({ variants });
                  }}
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
                    </View>
                    <View style={styles.tableBody}>

                      {
                        this.state.variants.map((item, index) => (
                          <View style={styles.tableRow} key={index.toString()}>
                            <View style={styles.colFirst}>
                              <MText size={18}>{item.variant}</MText>
                            </View>
                            <View style={styles.col}>
                              <TextInput
                                style={styles.tableInput}
                                value={item.quantity.toString()}
                                onChangeText={(quantity) => {
                                  let { variants } = this.state;
                                  variants[index].quantity = quantity;
                                  this.setState({ variants });
                                }}
                              />
                            </View>
                            <View style={styles.col}>
                              <TextInput
                                style={styles.tableInput}
                                value={item.variant_price.toString()}
                                // eslint-disable-next-line camelcase
                                onChangeText={(variant_price) => {
                                  let { variants } = this.state;
                                  // eslint-disable-next-line camelcase
                                  variants[index].variant_price = variant_price;
                                  this.setState({ variants });
                                }}
                              />
                            </View>
                            <View style={styles.col}>
                              <TextInput
                                style={styles.tableInput}
                                value={item.markup.toString()}
                                onChangeText={(markup) => {
                                  let { variants } = this.state;
                                  variants[index].markup = markup;
                                  this.setState({ variants });
                                }}
                              />
                            </View>
                            <TrashButton
                              onPress={() => {
                                Alert.alert(
                                  "Confirm",
                                  "Are you sure you want to delete this Variant?",
                                  [
                                    {
                                      text: 'Cancel',
                                      onPress: () => { }
                                    },
                                    {
                                      text: 'OK',
                                      onPress: () => {
                                        let { variants } = this.state;
                                        variants.splice(index, 1);
                                        this.setState({ variants });
                                      }
                                    }
                                  ]
                                )
                              }}
                            />
                          </View>
                        ))
                      }

                    </View>
                  </View>
                </ScrollView>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MText style={styles.label} size={18}>
                    Expected Ship Date
									</MText>
                </View>
                <TouchableOpacity
                  style={styles.selectBox}
                  activeOpacity={1.0}
                  onPress={() => {
                    this.setState(prevState => ({
                      displayItemDatePicker: !prevState.displayItemDatePicker
                    }));
                  }}
                >
                  <MText size={18}>{(this.state.selectedItemDate === null) ? 'Select' : this.state.selectedItemDate.toLocaleDateString()}</MText>
                </TouchableOpacity>
                <DateTimePicker
                  isVisible={this.state.displayItemDatePicker}
                  onConfirm={this.handleItemDatePicked}
                  onCancel={this.hideDateTimePicker}
                />

                <MDropDown
                  label="Location"
                  placeholder="Select Location"
                  data={this.state.locations}
                  searchable={true}
                  onSelectItem={(item) => { }}
                />

                <MButton
                  text=" Description"
                  iconLeft={(
                    <Icon name="plus" color={Colors.blue} />
                  )}
                  textColor={Colors.blue}
                  style={{ backgroundColor: "transparent", paddingHorizontal: 20 }}
                />
                <TextInput
                  style={{ borderRadius: 50, height: 50, borderColor: Colors.border, borderWidth: 1 }}
                />

                <MButton
                  text="SAVE"
                  pink
                  style={{ marginTop: 20, alignSelf: 'flex-start' }}
                  onPress={this.saveItem}
                />

                <MButton
                  text="SAVE & ADD NEW ITEM"
                  teal
                  style={{ marginVertical: 5, alignSelf: 'flex-start' }}
                />

              </CardBody>

            </Card>

            <MButton
              text="ADD ADITIONAL ITEM TO ORDER"
              style={{ margin: 10, zIndex: -1 }}
            />

            <CardItem>
              <View style={{ alignItems: 'center', flex: 1 }}>
                {this.renderTotal()}
                <MButton
                  text="UPDATE AS DRAFT"
                  teal
                  style={{ marginVertical: 5 }}
                />
                <MButton
                  text=" DUPLICATE ORDER"
                  blue
                  iconLeft={(
                    <Icon name="clone" color="#fff" size={18} />
                  )}
                  style={{ marginVertical: 5 }}
                />
              </View>
            </CardItem>
          </Card>
        </ScrollView>
      </SafeScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
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
    marginVertical: 10
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
    marginHorizontal: 10
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
    // zIndex: 200,
    backgroundColor: '#fff',
    top: 190,
    left: 10,
    right: 10
  },
  searchResultCat: {
    position: 'absolute',
    // zIndex: 200,
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
    backgroundColor: '#ffffff',
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
  }
});

export default EditOrder;
