import { useSession } from '@/context/ctx';
import React from "react";
import {Text} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs, Redirect, Stack } from "expo-router";
import { Pressable } from "react-native";
import {Colors} from '@/constants/Colors'
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { NavigationContainer } from '@react-navigation/native';


const HomeLayout = () => {
  const { session, isLoading, isAuthenticated } = useSession();

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!isAuthenticated) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/login" />;
  }

  // This layout can be deferred because it's not the root layout.
  return (
    <Stack>
        <Stack.Screen
            name="(tabs)"
            options={{
                headerShown: false
            }}
        />
    </Stack>
)


//   <Tabs
//   screenOptions={{
//     headerShown:false
// //    tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
//   }}
// >

//   <Tabs.Screen
//     name="index" 
//  //    component={ProjectStack}               
//     options={{
//       title: "",
//             tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
//     }}
//   />
  {/* <Tabs.Screen
        name="project"
        options={{
          href: null,
        }}
      /> */}
  {/* <Tabs.Screen
        name="test"
        options={{
          href: null,
        }}
      />*/}

// </Tabs> 
// )  
}

