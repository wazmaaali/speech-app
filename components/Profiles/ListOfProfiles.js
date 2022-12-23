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

    console.log("999 Im in list of profiles");

    this.state = {
      data: [
        {
          name: "Miyah Myles",
          email: "miyah.myles@gmail.com",
          position: "Data Entry Clerk",
          photo:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&s=707b9c33066bf8808c934c8ab394dff6",
        },
        {
          name: "June Cha",
          email: "june.cha@gmail.com",
          position: "Sales Manager",
          photo: "https://randomuser.me/api/portraits/women/44.jpg",
        },
        {
          name: "Iida Niskanen",
          email: "iida.niskanen@gmail.com",
          position: "Sales Manager",
          photo: "https://randomuser.me/api/portraits/women/68.jpg",
        },
        {
          name: "Renee Sims",
          email: "renee.sims@gmail.com",
          position: "Medical Assistant",
          photo: "https://randomuser.me/api/portraits/women/65.jpg",
        },
        {
          name: "Jonathan Nu\u00f1ez",
          email: "jonathan.nu\u00f1ez@gmail.com",
          position: "Clerical",
          photo: "https://randomuser.me/api/portraits/men/43.jpg",
        },
        {
          name: "Sasha Ho",
          email: "sasha.ho@gmail.com",
          position: "Administrative Assistant",
          photo:
            "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?h=350&auto=compress&cs=tinysrgb",
        },
        {
          name: "Abdullah Hadley",
          email: "abdullah.hadley@gmail.com",
          position: "Marketing",
          photo:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&s=a72ca28288878f8404a795f39642a46f",
        },
        {
          name: "Thomas Stock",
          email: "thomas.stock@gmail.com",
          position: "Product Designer",
          photo:
            "https://tinyfac.es/data/avatars/B0298C36-9751-48EF-BE15-80FB9CD11143-500w.jpeg",
        },
        {
          name: "Veeti Seppanen",
          email: "veeti.seppanen@gmail.com",
          position: "Product Designer",
          photo: "https://randomuser.me/api/portraits/men/97.jpg",
        },
        {
          name: "Bonnie Riley",
          email: "bonnie.riley@gmail.com",
          position: "Marketing",
          photo: "https://randomuser.me/api/portraits/women/26.jpg",
        },
      ],
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
    console.log("99999 New Profile");
    this.props.navigation.navigate("CreateAProfile", {
      appUser: this.props.navigation.state.params.appUser,
    });
  };
  componentDidMount() {
    this.state.fetchData.onSnapshot((querySnapshot) => {
      const user = [];
      querySnapshot.forEach((doc) => {
        console.log("  user;: ", doc.data());

        const { firstName, lastName, gender, dateOfBirth } = doc.data();
        user.push({
          id: doc.id,
          firstName,
          lastName,
          gender,
          dateOfBirth,
        });
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
    this.props.navigation.navigate("Profile", {
      appUser: this.props.navigation.state.params.appUser,
      child: aa,
    });
    // this.props.navigation.navigate("CreateAProfile");
  };

  deleteAd = (ss) => {
    firebase
      .firestore()
      .collection("/children_profiles/")
      .doc(ss.id)
      .delete()
      .then(() => {
        console.log("Doc deleted");
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
