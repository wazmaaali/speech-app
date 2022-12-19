import React, { Component } from "react";
import {
  Image,
  View,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  Text,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Input } from "react-native-elements";
import * as firebase from "firebase";

import { GetHeaderOnly } from "../style/TopNavigation";
import styles from "../style/Style";
import LabelledIcon from "../style/LabelledIcon";
import { myColors } from "../style/colors";

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      signedIn: false,
      name: "",
      photoUrl: "",
      clicked: false,
      email: "",
      password: "",
      emailErrorMessage: "",
      passwordErrorMessage: "",
      currUser: null,
      users: [],
      fetchData: firebase.firestore().collection("children_profiles"),
    };
    console.log("99999 in Sign In params:", this.props);
  }

  handleEmail = (text) => {
    this.setState({ email: text });
  };

  handlePassword = (text) => {
    this.setState({ password: text });
  };

  login = () => {
    const { email, password } = this.state;
    Keyboard.dismiss;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.state.fetchData.onSnapshot((querySnapshot) => {
          console.log("  user;: ");
          const user = [];
          querySnapshot.forEach((doc) => {
            const { firstName, lastName, gender } = doc.data();
            user.push({
              id: doc.id,
              firstName,
              lastName,
              gender,
            });
          });
          this.state.users = user;
          // this.storeData(this.state.users);
        });

        this.props.navigation.navigate("ListOfProfiles", {
          email: email,
          // appUser: this.props.navigation.state.params.appUser,
        });
      })
      .catch((error) => {
        /////**** Fix this later
        this.setState({ errorMessage: error.message });
        console.log("errorMessage: error.message: ", error.message);

        // if (error.code.includes("email")) {
        //   this.setState({
        //     emailErrorMessage: error.message,
        //     passwordErrorMessage: "",
        //   });
        // }
        // else {
        //   this.setState({
        //     passwordErrorMessage: error.message,
        //     emailErrorMessage: "",
        //   });
        // }
      });
  };

  // storeData = async (value) => {
  //   try {
  //     await AsyncStorage.setItem("@children_profiles", JSON.stringify(value));
  //   } catch (e) {
  //     console.log("error: ", error);
  //     // saving error
  //   }
  // };

  setup = () => {
    this.props.navigation.navigate("Sign Up");
  };

  forgotPassword = () => {
    this.props.navigation.navigate("Reset Password");
  };

  changeVisibility = (visibility) => {
    this.setState({ isVisible: visibility });
  };

  static navigationOptions = GetHeaderOnly();

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.containerView}
        >
          <Text style={styles.name}>Sign In</Text>

          <View style={styles.input}>
            <Input
              clearButtonMode="always"
              containerStyle={styles.email}
              onChangeText={(text) => this.handleEmail(text)}
              placeholder=" Email"
              leftIcon={{ type: "font-awesome", name: "envelope" }}
              errorStyle={{ color: "red" }}
              errorMessage={this.state.emailErrorMessage}
            />
            <Input
              clearButtonMode="always"
              secureTextEntry
              containerStyle={styles.password}
              onChangeText={(text) => this.handlePassword(text)}
              placeholder=" Password"
              leftIcon={{ type: "font-awesome", name: "key" }}
              errorStyle={{ color: "red" }}
              errorMessage={this.state.passwordErrorMessage}
            />
            <TouchableOpacity
              onPress={() => {
                this.forgotPassword();
              }}
            >
              <View
                style={{
                  backgroundColor: myColors.third,
                  borderColor: myColors.secondary,
                  width: "90%",
                  borderWidth: 0.5,
                  borderRadius: 10,
                  alignSelf: "center",
                }}
              >
                <Text style={styles.href}>Forgot Password?</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => {
                this.login();
              }}
            >
              <LabelledIcon
                name="log-in-outline"
                type="ionicon"
                color="#c2ba25"
                label="Sign in"
                alignSelf="center"
                style={styles.actionButton}
              />
            </TouchableOpacity>

            <Text></Text>
            <TouchableOpacity
              onPress={() => {
                this.setup();
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
                  paddingBottom: 12,
                  paddingTop: 12,
                }}
              >
                <Text style={styles.name}>Sign up</Text>
              </View>
            </TouchableOpacity>

            <Text> </Text>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  }
}

export default SignIn;
