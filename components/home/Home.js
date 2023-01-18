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
  }

  showHistory = async () => {
    this.props.navigation.navigate("History", {
      childData: this.props.navigation.state.params.childData,
    });
  };

  start = () => {
    this.props.navigation.navigate("Start Test", {
      appUser: this.props.navigation.state.params.appUser,
      childData: this.props.navigation.state.params.childData,
    });
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
