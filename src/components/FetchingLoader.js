import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import Colors from '../../config/Colors';

const FetchingLoader = (props) => {
    return (
        <View style={[
            {
                alignItems: 'center', 
                justifyContent: 'center', 
                borderTopWidth: 1,
                borderTopColor: Colors.border,
                height: 100,
            },
            {...props.style}
        ]}>
            <ActivityIndicator size="small" color={(props.color) ? props.color : '#000000'} />
        </View>
    )
}

export default FetchingLoader
