import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import { Icon, Button, Input } from "react-native-elements";
import * as firebase from "firebase";

import { GetHeaderOnly } from "../style/TopNavigation";
import styles from "../style/Style";
import LabelledIcon from "../style/LabelledIcon";
import {myColors} from "../style/colors";


class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      errorMessage: "",
      signedUp: false,
    };
  }

  handleEmail = (text) => {
    this.setState({ email: text });
  };

  signin = () => {
    this.props.navigation.navigate("Sign In");
  };


  resetPassword = () => {
    const { email} = this.state;

    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        this.setState({signedUp: true})
      })
      .catch((error) => this.setState({ errorMessage: error.message }));
  };

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
         style={styles.containerView} 
         behavior="padding"
       >
        <Text style={styles.name}>
        Reset Your Password
        </Text>

        {!this.state.signedUp &&
        <View style={styles.input}>
          <Input
            containerStyle={styles.email}
            onChangeText={(text) => this.handleEmail(text)}
            placeholder=" Enter Email "
            leftIcon={{ type: "font-awesome", name: "envelope" }}
            errorStyle={{ color: "red" }}
            errorMessage={this.state.errorMessage}
          />
        </View>
        }

        <View style={styles.buttonContainer}>
           {!this.state.signedUp &&
            <TouchableOpacity
                 onPress={() => {this.resetPassword()} }
             >
               <LabelledIcon
                    name="key-outline"
                    type="ionicon"
                    color={myColors.third}
                    label="Reset Password"
                    style={styles.actionButton}/>

            </TouchableOpacity>
            }
            {this.state.signedUp &&
             <View style={{backgroundColor:myColors.third, width:'90%', alignSelf:'center'}} >
               <Text style={styles.instructions}>
                  Please check your email for a password reset link.
                  Come back here and sign in after you reset your password.
               </Text>
             </View>
            }
            <Text></Text>
            <TouchableOpacity
               onPress={() => {this.signin()}}
             >
             <View style={{backgroundColor:myColors.third, borderColor:myColors.secondary, borderWidth:1, borderRadius:10, width:'90%', alignSelf:'center'}}>
             <Text style={styles.name}>
               Return to sign in
             </Text>
             </View>
            </TouchableOpacity>
         </View>
      </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  }
}
export default ForgotPassword;
