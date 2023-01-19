/* eslint-disable array-callback-return */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  Button,
  FlatList,
  ActivityIndicator
} from 'react-native'
import styles, { historyStyles } from '../style/Style.js'
import * as firebase from 'firebase'
import { Audio } from 'expo-av'
import * as Sharing from 'expo-sharing'
import Slider from '@react-native-community/slider'
import AudioRecorderPlayer from 'react-native-audio-recorder-player'
import moment from 'moment'

export default function History (props) {
  const childDataId = props.navigation.state.params.childData.id
  let soundObj = new Audio.Sound()
  const audioRecorderPlayer = new AudioRecorderPlayer()

  const [index, setIndex] = useState(0)
  const [isSeeking, setIsSeeking] = useState(false)
  const [shouldPlayAtEndOfSeek, setShouldPlayAtEndOfSeek] = useState(false)
  const [playbackInstance, setPlaybackInstance] = useState(null)
  const [showVideo, setShowVideo] = useState(false)
  const [muted, setMuted] = useState(false)
  const [playbackInstancePosition, setPlaybackInstancePosition] = useState(0)
  const [playbackInstanceDuration, setPlaybackInstanceDuration] = useState(0)
  const [shouldPlay, setShouldPlay] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isBuffering, setIsBuffering] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [fontLoaded, setFontLoaded] = useState(false)
  const [shouldCorrectPitch, setShouldCorrectPitch] = useState(true)
  const [childDataUrl, setChildDataUrl] = useState([])
  const [dateCreated, setDateCreated] = useState([])
  const [uri, setUri] = useState(null)
  const [isAlreadyPlay, setIsAlreadyPlay] = useState(false)
  const [duration, setDuration] = useState(null)
  const [timeElapsed, setTimeElapsed] = useState(null)
  const [percent, setPercent] = useState(0)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [inProgress, setInProgress] = useState(false)
  const [playerStatus, setPlayerStatus] = useState(null)
  const [audioItems, setAudioItems] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        playsInSilentLockedModeIOS: true,
        // interruptionModeIOS: 0,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: true
      })
      const audioItem = {
        url: null,
        date: null
      }
      await firebase
        .storage()
        .ref()
        .child(childDataId + '/')
        .listAll()
        .then((res) => {
          res.items.map((item) => {
            item.getDownloadURL().then(url => (audioItem.url = url))
            item.getMetadata()
              .then((data) => {
                const formattedDate = moment(data.timeCreated).utc().format('YYYY-MM-DD')
                audioItem.date = formattedDate
              })
            console.log(audioItem)
            // setAudioItems([...audioItems, audioItem])
            // setIsLoading(false)
          })
        })
    }

    fetchData()
      .catch(e => console.log(e))
  }, [])

  const getSeekSliderPosition = () => {
    if (
      soundObj != null &&
      playbackInstancePosition != null &&
      playbackInstanceDuration != null
    ) {
      return `${playbackInstancePosition} / ${playbackInstanceDuration}`
    }
    return 0
  }

  const onSeekSliderValueChange = () => {
    if (soundObj != null && !isSeeking) {
      setIsSeeking(true)
      setShouldPlayAtEndOfSeek(shouldPlay)
      soundObj.pauseAsync()
    }
  }

  const onSeekSliderSlidingComplete = async (value) => {
    if (soundObj != null) {
      setIsSeeking(false)
      const seekPosition = value * playbackInstanceDuration
      if (shouldPlayAtEndOfSeek) {
        soundObj.playFromPositionAsync(seekPosition)
      } else {
        soundObj.setPositionAsync(seekPosition)
      }
    }
  }

  const getTimestamp = () => {
    if (
      soundObj != null &&
      playbackInstancePosition != null &&
      playbackInstanceDuration != null
    ) {
      return `${getMMSSFromMillis(playbackInstancePosition)} / ${getMMSSFromMillis(playbackInstanceDuration)}`
    }
    return ''
  }

  const getMMSSFromMillis = (millis) => {
    const totalSeconds = millis / 1000
    const seconds = Math.floor(totalSeconds % 60)
    const minutes = Math.floor(totalSeconds / 60)

    const padWithZero = (number) => {
      const string = number.toString()
      if (number < 10) {
        return '0' + string
      }
      return string
    }
    return padWithZero(minutes) + ':' + padWithZero(seconds)
  }

  const downloadAudio = async (item, index) => {
    if (soundObj != null) {
      await soundObj.unloadAsync()
      soundObj = null
    }
    const source = { uri: item.url }
    const initialStatus = {
      shouldPlay: true
    }
    try {
      await Audio.Sound.createAsync(
        source,
        initialStatus,
        onPlaybackStatusUpdate
      )

      // await this.state.soundObj.loadAsync({ uri: item });
      // this.onPlaybackStatusUpdate;
      // console.log('url: ', item)

      // Get Player Status
      const status = await soundObj.getStatusAsync()
      setPlayerStatus(status)
      // Play if song is loaded successfully
      if (playerStatus.isLoaded) {
        if (playerStatus.isPlaying === false) {
          const newAudioItems = [...audioItems]
          newAudioItems[index].position = playerStatus.positionMillis
          newAudioItems[index].duration = playerStatus.durationMillis
          setAudioItems(newAudioItems)

          setIsAlreadyPlay(true)
          setInProgress(true)
          // setPlaybackInstancePosition(playerStatus.positionMillis)
          // setPlaybackInstanceDuration(playerStatus.durationMillis)
          setShouldPlay(playerStatus.shouldPlay)
          setDuration(playerStatus.durationMillis)
          soundObj.playAsync(onPlaybackStatusUpdate)
        }
      }
    } catch (error) {
      console.log('error:', error)
    }
  }

  const onPausePress = async () => {
    setIsAlreadyPlay(false)
    soundObj.pauseAsync()
  }

  // const changeTime = async (seconds) => {
  //   const seektime = (seconds / 100) * duration
  //   setTimeElapsed(seektime)
  //   soundObj.setProgressUpdateIntervalAsync(seektime)
  //   soundObj.setPositionAsync(seektime)
  // }

  const updateScreenForLoading = (isLoading) => {
    if (isLoading) {
      setShowVideo(false)
      setIsPlaying(false)
      setPlaybackInstanceDuration(null)
      setPlaybackInstancePosition(null)
      setIsLoading(true)
    } else {
      setIsLoading(false)
    }
  }

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setPlaybackInstancePosition(status.positionMillis)
      setPlaybackInstanceDuration(status.durationMillis)
      setShouldPlay(status.shouldPlay)
      setIsPlaying(status.isPlaying)
      setIsBuffering(status.isBuffering)
      if (status.didJustFinish && !status.isLooping) {
        updatePlaybackInstanceForIndex(true)
      }
    } else {
      if (status.error) {
        console.log(`FATAL PLAYER ERROR: ${status.error}`)
      }
    }
  }

  const updatePlaybackInstanceForIndex = async (playing) => {
    updateScreenForLoading(true)
  }

  const Item = ({ item }) => {
    return (
      <View style={historyStyles.listItem}>
        <View style={historyStyles.flexbox_container}>
          <View style={historyStyles.row}>
            <Button
              style={historyStyles.button}
              onPress={() => downloadAudio(item)} // this.state.soundObject.playAsync()}
              title="Play"
            ></Button>
            <Button
              style={historyStyles.button}
              onPress={() => onPausePress(item)} // this.state.soundObject.playAsync()}
              title="Pause"
            ></Button>
            <Button
              style={historyStyles.button}
              onPress={() => Sharing.shareAsync(soundObj.file)}
              title="Share"
            ></Button>
          </View>
          <View>
            <View>
              <Slider
                minimumValue={0}
                maximumValue={100}
                trackStyle={historyStyles.track}
                thumbStyle={historyStyles.thumb}
                minimumTrackTintColor="#93A8B3"
                value={getSeekSliderPosition()}
                onValueChange={onSeekSliderValueChange}
                onSlidingComplete={onSeekSliderSlidingComplete}
              />
            </View>
            <View style={historyStyles.timestampRow}>
              <Text
                style={[historyStyles.textLight, styles.timeStamp]}
                onValueChange={getTimestamp()}
              >
                {''}
                {/* {this.state.isBuffering ? BUFFERING_STRING : ""} */}
              </Text>
              <Text style={[historyStyles.textLight, styles.timeStamp]}>
                {getTimestamp()}
              </Text>
            </View>
          </View>
        </View>
      </View>
    )
  }

  return isLoading
    ? (
      <ActivityIndicator size='large' color={'blue'} style={{ alignSelf: 'center' }}/>
      )
    : (
      <View style={historyStyles.container}>
        <FlatList
          style={{ flex: 1 }}
          data={audioItems}
          renderItem={({ item, index }) => <Item item={item} index={index} />}
          keyExtractor={(item) => item.id}
        />
      </View>
      )
}
