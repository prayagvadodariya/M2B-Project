import React from 'react';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MText from './MText';
import Colors from '../../config/Colors';


const MButton = (props) => {
    let buttonColor = Colors.pink;
    if (props.teal) { 
      buttonColor = Colors.teal 
    } else if (props.darkBlue) {
      buttonColor = Colors.darkBlue
    } else if (props.blue) {
      buttonColor = Colors.blue
    } else if (props.gray) {
      buttonColor = Colors.gray
    }

    return (
      <TouchableOpacity
        style={[
          {
            borderRadius: 50,
            backgroundColor: buttonColor,
            paddingHorizontal: 30,
            paddingVertical: 8,
            opacity:(props.disabled) ? 0.5 : 1
          },
          {...props.style}          
        ]}
        onPress={props.onPress}
        disabled={props.disabled}
      >
        {
          props.isLoading ? (
            <ActivityIndicator animating color={props.textColor || '#ffffff'} />
          ) : (
            <MText
              style={{
                color:props.textColor || '#ffffff',
                fontSize: (props.textSize) ? props.textSize : 16,
                fontWeight: 'bold',
              }}
            >
              {
                props.iconLeft
                && (
                  props.iconLeft
                )
              }
              {props.text}
            </MText>
          )
        }
      </TouchableOpacity>
    );
  
}

export default MButton;
