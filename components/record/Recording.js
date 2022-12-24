// import React, { Component, Fragment } from "react";
// import {
//   View,
//   Text,
//   ActivityIndicator,
//   StyleSheet,
//   Image,
//   Card,
//   Background,
//   Logo,
//   Header,
//   Title,
//   Divider,
//   Button,
//   TouchableOpacity,
// } from "react-native";
// import styles from "../style/Style.js";
// import { StatusBar } from "expo-status-bar";
// import { Audio } from "expo-av";
// import * as Sharing from "expo-sharing";

// class Recording extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       isLoggingIn: false,
//       recording: "",
//       recordings: [],
//       message: "",
//     };
//     console.log("999: Recording");
//   }

//   render() {
//     return (
//       <View style={styless.container}>
//         <Text>{this.state.message}</Text>
//         <Button
//           title={this.state.recording ? "Stop Recording" : "Start Recording"}
//           onPress={
//             this.state.recording ? this.stopRecording : this.startRecording
//           }
//         />
//         {this.getRecordingLines()}
//         <StatusBar style="auto" />
//       </View>
//     );
//   }

//   async startRecording() {
//     try {
//       const permission = await Audio.requestPermissionsAsync();

//       if (permission.status === "granted") {
//         await Audio.setAudioModeAsync({
//           allowsRecordingIOS: true,
//           playsInSilentModeIOS: true,
//         });

//         const { recording } = await Audio.Recording.createAsync(
//           Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
//         );

//         this.state.recordings = recording;
//       } else {
//         setMessage("Please grant permission to app to access microphone");
//       }
//     } catch (err) {
//       console.error("Failed to start recording", err);
//     }
//   }

//   async stopRecording() {
//     this.state.recording = undefined;
//     await this.state.recording.stopAndUnloadAsync();

//     let updatedRecordings = [...this.state.recordings];
//     const { sound, status } =
//       await this.state.recording.createNewLoadedSoundAsync();
//     updatedRecordings.push({
//       sound: sound,
//       duration: this.getDurationFormatted(status.durationMillis),
//       file: this.state.recording.getURI(),
//     });

//     this.state.recordings = updatedRecordings;
//   }

//   getDurationFormatted(millis) {
//     const minutes = millis / 1000 / 60;
//     const minutesDisplay = Math.floor(minutes);
//     const seconds = Math.round((minutes - minutesDisplay) * 60);
//     const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
//     return `${minutesDisplay}:${secondsDisplay}`;
//   }

//   getRecordingLines() {
//     return this.state.recordings.map((recordingLine, index) => {
//       return (
//         <View key={index} style={styless.row}>
//           <Text style={styless.fill}>
//             Recording {index + 1} - {recordingLine.duration}
//           </Text>
//           <Button
//             style={styless.button}
//             onPress={() => recordingLine.sound.replayAsync()}
//             title="Play"
//           ></Button>
//           <Button
//             style={styless.button}
//             onPress={() => Sharing.shareAsync(recordingLine.file)}
//             title="Share"
//           ></Button>
//         </View>
//       );
//     });
//   }
// }

import { StatusBar } from "expo-status-bar";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { Audio } from "expo-av";
import * as Sharing from "expo-sharing";

export default function Recording() {
  const [recording, setRecording] = React.useState();
  const [recordings, setRecordings] = React.useState([]);
  const [message, setMessage] = React.useState("");

  async function startRecording() {
    try {
      const permission = await Audio.requestPermissionsAsync();

      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );

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
        <View key={index} style={styles.row}>
          <Text style={styles.fill}>
            Recording {index + 1} - {recordingLine.duration}
          </Text>
          <Button
            style={styles.button}
            onPress={() => recordingLine.sound.replayAsync()}
            title="Play"
          ></Button>
          <Button
            style={styles.button}
            onPress={() => Sharing.shareAsync(recordingLine.file)}
            title="Share"
          ></Button>
        </View>
      );
    });
  }

  return (
    <View style={styles.container}>
      <Text>{message}</Text>
      <Button
        title={recording ? "Stop Recording" : "Start Recording"}
        onPress={recording ? stopRecording : startRecording}
      />
      {getRecordingLines()}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
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
// const styless = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   row: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   fill: {
//     flex: 1,
//     margin: 16,
//   },
//   button: {
//     margin: 16,
//   },
// });
// export default Recording;
