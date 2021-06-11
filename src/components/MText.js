import React from 'react';
import { Text } from 'react-native';
import Colors from '../../config/Colors';

const MText = (props) => {
    return (
        <Text 
            style={
                [ 
                    {fontFamily: 'nunito'}, 
                    (props.pink) ? {color:Colors.pink} : {}, 
                    (props.teal) ? {color:Colors.teal} : {},
                    (props.size) ? {fontSize: props.size} : {},
                    (props.bold) ? {fontWeight: 'bold'} : {},
                    {...props.style}
                ]
            }
            onPress={props.onPress}
        >
            {props.children}
        </Text>
    )
};

export default MText;
