import React, { useEffect } from "react";
import useState from "react-usestateref";
import * as firebase from "firebase";
import moment from "moment";

import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Button,
  ActivityIndicator,
} from "react-native";
import { Audio } from "expo-av";
import Slider from "@react-native-community/slider";
import styles, { historyStyles } from "../style/Style.js";

export default function History(props) {
  const childDataId = props.navigation.state.params.childData.id;

  const [soundObjList, setSoundObjList, soundObjListRef] = useState([]);
  const [currentIndex, setCurrentIndex, currentIndexRef] = useState(null);
  const [dateAudioCreated, setDateAudioCreated] = useState([]);
  const [shouldPlayAtEndOfSeeks, setShouldPlayAtEndOfSeeks] = useState();
  const [isSeeking, setIsSeeking] = useState(false);

  async function initAudio(remoteAudioList) {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      playsInSilentLockedModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true,
    });

    await Promise.all(
      remoteAudioList.map(
        async (location) => await Audio.Sound.createAsync({ uri: location.url })
      )
    ).then((res) => {
      const currentSoundObjList = [];
      if (res) {
        res.map((soundObj) =>
          currentSoundObjList.push({
            sound: soundObj.sound,
            position: 0,
            duration: soundObj.status.durationMillis,
            isPlaying: false,
          })
        );
        setSoundObjList(currentSoundObjList);
      }
    });
  }

  useEffect(() => {
    const fetchData = async () => {
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
            dateAudioCreated.push(audioItem.date);
          });
          const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
          await sleep(3000);
          initAudio(newAudioItems);
        });
    };
    fetchData()
      .then((res) => {
        // if (res) {
        //   setAudioItems(res);
        // }
      })
      .catch((e) => console.log(e));
  }, []);

  // Check if any sound is playing and return the sound object and its index or null
  async function isSoundPlaying() {
    let soundPlaying = null;
    const newSoundObjList = [...soundObjListRef.current];
    newSoundObjList.map((item, index) => {
      if (item.isPlaying) {
        soundPlaying = { sound: item.sound, index: index };
      }
    });
    return soundPlaying;
  }

  function changeSoundPlayingStatus(index) {
    const newSoundObjList = [...soundObjListRef.current];
    newSoundObjList[index].isPlaying = false;
    setSoundObjList(newSoundObjList);
  }

  // Checks if any sound is playing and pauses it before playing the new sound
  async function playSound(sound) {
    await isSoundPlaying().then(async (soundPlaying) => {
      if (soundPlaying) {
        changeSoundPlayingStatus(soundPlaying.index);
        await pauseSound(soundPlaying.sound).then(async () => {
          await sound
            .playAsync()
            .then(() => sound.setOnPlaybackStatusUpdate(statusUpdate));
        });
      } else {
        await sound
          .playAsync()
          .then(() => sound.setOnPlaybackStatusUpdate(statusUpdate));
      }
    });
  }

  async function replaySound(sound) {
    await isSoundPlaying().then(async (soundPlaying) => {
      if (soundPlaying) {
        changeSoundPlayingStatus(soundPlaying.index);
        await pauseSound(soundPlaying.sound).then(async () => {
          await sound
            .replayAsync()
            .then(() => sound.setOnPlaybackStatusUpdate(statusUpdate));
        });
      } else {
        await sound
          .replayAsync()
          .then(() => sound.setOnPlaybackStatusUpdate(statusUpdate));
      }
    });
  }

  async function pauseSound(sound) {
    await sound.pauseAsync().then(() => {
      sound.setOnPlaybackStatusUpdate(statusUpdate);
    });
  }

  function statusUpdate(playbackStatus) {
    const newSoundObjList = [...soundObjListRef.current];
    if (newSoundObjList[currentIndexRef.current]) {
      newSoundObjList[currentIndexRef.current].position =
        playbackStatus.positionMillis;
      newSoundObjList[currentIndexRef.current].isPlaying =
        playbackStatus.isPlaying;
      setSoundObjList(newSoundObjList);
    }
  }

  function convertMilliSeconds(ms) {
    var min = Math.floor((ms / (1000 * 60)) % 60);
    var sec = Math.floor((ms / 1000) % 60);
    return min + ":" + sec;
  }
  const _onSeekSliderValueChange = (value) => {
    const newSoundObjList = [...soundObjListRef.current];
    if (newSoundObjList[currentIndexRef.current] && !setIsSeeking) {
      setIsSeeking(true);
      const newPosition =
        value * newSoundObjList[currentIndexRef.current].duration;
      newSoundObjList[currentIndexRef.current].position = newPosition;
      setSoundObjList(newSoundObjList);
    }
  };

  const _onSeekSliderSlidingComplete = async (value) => {
    const newSoundObjList = [...soundObjListRef.current];
    if (newSoundObjList[currentIndexRef.current]) {
      const newPosition =
        value * newSoundObjList[currentIndexRef.current].duration;
      newSoundObjList[currentIndexRef.current].position = newPosition;
      setSoundObjList(newSoundObjList);
      setIsSeeking(false);
      setShouldPlayAtEndOfSeeks(true);
    }
  };
  function AudioPlayerComponent(props) {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
          margin: 5,
        }}
      >
        <View
          style={{
            flex: 0.5,
            alignSelf: "stretch",
            justifyContent: "flex-end",
          }}
        >
          {props.isPlaying ? (
            <Button
              title="Pause Sound"
              onPress={() => {
                setCurrentIndex(props.index);
                pauseSound(props.sound);
              }}
            />
          ) : props.position == props.duration && props.position > 0 ? (
            <Button
              title="Replay Sound"
              onPress={() => {
                setCurrentIndex(props.index);
                replaySound(props.sound);
              }}
            />
          ) : (
            <Button
              title="Play Sound"
              onPress={() => {
                setCurrentIndex(props.index);
                playSound(props.sound);
              }}
            />
          )}
        </View>
        <View
          style={{
            flex: 0.5,
            alignSelf: "stretch",
          }}
        >
          <Slider
            // disabled={true}
            value={props.position}
            minimumValue={0}
            maximumValue={props.duration}
            minimumTrackTintColor="#537FE7"
            maximumTrackTintColor="#E9F8F9"
            // onValueChange={_onSeekSliderValueChange}
            // onSlidingComplete={_onSeekSliderSlidingComplete}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: 11, fontWeigh: "500", color: "#B6B7BF" }}>
              {convertMilliSeconds(props.position)}/
              {convertMilliSeconds(props.duration)}
            </Text>
            <Text
              style={{
                fontSize: 11,
                fontWeigh: "500",
                color: "#B6B7BF",
              }}
            >
              {dateAudioCreated[props.index]}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styless.container}>
        {soundObjListRef.current.length != 0 ? (
          soundObjListRef.current.map((item, index) => (
            <AudioPlayerComponent
              key={index}
              index={index}
              sound={item.sound}
              isPlaying={item.isPlaying}
              position={item.position}
              duration={item.duration}
            />
          ))
        ) : (
          <ActivityIndicator size={"large"} color={"#537FE7"} />
        )}
      </View>
    </ScrollView>
  );
}

const styless = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
