import React, { Component, Fragment } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Image, TouchableOpacity } from "react-native";
import * as Progress from "react-native-progress";

import cards from "../../assets/cards";

import GetTopNavigation from "../style/TopNavigation";
import styles from "../style/Style";
import {myColors} from "../style/colors";
import {saveDateOfLastCompletedTest} from "../dataStore/DataAccess";
import moment from 'moment-timezone'

import SentenceView from "./SentenceView";

class CardNavigation extends Component {

   constructor(props){
      super(props);
      console.log(props);
      this.user = props.navigation.state.params.appUser;
      this.state = {
         cardsCompleted: 0,
         numCards:       0,
      }
      this.initialize();
      this.labels = ["1", "2", "3", "4", "5", "6"];
   }

   initialize() {
     this.state.numCards = cards.length;
     console.log("App navigation initialized, user is "+this.user);
    
   }

   onSubmit = () => {
       
      if (this.state.cardsCompleted + 1 < this.state.numCards)
      {
         this.setState({cardsCompleted: this.state.cardsCompleted+1});
         console.log("cards completed "+this.state.cardsCompleted);
         console.log("num cards "+this.state.numCards);
      }
      else {
         console.log("navigating to test completed");
         date = moment()
           .tz('America/Chicago')
           .format('MMMM Do, YYYY');
         saveDateOfLastCompletedTest(date);

         this.props.navigation.navigate("Info",{
            messageTitle: "Recording Completed",
            message:"Thank you for recording your speech samples. Your recordings have been successfully sent to our research team."
         });
      }
   }

  static navigationOptions = ({navigation}) =>{
    return GetTopNavigation(navigation);
  };

  render() {
    return (
      <View style={styles.card}>
         <View style={{flex:9}}>
         <SentenceView
            user={this.user}
            data={cards[this.state.cardsCompleted]}
            onSubmit = {this.onSubmit}
         />
         </View>

         <View style={styles.bottom}>
            <Progress.Bar 
               width={null} 
               height={20}
               color={myColors.third}
               progress={(this.state.cardsCompleted+1)/this.state.numCards}>
            </Progress.Bar>

         </View>
      </View>
    );
  }
}


export default CardNavigation;
