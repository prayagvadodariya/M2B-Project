import React from 'react';
import { View, Image, Dimensions } from 'react-native';

const Logo = () => {
	return (
		<View style={{
				alignItems: 'center',
				justifyContent: 'center',
				// borderWidth:1,
				// borderColor: 'red',
			}}
		>
			<Image
				source={require('../assets/images/logoBlack.png')}
				style={{
					width: (Dimensions.get("window").width) - 100,
				}}
				resizeMode="contain"
			/>
		</View>
	)
}

export default Logo
