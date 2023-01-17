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
import LabelledIcon from "../style/LabelledIcon";

// const toDoRef = "";
// const [addData, setAddData] = "";
export default class Profile extends React.Component {
  constructor(props) {
    super(props);

    childData = this.props.navigation.state.params.child;
    //Work on dob lATER
    console.log(
      "999 Im in CreateAProfile: ",
      this.props.navigation.state.params.child
    );
    this.state = {
      name: childData.firstName + " " + childData.lastName,
      age: "",
      gender: childData.gender,
    };
  }

  render() {
    return (
      <View>
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
          </View>
        </View>
        <View
          style={{
            marginTop: 200,
          }}
        >
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
    );
  }

  start = () => {
    console.log("999 Im in childData: ", childData);
    this.props.navigation.navigate("Home", {
      appUser: this.props.navigation.state.params.appUser,
      childData: childData,
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
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 20,
    fontWeight: "bold",
    textTransform: "uppercase",
    padding: 9,
    textAlign: "center", // <-- the magic
    color: "#006aff",
    width: 250,
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
