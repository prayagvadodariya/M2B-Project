import React, { Component } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import getUserId from '../actions/getUserId';
import Api from '../../config/Api';
import Colors from '../../config/Colors';
import MText from '../components/MText';
import FetchingLoader from '../components/FetchingLoader';
import presentError from '../components/presentError';

class SlideItemModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      fetchingError: null,
      data: []
    };
  }

  componentDidMount = async () => {
    this.setState({ isFetching: true });
    const userId = await getUserId();
    axios.get(`${Api.url}/${userId}/order/open-orders/category/${this.props.timestamp}`, { headers: Api.headers }).then((response) => {
      this.setState({ isFetching: false });
      if (response.data.status === 'success') {
        let temp = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const key of Object.keys(response.data.categories)) {
          temp.push({
            title: key,
            price: response.data.categories[key].price,
            style: response.data.categories[key].style
          })
        }
        this.setState({
          fetchingError: null,
          data: temp,
        });
      } else {
        this.setState({
          data: null,
          fetchingError: response.data.message[0]
        });
      }
    }).catch((error) => {
      presentError("Error", error.message);
    });
  }

  render() {
    return (
      <View style={{
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 10,
        backgroundColor: '#fff'
      }}>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: Colors.border,
            padding: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <MText bold size={24}>Categories</MText>
          <TouchableOpacity onPress={this.props.closeModal}>
            <Icon name="times" color="#aaa" size={24} />
          </TouchableOpacity>
        </View>
        <ScrollView
          style={{
            padding: 20
          }}
        >
          {
            this.state.isFetching && (
              <FetchingLoader style={{ borderTopWidth: 0 }} />
            )
          }
          {
            this.state.fetchingError && (
              <MText pink size={16}>
                {this.state.fetchingError}
              </MText>
            )
          }
          {
            this.state.data !== null && this.state.data.map((element) => (
              <View
                style={{
                  padding: 10,
                  backgroundColor: '#fff',
                  borderColor: Colors.border,
                  borderRadius: 10,
                  overflow: 'hidden',
                  borderWidth: 1,
                  marginVertical: 5
                }}
                key={element.title}
              >
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  <MText size={18}>{element.title} - </MText>
                  <MText bold size={18}>${element.price},</MText>
                  <MText size={18}> Styles -</MText>
                  <MText bold size={18}>{element.style}</MText>
                </View>
              </View>
            ))
          }
        </ScrollView>

      </View>
    );
  }
}

export default SlideItemModal;
