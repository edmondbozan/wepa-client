import { Slot, Stack, Tabs } from 'expo-router'

const TabsLayout = () => {
    return (
        <Tabs>
                {/* <Tabs.Screen
                name="home/index"
                options={{
                    headerTitle: "what",
                    title: "Projects"
                }}
            />  */}
                            <Tabs.Screen
                name="home/index"
                options={{
                    headerTitle: "Home",
                    title: "home"
                }}
            /> 
            {/* <Slot></Slot> */}
        </Tabs>
    )
}

export default TabsLayout