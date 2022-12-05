import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Card, Icon } from "react-native-elements";

import GetTopNavigation from "../style/TopNavigation";
import styles from "../style/Style.js"
import {myColors} from "../style/colors";
import LabelledIcon from "../style/LabelledIcon";

class Info extends Component {
  constructor(props)
  {
     super(props);
  }

  static navigationOptions = ({navigation}) =>{
    //var navigation = GetTopNavigation(navigation);
    //navigation.headerTitle="";
    //return navigation;
    return GetTopNavigation(navigation);

  };

  goHome = () => {
    this.props.navigation.navigate("Home", {
       appUser: this.props.navigation.state.params.appUser
    });
  }

  render() {
    return (
      <View flex center style = {styles.imageContainer}>

      <View style={{paddingTop:10, paddingBottom:10, justifyContent:'space-around',  backgroundColor:myColors.third, width:'90%', borderRadius:10, alignSelf:'center'}}>


        <Text style={styles.title}>
           {this.props.navigation.state.params.messageTitle}
        </Text>
        <Text style={styles.instructions}>
           {this.props.navigation.state.params.message}
        </Text>

        <TouchableOpacity
          onPress={this.goHome}
        >
           <LabelledIcon
              name="home"
              type="ionicon"
              color={myColors.third}
              label="App Home"
              style={styles.actionButton}/>
         </TouchableOpacity>

      </View>
      </View>
    );
  }
}

export default Info;
