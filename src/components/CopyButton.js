import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Colors from '../../config/Colors';

const CopyButton = (props) => {
	return (
		<TouchableOpacity
			style={{
				height: 40,
				width: 40,
				borderRadius: 30,
				backgroundColor: Colors.teal,
				alignItems: 'center',
                justifyContent: 'center',
                marginHorizontal: 5
			}}
			onPress={props.onPress}
		>
			<Icon name="copy" color="#fff" size={16} />
		</TouchableOpacity>
	)
}

export default CopyButton
