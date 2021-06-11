import React from 'react';
import { View } from 'react-native';
import MText from './MText';
import Colors from '../../config/Colors';

const Badge = (props) => {
    let badgeColor = Colors.pink;
    if (props.teal) {
        badgeColor = Colors.teal
    } else if (props.darkBlue) {
        badgeColor = Colors.darkBlue
    } else if (props.danger) {
        badgeColor = "#dc3545"
    } else if (props.primary) {
        badgeColor = "#28a745"
    } else if (props.gray) {
        badgeColor = "#6c757d"
    }
    return (
        <View style={[
            {
                backgroundColor: props.color || badgeColor,
                paddingVertical: 5,
                paddingHorizontal: 10,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
            },
            {
                ...props.style
            }
        ]}>
            <MText style={{color: '#ffffff'}} bold>{props.children}</MText>
        </View>
    )
}

export default Badge
