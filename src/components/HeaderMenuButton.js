import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const HeaderMenuButton = (props) => {
    return (
        <TouchableOpacity
                style={{
                    marginHorizontal: 15,
                    borderRadius: 30,
                    height: 30,
                    width: 30,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#ffffff'
                }}
                onPress={props.onPress}
            >
                <Icon
                    name="bars"
                    size={22}
                    color="#000000"
                />
        </TouchableOpacity>
    )
}

export default HeaderMenuButton
