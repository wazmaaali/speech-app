import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  FlatList,
  TouchableHighlight,
  View,
} from "react-native";
import { Asset } from "expo-asset";
import * as firebase from "firebase";

import {
  Audio,
  InterruptionModeAndroid,
  InterruptionModeIOS,
  ResizeMode,
  Video,
} from "expo-av";
import * as Font from "expo-font";
import Slider from "@react-native-community/slider";

import { MaterialIcons } from "@expo/vector-icons";

class Icon {
  constructor(module, width, height) {
    this.module = module;
    this.width = width;
    this.height = height;
    Asset.fromModule(this.module).downloadAsync();
  }
}

class PlaylistItem {
  constructor(name, uri, isVideo) {
    this.name = name;
    this.uri = uri;
    this.isVideo = isVideo;
  }
}

const PLAYLIST = [
  new PlaylistItem(
    "Comfort Fit - “Sorry”",
    "https://s3.amazonaws.com/exp-us-standard/audio/playlist-example/Comfort_Fit_-_03_-_Sorry.mp3",
    false
  ),
  new PlaylistItem(
    "Big Buck Bunny",
    "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
    true
  ),
  new PlaylistItem(
    "Mildred Bailey – “All Of Me”",
    "https://ia800304.us.archive.org/34/items/PaulWhitemanwithMildredBailey/PaulWhitemanwithMildredBailey-AllofMe.mp3",
    false
  ),
  new PlaylistItem(
    "Popeye - I don't scare",
    "https://ia800501.us.archive.org/11/items/popeye_i_dont_scare/popeye_i_dont_scare_512kb.mp4",
    true
  ),
  new PlaylistItem(
    "Podington Bear - “Rubber Robot”",
    "https://s3.amazonaws.com/exp-us-standard/audio/playlist-example/Podington_Bear_-_Rubber_Robot.mp3",
    false
  ),
];

const ICON_PLAY_BUTTON = new Icon(
  require("../../assets/images/play_button.png"),
  34,
  51
);
const ICON_PAUSE_BUTTON = new Icon(
  require("../../assets/images/pause_button.png"),
  34,
  51
);
const ICON_STOP_BUTTON = new Icon(
  require("../../assets/images/stop_button.png"),
  22,
  22
);

const ICON_MUTED_BUTTON = new Icon(
  require("../../assets/images/muted_button.png"),
  67,
  58
);

const ICON_TRACK_1 = new Icon(
  require("../../assets/images/track_1.png"),
  166,
  5
);
const ICON_THUMB_1 = new Icon(
  require("../../assets/images/thumb_1.png"),
  18,
  19
);

const LOOPING_TYPE_ALL = 0;
const LOOPING_TYPE_ONE = 1;

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get("window");
const BACKGROUND_COLOR = "#FFF8ED";
const DISABLED_OPACITY = 0.5;
const FONT_SIZE = 14;
const LOADING_STRING = "... loading ...";
const BUFFERING_STRING = "...buffering...";
const VIDEO_CONTAINER_HEIGHT = (DEVICE_HEIGHT * 2.0) / 5.0 - FONT_SIZE * 2;

class TestThis extends React.Component {
  constructor(props) {
    super(props);
    this.index = 0;
    this.isSeeking = false;
    this.shouldPlayAtEndOfSeek = false;
    this.playbackInstance = null;
    this.state = {
      showVideo: false,
      playbackInstanceName: LOADING_STRING,
      loopingType: LOOPING_TYPE_ALL,
      muted: false,
      playbackInstancePosition: null,
      playbackInstanceDuration: null,
      shouldPlay: false,
      childDataId: this.props.navigation.state.params.childData.id,
      childDataUrl: [],

      isPlaying: false,
      isBuffering: false,
      isLoading: true,
      fontLoaded: false,
      shouldCorrectPitch: true,
    };
  }

  componentDidMount() {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      playThroughEarpieceAndroid: false,
    });
    const imageRefs = firebase
      .storage()
      .ref()
      .child(this.state.childDataId + "/")
      .listAll()
      .then((res) => {
        Promise.all(res.items.map((ref) => ref.getDownloadURL())).then(
          (ref) => {
            console.log("1111 9999 22233 urls: ", ref);
            this.setState({
              childDataUrl: ref,
            });
          }
        );
      });
    // console.log("1111 9999 22233 urls: ", imageRefs);

    (async () => {
      await Font.loadAsync({
        ...MaterialIcons.font,
        "cutive-mono-regular": require("../../assets/fonts/CutiveMono-Regular.ttf"),
      });
      this.setState({ fontLoaded: true });
    })();
  }

  async _loadNewPlaybackInstance(item, playing) {
    if (this.playbackInstance != null) {
      await this.playbackInstance.unloadAsync();
      // this.playbackInstance.setOnPlaybackStatusUpdate(null);
      this.playbackInstance = null;
    }

    const source = { uri: item };
    const initialStatus = {
      shouldPlay: playing,
      shouldCorrectPitch: this.state.shouldCorrectPitch,
      isMuted: this.state.muted,
      isLooping: this.state.loopingType === LOOPING_TYPE_ONE,
      // // UNCOMMENT THIS TO TEST THE OLD androidImplementation:
      // androidImplementation: 'MediaPlayer',
    };

    if (PLAYLIST[this.index].isVideo) {
      await this._video.loadAsync(source, initialStatus);
      // this._video.onPlaybackStatusUpdate(this._onPlaybackStatusUpdate);
      this.playbackInstance = this._video;
      const status = await this._video.getStatusAsync();
    } else {
      const { sound, status } = await Audio.Sound.createAsync(
        source,
        initialStatus,
        this._onPlaybackStatusUpdate
      );
      this.playbackInstance = sound;
    }

    this._updateScreenForLoading(false);
  }

  mountVideo = (item) => {
    // console.log("")
    this._loadNewPlaybackInstance(item, false);
  };

  _updateScreenForLoading(isLoading) {
    if (isLoading) {
      this.setState({
        showVideo: false,
        isPlaying: false,
        playbackInstanceName: LOADING_STRING,
        playbackInstanceDuration: null,
        playbackInstancePosition: null,
        isLoading: true,
      });
    } else {
      this.setState({
        playbackInstanceName: PLAYLIST[this.index].name,
        showVideo: PLAYLIST[this.index].isVideo,
        isLoading: false,
      });
    }
  }

  _onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      this.setState({
        playbackInstancePosition: status.positionMillis,
        playbackInstanceDuration: status.durationMillis,
        shouldPlay: status.shouldPlay,
        isPlaying: status.isPlaying,
        isBuffering: status.isBuffering,
        muted: status.isMuted,
        loopingType: status.isLooping ? LOOPING_TYPE_ONE : LOOPING_TYPE_ALL,
        shouldCorrectPitch: status.shouldCorrectPitch,
      });
      if (status.didJustFinish && !status.isLooping) {
        this._advanceIndex(true);
        this._updatePlaybackInstanceForIndex(true);
      }
    } else {
      if (status.error) {
        console.log(`FATAL PLAYER ERROR: ${status.error}`);
      }
    }
  };

  _advanceIndex(forward) {
    this.index =
      (this.index + (forward ? 1 : PLAYLIST.length - 1)) % PLAYLIST.length;
  }

  async _updatePlaybackInstanceForIndex(playing) {
    this._updateScreenForLoading(true);

    this._loadNewPlaybackInstance(playing);
  }

  _onPlayPausePressed = () => {
    if (this.playbackInstance != null) {
      if (this.state.isPlaying) {
        this.playbackInstance.pauseAsync();
      } else {
        this.playbackInstance.playAsync();
      }
    }
  };

  _onStopPressed = () => {
    if (this.playbackInstance != null) {
      this.playbackInstance.stopAsync();
    }
  };

  _onSeekSliderValueChange = (value) => {
    if (this.playbackInstance != null && !this.isSeeking) {
      this.isSeeking = true;
      this.shouldPlayAtEndOfSeek = this.state.shouldPlay;
      this.playbackInstance.pauseAsync();
    }
  };

  _onSeekSliderSlidingComplete = async (value) => {
    if (this.playbackInstance != null) {
      this.isSeeking = false;
      const seekPosition = value * this.state.playbackInstanceDuration;
      if (this.shouldPlayAtEndOfSeek) {
        this.playbackInstance.playFromPositionAsync(seekPosition);
      } else {
        this.playbackInstance.setPositionAsync(seekPosition);
      }
    }
  };

  _getSeekSliderPosition() {
    if (
      this.playbackInstance != null &&
      this.state.playbackInstancePosition != null &&
      this.state.playbackInstanceDuration != null
    ) {
      return (
        this.state.playbackInstancePosition /
        this.state.playbackInstanceDuration
      );
    }
    return 0;
  }

  _getMMSSFromMillis(millis) {
    const totalSeconds = millis / 1000;
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor(totalSeconds / 60);

    const padWithZero = (number) => {
      const string = number.toString();
      if (number < 10) {
        return "0" + string;
      }
      return string;
    };
    return padWithZero(minutes) + ":" + padWithZero(seconds);
  }

  _getTimestamp() {
    if (
      this.playbackInstance != null &&
      this.state.playbackInstancePosition != null &&
      this.state.playbackInstanceDuration != null
    ) {
      return `${this._getMMSSFromMillis(
        this.state.playbackInstancePosition
      )} / ${this._getMMSSFromMillis(this.state.playbackInstanceDuration)}`;
    }
    return "";
  }
  render() {
    return (
      <View style={styless.container}>
        <FlatList
          style={{ flex: 1 }}
          data={this.state.childDataUrl}
          renderItem={({ item }) => <this.Item item={item} />}
          keyExtractor={(item, index) => item.id}
        />
      </View>
    );
  }
  Item = ({ item }) => {
    return !this.state.fontLoaded ? (
      <View style={styles.emptyContainer} />
    ) : (
      <View style={styles.container}>
        <View />

        <View style={styles.space} />
        <View
          style={[
            styles.playbackContainer,
            {
              opacity: this.state.isLoading ? DISABLED_OPACITY : 1.0,
            },
          ]}
        >
          <Slider
            style={styles.playbackSlider}
            ref={this.mountVideo(item)}
            trackImage={ICON_TRACK_1.module}
            thumbImage={ICON_THUMB_1.module}
            value={this._getSeekSliderPosition()}
            onValueChange={this._onSeekSliderValueChange}
            onSlidingComplete={this._onSeekSliderSlidingComplete}
            disabled={this.state.isLoading}
          />
          <View style={styles.timestampRow}>
            <Text
              style={[
                styles.text,
                styles.buffering,
                { fontFamily: "cutive-mono-regular" },
              ]}
            >
              {this.state.isBuffering ? BUFFERING_STRING : ""}
            </Text>
            <Text
              style={[
                styles.text,
                styles.timestamp,
                { fontFamily: "cutive-mono-regular" },
              ]}
            >
              {this._getTimestamp()}
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.buttonsContainerBase,
            styles.buttonsContainerTopRow,
            {
              opacity: this.state.isLoading ? DISABLED_OPACITY : 1.0,
            },
          ]}
        >
          <TouchableHighlight
            underlayColor={BACKGROUND_COLOR}
            style={styles.wrapper}
            onPress={this._onPlayPausePressed}
            disabled={this.state.isLoading}
          >
            <Image
              style={styles.button}
              source={
                this.state.isPlaying
                  ? ICON_PAUSE_BUTTON.module
                  : ICON_PLAY_BUTTON.module
              }
            />
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={BACKGROUND_COLOR}
            style={styles.wrapper}
            onPress={this._onStopPressed}
            disabled={this.state.isLoading}
          >
            <Image style={styles.button} source={ICON_STOP_BUTTON.module} />
          </TouchableHighlight>
        </View>
        <View
          style={[
            styles.buttonsContainerBase,
            styles.buttonsContainerMiddleRow,
          ]}
        ></View>

        <View />
      </View>
    );
  };
  // render() {
  //   return !this.state.fontLoaded ? (
  //     <View style={styles.emptyContainer} />
  //   ) : (
  //     <View style={styles.container}>
  //       <View />

  //       <View style={styles.space} />
  //       <View
  //         style={[
  //           styles.playbackContainer,
  //           {
  //             opacity: this.state.isLoading ? DISABLED_OPACITY : 1.0,
  //           },
  //         ]}
  //       >
  //         <Slider
  //           style={styles.playbackSlider}
  //           ref={this.mountVideo}
  //           trackImage={ICON_TRACK_1.module}
  //           thumbImage={ICON_THUMB_1.module}
  //           value={this._getSeekSliderPosition()}
  //           onValueChange={this._onSeekSliderValueChange}
  //           onSlidingComplete={this._onSeekSliderSlidingComplete}
  //           disabled={this.state.isLoading}
  //         />
  //         <View style={styles.timestampRow}>
  //           <Text
  //             style={[
  //               styles.text,
  //               styles.buffering,
  //               { fontFamily: "cutive-mono-regular" },
  //             ]}
  //           >
  //             {this.state.isBuffering ? BUFFERING_STRING : ""}
  //           </Text>
  //           <Text
  //             style={[
  //               styles.text,
  //               styles.timestamp,
  //               { fontFamily: "cutive-mono-regular" },
  //             ]}
  //           >
  //             {this._getTimestamp()}
  //           </Text>
  //         </View>
  //       </View>
  //       <View
  //         style={[
  //           styles.buttonsContainerBase,
  //           styles.buttonsContainerTopRow,
  //           {
  //             opacity: this.state.isLoading ? DISABLED_OPACITY : 1.0,
  //           },
  //         ]}
  //       >
  //         <TouchableHighlight
  //           underlayColor={BACKGROUND_COLOR}
  //           style={styles.wrapper}
  //           onPress={this._onPlayPausePressed}
  //           disabled={this.state.isLoading}
  //         >
  //           <Image
  //             style={styles.button}
  //             source={
  //               this.state.isPlaying
  //                 ? ICON_PAUSE_BUTTON.module
  //                 : ICON_PLAY_BUTTON.module
  //             }
  //           />
  //         </TouchableHighlight>
  //         <TouchableHighlight
  //           underlayColor={BACKGROUND_COLOR}
  //           style={styles.wrapper}
  //           onPress={this._onStopPressed}
  //           disabled={this.state.isLoading}
  //         >
  //           <Image style={styles.button} source={ICON_STOP_BUTTON.module} />
  //         </TouchableHighlight>
  //       </View>
  //       <View
  //         style={[
  //           styles.buttonsContainerBase,
  //           styles.buttonsContainerMiddleRow,
  //         ]}
  //       ></View>

  //       <View />
  //     </View>
  //   );
  // }
}
const styless = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAEAEC",
  },
  textLight: {
    color: "#B6B7BF",
  },
  text: {
    color: "#8E97A6",
  },
  titleContainer: { alignItems: "center", marginTop: 24 },
  textDark: {
    color: "#3D425C",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  coverContainer: {
    marginTop: 32,
    width: 250,
    height: 250,
    shadowColor: "#5D3F6A",
    shadowOffset: { height: 15 },
    shadowRadius: 8,
    shadowOpacity: 0.3,
  },
  cover: {
    width: 250,
    height: 250,
    borderRadius: 125,
  },
  track: {
    height: 2,
    borderRadius: 1,
    backgroundColor: "#FFF",
  },
  thumb: {
    width: 8,
    height: 8,
    backgroundColor: "#3D425C",
  },
  timeStamp: {
    fontSize: 11,
    fontWeight: "500",
  },
  seekbar: { margin: 32 },
  inprogress: {
    marginTop: -12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  timestampRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "stretch",
  },
});
const styles = StyleSheet.create({
  emptyContainer: {
    alignSelf: "stretch",
    backgroundColor: BACKGROUND_COLOR,
  },
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: BACKGROUND_COLOR,
  },
  wrapper: {},
  nameContainer: {
    height: FONT_SIZE,
  },
  space: {
    height: FONT_SIZE,
  },
  videoContainer: {
    height: VIDEO_CONTAINER_HEIGHT,
  },
  video: {
    maxWidth: DEVICE_WIDTH,
  },
  playbackContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
    minHeight: ICON_THUMB_1.height * 2.0,
    maxHeight: ICON_THUMB_1.height * 2.0,
  },
  playbackSlider: {
    alignSelf: "stretch",
  },
  timestampRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "stretch",
    minHeight: FONT_SIZE,
  },
  text: {
    fontSize: FONT_SIZE,
    minHeight: FONT_SIZE,
  },
  buffering: {
    textAlign: "left",
    paddingLeft: 20,
  },
  timestamp: {
    textAlign: "right",
    paddingRight: 20,
  },
  button: {
    backgroundColor: BACKGROUND_COLOR,
  },
  buttonsContainerBase: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonsContainerTopRow: {
    maxHeight: ICON_PLAY_BUTTON.height,
    minWidth: DEVICE_WIDTH / 2.0,
    maxWidth: DEVICE_WIDTH / 2.0,
  },
  buttonsContainerMiddleRow: {
    maxHeight: ICON_MUTED_BUTTON.height,
    alignSelf: "stretch",
    paddingRight: 20,
  },

  buttonsContainerBottomRow: {
    maxHeight: ICON_THUMB_1.height,
    alignSelf: "stretch",
    paddingRight: 20,
    paddingLeft: 20,
  },

  buttonsContainerTextRow: {
    maxHeight: FONT_SIZE,
    alignItems: "center",
    paddingRight: 20,
    paddingLeft: 20,
    minWidth: DEVICE_WIDTH,
    maxWidth: DEVICE_WIDTH,
  },
});
export default TestThis;
