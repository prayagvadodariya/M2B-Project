import React from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';

const SafeScrollView = (props) => {
	if (Platform.OS === "android") {
		return (
			<View style={props.style}>
				{props.children}
			</View>
		);
	}
	return (
		<KeyboardAvoidingView style={props.style} behavior="padding">
			{props.children}
		</KeyboardAvoidingView>
	)
}

export default SafeScrollView
