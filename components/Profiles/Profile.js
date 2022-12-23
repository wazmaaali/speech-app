import React, { Component } from "react";
import * as firebase from "firebase";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Button,
  TouchableOpacity,
} from "react-native";
import styles from "../style/Style.js";
import { myColors } from "../style/colors";

// const toDoRef = "";
// const [addData, setAddData] = "";
export default class Profile extends React.Component {
  constructor(props) {
    super(props);

    childData = this.props.navigation.state.params.child;
    //Work on dob lATER
    console.log(
      "999 Im in CreateAProfile: ",
      this.props.navigation.state.params.child.dateOfBirth
    );
    this.state = {
      name: childData.firstName + " " + childData.lastName,
      age: "",
      gender: childData.gender,
    };
  }

  render() {
    return (
      <View style={styless.container}>
        <View style={styless.header}></View>
        <Image
          style={styless.avatar}
          source={{ uri: "https://bootdey.com/img/Content/avatar/avatar6.png" }}
        />
        <View style={styless.body}>
          <View style={styless.bodyContent}>
            <Text style={styless.nameDesign}>{this.state.name}</Text>
            <Text style={styless.nameDesign}>{this.state.gender}</Text>
            <Text style={styless.nameDesign}>6 years</Text>
            <TouchableOpacity
              style={styless.buttonContainer}
              onPress={() => {
                this.start();
              }}
            >
              <Text>Start</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  start = () => {
    this.props.navigation.navigate("Home", {
      appUser: this.props.navigation.state.params.appUser,
    });
  };
}
const styless = StyleSheet.create({
  header: {
    backgroundColor: "#00BFFF",
    height: 200,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom: 10,
    alignSelf: "center",
    position: "absolute",
    marginTop: 130,
  },

  body: {
    marginTop: 40,
  },
  bodyContent: {
    flex: 1,
    alignItems: "center",
    padding: 30,
  },
  nameDesign: {
    marginTop: 10,
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 15,
    padding: 9,
    textAlign: "center", // <-- the magic
    color: "white",
    width: 250,
    backgroundColor: "#00BFFF",
  },
  buttonContainer: {
    marginTop: 60,
    height: 85,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
    width: 250,
    borderRadius: 30,
    backgroundColor: "#00BFFF",
  },
});
