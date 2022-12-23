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

class ReadyToStart extends Component {
  constructor(props) {
    super(props);
  }

  start = async () => {
    this.props.navigation.navigate("CardNavigation", {
      appUser: this.props.navigation.state.params.appUser,
    });
  };

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
            backgroundColor: myColors.third,
            width: "90%",
            borderRadius: 10,
            alignSelf: "center",
          }}
        >
          <View>
            {/* Title */}
            <Text style={styles.title}>Recording Instructions</Text>

            {/* Instructions */}

            <Text style={styles.instructions}>
              Listen to the prompts and record your speech samples. Your
              recordings will be used for research purposes.
            </Text>

            <Text style={styles.instructions}>Ready To Start?</Text>

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
        </View>
      </View>
    );
  }
}

export default ReadyToStart;
