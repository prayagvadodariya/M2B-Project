import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MText from './MText';
import Colors from '../../config/Colors';

const Li = (props) => {
    return (
        <View style={{
            alignItems:'center',
            flexDirection: 'row'
        }}>
            <Icon name="circle" size={8} color={Colors.teal} style={{marginRight: 10}} />
            <MText size={16} style={props.style}>{props.children}</MText>
        </View>
    )
}

export default Li
