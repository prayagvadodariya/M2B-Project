import React from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '../../config/Colors';

const Card = (props) => {
    return (
        <View style={[styles.cardContainer, {...props.style}]}>
            {props.children}
        </View>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: Colors.border,
        marginVertical: 10,
        backgroundColor: '#fff',
        overflow: 'hidden'
    }
});

export default Card
