import React, { Component } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import RecordSample from "./RecordSample";
import ReviewRecording from "./ReviewRecording";
import VoiceRecorder from "./VoiceRecorder";

import styles from "../style/Style";

class SentenceView extends Component {
   constructor(props){
      super(props);
      this.recorder = new VoiceRecorder(this.props.user, "card0");
      this.state = {
         review: false,
         mustListenToSample: true
      }
   }

   onSubmit = () =>{
      this.setState({review:false, mustListenToSample:true});
      this.props.onSubmit();
   }
   onRedo = () =>{
      this.setState({review:false, mustListenToSample:false});
   }

   onStop = () =>{
      this.setState({review:true});
   }
   render() {
     return (
       <View style={{flex:1}}>
 
          {this.state.review &&
             <ReviewRecording recorder={this.recorder} onSubmit={this.onSubmit} onRedo={this.onRedo} name={"Card"+this.props.data.key} />
          }
          {!this.state.review &&
             <RecordSample recorder={this.recorder} onStop={this.onStop} onRedo={this.onRedo} data={this.props.data} mustListenToSample={this.state.mustListenToSample}/>
          }
       </View>

     );
  }
}

export default SentenceView;
