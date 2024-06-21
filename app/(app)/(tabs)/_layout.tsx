import { Slot, Stack, Tabs } from 'expo-router'
import LogoutButton from '@/components/LogoutButton'

const TabsLayout = () => {
    return (

        
        <Tabs>
         <Tabs.Screen
            name="home/index"
            options={{
                headerShown:false,

                // headerTitle: "what",
                // title: "Projects"
            }}
        />  
            <Tabs.Screen
                name="projects"
                options={{
                    headerShown:false,
                    // headerTitle: "Projects",
                    // title: "projects"
                }} />
            {/* <Slot></Slot> */}
        </Tabs>
    )
}

export default TabsLayout