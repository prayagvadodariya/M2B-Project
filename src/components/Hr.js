import React from 'react';
import { View } from 'react-native';
import Colors from '../../config/Colors';

const Hr = (props) => {
  return (
    <View 
      style={{
          height: (props.height) || 3,
          borderRadius: 10,
          backgroundColor: Colors.hr,
          marginVertical: 10,
        }}
    />
  )
}

export default Hr
