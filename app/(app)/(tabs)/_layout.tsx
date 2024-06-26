import { Slot, Stack, Tabs } from 'expo-router'
import LogoutButton from '@/components/LogoutButton'
import { FontAwesome } from '@expo/vector-icons'
import { useColorScheme } from 'react-native';

const TabsLayout = () => {
    const colorScheme = useColorScheme();

    return (        
        <Tabs 
        screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName: string;
    
              if (route.name === 'home/index') {
                iconName = 'home';
              } else if (route.name === 'projects') {
                iconName = 'briefcase';
              }
    
              // Return the appropriate FontAwesome icon component
              return <FontAwesome name={iconName} size={30} color={color} />;
            },
            tabBarActiveTintColor: colorScheme === 'dark' ? 'tomato' : '#B87333',
            tabBarInactiveTintColor: 'gray',
          })}>


         <Tabs.Screen
            name="home/index"
            options={{
                headerShown:false,
            }}
        />  
            <Tabs.Screen
                name="projects"
                options={{
                    headerShown:false,
                }} />
            {/* <Slot></Slot> */}
        </Tabs>
    )
}

export default TabsLayout