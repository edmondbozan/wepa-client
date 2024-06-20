import { Stack } from 'expo-router'

const ProjectLayout = () => {
    return <Stack>

       <Stack.Screen
        name="Projects"
        options={{
            headerShown: false
        }} />
         <Stack.Screen
            name="project"
            options={{
                headerShown: false
            }} /><Stack.Screen
            name="test"
            options={{
                headerShown: false
            }} />
            </Stack> 
}

export default ProjectLayout