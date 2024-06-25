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

  return ( 
    <Stack>
        <Stack.Screen
            name="index"
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

