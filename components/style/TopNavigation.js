import React, { Component, Fragment } from "react";
import { Text, TouchableOpacity } from "react-native";
import * as firebase from "firebase";

import styles from "./Style";

logout = (navigation) => {
  console.log("Logging out");
  firebase
    .auth()
    .signOut()
    .then(() => {
      navigation.navigate("Sign In");
    })
    .catch((e) => {
      console.log(e);
    });
};

getHeaderTitle = () => {
  return <Text style={styles.navigationText}>Speech App</Text>;
};

getHeaderRight = (navigation) => {
  return (
    <TouchableOpacity onPress={() => logout(navigation)}>
      <Text style={styles.navigationText}>Logout</Text>
    </TouchableOpacity>
  );
};

export function GetHeaderOnly() {
  title = getHeaderTitle();
  return {
    headerTitle: title,
    headerRight: null,
    headerLeft: null,
    headerTitleStyle: { alignSelf: "center" },
  };
}

function GetTopNavigation(navigation) {
  right = getHeaderRight(navigation);
  headerNavigation = GetHeaderOnly();
  headerNavigation.headerRight = right;
  return headerNavigation;
}

export default GetTopNavigation;
