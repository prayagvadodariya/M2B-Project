import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MText from './MText';
import Colors from '../../config/Colors';
import SearchableSelectMT from './SearchableSelectMT';

class MSearchableSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View>
        <View style={{ marginVertical: 5 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MText style={styles.label} size={18} bold={this.props.labelBold}>
                    {this.props.label}
                </MText>
                {
                    this.props.required && (
                        <MText bold size={20} pink>*</MText>
                    )
                }
            </View>
            <TouchableOpacity
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 100,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#ffffff',
                    borderColor: Colors.border,
                    borderWidth: 1
                }}
                activeOpacity={1.0}
                onPress={this.props.onPress}
            >
                <MText size={18}>{(this.state.selectedMarketTrip === '') ? 'Select Market Trip' : this.state.selectedMarketTrip.name}</MText>
                <Icon name="caret-down" />
            </TouchableOpacity>
        </View>

        <Modal 
            isVisible={this.state.displayMarketTrip}
            avoidKeyboard={true}
            backdropOpacity={0.2}
            backdropTransitionOutTiming={0}
            animationIn="fadeIn"
            animationOut="fadeOut"
            animationInTiming={100}
            animationOutTiming={100}
            onBackdropPress={() => this.setState({ displayMarketTrip: false})}
        >
            <SearchableSelectMT
                onItemSelect={(item) => {
                    this.setState({
                        selectedMarketTrip: item,
                        displayMarketTrip: false
                    })
                }}
            />
        </Modal>

        {/* {
            this.state.displayMarketTrip
            && (
                <View style={styles.searchResultMT}>
                    <SearchableSelectMT
                        onItemSelect={(item) => {
                            this.setState({
                                selectedMarketTrip: item,
                                displayMarketTrip: false
                            })
                        }}
                    />
                </View>
            )
        } */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
    label: {
		marginLeft: 20,
		marginVertical: 5,
    }
});

export default MSearchableSelect;
