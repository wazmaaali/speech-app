import React from "react";
import { Image, View } from "react-native";

import styles from "../style/Style.js";

export const Splash = props => {
  return (
    <View
      style={styles.loading}
    >
      <Image
        source={require("../../assets/logo.png")}
        style={{ width: "100%", height:"50%"}}
      />
    </View>
  );
};
