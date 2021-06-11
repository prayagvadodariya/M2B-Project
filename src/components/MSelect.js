import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import MText from './MText';
import Colors from '../../config/Colors';

const MSelect = (props) => {
    return (
        <View style={{marginVertical:5}}>
            <View style={{flexDirection: 'row', alignItems:'center'}}>
                <MText style={styles.label} bold size={18}>
                    {props.label}
                    {
						props.require && (
							<MText pink bold size={20}> * </MText>
						)
					}
                </MText>
            </View>
            <Dropdown
                label=""
                data={props.data}
                value={props.value}
                dropdownOffset={{top: 15, left: 20}}
                inputContainerStyle={{
                    borderBottomWidth: 0,
                    paddingLeft: 20,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                containerStyle={{
                    backgroundColor: '#ffffff',
                    borderWidth: 0.5,
                    borderColor: Colors.border,
                    borderRadius: 50,
                    height: 50,
                    justifyContent: 'center'
                }}
                onChangeText={props.onChangeText}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    label: {
		marginLeft: 20,
		marginVertical: 5,
    },
});

export default MSelect
