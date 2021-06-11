import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Alert, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import HeaderMenuButton from '../components/HeaderMenuButton';
import HeaderSearchButton from '../components/HeaderSearchButton';
import SafeScrollView from '../components/SafeScrollView';
import Colors from '../../config/Colors';
import MButton from '../components/MButton';
import MText from '../components/MText';
import Card from '../components/Card';
import CardItem from '../components/CardItem';
import presentError from '../components/presentError';
import Api from '../../config/Api';
import getUserId from '../actions/getUserId';
import Loader from '../components/Loader';
import ViewOnlyItem from './ViewOnlyItem';
import ToggleInputBox from '../components/ToggleInputBox';
import StatusBadge from '../components/StatusBadge';
import CardBody from '../components/CardBody';
import showToast from '../components/showToast';
import ActionButton from '../components/ActionButton';

class ViewOrder extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Order Detail',
    headerLeft: (
      <HeaderMenuButton onPress={() => navigation.toggleDrawer()} />
    ),
    headerRight: (
      <HeaderSearchButton onPress={() => navigation.navigate("Search")} />
    )
  })

  event = null;

  constructor(props) {
    super(props);
    this.state = {
      selectedItem: null,
      selectedDate: null,
      orderNumber: null,
      boothNumber: null,
      notes: null,
      selectedEvent: null,
      items: [],
      itemTotals: [],

      variants: [],
      openedItem: null,
      isLoading: false,

      totalPrice: 0,
      status: ''
    };

    this.event = this.props.navigation.getParam("event");
  }

  componentDidMount = () => {
    this.fetchOrder();
  }

  getCurrencyFormat = (num) => {
    return `${num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
  }

  getUnitFormat = (num) => {
    return `${num.replace(/,/g, '').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
  }

  fetchOrder = async () => {
    this.setState({ isLoading: true });
    const userId = await getUserId();
    const orderId = this.props.navigation.getParam("orderId");
    axios.get(`${Api.url}/${userId}/order/get/${orderId}`, { headers: Api.headers }).then((response) => {
      if (response.data.status === 'success') {
        this.setState({
          selectedItem: response.data.order.vendor,
          selectedDate: response.data.order.order_placed,
          boothNumber: response.data.order.booth_no,
          orderNumber: response.data.order.order_number,
          notes: response.data.order.notes,
          selectedEvent: response.data.order.event,
          items: response.data.items,
          totalPrice: response.data.order.total_price,
          status: response.data.order.status
        }, async () => {
          if (this.state.items.length === 0) {
            await this.addNewItem();
            const variants = [];
            this.state.items.forEach((item) => {
              variants.push(item.variations);
            });
            this.setState({ variants }, () => {
              this.setState({ isLoading: false });
            });
          } else {
            const variants = [];
            this.state.items.forEach((item) => {
              variants.push(item.variations);
            });
            this.setState({ variants }, () => {
              this.setState({ isLoading: false });
            });
          }
        });
      } else {
        this.showError(response.data.message[0]);
      }
    }).catch((error) => {
      this.showError(error.message);
    });
  }

  handleDatePicked = date => {
    this.setState({
      selectedDate: date
    })
    this.hideDateTimePicker();
  };

  totalChanges = (total, index) => {
    let { itemTotals } = this.state;
    itemTotals[0] = total;
    this.setState({ itemTotals });
  }

  renderTotal = () => {
    const { variants } = this.state;
    let total = 0;
    variants.forEach(element1 => {
      element1.forEach((element) => {
        total += (element.quantity * parseFloat(element.variant_price.toString().replace(/,/g, ''), 10));
      });
    });
    return (
      <MText bold size={18} style={{ alignSelf: 'flex-start' }}>
        TOTAL : ${this.getCurrencyFormat(total)}
      </MText>
    );
  }

  getFormattedDate = (date) => {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  }

  addNewItem = async () => {
    const { items } = this.state;
    items.push({
      id: Math.random(),
      name: '',
      pictures: null,
      sku: '',
      colors: '[]',
      sizes: '[]',
      description: '',
      expected_date: null,
      variations: [],
      isNew: true
    });
    await this.setState({ items });
  }

  toggleItem = (index) => {
    if (this.state.openedItem === index) {
      this.setState({
        openedItem: null
      });
    } else {
      this.setState({
        openedItem: index
      });
    }
  }

  onCopyItem = (orderId, itemId, index) => {

  }

  copyItem = (orderId, itemId, index) => {

  }

  showError = (error) => {
    this.setState({ isLoading: false }, () => {
      setTimeout(() => {
        presentError(error);
      }, 200);
    });
  }

  onDeleteItem = (orderId, itemId, index, isNew) => {
    Alert.alert(
      'Remove',
      'Are you sure you want to remove this item?',
      [
        {
          text: 'Cancel'
        },
        {
          text: 'Ok',
          onPress: () => this.deleteItem(orderId, itemId, index, isNew)
        }
      ]
    )
  }

  deleteItem = async (orderId, itemId, deletedIndex, isNew) => {
    if (isNew) {
      this.setState({
        items: this.state.items.filter((_, i) => i !== deletedIndex),
        variants: this.state.variants.filter((_, i) => i !== deletedIndex)
      });
      showToast("Item removed successfully");
    } else {
      this.setState({ isLoading: true });
      const userId = await getUserId();
      axios.post(`${Api.url}/${userId}/order/${orderId}/item/${itemId}/delete`, {}, { headers: Api.headers }).then((response) => {
        if (response.data.status === 'success') {
          this.setState({
            items: this.state.items.filter((_, i) => i !== deletedIndex),
            variants: this.state.variants.filter((_, i) => i !== deletedIndex)
          });
          this.setState({ isLoading: false })
          showToast("Item removed successfully");
        } else {
          this.showError(response.data.message[0]);
        }
      }).catch((error) => {
        this.showError(error.message);
      });
    }
  }

  handleVariantChanges = (itemVariants, index) => {
    const { variants } = this.state;
    variants[index] = itemVariants;
    this.setState({ variants });
  }

  renderItems = () => {
    const orderId = this.props.navigation.getParam("orderId");
    if (this.state.items.length > 0) {

      return (
        this.state.items.map((item, index) => (
          <ViewOnlyItem
            key={item.id}
            isAvailable={(item.isNew === undefined)}
            isNew={(item.isNew !== undefined)}
            item={item}
            orderId={orderId}
            event={this.event}
            index={index}
            handleVariantChanges={(itemVariants) => {
              this.handleVariantChanges(itemVariants, index);
            }}
            addNewItem={this.addNewItem}
            display={this.state.openedItem === index}
            onPress={() => this.toggleItem(index)}
            onCopyItem={(oId, iId, delIndex) => { this.onCopyItem(oId, iId, delIndex) }}
            onDeleteItem={(oId, iId, delIndex, isNew) => { this.onDeleteItem(oId, iId, delIndex, isNew) }}
            disableDelete={(this.state.items.length === 1)}
          />

        ))
      )
    }
    return (
      <ViewOnlyItem
        isAvailable={false}
        isNew={true}
        item={{ isNew: true }}
        orderId={orderId}
        event={this.event}
        index={0}
        handleVariantChanges={(itemVariants) => {
          this.handleVariantChanges(itemVariants, 0);
        }}
        addNewItem={this.addNewItem}
        display={this.state.openedItem === 0}
        onPress={() => this.toggleItem(0)}
        onCopyItem={this.onCopyItem}
        onDeleteItem={this.onDeleteItem}
      />
    )
  }

  updateAsDraft = async (isOrderNow) => {
    this.setState({ isLoading: true });
    const userId = await getUserId();
    const orderId = this.props.navigation.getParam("orderId");
    const param = {
      "vendor_id": this.state.selectedItem.id,
      "notes": this.state.notes,
      "order_number": this.state.orderNumber,
      "booth_no": this.state.boothNumber,
      "event_id": this.state.selectedEvent.id,
      "global_date": (this.state.selectedDate !== null) ? this.getFormattedDate(new Date(this.state.selectedDate)) : null
    }
    if (isOrderNow) {
      param.status = "ordered";
    }
    await axios.post(`${Api.url}/${userId}/order/update/${orderId}`, param, { headers: Api.headers }).then((response) => {
      this.setState({ isLoading: false });
      if (response.data.status === 'success') {
        showToast(response.data.message);
      } else {
        this.showError(response.data.message[0]);
      }
    }).catch((error) => {
      this.showError(error.message);
    });
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

  duplicateOrder = async () => {
    this.setState({ isLoading: true });
    const orderId = this.props.navigation.getParam("orderId");
    const userId = await getUserId();
    const path = `${Api.url}/${userId}/order/duplicate/${orderId}`;
    axios.get(path, { headers: Api.headers }).then((response) => {
      if (response.data.status === 'success') {
        this.setState({ isLoading: false }, () => {
          showToast(response.data.message);
          this.props.navigation.state.params.onGoBack();
          this.props.navigation.goBack();
        });
      } else {
        this.showError(response.data.message[0]);
      }
    }).catch((error) => {
      this.showError(error.message);
    });
  }

  navigateToEditOrder = () => {
    const orderId = this.props.navigation.getParam("orderId");
    this.props.navigation.navigate("EditOrder", {
      orderId,
      isFromCreateOrder: false,
      isFromViewOrder: true,
      onGoBack: (isUpdated) => {
        if (isUpdated) {
          this.fetchOrder();
          showToast("Order updated successfully");
        }
      }
    });
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.bgGray}}>
        <SafeScrollView style={{ flex: 1, backgroundColor: Colors.bgGray }}>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={true}
            keyboardDismissMode={'on-drag'}
          >
            <Loader loading={this.state.isLoading} />

            <ActionButton style={{ alignSelf: 'flex-end' }} color={Colors.pink} iconColor="#fff" icon="edit" onPress={this.navigateToEditOrder} />

            <Card style={{ backgroundColor: '#fff' }}>
              <CardBody>

                <CardItem style={{ borderTopWidth: 0, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                  <MText bold size={18}>Company : </MText>
                  <MText size={18}>{(this.state.selectedItem) ? this.state.selectedItem.name : ' '}</MText>
                </CardItem>

                <CardItem>
                  <MText bold size={18}>Event : </MText>
                  <MText size={18}>{(this.state.selectedEvent) ? this.state.selectedEvent.name : ' '}</MText>
                </CardItem>

                <CardItem>
                  <MText bold size={18}>Booth No: </MText>
                  <MText size={18}>{this.state.boothNumber}</MText>
                </CardItem>

                <CardItem>
                  <MText bold size={18}>Purchase Order Number : </MText>
                  <MText size={18}>{this.state.orderNumber}</MText>
                </CardItem>

                <CardItem>
                  <MText bold size={18}>Placed on : </MText>
                  <MText size={18}>{this.state.selectedDate}</MText>
                </CardItem>

                <CardItem>
                  <MText bold size={18}>Status : </MText>
                  {this.renderStatus(this.state.status)}
                </CardItem>

                <CardItem>
                  <ToggleInputBox
                    label="Notes"
                    value={this.state.notes}
                    noLabelPadding
                    disabled={true}
                  />
                </CardItem>

                {/* ---------------- Item start here ----------------- */}
                <View style={{
                  borderTopWidth: 1,
                  borderTopColor: Colors.border,
                  paddingVertical: 10
                }}
                >
                  {this.renderItems()}
                </View>

                <CardItem>
                  <MText bold size={18} style={{ alignSelf: 'flex-start' }}>
                    TOTAL : ${this.getCurrencyFormat(parseFloat(this.state.totalPrice, 10))}
                  </MText>
                </CardItem>

                <CardItem>
                  <MButton
                    text=" DUPLICATE ORDER"
                    pink
                    iconLeft={(
                      <Icon name="clone" color="#fff" size={18} />
                    )}
                    style={{ marginVertical: 5 }}
                    onPress={() => this.duplicateOrder()}
                  />
                </CardItem>
              </CardBody>
            </Card>
          </ScrollView>
        </SafeScrollView>
      </SafeAreaView>
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

export default ViewOrder;
