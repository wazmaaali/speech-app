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
import { getDateOfLastCompletedTest } from "../dataStore/DataAccess";
import moment from "moment-timezone";
import * as firebase from "firebase";

class Home extends React.Component {
  constructor(props) {
    super(props);
    //Work on dob lATER
    console.log(
      "999 Im in home: ",
      this.props.navigation.state.params.childData
    );
    this.state = {
      missing_profile: true,
    };
  }

  showHistory = async () => {
    // var lastCompletedDate = await getDateOfLastCompletedTest();
    // var messageTitleVar = "";
    // var messageVar = "";

    // if (lastCompletedDate == null) {
    //   messageTitleVar = "You have not completed any recordings";
    //   messageVar =
    //     "Select New Test from the App Home to start a new recording.";
    // } else {
    //   messageTitleVar = "Date of last recording";
    //   messageVar = lastCompletedDate;
    // }
    console.log(
      "999999999 home: ",
      this.props.navigation.state.params.childData.id
    );

    this.props.navigation.navigate("History", {
      childData: this.props.navigation.state.params.childData,
      // messageTitle: messageTitleVar,
      // message: messageVar,
    });
  };

  start = () => {
    console.log(
      "999 Im in home: ",
      this.props.navigation.state.params.childData
    );

    this.props.navigation.navigate("Start Test", {
      appUser: this.props.navigation.state.params.appUser,
      childData: this.props.navigation.state.params.childData,
    });
  };

  static navigationOptions = ({ navigation }) => {
    return GetHeaderOnly(navigation);
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
