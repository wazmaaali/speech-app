import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, ActivityIndicator } from "react-native";
import styles, { historyStyles } from "../style/Style.js";
import * as firebase from "firebase";
import { Audio } from "expo-av";
import * as Sharing from "expo-sharing";
import Slider from "@react-native-community/slider";
import AudioRecorderPlayer from "react-native-audio-recorder-player";
import moment from "moment";
import { _DEFAULT_PROGRESS_UPDATE_INTERVAL_MILLIS } from "expo-av/build/AV.js";

export default function History(props) {
  const childDataId = props.navigation.state.params.childData.id;
  const soundObj = new Audio.Sound();
  let currentIndexPlaying = null;
  const [shouldPlay, setShouldPlay] = useState(false);
  const [audioItems, setAudioItems] = useState([]);
  const [positions, setPositions] = useState([]);
  const [durations, setDurations] = useState([]);
  const [soundObjList, setSoundObjList] = useState([]);
  const [playersStatusList, setPlayersStatusList] = useState([]);
  const [shouldPlaySound, setShouldPlaySound] = useState([]);
  const [isPlayingSound, setIsPlayingSound] = useState([]);
  const [shouldPlayAtEndOfSeeks, setshouldPlayAtEndOfSeeks] = useState([]);
  // const [currentIndexPlaying, setCurrentIndexPlaying] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        playsInSilentLockedModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: true,
      });
      const newAudioItems = [];
      firebase
        .storage()
        .ref()
        .child(childDataId + "/")
        .listAll()
        .then(async (res) => {
          res.items.map(async (item) => {
            const audioItem = {
              url: null,
              date: null,
            };
            await item.getDownloadURL().then((url) => (audioItem.url = url));
            await item.getMetadata().then((data) => {
              audioItem.date = moment(data.timeCreated)
                .utc()
                .format("YYYY-MM-DD");
            });

            newAudioItems.push(audioItem);
          });
          const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
          await sleep(3000);
          setAudioItems(newAudioItems);
          loadAudio(newAudioItems);
        });

      // return newAudioItems;
    };

    fetchData()
      .then((res) => {
        // if (res) {
        //   setAudioItems(res);
        // }
      })
      .catch((e) => console.log(e));
    return () => {
      // if (soundObjList != null) {
      //   for (let i = 0; i < soundObjList.length; i++) {
      //     soundObjList[i].unloadAsync();
      //   }
      // }
    };
  }, []);

  const loadAudio = async (item) => {
    for (let i = 0; i < item.length; i++) {
      const ss = new Audio.Sound();

      const source = { uri: item[i].url };
      const initialStatus = {
        shouldPlay: false,
      };
      try {
        await ss.loadAsync(
          source,
          initialStatus,
          _DEFAULT_PROGRESS_UPDATE_INTERVAL_MILLIS
        );
        // Get Player Status
        ss.setOnPlaybackStatusUpdate(_onPlaybackStatusUpdate);

        soundObjList.push(ss);
      } catch (error) {
        console.log("error:", error);
      }
    }
  };
  const _onPlaybackStatusUpdate = (playbackStatus) => {
    if (playbackStatus.isLoaded === true) {
      if (currentIndexPlaying !== null && !playbackStatus.isAlreadyPlaying) {
        console.log(
          "playbackStatus.positionMillis: ",
          playbackStatus.positionMillis
        );
        positions[currentIndexPlaying] = playbackStatus.positionMillis;
        durations[currentIndexPlaying] = playbackStatus.durationMillis;
        playersStatusList[currentIndexPlaying] = playbackStatus;
        // getTimestamp();
      } else {
        playersStatusList.push(playbackStatus);
        positions.push(playbackStatus.positionMillis);
        durations.push(playbackStatus.durationMillis);
        if (playbackStatus.didJustFinish) {
          // updatePlaybackInstanceForIndex(true);
        } else {
          // updatePlaybackInstanceForIndex(false);
          if (playbackStatus.error) {
            console.log(`FATAL PLAYER ERROR: ${playbackStatus.error}`);
          }
        }
      }
    }
  };

  const updatePlaybackInstanceForIndex = async (playing) => {
    updateScreenForLoading(playing);
  };

  const updateScreenForLoading = (isLoading) => {
    if (isLoading) {
      isPlayingSound[currentIndexPlaying] = false;
      durations[currentIndexPlaying] = null;
      positions[currentIndexPlaying] = null;
      // setPosition(null);
      // setIsLoading(true);
    } else {
      // setIsLoading(false);
    }
  };

  const downloadAudio = async (index) => {
    currentIndexPlaying = index;
    // Play if song is loaded successfully
    if (playersStatusList[index].isLoaded) {
      if (playersStatusList[index].isPlaying === false) {
        console.log("999 downloadAudio positions[index]: ", positions[index]);

        positions[index] = playersStatusList[index].positionMillis;
        await soundObjList[index].replayAsync();
        soundObjList[index].setOnPlaybackStatusUpdate(_onPlaybackStatusUpdate);
      }
    }
  };
  const _getSeekSliderPosition = () => {
    console.log(
      "999 getSeekSliderPosition positions[index]: ",
      durations[currentIndexPlaying]
    );

    if (
      soundObjList[currentIndexPlaying] != null &&
      durations[currentIndexPlaying] != null &&
      positions[currentIndexPlaying] != null
    ) {
      return `${positions[currentIndexPlaying]} / ${durations[currentIndexPlaying]}`;
    }
    return `0.00 / ${durations[currentIndexPlaying]}`;
  };

  const _onSeekSliderValueChange = (value) => {
    console.log("999 onSeekSliderValueChange value: ", value);

    if (soundObjList[currentIndexPlaying] != null) {
      // setIsSeeking(true);
      shouldPlayAtEndOfSeeks[currentIndexPlaying] =
        shouldPlaySound[currentIndexPlaying];
      console.log("999 onSeekSliderValueChange: ");

      soundObjList[currentIndexPlaying].pauseAsync();
    }
  };

  const _onSeekSliderSlidingComplete = async (value) => {
    console.log(
      "999 onSeekSliderSlidingComplete seekPosition[index]: ",
      positions[currentIndexPlaying]
    );

    if (soundObjList[currentIndexPlaying] != null) {
      setIsSeeking(false);
      const seekPosition = value * durations[currentIndexPlaying];
      console.log("999 seekPosition[index]: ", seekPosition);

      if (shouldPlayAtEndOfSeeks[currentIndexPlaying]) {
        console.log("999 playFromPositionAsync: ");

        soundObjList[currentIndexPlaying].playFromPositionAsync(seekPosition);
      } else {
        console.log("999 setPositionAsync: ");

        soundObjList[currentIndexPlaying].setPositionAsync(seekPosition);
      }
    }
  };

  const getTimestamp = (index) => {
    console.log(
      "999 getTimestamp seekPosition[index]: ",
      positions[currentIndexPlaying]
    );

    if (
      soundObjList[index] != null &&
      durations[index] != null &&
      positions[index] != null
    ) {
      return `${getMMSSFromMillis(positions[index])} / ${getMMSSFromMillis(
        durations[index]
      )}`;
    }
    return `0.00 / 0.00`;
  };

  const getMMSSFromMillis = (millis) => {
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
  };

  const onPressShare = async (index) => {
    console.log("999 share: ", index);
    Sharing.shareAsync(soundObjList[index].file);
    // Sharing.shareAsync(soundObj.file)
  };
  const onPressStop = async (index) => {
    soundObjList[index].stopAsync();
  };

  const Item = ({ item, index }) => {
    return (
      <View style={historyStyles.listItem}>
        <View style={historyStyles.flexbox_container}>
          <View style={historyStyles.row}>
            <Button
              style={historyStyles.button}
              onPress={() => {
                downloadAudio(index);
                // currentIndexPlaying = index;
                // setCurrentIndexPlaying(index);
              }}
              title="Play"
            ></Button>
            <Button
              style={historyStyles.button}
              onPress={() => onPressStop(index)}
              title="Stop"
            ></Button>
            <Button
              style={historyStyles.button}
              onPress={() => onPressShare(index)}
              title="Share"
            ></Button>
          </View>
          <View>
            <Slider
              minimumTrackTintColor="#93A8B3"
              value={_getSeekSliderPosition()}
              maximumValue={durations[currentIndexPlaying]}
              minimumValue={0.0}
              // value={
              //   index === currentIndexPlaying
              //     ? `${positions[currentIndexPlaying]} / ${durations[currentIndexPlaying]}`
              //     : `0.00 / ${durations[index]}`
              // }
              onValueChange={(value) => _onSeekSliderValueChange(value)}
              onSlidingComplete={_onSeekSliderSlidingComplete}
            />

            <View style={historyStyles.timestampRow}>
              <Text style={[historyStyles.textLight, historyStyles.timeStamp]}>
                {item.date}
              </Text>
              <Text style={[historyStyles.textLight, historyStyles.timeStamp]}>
                {getTimestamp(index)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={historyStyles.container}>
      <FlatList
        style={{ flex: 1 }}
        data={audioItems}
        renderItem={({ item, index }) => <Item item={item} index={index} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
