import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../../config/Colors';

const CardItem = (props) => {
    if (props.clickable) {
        return (
            <TouchableOpacity 
                style={[styles.container, {...props.style}]}
                onPress={props.onPress}
                activeOpacity={0.5}
            >
                {props.children}
            </TouchableOpacity> 
        )   
    }
    return (
        <View style={[styles.container, {...props.style}]}>
            {props.children}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    }
});

export default CardItem
