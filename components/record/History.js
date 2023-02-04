import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Linking,
  // Slider,
} from "react-native";
import moment from "moment";

import GetTopNavigation from "../style/TopNavigation";
import styles from "../style/Style.js";
import * as firebase from "firebase";
import { Audio } from "expo-av";
import * as Sharing from "expo-sharing";
import Slider from "@react-native-community/slider";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AudioRecorderPlayer from "react-native-audio-recorder-player";
import PlayButton from "./PlayButton";

import { MaterialIcons } from "@expo/vector-icons";

class AudioInformation {
  constructor(uri, date) {
    this.uri = uri;
    this.date = date;
  }
}

class History extends React.Component {
  constructor(props) {
    super(props);
    this.index = 0;
    this.isSeeking = false;
    this.shouldPlayAtEndOfSeek = false;
    this.playbackInstance = null;
    this.state = {
      showVideo: false,
      // playbackInstanceName: LOADING_STRING,
      // loopingType: LOOPING_TYPE_ALL,
      muted: false,
      playbackInstancePosition: null,
      playbackInstanceDuration: null,
      shouldPlay: false,
      isPlaying: false,
      isBuffering: false,
      isLoading: true,
      fontLoaded: false,
      shouldCorrectPitch: true,
      volume: 1.0,
      rate: 1.0,
      // videoWidth: DEVICE_WIDTH,
      // videoHeight: VIDEO_CONTAINER_HEIGHT,
      poster: false,
      useNativeControls: false,
      fullscreen: false,
      throughEarpiece: false,

      childDataId: this.props.navigation.state.params.childData.id,
      childDataUrl: [],
      dateCreated: [],
      arrOfTime: [],
      arrOfUrls: [],

      uri: null,
      isAlreadyPlay: false,
      duration: "00:00:00",
      timeElapsed: "00:00:00",
      percent: 0,
      current_track: 0,
      soundObj: new Audio.Sound(),
      inprogress: false,
      playerStatus: null,
      audioRecorderPlayer: new AudioRecorderPlayer(),
    };
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
    // console.log("ref.getDownloadURL(): ", this.state.arrOfTime);

    console.log("1: ", item);
    return (
      <View style={styless.listItem}>
        <View style={styless.flexbox_container}>
          <View style={styless.row}>
            <Button
              style={styless.button}
              onPress={() => this.downloadAudio(item)} //this.state.soundObject.playAsync()}
              title="Play"
            ></Button>
            <Button
              style={styless.button}
              onPress={() => this.onPausePress(item)} //this.state.soundObject.playAsync()}
              title="Pause"
            ></Button>
            <Button
              style={styless.button}
              onPress={() => Sharing.shareAsync(soundObject.file)}
              title="Share"
            ></Button>
          </View>
          <View>
            <View>
              <Slider
                minimumValue={0}
                maximumValue={100}
                trackStyle={styless.track}
                thumbStyle={styless.thumb}
                minimumTrackTintColor="#93A8B3"
                value={this._getSeekSliderPosition()}
                onValueChange={this._onSeekSliderValueChange}
                onSlidingComplete={this._onSeekSliderSlidingComplete}
              />
            </View>
            <View style={styless.timestampRow}>
              <Text
                style={[styless.textLight, styles.timeStamp]}
                onValueChange={this._getTimestamp()}
              >
                {""}
                {/* {this.state.isBuffering ? BUFFERING_STRING : ""} */}
              </Text>
              <Text style={[styless.textLight, styles.timeStamp]}>
                {this._getTimestamp()}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };
  _getSeekSliderPosition() {
    // console.log("111 _getSeekSliderPosition vale: ");

    if (
      this.state.soundObj != null &&
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
  _onSeekSliderValueChange = (value) => {
    // console.log("111 _onSeekSliderValueChange vale: ", value);

    if (this.state.soundObj != null && !this.isSeeking) {
      this.isSeeking = true;
      this.shouldPlayAtEndOfSeek = this.state.shouldPlay;
      this.state.soundObj.pauseAsync();
    }
  };
  _onSeekSliderSlidingComplete = async (value) => {
    // console.log("111 _onSeekSliderSlidingComplete vale: ", value);

    if (this.state.soundObj != null) {
      this.isSeeking = false;
      const seekPosition = value * this.state.playbackInstanceDuration;
      if (this.shouldPlayAtEndOfSeek) {
        this.state.soundObj.playFromPositionAsync(seekPosition);
      } else {
        this.state.soundObj.setPositionAsync(seekPosition);
      }
    }
  };
  _getTimestamp() {
    // console.log(
    //   "111 _getTimestamp vale: ",
    //   this.state.playbackInstancePosition,
    //   " posi: ",
    //   this.state.playbackInstanceDuration
    // );

    if (
      this.state.soundObj != null &&
      this.state.playbackInstancePosition != null &&
      this.state.playbackInstanceDuration != null
    ) {
      // console.log(
      //   "999 call _getMMSSFromMillis:",
      //   this._getMMSSFromMillis(this.state.playbackInstancePosition)
      // );
      return `${this._getMMSSFromMillis(
        this.state.playbackInstancePosition
      )} / ${this._getMMSSFromMillis(this.state.playbackInstanceDuration)}`;
    }
    return "";
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

  async componentDidMount() {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      playsInSilentLockedModeIOS: true,
      // interruptionModeIOS: 0,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true,
    });

    // var arrOfTime = [];
    // var arrOfUrls = [];
    var id = 0;
    var formattedDate = "";
    const imageRefs = await firebase
      .storage()
      .ref()
      .child(this.state.childDataId + "/")
      .listAll()
      .then((res) => {
        const fileNamesArray = res.items.map((i) => i.name);
        res.items.map(
          (ref) => console.log("9999: ", ref)
          // ref.getMetadata(ref).then((metadata) => {
          //   formattedDate = moment(metadata.timeCreated)
          //     .utc()
          //     .format("YYYY-MM-DD");

          // this.setState({
          //   dateCreated: formattedDate,
          //   arrOfTime: formattedDate,
          // });
          // })
        );

        // Promise.all(res.items.map((ref) => ref.getDownloadURL())).then(
        //   (ref) => {
        //     console.log("1111 9999 urls: ", this.state.arrOfTime);
        //     // this.state.arrOfUrls.push(ref);
        //     // this.state.childDataUrl.push({
        //     //   url: ref,
        //     // });
        //     this.setState({
        //       childDataUrl: ref,
        //       arrOfUrls: ref,
        //     });
        //   }
        // );
      });

    // await Promise.all(imageRefs.items.map((ref) => ref.getDownloadURL())).then(
    //   (ref) => {
    //     console.log("1111 9999 22233 urls: ", ref);
    //     this.setState({
    //       childDataUrl: ref,
    //     });
    //   }
    // );
  }
  async downloadAudio(item) {
    if (this.soundObj != null) {
      await this.soundObj.unloadAsync();
      // this.playbackInstance.setOnPlaybackStatusUpdate(null);
      this.soundObj = null;
    }
    const source = { uri: item };
    const initialStatus = {
      shouldPlay: true,
      rate: this.state.rate,
      shouldCorrectPitch: this.state.shouldCorrectPitch,
      volume: this.state.volume,
      isMuted: this.state.muted,
      // // UNCOMMENT THIS TO TEST THE OLD androidImplementation:
      // androidImplementation: 'MediaPlayer',
    };
    try {
      await Audio.Sound.createAsync(
        source,
        initialStatus,
        this._onPlaybackStatusUpdate
      );

      // await this.state.soundObj.loadAsync({ uri: item });
      // this._onPlaybackStatusUpdate;
      console.log("url: ", item);

      // Get Player Status
      this.state.playerStatus = await this.state.soundObj.getStatusAsync();
      // Play if song is loaded successfully
      if (this.state.playerStatus.isLoaded) {
        if (this.state.playerStatus.isPlaying === false) {
          this.state.isAlreadyPlay = true;
          this.state.inprogress = true;

          this.state.playbackInstancePosition =
            this.state.playerStatus.positionMillis;
          this.state.playbackInstanceDuration =
            this.state.playerStatus.durationMillis;

          this.state.shouldPlay = this.state.playerStatus.shouldPlay;

          this.state.duration = this.state.playerStatus.durationMillis;

          this.state.soundObj.playAsync(this._onPlaybackStatusUpdate);
        }
      }
    } catch (error) {
      console.log("error:", error);
    }
  }

  onPausePress = async (e) => {
    this.state.isAlreadyPlay = false;
    this.state.soundObj.pauseAsync();
  };

  changeTime = async (seconds) => {
    // 50 / duration
    console.log("999 this.state.duration: ", this.state.duration);
    var seektime = (seconds / 100) * this.state.duration;
    this.state.timeElapsed = seektime;
    console.log("999 this.state.duration: ", this.state.timeElapsed);
    // this.state.percent = seektime;
    this.state.soundObj.setProgressUpdateIntervalAsync(seektime);
    this.state.soundObj.setPositionAsync(seektime);
  };

  _updateScreenForLoading(isLoading) {
    if (isLoading) {
      this.setState({
        showVideo: false,
        isPlaying: false,
        // playbackInstanceName: LOADING_STRING,
        playbackInstanceDuration: null,
        playbackInstancePosition: null,
        isLoading: true,
      });
    } else {
      this.setState({
        // playbackInstanceName: PLAYLIST[this.index].name,
        // showVideo: PLAYLIST[this.index].isVideo,
        isLoading: false,
      });
    }
  }

  _onPlaybackStatusUpdate = (status) => {
    console.log("FATAL PLAYER ERROR: ", status);

    if (status.isLoaded) {
      this.setState({
        playbackInstancePosition: status.positionMillis,
        playbackInstanceDuration: status.durationMillis,
        shouldPlay: status.shouldPlay,
        isPlaying: status.isPlaying,
        isBuffering: status.isBuffering,
        rate: status.rate,
        muted: status.isMuted,
        volume: status.volume,
        // loopingType: status.isLooping ? LOOPING_TYPE_ONE : LOOPING_TYPE_ALL,
        shouldCorrectPitch: status.shouldCorrectPitch,
      });
      if (status.didJustFinish && !status.isLooping) {
        // this._advanceIndex(true);
        this._updatePlaybackInstanceForIndex(true);
      }
    } else {
      if (status.error) {
        console.log(`FATAL PLAYER ERROR: ${status.error}`);
      }
    }
  };

  async _updatePlaybackInstanceForIndex(playing) {
    this._updateScreenForLoading(true);
  }
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
export default History;
