import React from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '../../config/Colors';
import MText from './MText';

const StepButton = (props) => {
	
	return (
		<View style={[
			styles.container,
			{
				backgroundColor: (props.isActive) ? Colors.teal : Colors.darkGray
			}
		]}
		>
			<View style={styles.step}>
				<MText style={{ color: '#ffffff', fontSize: 18, fontWeight: 'bold' }}>{props.step}</MText>
			</View>
			<MText style={styles.text}>{props.stepName}</MText>
		</View>
	);
	
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		borderRadius: 100,
		flexDirection: 'row',
		alignItems: 'center'
	},
	step: {
		borderRadius: 30,
		backgroundColor: Colors.darkBlue,
		alignItems: 'center',
		justifyContent: 'center',
		height: 30,
		width: 30,
		margin: 3,
	},
	text: {
		color: '#ffffff',
		fontSize: 12,
		marginLeft: 5,
		flex:1
	}
});

export default StepButton;
