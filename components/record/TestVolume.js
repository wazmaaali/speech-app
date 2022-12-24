import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Button, Card, Icon } from "react-native-elements";

import * as Permissions from "expo-permissions";
import * as Speech from "expo-speech";

import GetHeaderOnly from "../style/TopNavigation";
import styles from "../style/Style.js";
import LabelledIcon from "../style/LabelledIcon";
import { myColors } from "../style/colors";

import { playRecording, prepSound } from "./playRecording";

class TestVolume extends Component {
  constructor(props) {
    super(props);
    this.state = {
      done: false,
      listened: false,
      soundCounter: 0,
    };
    testSound: null;
  }

  setDone = () => {
    this.setState({ done: true });
    //Speech.stop();
    this.testSound.stopAsync();
    this.props.navigation.navigate("Recording", {
      appUser: this.props.navigation.state.params.appUser,
    });
  };

  setListenedToTrue = () => {
    console.log("Setting listened to true");
    this.setState({ listened: true });
  };
  async startSound() {
    this.playSound();
    //       this.state.interval = setInterval(()=> {this.playSound()}, 3000);
  }
  async playSound() {
    this.testSound = await prepSound(
      require("../../assets/sounds/testSound.wav")
    );
    this.testSound.setIsLoopingAsync(true);

    if (!this.state.done) {
      this.setListenedToTrue();
      await this.testSound.playAsync();
    }
    //     {
    //       await Speech.speak("1, 2, 3", {
    //       language: 'en',
    //       pitch: 1,
    //       rate: 0.9,
    //       });
    //     }
  }

  static navigationOptions = ({ navigation }) => {
    return GetHeaderOnly(navigation);
  };

  render() {
    return (
      <View flex style={styles.imageContainer}>
        <View
          style={{
            paddingTop: 10,
            paddingBottom: 10,
            justifyContent: "space-around",
            backgroundColor: "white",
            width: "90%",
            borderRadius: 10,
            alignSelf: "center",
          }}
        >
          <View>
            {/* Title */}
            <Text style={styles.title}>Adjust Volume</Text>

            {/* Instructions */}
            <Text style={styles.instructions}>
              Adjust your device volume to clearly hear 1, 2, 3.
            </Text>

            {/* Actions */}

            {!this.state.listened && (
              <TouchableOpacity
                onPress={() => {
                  this.startSound();
                }}
              >
                <LabelledIcon
                  name="play-outline"
                  type="ionicon"
                  color={myColors.third}
                  label="Play 1, 2, 3"
                  style={styles.actionButton}
                />
              </TouchableOpacity>
            )}
            {this.state.listened && (
              <TouchableOpacity
                onPress={() => {
                  this.setDone();
                }}
              >
                <LabelledIcon
                  name="checkmark-done-circle-outline"
                  type="ionicon"
                  color={myColors.third}
                  label="Done"
                  style={styles.actionButton}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  }
}

export default TestVolume;
