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

import GetTopNavigation from "../style/TopNavigation";
import styles from "../style/Style.js";
import LabelledIcon from "../style/LabelledIcon";
import { myColors } from "../style/colors";
import { getDateOfLastCompletedTest } from "../dataStore/DataAccess";
import moment from "moment-timezone";
import * as firebase from "firebase";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      missing_profile: true,
    };
  }

  showHistory = async () => {
    var lastCompletedDate = await getDateOfLastCompletedTest();
    var messageTitleVar = "";
    var messageVar = "";

    if (lastCompletedDate == null) {
      messageTitleVar = "You have not completed any recordings";
      messageVar =
        "Select New Test from the App Home to start a new recording.";
    } else {
      messageTitleVar = "Date of last recording";
      messageVar = lastCompletedDate;
    }
    this.props.navigation.navigate("Info", {
      messageTitle: messageTitleVar,
      message: messageVar,
    });
  };

  start = () => {
    this.props.navigation.navigate("Start Test", {
      appUser: this.props.navigation.state.params.appUser,
    });
  };

  static navigationOptions = ({ navigation }) => {
    return GetTopNavigation(navigation);
  };

  render() {
    return (
      <View style={styles.containerView}>
        <View style={{ flex: 1 }}></View>
        <View style={{ flex: 1 }}>
          {/* Title */}
          <Text style={styles.title}>Speech App</Text>
        </View>
        <View style={{ flex: 1, justifyContent: "space-around" }}>
          {/* Actions */}
          <TouchableOpacity
            style={styles.unselectedBox}
            onPress={() => {
              this.showHistory();
            }}
          >
            <Text style={styles.name}>History</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              this.start();
            }}
            style={styles.unselectedBox}
          >
            <Text style={styles.name}>New Test</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}></View>
      </View>
    );
  }
}

export default Home;
