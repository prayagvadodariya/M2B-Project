import React from 'react';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const BtnRound = (props) => {
    return (
        <TouchableOpacity
            {...props}
            style={{
                height: props.size || 30,
                width: props.size || 30,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: props.color || '#000000',
                borderRadius: props.size || 30,
                marginHorizontal: 5,
                opacity: (props.disabled) ? 0.5 : 1,
                ...props.style
            }}
            activeOpacity={0.7}
            disabled={props.disabled || props.isLoading}
            onPress={props.onPress}
        >
            {
                props.isLoading ? (
                    <ActivityIndicator size="small" color={props.iconColor || '#ffffff'} />
                ) : (
                    <Icon name={props.icon} color={props.iconColor || '#ffffff'} size={props.iconSize || 16} />
                )
            }
        </TouchableOpacity>
    )
}

export default BtnRound
