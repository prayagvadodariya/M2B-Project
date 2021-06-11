import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import MText from './MText';
import Colors from '../../config/Colors';

const RadioButton = (props) => {
	return (
		<TouchableOpacity
			onPress={() => props.onPress(props.id)}
			activeOpacity={1.0}
			style={styles.container}
		>
			<View style={(props.isSelected) ? styles.selectedButton : styles.simpleButton} />
			<MText style={{marginLeft: 10, fontSize:18}}>{props.label}</MText>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	simpleButton: {
		height:20,
		width:20,
		borderRadius: 20,
		borderWidth: 7,
		borderColor: '#aaaaaa',
		backgroundColor: '#ffffff'
	},
	selectedButton: {
		height:20,
		width:20,
		borderRadius: 20,
		borderWidth: 7,
		borderColor: Colors.pink,
		backgroundColor: '#ffffff'
	}
});

export default RadioButton
