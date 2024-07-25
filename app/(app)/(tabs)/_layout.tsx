import { Slot, Stack, Tabs } from 'expo-router'
import LogoutButton from '@/components/LogoutButton'
import { FontAwesome } from '@expo/vector-icons'
import { useColorScheme } from 'react-native';
import { useSession } from '@/context/ctx';

const TabsLayout = () => {
    const colorScheme = useColorScheme();
    const {userType } = useSession();
    
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
              title:'home',
                headerShown:false,
                tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} /> }}
        />  
            <Tabs.Screen
                name="projects"
                options={{
                    headerShown:false,
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="briefcase" color={color} /> }}
                 />
             <Tabs.Screen
                name="leads/leads"
                options={{
                    href: (userType?.toString() != "professional") ? null : 'leads/leads',
                    headerShown:false,
                    title:'leads',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="phone" color={color} /> }}    
                 /> 
            <Tabs.Screen
            name="settings/settings"
            options={{
                headerShown:false,
                title:'settings',
                tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} /> }}
            
        />  
                
            {/* <Slot></Slot> */}
        </Tabs>
    )
}

export default TabsLayout