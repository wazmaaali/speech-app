import React, { Component } from "react";
import { Text, View, TouchableOpacity } from "react-native";

import {playRecording} from "./playRecording";

import styles from "../style/Style";
import {myColors} from "../style/colors";
import LabelledIcon from "../style/LabelledIcon";
/*
   Required parameters:
   name=<Root name of the file to send>
   onRedo=<Action to take when redo is selected>
   onSubmit=<Action to take after sending the recording>
   recorder=<VoiceRecorder object>
 **/

class ReviewRecording extends Component {

   constructor(props){
      super(props);
      this.state={
         listened: false,
         listening: false,
         reviewColor:myColors.secondary,
         redoColor:myColors.third
      }
   }

playVoiceRecording = async () => {
   this.setState({listening: true});

   const setListenedToTrue = (playbackStatus) => {
       if (playbackStatus.didJustFinish)
       {
          this.setState({listened:true, listening:false, reviewColor:myColors.third, redoColor:myColors.secondary});
       }
   }


   var uri = await this.props.recorder.getRecording();
   await playRecording(uri, setListenedToTrue);
}

componentDidMount() {
  //this.playVoiceRecording();
}


redo = () => {
  console.log("Redo");
  this.setState({recordedSample: false})
  this.props.onRedo();
}

submit = async () => {
  console.log("Submit");
  await this.props.recorder.send(this.props.name);
  this.props.onSubmit();
}


render() {
   return(
      <View style={{flex:1}}>
            <View style={{paddingTop:20, flexDirection:"row", justifyContent:"center", alignItems:"center"}}/>


            <View style={{paddingTop:10, paddingBottom:10, flex:3, justifyContent:'space-around',  backgroundColor:myColors.third, width:'90%', borderRadius:10, alignSelf:'center', borderColor:this.state.reviewColor, borderWidth:1}}>
                 <Text style={styles.name}>
                   Review your recording 
                 </Text>



               <TouchableOpacity
                     onPress={() => {this.playVoiceRecording()}}
                     disabled={this.state.listening}>

                     <LabelledIcon 
                         label="PLAY" 
                         name="play-outline"
                         type="ionicon"
                         color={myColors.third} 
                         style={styles.actionButton}/>
               </TouchableOpacity>
            </View>

               {!this.state.listened &&
                  <View style={{flex:4}}/>
               }
               <View style={{paddingTop:20, flexDirection:"row", justifyContent:"center", alignItems:"center"}}/>

               {this.state.listened &&
               <View style={{paddingTop:10, paddingBottom:10, flex:4, justifyContent:'space-around',  backgroundColor:myColors.third, width:'90%', borderRadius:10, alignSelf:'center', borderColor:this.state.redoColor, borderWidth:1}}>
                 <Text style={styles.name}>
                   Did that sound right?
                 </Text>

                 <TouchableOpacity
                    onPress={() => {this.submit()}} 
                    disabled={this.state.listening || !this.state.listened} >

                        <LabelledIcon 
                            label="YES, continue" 
                            name="done-outline"
                            type="material-icons"
                            color={myColors.third} 
                            style={styles.actionButtonGreen}/>

                 </TouchableOpacity>


                 <TouchableOpacity
                  onPress={() => {this.redo()}} 
                  disabled={this.state.listening} >

                        <LabelledIcon 
                            label="NO, redo" 
                            name="arrow-undo-outline"
                            type="ionicon"
                            color={myColors.third} 
                            style={styles.actionButtonRed}/>

               </TouchableOpacity>
               </View>
            }
      </View>
   );
}

}

export default ReviewRecording;
