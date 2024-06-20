import { Slot, Tabs } from 'expo-router'

const TabsLayout = () => {
    return (
        <Tabs>
            {/* <Tabs.Screen
                name="projects"
                options={{
                    headerTitle: "Projects",
                    title: "Tab 1 Title"
                }}
            /> */}
            <Tabs.Screen
                name="index"
                options={{
                    headerTitle: "Home Tab",
                    title: "Home Tab Title"
                }}
            />
            <Slot></Slot>
        </Tabs>
    )
}

export default TabsLayout