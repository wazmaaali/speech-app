import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Card, Icon } from "react-native-elements";

import GetHeaderOnly from "../style/TopNavigation";
import styles from "../style/Style.js";
import { myColors } from "../style/colors";
import LabelledIcon from "../style/LabelledIcon";

class Info extends Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = ({ navigation }) => {
    return GetHeaderOnly(navigation);
  };

  goHome = () => {
    console.log(
      "999999999 Info: ",
      this.props.navigation.state.params.childData.id
    );
    this.props.navigation.navigate("Home", {
      appUser: this.props.navigation.state.params.appUser,
      childData: this.props.navigation.state.params.childData,
    });
  };

  render() {
    return (
      <View flex center style={styles.imageContainer}>
        <View
          style={{
            paddingTop: 10,
            paddingBottom: 10,
            justifyContent: "space-around",
            backgroundColor: myColors.secondary_old,
            width: "90%",
            borderRadius: 10,
            alignSelf: "center",
          }}
        >
          <Text style={styles.title}>
            {this.props.navigation.state.params.messageTitle}
          </Text>
          <Text style={styles.instructions}>
            {this.props.navigation.state.params.message}
          </Text>

          <TouchableOpacity onPress={this.goHome}>
            <LabelledIcon
              name="home"
              type="ionicon"
              color={myColors.third}
              label="App Home"
              style={styles.actionButton}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default Info;
