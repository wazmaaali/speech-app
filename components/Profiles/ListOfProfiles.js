import React, { Component, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Button,
  TouchableOpacity,
} from "react-native";
import GetTopNavigation from "../style/TopNavigation";
// import { GetHeaderOnly } from "../style/TopNavigation";
import * as firebase from "firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

class ListOfProfiles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      loaded: false,

      fetchData: firebase.firestore().collection("children_profiles"),
    };
    this.goToProfile = this.goToProfile.bind(this);
  }

  render() {
    if (!this.state.loaded) return <View />;

    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => logout(navigation)}></TouchableOpacity>
        <Button
          onPress={() => {
            this.addNewProfile();
          }}
          title="Add New Profile +"
          backgroundColor="#00BFFF"
          color="#006aff"
        />
        <FlatList
          style={{ flex: 1 }}
          data={this.state.users}
          renderItem={({ item }) => <this.Item item={item} />}
          keyExtractor={(item) => item.email}
        />
      </View>
    );
  }

  addNewProfile = () => {
    this.props.navigation.navigate("CreateAProfile", {
      appUser: this.props.navigation.state.params.appUser,
    });
  };
  componentDidMount() {
    var a = firebase.auth().currentUser.uid;
    this.state.fetchData.onSnapshot((querySnapshot) => {
      const user = [];
      querySnapshot.forEach((doc) => {
        const { firstName, lastName, gender, dateOfBirth, currUser } =
          doc.data();
        if (a === currUser) {
          user.push({
            id: doc.id,
            firstName,
            lastName,
            gender,
            dateOfBirth,
          });
        }
      });
      this.setState({
        users: user,
        loaded: true,
      });
    });
  }
  static navigationOptions = ({ navigation }) => {
    return GetTopNavigation(navigation);
  };
  //   getData() {
  //     try {
  //       const jsonValue = AsyncStorage.getItem("@children_profiles");
  //       console.log("999: ", jsonValue);
  //       return jsonValue != null ? JSON.parse(jsonValue) : null;
  //     } catch (e) {
  //       console.log(e);
  //       console.log("There was an error");
  //     }
  //   }

  Item = ({ item }) => {
    return (
      <View style={styles.listItem}>
        <Image
          source={require("../../assets/profile.png")}
          style={{ width: 60, height: 60, borderRadius: 30 }}
        />
        <View style={{ alignItems: "center", flex: 1 }}>
          <Text style={{ fontWeight: "bold" }}>
            {item.firstName} {item.lastName}
          </Text>
          <Text>{item.gender}</Text>
        </View>
        <TouchableOpacity
          style={{
            height: 50,
            width: 50,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              this.goToProfile(item);
            }}
          >
            <Image source={require("../../assets/edit.png")} />
          </TouchableOpacity>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            height: 50,
            width: 50,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              this.deleteAd(item);
            }}
          >
            <Image
              source={require("../../assets/delete.png")}
              style={{
                height: 40,
                width: 40,
              }}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    );
  };

  goToProfile = (aa) => {
    console.log("9999999 listOfP: ", aa.id);
    this.props.navigation.navigate("Profile", {
      appUser: this.props.navigation.state.params.appUser,
      child: aa,
    });
  };

  deleteAd = (ss) => {
    firebase
      .firestore()
      .collection("/children_profiles/")
      .doc(ss.id)
      .delete()
      .then(() => {
        console.log("child data deleted");
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    marginTop: 60,
  },
  listItem: {
    margin: 10,
    padding: 10,
    backgroundColor: "#FFF",
    width: "80%",
    flex: 1,
    alignSelf: "center",
    flexDirection: "row",
    borderRadius: 5,
  },
});

export default ListOfProfiles;
