import React, { Component } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Image } from "react-native";
import * as firebase from "firebase";

import { GetHeaderOnly } from "../style/TopNavigation";
import styles from "../style/Style.js";

export default class Loading extends Component {
  static navigationOptions = GetHeaderOnly();

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      this.navigateToNext(user);
    });
  }

  navigateToNext = async (user) => {
    if (user) {
      console.log("getting profile data");
      var user = firebase.auth().currentUser;
      console.log("profiles/" + user.uid);
      firebase
        .database()
        .ref("profiles/" + user.uid)
        .once("value", (snapshot) => {
          console.log("getting profile data");
          console.log(snapshot.val());

          if (snapshot.val() != null) {
            this.props.navigation.navigate("Home", {
              appUser: user.email.toLowerCase(),
            });
          } else {
            console.log("could not find user data");
            this.props.navigation.navigate("Sign Up", {
              appUser: user.email.toLowerCase(),
            });
          }
        })
        .catch((error) => {
          console.log("could not find user data");
          this.props.navigation.navigate("Sign Up", {
            appUser: user.email.toLowerCase(),
          });
        });
    } else {
      this.props.navigation.navigate("Sign In");
    }
  };

  render() {
    console.log("loading");

    return (
      <View style={styles.loading}>
        <Image
          source={require("../../assets/logo.png")}
          style={{ width: "100%", height: "60%" }}
        />
      </View>
    );
  }
}
