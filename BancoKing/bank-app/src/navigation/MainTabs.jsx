import React from "react";
import { Alert } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MaterialIcons } from "@expo/vector-icons";

import { useAuthStore } from "../features/auth/store/authStore.js"; 
import { MyAccounts } from "../features/accountsuser/components/MyAccounts.jsx";
import { MovementsUser } from "../features/accountsuser/components/MovementsUser.jsx";
import { Transfers } from "../features/transfers/components/Transfers.jsx";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const AccountsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MyAccountsList" component={MyAccounts} />
    <Stack.Screen name="MovementsUser" component={MovementsUser} />
  </Stack.Navigator>
);

const EmptyComponent = () => null;

const MainTabs = () => {
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Está seguro de que desea salir de Banco King?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Salir", 
          style: "destructive", 
          onPress: () => {
            logout();
          } 
        }
      ]
    );
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "AccountsTab") {
            iconName = "account-balance";
          } else if (route.name === "TransfersTab") {
            iconName = "swap-horiz";
          } else if (route.name === "LogoutTab") {
            iconName = "logout"; 
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "#64748b",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          height: 60,
          borderTopColor: "#e2e8f0",
          borderTopWidth: 1,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="AccountsTab"
        component={AccountsStack}
        options={{ title: "Mis Cuentas" }}
      />
      <Tab.Screen
        name="TransfersTab"
        component={Transfers}
        options={{ title: "Transferencias" }}
      />
      
      <Tab.Screen
        name="LogoutTab"
        component={EmptyComponent}
        options={{ title: "Salir" }}
        listeners={() => ({
          tabPress: (e) => {
            e.preventDefault(); 
            handleLogout();
          },
        })}
      />
    </Tab.Navigator>
  );
};

export default MainTabs;