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

import GetHeaderOnly from "../style/TopNavigation";
import styles from "../style/Style.js";
import LabelledIcon from "../style/LabelledIcon";
import { myColors } from "../style/colors";

class TestCompleted extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noMicAccess: false,
    };
  }

  start = async () => {
    status = await this.getMicrophonePermissions();
    if (status) {
      this.props.navigation.navigate("TestVolume", {
        appUser: this.props.navigation.state.params.appUser,
      });
    } else {
      this.setState({ noMicAccess: true });
    }
  };

  openSettings = () => {
    Linking.openURL("app-settings:");
    this.setState({ noMicAccess: false });
  };
  async getMicrophonePermissions() {
    microphonePermissionStatus = await Permissions.askAsync(
      Permissions.AUDIO_RECORDING
    );
    return microphonePermissionStatus.permissions.audioRecording.granted;
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
            backgroundColor: myColors.secondary_old,
            width: "90%",
            borderRadius: 10,
            alignSelf: "center",
          }}
        >
          {/* Initial state of the page assumes microphone access is granted */}
          {!this.state.noMicAccess && (
            <View>
              {/* Title */}
              <Text style={styles.title}>Volume Test</Text>

              {/* Instructions */}
              <Text style={styles.instructions}>
                First, let's test your volume
              </Text>

              {/* Actions */}

              <TouchableOpacity
                onPress={() => {
                  this.start();
                }}
              >
                <LabelledIcon
                  name="play-outline"
                  type="ionicon"
                  color={myColors.third}
                  label="Start"
                  style={styles.actionButton}
                />
              </TouchableOpacity>
            </View>
          )}

          {/* Microphone access has not been granted */}
          {this.state.noMicAccess && (
            <View>
              <Text>
                Please give this application access to the microphone to
                proceed. You will use the microphone to record your speech
                samples for analysis. You can enable microphone access through
                Application Settings.
              </Text>
              <Button
                title="Open Application Settings"
                onPress={this.openSettings}
              />
            </View>
          )}
        </View>
      </View>
    );
  }
}

export default TestCompleted;
