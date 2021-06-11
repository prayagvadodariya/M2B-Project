import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import Colors from '../../config/Colors';

const InputBox = React.forwardRef((props, ref) => {
		return (
			<View style={{marginVertical:5}}>
				<Text style={[styles.label, {fontWeight: (props.labelNormal ? 'normal' : 'bold')}]}>
					{props.label}
					{
						props.require && (
							<Text style={{
								color: Colors.pink, 
								fontFamily: 'nunito',
								fontWeight: 'bold',
								fontSize: 20
							}}>
								*
							</Text>
						)
					}
				</Text>
				<TextInput 
					{...props}
					placeholder={props.placeholder}
					autoCorrect={false}
					style={[styles.textbox, {...props.style}]}
					ref={ref}
				/>
			</View>
		)
});

const styles = StyleSheet.create({
	label: {
		fontFamily: 'nunito',
		fontSize: 18,
		marginLeft: 20,
		marginVertical: 5,
	},
	textbox: {
		backgroundColor: '#ffffff',
		borderWidth: 1,
		borderColor: Colors.border,
		borderRadius: 50,
		fontFamily: 'nunito',
		height: 50,
		paddingVertical: 5,
		paddingHorizontal: 20,
		fontSize: 18,
	}
});

export default InputBox
