import React, { Component, Fragment } from "react";
import { Image, Text, TouchableOpacity, View, Pressable } from "react-native";
import * as Animatable from "react-native-animatable";

import VoiceRecorder from "./VoiceRecorder";
import {playRecording} from "./playRecording";

import styles from "../style/Style";
import LabelledIcon from "../style/LabelledIcon";
import {myColors} from "../style/colors";
/*
 Required parameters:
   recorder=<VoiceRecorder>
   onStop=<Function to execute when stop is pressed>
   data={
      image=<Image to display>
      sentence=<Sentence to display>
      audio=<Audio file to play>
   } 
 **/

const MAX_TIME = 5;

class RecordSample extends Component {

   constructor(props){
      super(props);
      this.state={
         bounceCount:"infinite",
         listened: !this.props.mustListenToSample,
         listening: false,
         recordingInProgress: false,
         interval: null,
         counter: MAX_TIME,
         counterText: 'STOP',
         playBorderWidth:1,
         recordBorderWidth:0,
      }
   }


redo = () => {
   this.setState({listened:false});
}

listenToSample = async () =>{
    this.setState({listening:true});
    await this.props.recorder.stop();
    await playRecording(this.props.data.audio, setListenedToTrue = async(playbackStatus) =>{
       if (playbackStatus.didJustFinish)
       {
          await this.props.recorder.prepareForRecording();
          console.log("Playback volume is " + playbackStatus.volume);
          this.setState({listened:true, listening:false, playBorderWidth:0, recordBorderWidth:1});
       }

    });
    //setListenedToTrue();
    //await Speech.speak(this.props.data.sentence, {
    //  language: 'en',
    //  pitch: 1,
    //  rate: 0.8,
    //  onDone: setListenedToTrue
    //});
}

updateCounter(){
     this.setState({counter: this.state.counter-1});
     if (this.state.counter <= 0) {
       this.stopRecording();
     }
     console.log("counter is "+this.state.counter);
}


startRecording = async () => {
     this.setState({recordingInProgress: true, counter: MAX_TIME});
     await this.props.recorder.start();
     this.state.interval = setInterval(()=> {this.updateCounter()}, 1000);
  }



stopRecording = async () => {
     console.log("Stop recording is pressed");
     await this.props.recorder.stop();
     this.setState({recordingInProgress: false});
     clearInterval(this.state.interval);
     this.props.onStop();
}



async componentDidMount(){
   //await this.listenToSample();
   if (this.state.listened)
   {
      this.setState({playBorderWidth:0,recordBorderWidth:1});
      await this.props.recorder.prepareForRecording();
   }
}

async componentWillUnmount(){
   await this.props.recorder.stop();
}

render(){
   return(
      <View style={{flex:1}}>
            <View style={{flex:1}}/>
            <View style={{
                  flex:20, 
                  backgroundColor:myColors.third, 
                  width:'90%', 
                  borderRadius:10, 
                  justifyContent:'space-around', 
                  alignSelf:'center',
                  borderColor:myColors.secondary, 
                  borderWidth:this.state.playBorderWidth,}}>

                 <Text style={styles.name}>
                   {this.props.data.sentence} 
                 </Text>

                 <Image source={this.props.data.image} style={{borderRadius:100, alignSelf:'center'}}/>

                 {!this.state.recordingInProgress &&
                 <View>
                 <TouchableOpacity
                   onPress={() => {this.listenToSample()}}
                   disabled={this.state.listening || this.state.recordingInProgress}>

                   <LabelledIcon
                    name="play-outline"
                    type="ionicon"
                    color={myColors.third}
                    label="PLAY"
                    style={styles.actionButton}/>
                 </TouchableOpacity>
                 </View>
                 }
                 {this.state.recordingInProgress &&
                 <View>
                    <Animatable.Text style={styles.title} animation="zoomInUp">
                       Recording Now
                    </Animatable.Text>
                 </View>
                 }


            </View>

            <View style={{flex:1}}/>

            <View style={{flex:6,  
                          backgroundColor:myColors.third, 
                          width:'90%', 
                          borderRadius:10, 
                          alignSelf:'center', 
                          borderColor:myColors.secondary, 
                          borderWidth:this.state.recordBorderWidth,
                          justifyContent:'space-evenly'}}>
            {!this.state.listened &&
               <View>
                  <Text style={styles.name}>Play the recording</Text>
               </View>
            }

            {this.state.listened && !this.state.recordingInProgress &&
               <View>
                <Pressable 
                  onPressIn={() => this.startRecording() }
                  disabled={this.state.listening}>

                  <LabelledIcon
                     name="md-mic"
                     type="ionicon"
                     color={myColors.third}
                     label="RECORD"
                     style={styles.actionButtonGreen}/>
                </Pressable>
              </View>
            }

            {/* Conditional rendering: only show the stop button if there is no other recording in progress */}
            {this.state.recordingInProgress &&
               <View style={{justifyContent:'space-around',flex:1}}>
                   <TouchableOpacity
                      onPress={() => this.stopRecording()} 
                    >
                       <LabelledIcon
                        name="stop"
                        type="materials"
                        color={myColors.third}
                        label={this.state.counterText}
                        style={styles.actionButtonRed}
                       />
                   </TouchableOpacity>
                </View>
             }



            </View>
      </View>
   );
}
}

export default RecordSample;
