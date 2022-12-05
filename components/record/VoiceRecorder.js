import React from "react";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import * as firebase from "firebase";
import moment from 'moment-timezone'

class VoiceRecorder {
   constructor(user, name){
      this.user = user,
      this.name = name,
      this.recording = null;
      this.playback = null;
      this.uri = null;
      this.timestamp = null;
      console.log("Voice recorder user is "+this.user);
   } 

   async prepareForRecording() {
       await Audio.setAudioModeAsync({
         allowsRecordingIOS: true,
         interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
         playsInSilentModeIOS: true,
         shouldDuckAndroid: true,
         interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
         playThroughEarpieceAndroid: false,
         staysActiveInBackground: false,
       });

       this.recording = new Audio.Recording();

       await this.recording.prepareToRecordAsync({
         android: {
           extension: ".wav",
           outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
           audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
           sampleRate: 44100,
           numberOfChannels: 2,
           bitRate: 128000,
         },
         ios: {
           extension: ".m4a",
           outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
           audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
           sampleRate: 44100,
           numberOfChannels: 1,
           bitRate: 96400,
           linearPCMBitDepth: 16,
           linearPCMIsBigEndian: false,
           linearPCMIsFloat: false,
         },
       });


       console.log("Ready to record");
   }


   /*
    Start audio recording
   **/
   async start() {
       await this.recording.startAsync();

       try {
         this.uri = await this.recording.getURI();
       } catch (error) {
         console.log(error);
       }
   }


   /*
   Stop audio recording and prepare playback sound
   **/
   async stop() {
     try {
       await this.recording.stopAndUnloadAsync();
     } catch (e) {
       console.log("Stop and unload... " + e);
       return;
     }


     this.timestamp = moment()
                     .tz('America/Chicago')
                     .format('YYYY-MM-DD-HH:mm:ss');
     console.log(this.timestamp);
     
     await Audio.setAudioModeAsync({
       allowsRecordingIOS: false,
       interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
       playsInSilentModeIOS: true,
       playsInSilentLockedModeIOS: true,
       shouldDuckAndroid: true,
       interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
       playThroughEarpieceAndroid: false,
       staysActiveInBackground: true,
     });

     //const { mySound, status } = await this.recording.createNewLoadedSoundAsync();
   
     //this.sound = mySound;
     //await this.send();
   }

   async getRecording() {
        var dateOnly = moment(this.timestamp, 'YYYY-MM-DD-HH:mm:ss').format('YYYY-MM-DD');
        uriInfo = await FileSystem.getInfoAsync(this.uri);
        return uriInfo;
   }
   /*
    Send the recording to the cloud
    **/
    async send(title) {
        var dateOnly = moment(this.timestamp, 'YYYY-MM-DD-HH:mm:ss').format('YYYY-MM-DD');
        uriInfo = await FileSystem.getInfoAsync(this.uri);

        const response = await fetch(uriInfo.uri);
        const blob = response.blob();


        blob.then((x) => {
          var ref = firebase
            .storage()
            .ref()
            .child(this.user + '/' + dateOnly + '/' + title + '_' + this.timestamp);

          ref.put(x);
        });
    }

   /*
    Play back the latest recording
   **/
   play() {
   
   }
}

export default VoiceRecorder;
