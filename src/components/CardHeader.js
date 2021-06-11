import React from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '../../config/Colors';
import MText from './MText';

const CardHeader = (props) => {
    return (
        <View style={[styles.container, {...props.style}]}>
            {props.children}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fafbfc',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
    }
});

export default CardHeader
