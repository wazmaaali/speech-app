import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Linking,
} from "react-native";
import { Input } from "react-native-elements";
import DateTimePicker from "@react-native-community/datetimepicker";

import { GetHeaderOnly } from "../style/TopNavigation";

import { Button, Card, Icon } from "react-native-elements";

import GetTopNavigation from "../style/TopNavigation";
import styles from "../style/Style.js";
import LabelledIcon from "../style/LabelledIcon";
import { myColors } from "../style/colors";

import * as firebase from "firebase";

export default class CreateAProfile extends React.Component {
  constructor(props) {
    super(props);
    console.log("999 Im in CreateAProfile");

    this.state = {
      isPatientSelected: false,
      isPatient: false,
      firstName: "",
      lastName: "",

      dateOfBirth: new Date(),
      today: new Date(),
      dateSelected: false,

      isSexSelected: false,
      isMale: false,
      isFemale: false,
    };
    console.log("23 99999", this.props);
  }
  handleFirstName = (text) => {
    this.setState({ firstName: text });
  };

  handleLastName = (text) => {
    this.setState({ lastName: text });
  };
  setSex = (male, female) => {
    this.setState({
      isSexSelected: true,
      isMale: male,
      isFemale: female,
      isNoAnswer: !male && !female,
    });
  };

  getButtonStyle = (selected) => {
    var unselectedStyle = {
      backgroundColor: myColors.third,
      borderColor: myColors.secondary,
      borderWidth: 1,
      borderRadius: 10,
      width: "70%",
      marginBottom: 2,
      alignSelf: "center",
    };

    var selectedStyle = {
      width: "70%",
      borderRadius: 10,
      marginBottom: 2,
      backgroundColor: myColors.secondary,
      alignSelf: "center",
    };

    if (selected) {
      return selectedStyle;
    } else {
      return unselectedStyle;
    }
  };

  getButtonTextStyle = (selected) => {
    var nameStyle = {
      textAlign: "center",
      fontFamily: "System",
      fontSize: 22,
      fontWeight: "bold",
      color: myColors.secondary,
      width: "90%",
      alignSelf: "center",
    };
    if (selected) {
      nameStyle = [styles.name, { color: myColors.third }];
    }
    return nameStyle;
  };

  // static navigationOptions = ({ navigation }) => {
  //   return GetTopNavigation(navigation);
  // };

  render() {
    return (
      <View style={styles.containerView}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.containerView}
          >
            <View style={styles.input}>
              <Input
                clearButtonMode="always"
                containerStyle={styles.email}
                onChangeText={(text) => this.handleFirstName(text)}
                placeholder=" First Name"
              />
              <Input
                clearButtonMode="always"
                containerStyle={styles.email}
                onChangeText={(text) => this.handleLastName(text)}
                placeholder=" Last Name"
              />
            </View>

            <View style={styles.unselectedBox}>
              <Text style={styles.name}>Date Of Birth</Text>

              <DateTimePicker
                style={{
                  backgroundColor: "#edeab9",
                  borderColor: myColors.secondary,
                  borderWidth: 0.5,
                  color: myColors.third,
                  borderRadius: 10,
                }}
                testID="dateTimePicker"
                display="spinner"
                value={this.state.dateOfBirth}
                maximumDate={this.state.today}
                onChange={this.handleConfirm}
                textColor="black"
              />
            </View>

            <View>
              <TouchableOpacity
                onPress={() => {
                  this.setSex(true, false);
                }}
              >
                <View
                  style={this.getButtonStyle(
                    this.state.isSexSelected && this.state.isMale
                  )}
                >
                  <Text
                    style={this.getButtonTextStyle(
                      this.state.isSexSelected && this.state.isMale
                    )}
                  >
                    Male
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  this.setSex(false, true);
                }}
              >
                <View
                  style={this.getButtonStyle(
                    this.state.isSexSelected && this.state.isFemale
                  )}
                >
                  <Text
                    style={this.getButtonTextStyle(
                      this.state.isSexSelected && this.state.isFemale
                    )}
                  >
                    Female
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  this.setSex(false, false);
                }}
              >
                <View
                  style={this.getButtonStyle(
                    this.state.isSexSelected && this.state.isNoAnswer
                  )}
                >
                  <Text
                    style={this.getButtonTextStyle(
                      this.state.isSexSelected && this.state.isNoAnswer
                    )}
                  >
                    Prefer not to answer
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
        <TouchableOpacity
          onPress={() => {
            this.submit();
          }}
        >
          <LabelledIcon
            name="create-outline"
            type="ionicon"
            color="#edeab9"
            label="Create Profile"
            style={styles.actionButton}
          />
        </TouchableOpacity>
      </View>
    );
  }

  submit = () => {
    this.props.navigation.navigate("Info", {
      //appUser: this.props.navigation.state.params.appUser,
      messageTitle: "Profile Created",
      message:
        "Thank you for creating your profile data. It will help improve the accuracy of our software.",
    });
    var userId = firebase.auth().currentUser.uid;

    // var isPatient = this.props.navigation.state.params.isPatient;
    var firstName = this.props.navigation.state.params.firstName;
    var lastName = this.props.navigation.state.params.lastName;
    var dateOfBirth = this.props.navigation.state.params.dateOfBirth;
    var email = "wazma@slu.edu"; //this.props.navigation.state.params.appUser;

    firebase
      .database()
      .ref("profiles/" + userId + "/")
      .set({
        dateOfBirth,
        isPatient,
        email,
        firstName,
        lastName,
        userId,
      })
      .then((data) => {
        console.log("data ", data);
        this.props.navigation.navigate("Info", {
          appUser: this.props.navigation.state.params.appUser,
          messageTitle: "Profile Created",
          message:
            "Thank you for creating your profile data. It will help improve the accuracy of our software.",
        });
      })
      .catch((error) => {
        console.log("error ", error);
      });
  };
}
