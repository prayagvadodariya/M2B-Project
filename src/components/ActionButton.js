import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const ActionButton = (props) => {
	return (
		<TouchableOpacity
			style={{
				height: 40,
				width: 40,
				borderRadius: 30,
				backgroundColor: props.color,
				alignItems: 'center',
                justifyContent: 'center',
                marginHorizontal: 5,
                ...props.style
			}}
			onPress={props.onPress}
		>
			<Icon name={props.icon} color={props.iconColor || "#fff"} size={16} />
		</TouchableOpacity>
	)
}

export default ActionButton
