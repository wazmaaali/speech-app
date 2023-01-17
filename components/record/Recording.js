import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Audio } from "expo-av";
import * as Sharing from "expo-sharing";
import LabelledIcon from "../style/LabelledIcon";
import { myColors } from "../style/colors";
import styles from "../style/Style.js";
import * as firebase from "firebase";
import { VoiceQuality } from "expo-speech";

export default function Recording({ navigation }) {
  const [recording, setRecording] = React.useState();
  const [recordings, setRecordings] = React.useState([]);
  const [message, setMessage] = React.useState("");
  var childDataId = navigation.state.params.childData.id;

  async function startRecording() {
    try {
      const permission = await Audio.requestPermissionsAsync();

      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
          staysActiveInBackground: false,
        });

        const { recording } = await Audio.Recording.createAsync({
          android: {
            extension: ".wav",
            outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
            audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 128000,
          },
          ios: {
            extension: ".m4a",
            outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
            audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
            sampleRate: 44100,
            numberOfChannels: 1,
            bitRate: 96400,
            linearPCMBitDepth: 16,
            linearPCMIsBigEndian: false,
            linearPCMIsFloat: false,
          },
        });

        setRecording(recording);
      } else {
        setMessage("Please grant permission to app to access microphone");
      }
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();

    let updatedRecordings = [...recordings];
    const { sound, status } = await recording.createNewLoadedSoundAsync();
    updatedRecordings.push({
      sound: sound,
      duration: getDurationFormatted(status.durationMillis),
      file: recording.getURI(),
    });

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      playsInSilentLockedModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true,
    });
    setRecordings(updatedRecordings);
  }

  function getDurationFormatted(millis) {
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay}:${secondsDisplay}`;
  }

  function getRecordingLines() {
    return recordings.map((recordingLine, index) => {
      return (
        <View key={index} style={styless.row}>
          <Text style={styless.fill}>
            Recording {index + 1} - {recordingLine.duration}
          </Text>

          <Button
            style={styles.button}
            onPress={() => recordingLine.sound.replayAsync()}
            title="Play"
          ></Button>
          <Button
            style={styless.button}
            onPress={() => Sharing.shareAsync(recordingLine.file)}
            title="Share"
          ></Button>
        </View>
      );
    });
  }

  return (
    <View
      style={{
        justifyContent: "center",
        flex: 1,
      }}
    >
      <Text>{message}</Text>
      <View>
        <TouchableOpacity onPress={recording ? stopRecording : startRecording}>
          <LabelledIcon
            name="play-outline"
            type="ionicon"
            color={myColors.third}
            label={recording ? "Stop Recording" : "Start Recording"}
            style={styles.actionButton}
          />
        </TouchableOpacity>
      </View>
      {getRecordingLines()}
      <StatusBar style="auto" />
      <TouchableOpacity
        onPress={() => {
          save();
        }}
      >
        <View
          style={{
            backgroundColor: myColors.third,
            marginTop: 15,
            borderColor: myColors.secondary,
            borderWidth: 1,
            borderRadius: 10,
            width: "90%",
            alignSelf: "center",
            paddingBottom: 12,
            paddingTop: 12,
          }}
        >
          <Text style={styles.name}>Save</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  async function save() {
    recordings.map(async (result, index) => {
      const response = await fetch(result.file);
      // console.log("999: ", result);
      const file = await response.blob();
      uploadAudio(file);
      console.log("do we see this?");
    });
  }

  async function uploadAudio(blob) {
    const filename = "records";
    console.log("2 do we see this?: ", childDataId);
    console.log("guidGenerator: ", guidGenerator());
    var ref = firebase
      .storage()
      .ref(childDataId)
      .child(guidGenerator())
      .put(blob);
    var flag = false;
    try {
      flag = true;
      console.log("2 do we see this?");

      await ref;
    } catch (error) {
      console.log("error: ", error);
    }
    if (flag) {
      console.log("3 do we see this?");

      Alert.alert("Recording uploaded");

      navigation.navigate("ListOfProfiles", {
        // childData: navigation.state.params.childData,
      });
    }
  }
  function guidGenerator() {
    var S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (
      S4() +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      S4() +
      S4()
    );
  }
}

const styless = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  fill: {
    flex: 1,
    margin: 16,
  },
  button: {
    margin: 16,
  },
});
