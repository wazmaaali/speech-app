import React, { Component } from "react";

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    console.log("999 Im in CreateAProfile");
    this.state = {
      name: "",
      Age: "",
      Gender: "",
    };
  }

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
    this.props.navigation.navigate("Start Test", {
      appUser: this.props.navigation.state.params.appUser,
    });
  };
}
