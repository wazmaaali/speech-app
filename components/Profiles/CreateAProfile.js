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
import { useState } from "react";
import { Input } from "react-native-elements";
import DateTimePicker from "@react-native-community/datetimepicker";
import styles from "../style/Style.js";
import LabelledIcon from "../style/LabelledIcon";
import { myColors } from "../style/colors";

import * as firebase from "firebase";

export default class CreateAProfile extends React.Component {
  // var toDoRef = "";
  // var [addData, setAddData] = "";
  constructor(props) {
    super(props);
    console.log("999 Im in CreateAProfile");

    this.state = {
      isPatientSelected: false,
      isPatient: false,
      firstName: "",
      lastName: "",
      childId: "",

      dateOfBirth: new Date(),
      today: new Date(),
      dateSelected: false,

      isSexSelected: false,
      isMale: false,
      isFemale: false,

      toDoRef: firebase.firestore().collection("children_profiles"),
      addData: "",
      setAddData: "",
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
                  backgroundColor: "#88c8e3",
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
            color="#00BFFF"
            label="Create Profile"
            style={styles.actionButton}
          />
        </TouchableOpacity>
      </View>
    );
  }

  submit = () => {
    if (
      firebase.auth().currentUser.uid.length > 0 &&
      this.state.firstName &&
      this.state.firstName.length > 0 &&
      this.state.lastName &&
      this.state.lastName.length > 0 &&
      this.state.dateOfBirth &&
      this.state.isSexSelected == true
    ) {
      var gen = "";
      if (this.state.isSexSelected) {
        if (this.state.isMale) {
          gen = "male";
        } else if (this.state.isFemale) {
          gen = "female";
        } else {
          gen = "Preferred not to answer";
        }
      }
      console.log("99 inside if", this.state.dateOfBirth);

      const data = {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        dateOfBirth: this.state.dateOfBirth,
        gender: gen,
        currUser: firebase.auth().currentUser.uid,
      };

      this.state.toDoRef
        .add(data)
        .then(() => {
          this.props.navigation.navigate("ListOfProfiles", {
            messageTitle: "Profile Created",
            message:
              "Thank you for creating your profile data. It will help improve the accuracy of our software.",
          });
        })
        .catch((error) => {
          alert(error);
          console.log("999: ", error);
        });
    }
  };
}
