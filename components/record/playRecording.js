import React from "react";
import { Audio } from "expo-av";

export async function playRecording(props, callback=null) {
  await Audio.setAudioModeAsync({
     playsInSilentModeIOS: true,
  });

  let soundObject = new Audio.Sound();
  console.log("Object Created");
  await soundObject.loadAsync(props);
  soundObject.setOnPlaybackStatusUpdate(callback)
  console.log("Song Loaded");
  await soundObject.playAsync();
}

export async function prepSound(props)
{
  await Audio.setAudioModeAsync({
     playsInSilentModeIOS: true,
  });

  let soundObject = new Audio.Sound();
  console.log("Object Created");
  await soundObject.loadAsync(props);
  return soundObject;
}
//export default playRecording;
