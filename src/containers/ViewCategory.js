import React, { Component } from 'react';
import { View, ScrollView, KeyboardAvoidingView, StyleSheet, TouchableOpacity, TextInput, Alert, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import Api from '../../config/Api';
import getUserId from '../actions/getUserId';
import Colors from '../../config/Colors';
import Loader from '../components/Loader';
import MText from '../components/MText';
import MButton from '../components/MButton';
import ActionButton from '../components/ActionButton';
import presentError from '../components/presentError';
import SafeScrollView from '../components/SafeScrollView';


class ViewCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sizes: [],
      categoryId: '',
      additionalSizes: [],
      isLoading: false,
      error: null
    };
  }

  componentDidMount = () => {
    const { sizes, id } = this.props.category;
    this.setState({ sizes: JSON.parse(sizes), categoryId: id });
  }

  addAdditionalSize = () => {
    const { additionalSizes } = this.state;
    additionalSizes.push('');
    this.setState({ additionalSizes });
  }

  removeAdditionalSize = (index) => {
    const { additionalSizes } = this.state;
    additionalSizes.splice(index, 1);
    this.setState({ additionalSizes });
  }

  validate = () => {
    for (let i = 0; i < this.state.additionalSizes.length; i++) {
      if (this.state.additionalSizes[i] === '') {
        return false;
        break;
      }
    }
    return true;
  }

  closeModal = (isAdded) => {
    this.props.closeModal(isAdded)
  }

  save = async () => {
    const isValid = this.validate();

    if (!isValid) {
      this.setState({
        error: 'Size cannot be blank'
      });
    } else {
      this.setState({
        error: null,
        isLoading: true
      });

      this.setState({ isLoading: true });
      const userId = await getUserId();
      const param = {
        "sizes": this.state.additionalSizes
      }
      axios.post(`${Api.url}/${userId}/settings/category/update-sizes/${this.state.categoryId}`, param, { headers: Api.headers }).then((response) => {

        if (response.data.status === 'success') {
          this.setState({ isLoading: false }, () => {
            setTimeout(() => {
              Alert.alert(
                'Success',
                'Category updated successfully',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      this.closeModal(true)
                    }
                  }
                ]
              )
            }, 500);
          })
        } else {
          this.setState({ isLoading: false }, () => {
            setTimeout(() => {
              presentError("Error", response.data.message[0]);
            }, 500);
          })
        }
      }).catch((error) => {
        this.setState({ isLoading: false }, () => {
          setTimeout(() => {
            presentError("Error", error.message);
          }, 500);
        });
      });
    }

  }

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.bgGray}}>
        <SafeScrollView>
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
          >
            <Loader loading={this.state.isLoading} />

            <View style={styles.title}>
              <MText size={28} bold>Sizes</MText>
              <TouchableOpacity onPress={() => this.props.closeModal(false)}>
                <Icon name="times" color="#aaa" size={18} />
              </TouchableOpacity>
            </View>

            <View style={styles.body}>

              <MButton
                text="ADD NEW"
                teal
                onPress={this.addAdditionalSize}
                style={{ alignSelf: 'flex-end', marginVertical: 10 }}
              />

              <ScrollView
                contentContainerStyle={{ padding: 10 }}
                keyboardShouldPersistTaps="handled"
              >
                {
                  this.state.sizes.map((size, index) => (
                    <View
                      key={index.toString()}
                      style={{ marginVertical: 5, borderWidth: 1, borderColor: Colors.border, borderRadius: 10, padding: 10 }}
                    >
                      <MText size={18}>{size}</MText>
                    </View>
                  ))
                }

                {
                  this.state.additionalSizes.map((item, index) => (
                    <View
                      key={index.toString()}
                      style={styles.additionItem}
                    >
                      <TextInput
                        value={this.state.additionalSizes[index]}
                        onChangeText={(text) => {
                          const { additionalSizes } = this.state;
                          additionalSizes[index] = text;
                          this.setState({ additionalSizes });
                        }}
                        style={styles.textInput}
                      />
                      <ActionButton
                        color={Colors.danger}
                        icon="trash"
                        onPress={this.removeAdditionalSize}
                      />
                    </View>
                  ))
                }
                {
                  this.state.error && (
                    <MText size={18} pink>{this.state.error}</MText>
                  )
                }
              </ScrollView>

            </View>



            <View style={styles.footer}>
              <MButton
                text="SAVE"
                pink
                disabled={this.state.additionalSizes.length === 0}
                onPress={this.save}
              />
              <MButton
                text="CLOSE"
                darkBlue
                style={{ marginRight: 10 }}
                onPress={() => this.props.closeModal(false)}
              />
            </View>

          </ScrollView>
        </SafeScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    paddingBottom: 50,
  },
  title: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: Colors.border,
    borderBottomWidth: 1,
    alignItems: 'center'
  },
  body: {
    paddingHorizontal: 10,
    paddingBottom: 10
  },
  footer: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    overflow: 'hidden',
    flexDirection: 'row-reverse',
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    alignItems: 'center'
  },
  additionItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 100,
    paddingHorizontal: 10,
    height: 50,
    fontSize: 18,
    fontFamily: 'nunito'
  }
});

export default ViewCategory;
