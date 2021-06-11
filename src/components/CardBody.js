import React from 'react';
import { View } from 'react-native';

const CardBody = (props) => {
    return (
        <View 
            style={[
                {
                    backgroundColor: '#ffffff', 
                    borderBottomLeftRadius: 10, 
                    borderBottomRightRadius: 10,
                    borderTopLeftRadius: 10, 
                    borderTopRightRadius: 10
                },
                {...props.style}
            ]}
            {...props}
        >
            {props.children}
        </View>
    )
}

export default CardBody
