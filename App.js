import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
// import config from "./firebase/config.json";
import * as firebase from "firebase";

// firebase.initializeApp(config);
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDE_F88m4Q1mMDldwK1lfbjy9Rs0sFbbSg",
  authDomain: "speech-recognition-33a7f.firebaseapp.com",
  projectId: "speech-recognition-33a7f",
  storageBucket: "speech-recognition-33a7f.appspot.com",
  messagingSenderId: "900205769137",
  appId: "1:900205769137:web:c88bd9187b91a905ee4d90",
  measurementId: "G-SDX7SZX8MW",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// const analytics = getAnalytics(firebase);

import Loading from "./components/startApp/Loading";
import { Splash } from "./components/startApp/Splash";

import SignIn from "./components/login/SignIn";
import SignUp from "./components/login/SignUp";
import ForgotPassword from "./components/login/ForgotPassword";

import StartTest from "./components/record/StartTest";
import TestVolume from "./components/record/TestVolume";

import Home from "./components/home/Home";
import Info from "./components/home/Info";

import Profile from "./components/Profiles/Profile";
import ListOfProfiles from "./components/Profiles/ListOfProfiles";
import CreateAProfile from "./components/Profiles/CreateAProfile";
import Recording from "./components/record/Recording";
import History from "./components/record/TestThis";

const RootStack = createStackNavigator(
  {
    Loading: {
      screen: Loading,
    },
    "Sign In": {
      screen: SignIn,
    },
    Home: {
      screen: Home,
    },
    "Start Test": {
      screen: StartTest,
    },
    TestVolume: {
      screen: TestVolume,
    },
    "Sign Up": {
      screen: SignUp,
    },
    "Reset Password": {
      screen: ForgotPassword,
    },
    Info: {
      screen: Info,
    },
    CreateAProfile: {
      screen: CreateAProfile,
    },
    Profile: {
      screen: Profile,
    },
    ListOfProfiles: {
      screen: ListOfProfiles,
    },
    Recording: {
      screen: Recording,
    },
    History: {
      screen: History,
    },
    // TestThis: {
    //   screen: TestThis,
    // },
  },
  {
    initialRouteName: "Loading",
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: "#006aff",
      },
      headerBackTitle: "Back",
      gesturesEnabled: false,
      headerTintColor: "#FFFFFF",
      headerTitleStyle: {
        fontWeight: "bold",
      },
    },
  }
);

const AppContainer = createAppContainer(RootStack);

function AsyncFunction(props) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 1500);
  });
}

export default function App() {
  const [currComp, setComp] = useState();

  // Causing benign error with android, so disabled yellow box errors
  console.disableYellowBox = true;
  AsyncFunction().then((data) => {
    setComp("App");
  });

  const components = currComp !== "App" ? <Splash /> : <AppContainer />;
  return components;
}
