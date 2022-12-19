import React, { Component, useState } from "react";
import * as firebase from "firebase";

const toDoRef = "";
const [addData, setAddData] = "";
export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    console.log("999 Im in CreateAProfile");
    this.state = {
      name: "",
      Age: "",
      Gender: "",
    };
    toDoRef = firebase.firestore().collection("children_profiles");
    [addData, setAddData] = useState("");
  }

  // addField = () => {

  //   }
  // };
  render() {
    return (
      <View style={styles.containerView}>
        <Text>Name</Text>
        <Text>Age</Text>
        <Text>Gender</Text>
        <TouchableOpacity
          onPress={() => {
            this.start();
          }}
          style={styles.unselectedBox}
        >
          <Text style={styles.name}>New Test</Text>
        </TouchableOpacity>
      </View>
    );
  }

  start = () => {
    if (addData && addData.length > 0) {
      const timestemp = firebase.firestore().FieldValue.serverTimestamp();
      const data = {
        heading: addData,
        createdAt: timestemp,
      };

      toDoRef
        .add(data)
        .then(() => {
          setAddData("");
        })
        .catch((error) => {
          alert(error);
        });
    }
    // this.props.navigation.navigate("Start Test", {
    //   appUser: this.props.navigation.state.params.appUser,
    // });
  };
}
