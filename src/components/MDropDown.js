import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Colors from '../../config/Colors';
import MText from './MText';
import MDropDownList from './MDropDownList';

class MDropDown extends Component {
	constructor(props) {
		super(props);
		this.state = {
			displayDropDown: false,
			selectedItem: null,
			data: this.props.data
		};
	}

	componentWillReceiveProps = (props) => {
		this.setState({
			data: props.data
		});
	}

	handleOnPress = (item) => {
		this.setState({
			displayDropDown: false,
			selectedItem: item
		});
		this.props.onSelectItem(item);
	}

	render() {
		return (
			<View style={{ marginVertical: 5, position: 'relative'}}>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<MText
						style={styles.label}
						size={this.props.labelSize || 18}
						bold={this.props.labelBold}
					>
						{this.props.label}
					</MText>
					{
						this.props.required && (
							<MText size={18} pink bold>*</MText>
						)
					}
				</View>

				<TouchableOpacity
					style={[styles.touchableBox, { ...this.props.touchableStyle }]}
					activeOpacity={1.0}
					disabled={this.props.disabled}
					onPress={() => this.setState({ displayDropDown: !this.state.displayDropDown})}
				>
					{/* eslint-disable-next-line no-nested-ternary */}
					<MText size={18}>{(this.state.selectedItem === null) ? (this.props.selectedItem) ? this.props.selectedItem.name : <MText size={18} style={{color: "gray"}}>{this.props.placeholder}</MText> : this.state.selectedItem.name}</MText>
					<Icon name={(this.state.displayDropDown) ? "caret-up" : "caret-down"} />
				</TouchableOpacity>

				<Modal 
					isVisible={this.state.displayDropDown}
					avoidKeyboard={true}
					backdropOpacity={0.2}
					animationIn="fadeIn"
					animationOut="fadeOut"
					animationInTiming={100}
					animationOutTiming={100}
					backdropTransitionOutTiming={0}
					// customBackdrop={<View style={{ flex: 1, flexGrow: 1, backgroundColor: 'black', height: Dimensions.get('window').height }} />}
					onBackdropPress={() => this.setState({ displayDropDown: false})}
				>
					<MDropDownList {...this.props} data={this.state.data} searchable={this.props.searchable} handleOnPress={(item) => this.handleOnPress(item)} />
				</Modal>

				{/* {
					this.state.displayDropDown && (
						<MDropDownList {...this.props} data={this.state.data} searchable={this.props.searchable} handleOnPress={(item) => this.handleOnPress(item)} />
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
	},
	touchableBox: {
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
	}
});

export default MDropDown;
