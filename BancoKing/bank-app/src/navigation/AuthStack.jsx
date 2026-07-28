import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginPage } from "../features/auth/pages/LoginPage.jsx";

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginPage} />
    </Stack.Navigator>
  );
};

export default AuthStack;
