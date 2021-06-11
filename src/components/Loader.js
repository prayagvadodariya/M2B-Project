import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Modal
} from 'react-native';
import { CirclesLoader } from 'react-native-indicator';
import Colors from '../../config/Colors';


class Loader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: this.props.loading
        }
    }

    componentWillReceiveProps = (props) => {
        this.setState({ loading: props.loading });
    }

    render() {
        return (
            <Modal
                transparent={true}
                animationType={'none'}
                visible={this.state.loading}
                style={{zIndex: 1100}}
                backdropTransitionOutTiming={0}
                supportedOrientations={[
                    "landscape",
                    "landscape-left",
                    "landscape-right",
                    "portrait",
                    "portrait-upside-down"
                ]}
                onRequestClose={() => { }}>
                <View style={styles.modalBackground}>
                    <View style={styles.activityIndicatorWrapper}>
                        <CirclesLoader 
                            size={40}
                            color={Colors.pink} 
                            dotRadius={10}
                        />
                    </View>
                </View>
            </Modal>
        )
    }
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

export default Loader
