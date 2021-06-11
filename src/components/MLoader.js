import React from 'react';
import { View, ActivityIndicator, Dimensions, StyleSheet } from 'react-native';

const MLoader = () => {
    return (
        <View 
            style={{
                flex: 1,
                backgroundColor: '#00000040',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1,
                minHeight: Dimensions.get('screen').height,
                // width: Dimensions.get('screen').width
            }}
        >
            <View style={styles.modalBackground}>
                <View style={styles.activityIndicatorWrapper}>
                    <ActivityIndicator
                        animating={true} />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000040',
        zIndex: 1000
    },
    activityIndicatorWrapper: {
        backgroundColor: '#FFFFFF',
        height: 100,
        width: 100,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
    }
});

export default MLoader
