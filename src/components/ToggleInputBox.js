import React, { Component } from 'react';
import { View, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Collapsible from 'react-native-collapsible'; 
import MButton from './MButton';
import Colors from '../../config/Colors';

class ToggleInputBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
        isVisible: false,
        value: this.props.value,
        height: 50
    };
  }

  componentWillReceiveProps = (props) => {
      this.setState({
          value: props.value
      });
  }

  render() {
    return (
        <View style={{flex: 1}}>
            <MButton
                text={` ${this.props.label}`}
                iconLeft={(
                    <Icon name={(this.state.isVisible) ? "minus" : "plus"} color={Colors.blue} />
                )}
                textColor={Colors.blue}
                onPress={() => { this.setState({isVisible: !this.state.isVisible}) }}
                style={{ backgroundColor: "transparent", paddingHorizontal:  (this.props.noLabelPadding) ? 0 : 20 }}
            />
            <Collapsible
                collapsed={!this.state.isVisible}
                duration={100}
            >
                <TextInput
                    style={[
                        { 
                            backgroundColor: (this.props.disabled) ? Colors.disabled : '#ffffff',
                            borderWidth: 1,
                            borderColor: Colors.border,
                            borderRadius: 50,
                            fontFamily: 'nunito',
                            paddingVertical: 10,
                            minHeight: 50,
                            paddingHorizontal: 20,
                            fontSize: 18,
                            overflow: 'hidden',
                        },
                        {height: Math.min(200, this.state.height)}
                    ]}
                    value={this.state.value}
                    onChangeText={this.props.onChangeText}
                    multiline={true}
                    editable={!this.props.disabled}
                    onContentSizeChange={(event) => {
                        this.setState({ height: event.nativeEvent.contentSize.height })
                    }}
                />
            </Collapsible>
        </View>
    );
  }
}

export default ToggleInputBox;
