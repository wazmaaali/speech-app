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
import moment from "moment";

export default class Profile extends React.Component {
  constructor(props) {
    super(props);

    childData = this.props.navigation.state.params.child;
    var a = new Date(
      childData.dateOfBirth.seconds * 1000 +
        childData.dateOfBirth.nanoseconds / 1000000
    );
    var formattedDate = moment(a).utc().format("MM/DD/YYYY");
    var aa = this.calculate_age(formattedDate);
    this.state = {
      name: childData.firstName + " " + childData.lastName,
      age: aa,
      gender: childData.gender,
    };
  }
  calculate_age = (dob1) => {
    var dob = new Date(dob1);
    //calculate month difference from current date in time
    var month_diff = Date.now() - dob.getTime();

    //convert the calculated difference in date format
    var age_dt = new Date(month_diff);

    //extract year from date
    var year = age_dt.getUTCFullYear();

    //now calculate the age of the user
    var age = Math.abs(year - 1969);
    console.log(age);
    return age;
  };
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
            <Text style={styless.nameDesign}>{this.state.age} years</Text>
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
