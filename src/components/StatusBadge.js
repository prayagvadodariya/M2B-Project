import React from 'react';
import { View } from 'react-native';
import Colors from '../../config/Colors';
import MText from './MText';

const Badge = (props) => {
	let badgeColor = Colors.pink;
	if (props.teal) {
		badgeColor = Colors.teal
	} else if (props.darkBlue) {
		badgeColor = Colors.darkBlue
	} else if (props.danger) {
		badgeColor = Colors.danger
	} else if (props.primary) {
		badgeColor = Colors.primary
	} else if (props.gray) {
		badgeColor = Colors.gray
	} else if (props.warning) {
		badgeColor = Colors.warning
	} 
	
	return (
		<View style={[
			{
				backgroundColor: props.color || badgeColor,
				paddingVertical: 0,
				paddingHorizontal: 5,
				marginHorizontal: 5,
				borderRadius: 20,
				alignItems: 'center',
				justifyContent: 'center'
			},
			{
				...props.style
			}
		]}>
			<MText style={{ color: props.fontColor || '#ffffff'}} bold size={props.fontSize || 12}>{props.children}</MText>
		</View>
	)
}

export default Badge
