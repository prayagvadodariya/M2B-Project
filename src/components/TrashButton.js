import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const TrashButton = (props) => {
	return (
		<TouchableOpacity
			style={{
				height: 40,
				width: 40,
				borderRadius: 30,
				backgroundColor: '#dc3545',
				alignItems: 'center',
				justifyContent: 'center'
			}}
			onPress={props.onPress}
		>
			<Icon name="trash" color="#fff" size={16} />
		</TouchableOpacity>
	)
}

export default TrashButton
