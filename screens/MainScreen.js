import React, { useState } from "react";
import { StyleSheet, View, Button, ImageBackground, Text } from "react-native";
import { THEME } from "../src/Theme";

const MainScreen = ({ navigation }) => {
  const localImage = require("../assets/fon3.png");
  const [changeColor, SetChangeColor] = useState(false);
  const [blocked, SetBlocked] = useState(false);

  const onPressHandler = () => {
    SetBlocked(!blocked);
    SetChangeColor(!changeColor);
  };

  return (
    <View style={{ flex: 1 }}>
      <View>
        <ImageBackground source={localImage} style={styles.image} />
        <View style={styles.eclipse} />

        <View style={styles.viewText}>
          {blocked ? (
            <Text style={styles.text}>Пристрій заблоковано</Text>
          ) : (
            <Text style={styles.text}>Пристрій розблоковано</Text>
          )}
        </View>
        <View style={styles.buttons}>
          <Button
            title={blocked ? "Розблокувати" : "Заблокувати"}
            onPress={onPressHandler}
            color={blocked ? THEME.GREEN_COLOR : THEME.RED_COLOR}
          />
        </View>
      </View>
    </View>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  image: {
    flex: 1,
    height: 880,
    width: "100%",
  },
  buttons: {
    marginTop: 180,
    paddingHorizontal: 90,
  },
  eclipse: {
    backgroundColor: THEME.RECTANGLE_COLOR,
    width: "94%",
    height: 545,
    position: "absolute",
    borderRadius: 20,
    left: "3%",
    right: "3%",
    top: "15%",
  },
  viewText: {
    marginTop: "80%",
    alignItems: "center",
  },
  text: {
    color: THEME.WHITE_COLOR,
    fontSize: 20,
  },
});
