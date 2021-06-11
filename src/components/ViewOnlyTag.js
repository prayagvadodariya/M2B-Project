import React from 'react';
import { View } from 'react-native';
import MText from './MText';
import Colors from '../../config/Colors';

const ViewOnlyTag = (props) => {
    return (
        <View
            style={{
                borderWidth: 1,
                borderColor: Colors.border,
                borderRadius: 10,
                padding: 5,
                backgroundColor: '#e9ecef',
                flexDirection: 'row',
                flexWrap: 'wrap',
                minHeight: 50
            }}
        >
            {
                props.tags.map((tag, index) => (
                    <View
                        key={index.toString()}
                        style={{
                            borderWidth: 1,
                            borderColor: '#ced4da',
                            borderRadius: 5,
                            padding: 5,
                            backgroundColor: 'transparent',
                            margin: 5
                        }}
                    >
                        <MText>{tag}</MText>
                    </View>
                ))
            }
        </View>
    )
}

export default ViewOnlyTag
