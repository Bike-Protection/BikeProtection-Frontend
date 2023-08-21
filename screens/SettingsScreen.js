import React from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { THEME } from "../src/Theme";

const SettingsScreen = ({ navigation }) => {
  const localImage = require("../assets/fon3.png");
  const buttonPress = () =>
    Alert.alert("OONT App", "Оновлення згодом", [
      { text: "Ок", onPress: () => console.log("Ок pressed") },
    ]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        <ImageBackground source={localImage} style={styles.image} />
      </View>
      <TouchableOpacity onPress={buttonPress}>
        <View style={[styles.rectangle, { marginTop: 270 }]}>
          <Text style={styles.text}>
            Мова:                   Українська
            </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={buttonPress}>
        <View style={styles.rectangle}>
          <Text style={styles.text}>
            Допомога та підтримка
            </Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  image: {
    flex: 1,
    height: 880,
    width: "100%",
  },
  rectangle: {
    backgroundColor: THEME.RECTANGLE_COLOR,
    flexDirection: "column",
    width: "90%",
    height: 90,
    left: "5%",
    right: "5%",
    borderRadius: 20,
    marginBottom: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: THEME.WHITE_COLOR,
    fontSize: 17,
  },
});
