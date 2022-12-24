import { StyleSheet } from "react-native";
import { myColors } from "./colors";

const styles = StyleSheet.create({
  containerView: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    resizeMode: "contain",
    justifyContent: "space-around",
  },

  scrollingContainerView: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  cardView: {
    flex: 1,
    flexDirection: "column",
  },
  email: {
    backgroundColor: "#FFFFFF",
    marginBottom: 5,
    borderRadius: 10,
  },
  password: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
  },
  input: {
    marginTop: 0,
    width: "90%",
    alignSelf: "center",
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#006aff",
    alignSelf: "stretch",
  },
  imageContainer: {
    paddingTop: 10,
    paddingBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: myColors.primary,
  },
  card: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: myColors.primary,
  },
  name: {
    textAlign: "center",
    fontFamily: "System",
    fontSize: 32,
    fontWeight: "bold",
    color: myColors.secondary,
    width: "90%",
    alignSelf: "center",
  },

  title: {
    textAlign: "center",
    fontFamily: "System",
    fontSize: 40,
    fontWeight: "bold",
    color: myColors.secondary,
  },

  announcement: {
    textAlign: "center",
    fontFamily: "System",
    fontSize: 40,
    fontWeight: "bold",
    color: "#b4d4c4",
  },

  href: {
    textAlign: "center",
    fontFamily: "System",
    fontSize: 22,
    color: myColors.secondary,
    textDecorationLine: "underline",
  },

  instructionsNoPadding: {
    textAlign: "left",
    fontFamily: "System",
    fontSize: 22,
    color: myColors.secondary,
    width: "90%",
    alignSelf: "center",
  },

  instructions: {
    textAlign: "left",
    fontFamily: "System",
    fontSize: 22,
    marginLeft: 10,
    marginRight: 10,
    paddingTop: 40,
    paddingBottom: 60,
    color: myColors.secondary,
  },
  importantInstructions: {
    textAlign: "left",
    alignSelf: "center",
    fontFamily: "System",
    fontSize: 32,
    fontWeight: "bold",
    color: myColors.secondary,
    width: "90%",
  },
  buttonIcon: {
    marginTop: 15,
    marginLeft: 15,
  },
  counter: {
    textAlign: "center",
    fontFamily: "System",
    fontSize: 20,
    color: "#0B335C",
  },
  timer: {
    textAlign: "center",
    fontFamily: "System",
    fontSize: 25,
  },

  clearBorder: {
    borderWidth: 0,
    shadowColor: "rgba(0,0,0, 0.0)", // Remove Shadow IOS
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0, // This is for Android
  },
  bottom: {
    justifyContent: "flex-end",
    marginBottom: 15,
    marginTop: 15,
    width: "90%",
    alignSelf: "center",
  },
  actionBox: {
    flex: 3,
    width: "90%",
    alignSelf: "center",
    borderRadius: 10,
    backgroundColor: myColors.fourth,
    justifyContent: "center",
  },
  actionButton: {
    width: "90%",
    borderRadius: 10,
    backgroundColor: myColors.secondary,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignSelf: "center",
  },
  disabledButton: {
    width: "90%",
    borderRadius: 10,
    backgroundColor: "gray",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignSelf: "center",
  },

  actionButtonGreen: {
    width: "90%",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignSelf: "center",
    backgroundColor: "#b4d4c4",
  },
  actionButtonRed: {
    width: "90%",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignSelf: "center",
    backgroundColor: "#edeab9",
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  homeScreen: {
    flex: 2,
    backgroundColor: myColors.secondary,
    width: "90%",
    borderRadius: 10,
    alignSelf: "center",
    justifyContent: "center",
  },

  infoBox: {
    backgroundColor: "white",
    width: "90%",
    borderRadius: 10,
    alignSelf: "center",
    justifyContent: "center",
  },
  profileHeader: {
    alignSelf: "center",
    color: myColors.third,
    fontSize: 22,
    fontWeight: "bold",
  },
  profileText: {
    alignSelf: "center",
    color: myColors.third,
    fontSize: 22,
  },
  buttonText: {
    alignSelf: "center",
    color: myColors.third,
    fontSize: 30,
    fontWeight: "bold",
  },
  navigationText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  unselectedBox: {
    backgroundColor: "#00BFFF",
    borderColor: myColors.secondary,
    borderWidth: 1,
    borderRadius: 10,
    width: "90%",
    alignSelf: "center",
  },
});

export default styles;
