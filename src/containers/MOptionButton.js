import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { View, TouchableOpacity, FlatList, Alert, StyleSheet } from 'react-native';
import { Popover, PopoverController } from 'react-native-modal-popover';
import axios from 'axios';
import Api from '../../config/Api';
import getUserId from '../actions/getUserId';
import MText from '../components/MText';
import Colors from '../../config/Colors';
import showToast from '../components/showToast';

const PopoverKeys = {
  VIEWORDER: 'viewOrder',
  EDITORDER: 'editOrder',
  ARCHIVEORDER: 'archived',
  DELETEORDER: 'delete',
  CANCELORDER: 'canceled',
  ORDERNOW: 'ordered'
}

class MOptionButton extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  handleOnPressPopover = (key, closePopover) => {
    closePopover();
    setTimeout(() => {
      switch (key) {
        case PopoverKeys.ARCHIVEORDER: {
          this.archiveOrder();
          break;
        }
        case PopoverKeys.ORDERNOW: {
          this.orderNow();
          break;
        }
        case PopoverKeys.CANCELORDER: {
          this.cancelOrder();
          break;
        }
        case PopoverKeys.DELETEORDER: {
          this.deleteOrder();
          break;
        }
        case PopoverKeys.EDITORDER: {
          this.props.navigation.navigate("EditOrder", {
            "orderId": this.props.order.id,
            "event": this.props.event,
            onGoBack: () => this.props.doRefresh()
          });
          break;
        }
        case PopoverKeys.VIEWORDER: {
          this.props.navigation.navigate("ViewOrder", {
            "orderId": this.props.order.id,
            "event": this.props.event,
            onGoBack: () => this.props.doRefresh()
          });
          break;
        }
        default: {
          Alert.alert(
            'Error',
            'Select Option',
            [
              { text: 'OK' }
            ]
          );
        }
      }
    }, 100);
  }

  archiveOrder = async () => {
    this.props.onLoading();
    const userId = await getUserId();
    await axios.get(`${Api.url}/${userId}/order/${this.props.order.id}/${PopoverKeys.ARCHIVEORDER}`, { headers: Api.headers }).then((response) => {
      if (response.data.status === 'success') {
        this.props.onLoadingStop();
        showToast(response.data.message);
        this.props.doRefresh();
      } else {
        this.props.onError(response.data.message[0]);
      }
    }).catch((error) => {
      this.props.onError(error.message);
    });
  }

  deleteOrder = async () => {
    this.props.onLoading();
    const userId = await getUserId();
    await axios.get(`${Api.url}/${userId}/order/${this.props.order.id}/${PopoverKeys.DELETEORDER}`, { headers: Api.headers }).then((response) => {
      if (response.data.status === 'success') {
        this.props.onLoadingStop();
        showToast(response.data.message);
        this.props.doRefresh();
      } else {
        this.props.onError(response.data.message[0]);
      }
    }).catch((error) => {
      this.props.onError(error.message);
    });
  }

  cancelOrder = async () => {
    this.props.onLoading();
    const userId = await getUserId();
    await axios.get(`${Api.url}/${userId}/order/${this.props.order.id}/${PopoverKeys.CANCELORDER}`, { headers: Api.headers }).then((response) => {
      if (response.data.status === 'success') {
        this.props.onLoadingStop();
        showToast(response.data.message);
        this.props.doRefresh();
      } else {
        this.props.onError(response.data.message[0]);
      }
    }).catch((error) => {
      this.props.onError(error.message);
    });
  }

  orderNow = async () => {
    this.props.onLoading();
    const userId = await getUserId();
    await axios.get(`${Api.url}/${userId}/order/${this.props.order.id}/${PopoverKeys.ORDERNOW}`, { headers: Api.headers }).then((response) => {
      if (response.data.status === 'success') {
        this.props.onLoadingStop();
        showToast(response.data.message);
        this.props.doRefresh();
      } else {
        this.props.onError(response.data.message);
      }
    }).catch((error) => {
      this.props.onError(error.message);
    });
  }

  renderPopover = (closePopover, popoverVisible, popoverAnchorRect, status) => {
    let popoverMenus = [];
    switch (status) {
      case 'draft': {
        popoverMenus = [
          { key: PopoverKeys.ORDERNOW, title: 'Order Now' },
          { key: PopoverKeys.EDITORDER, title: 'Edit Order' },
          { key: PopoverKeys.ARCHIVEORDER, title: 'Archive Order' },
          { key: PopoverKeys.DELETEORDER, title: 'Delete Order' }
        ]

        break;
      }
      case 'closed': {
        popoverMenus = [
          { key: PopoverKeys.VIEWORDER, title: 'View Order' }
        ]
        break;
      }
      case 'ordered': {
        popoverMenus = [
          { key: PopoverKeys.VIEWORDER, title: 'View Order' },
          { key: PopoverKeys.CANCELORDER, title: 'Cancel Order' }
        ]
        break;
      }
      case 'canceled': {
        popoverMenus = [
          { key: PopoverKeys.VIEWORDER, title: 'View Order' }
        ]
        break;
      }
      default: {
        popoverMenus = [
          { key: PopoverKeys.VIEWORDER, title: 'View Order' }
        ]
      }
    }
    return (
      <Popover
        contentStyle={styles.content}
        visible={popoverVisible}
        onClose={closePopover}
        fromRect={popoverAnchorRect}
        duration={100}
        supportedOrientations={['portrait', 'landscape']}
      >
        <FlatList
          data={popoverMenus}
          renderItem={({ item, separators }) => (
            <TouchableOpacity
              key={item.key}
              style={{ padding: 5, backgroundColor: Colors.bgGray }}
              onShowUnderlay={separators.highlight}
              onHideUnderlay={separators.unhighlight}
              onPress={() => this.handleOnPressPopover(item.key, closePopover)}
            >
              <MText size={16}>{item.title}</MText>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={({ highlighted }) => (
            <View style={[{ borderWidth: 0.5, borderColor: Colors.border }, highlighted && { marginLeft: 0 }]} />
          )}
        />
      </Popover>
    )
  }

  render() {
    return (
      <PopoverController>
        {({ openPopover, closePopover, popoverVisible, setPopoverAnchor, popoverAnchorRect }) => (
          <React.Fragment>
            <TouchableOpacity
              style={{
                height: 40,
                width: 40,
                borderRadius: 40,
                backgroundColor: '#343a40',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              ref={setPopoverAnchor}
              onPress={openPopover}
            >
              <Icon name="ellipsis-h" color="#fff" size={18} />
            </TouchableOpacity>
            {this.renderPopover(closePopover, popoverVisible, popoverAnchorRect, this.props.order.status)}
          </React.Fragment>
        )}
      </PopoverController>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1
  }
});

export default MOptionButton;
