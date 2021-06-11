import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../../config/Colors';

const SlideItem = (props) => {
    return (
        <View style={{ alignItems: 'center' }}>
            <TouchableOpacity 
                style={[
                    styles.container,
                    {...props.style}
                ]}
                onPress={props.onPress}
            >
                {props.children}
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton} onPress={props.onFilter}>
                <Icon 
                    name="filter"
                    color="#ffffff"
                    size={22}
                />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderRadius: 10,
        paddingVertical: 20,
        borderColor: Colors.border,
        marginVertical: 20,
        width: 150,
        margin: 10,
        overflow: 'visible',
        zIndex: -1
    },
    filterButton: {
        // position: 'absolute',
        // bottom: -15,
        height: 30,
        width: 30,
        backgroundColor: Colors.pink,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        marginTop: -35
    }
});

export default SlideItem
