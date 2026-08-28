import {
  AtkinsonHyperlegible_400Regular,
  AtkinsonHyperlegible_700Bold,
} from "@expo-google-fonts/atkinson-hyperlegible";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { initializeDatabase } from "@/db/database";
import { RootNavigator } from "@/navigation/RootNavigator";
import "@/services/notifications";
import { theme } from "@/theme";

export default function App() {
  const [dbReady, setDbReady] = useState(false);
  const [fontsLoaded] = useFonts({
    AtkinsonHyperlegible_400Regular,
    AtkinsonHyperlegible_700Bold,
  });

  useEffect(() => {
    initializeDatabase()
      .then(() => setDbReady(true))
      .catch((error) => {
        console.error("Failed to initialize database", error);
        setDbReady(true);
      });
  }, []);

  if (!fontsLoaded || !dbReady) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <StatusBar style="dark" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootNavigator />
      <StatusBar style="dark" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.background,
  },
});
