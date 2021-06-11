import React, { Component } from 'react';
import { View, StyleSheet, Image, ScrollView, Dimensions, TouchableOpacity, Linking, Button, TouchableWithoutFeedback, SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5';
import HeaderMenuButton from '../components/HeaderMenuButton';
import HeaderSearchButton from '../components/HeaderSearchButton';
import supportAction from '../actions/supportAction';
import Colors from '../../config/Colors';
import MText from '../components/MText';
import Loader from '../components/Loader';

class Support extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Support',
    headerLeft: (
      <HeaderMenuButton onPress={() => navigation.toggleDrawer()} />
    ),
    headerRight: (
      <HeaderSearchButton onPress={() => navigation.navigate("Search")} />
    )
  })

  constructor(props) {
    super(props);
    this.state = {
      playVideo: false,
      videoUrl: '',
    };

    this.props.fetchVideos();
  }

  playVideo = (videoId) => {
    this.setState({
      videoUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1`
    }, () => {
      // this.setState({
      // 	playVideo: true
      // });
      Linking.openURL(this.state.videoUrl);
    });
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.bgGray}}>
        <View style={{ flex: 1, backgroundColor: Colors.bgGray }}>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>

            <View>
              <MText size={18}>
                For additional support, please contact us at
              <MText
                  size={18}
                  style={{ color: "#007bff" }}
                  onPress={() => {
                    Linking.openURL('mailto:support@market2boutique.com')
                  }}
                >
                  {' '}support@market2boutique.com
              </MText>
              </MText>
              {/* <TouchableOpacity onPress={() => {
                Linking.openURL('mailto:support@market2boutique.com')
            }}>
              <MText size={18} style={{color:"#007bff"}}>support@market2boutique.com</MText>
            </TouchableOpacity> */}
              {/* <Button 
              title="support@market2boutique.com"
              color="#007bff"
              onPress={() => {
                Linking.openURL('mailto:support@market2boutique.com')
              }}
            /> */}
            </View>

            {
              this.props.support.isFetching && (
                <Loader loading={true} />
              )
            }

            {
              this.props.support.videos.map((video, index) => (
                <TouchableOpacity
                  style={styles.videoItemContainer}
                  key={index.toString()}
                  onPress={() => { this.playVideo(video.id.videoId) }}
                  activeOpacity={0.8}
                >
                  <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    overflow: 'hidden',
                  }}>
                    <Icon
                      name="youtube"
                      size={50}
                      color="red"
                      style={{
                        position: 'absolute',
                        zIndex: 99,
                      }}
                    />
                    <View style={{ position: 'absolute', height: 20, width: 20, backgroundColor: '#fff', zIndex: 98 }} />
                    <View style={styles.thumbnailOverlay} />
                    <Image
                      source={{ uri: video.snippet.thumbnails.high.url }}
                      style={{
                        height: Dimensions.get('screen').width - 150,
                        width: Dimensions.get('screen').width - 31,
                        zIndex: -1,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                      }}
                    />
                  </View>
                  <View style={styles.itemFooter}>
                    <MText size={18}>{video.snippet.title}</MText>
                  </View>
                </TouchableOpacity>
              ))
            }

          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgGray,
    paddingVertical: 20,
    paddingHorizontal: 15,
    justifyContent: 'center'
  },
  videoItemContainer: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    marginVertical: 10,
  },
  thumbnailOverlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.48)',
    height: Dimensions.get('screen').width - 150,
    width: Dimensions.get('screen').width - 30
  },
  itemFooter: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    borderWidth: 1,
    borderColor: 'red',
    height: 200,
    width: 300
  }
});

const mapStateToProps = (state) => ({
  support: state.supportReducer
});

const mapDispatchToProps = (dispatch) => ({
  fetchVideos: () => dispatch(supportAction())
});

export default connect(mapStateToProps, mapDispatchToProps)(Support);
