import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import { Input } from "react-native-elements";
import * as firebase from "firebase";

import { GetHeaderOnly } from "../style/TopNavigation";
import styles from "../style/Style";
import LabelledIcon from "../style/LabelledIcon";
import { myColors } from "../style/colors";

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      emailErrorMessage: "",
      passwordErrorMessage: "",
    };
  }

  handleEmail = (text) => {
    this.setState({ email: text });
  };

  handlePassword = (text) => {
    this.setState({ password: text });
  };

  signin = () => {
    console.log("99999 to Sign up params:", this.props);
    this.props.navigation.navigate("Sign In");
  };

  setup = () => {
    const { email, password } = this.state;

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        alert("Congrats you are signed up!");
        console.log("99999 to Loading  params:", this.props);

        this.props.navigation.navigate("Loading");
      })
      .catch((error) => {
        if (error.code.includes("email")) {
          this.setState({
            emailErrorMessage: error.message,
            passwordErrorMessage: "",
          });
        } else {
          this.setState({
            passwordErrorMessage: error.message,
            emailErrorMessage: "",
          });
        }
      });
  };

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.containerView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Text style={styles.name}>Create an Account</Text>
          <View style={styles.input}>
            <Input
              containerStyle={styles.email}
              onChangeText={(text) => this.handleEmail(text)}
              placeholder=" Enter Email "
              leftIcon={{ type: "font-awesome", name: "envelope" }}
              errorStyle={{ color: "red" }}
              errorMessage={this.state.emailErrorMessage}
            />
            <Input
              secureTextEntry
              containerStyle={styles.password}
              onChangeText={(text) => this.handlePassword(text)}
              placeholder=" Enter New Password "
              leftIcon={{ type: "font-awesome", name: "key" }}
              errorStyle={{ color: "red" }}
              errorMessage={this.state.passwordErrorMessage}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => {
                this.setup();
              }}
            >
              <LabelledIcon
                name="create-outline"
                type="ionicon"
                color={myColors.third}
                label="Create account"
                style={styles.actionButton}
              />
            </TouchableOpacity>
            <Text></Text>
            <TouchableOpacity
              onPress={() => {
                this.signin();
              }}
            >
              <View
                style={{
                  backgroundColor: myColors.third,
                  borderColor: myColors.secondary,
                  borderWidth: 1,
                  borderRadius: 10,
                  width: "90%",
                  alignSelf: "center",
                }}
              >
                <Text style={styles.name}>Return to sign in</Text>
              </View>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  }
}
export default SignUp;
