import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Alert, FlatList, ImageBackground, ListRenderItem } from 'react-native';
import { ProjectDetails } from '@/interfaces/IProject';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { useSession } from '@/context/ctx';
import { FontAwesome } from '@expo/vector-icons';
import { BASE_URL } from '@/constants/Endpoints';
import fetchWithAuth from '@/context/FetchWithAuth';
import { normalize } from 'react-native-elements';
import { formatDate } from '@/functions/stringfunctions';

interface ProjectLeads{
  id:number;
  userName:string;
  phoneNumber:string;
  email:string;
  title:string;
  createDate:string;     
}

const Leads: React.FC = () => {
  const [leads, setData] = React.useState<ProjectLeads[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      // Code to refresh or fetch new data
      fetchData();
      setRefreshKey((prevKey) => prevKey + 1);
    }, [])
  );


  
  const { userId } = useSession();
  const fetchData = async () => {
    try {
      const url = BASE_URL + '/api/ProjectLeads/users/' + userId;       
      console.log(url);
      const response = await fetchWithAuth(url);
      const result: ProjectLeads[] = await response.json();
      if (response.ok) {       
        setData(result);
      } else {
        Alert.alert('Page Load Error', 'Page Load');
      }
    } catch (err) {
       setError(JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderItem: ListRenderItem<ProjectLeads> = ({ item }) => {
  return(
  <View style={styles.itemContainer}>
    <View style={{ flexDirection: 'row' }}>
      <FontAwesome name="user" size={18} color="#B87333" />
      <Text> {item.userName}</Text>
    </View>
    <View style={{ borderBottomColor: '#ccc', borderBottomWidth: 1, marginVertical: 10 }}></View>
    <View style={{ flexDirection: 'row' }}>
      <FontAwesome name="phone" size={18} color="#B87333" />
      <Text> {item.phoneNumber}</Text>
    </View>
    <View style={{ borderBottomColor: '#ccc', borderBottomWidth: 1, marginVertical: 10 }}></View>
    <View style={{ flexDirection: 'row' }}>
      <FontAwesome name="envelope" size={18} color="#B87333" />
      <Text> {item.email}</Text>
    </View>
    <View style={{ borderBottomColor: '#ccc', borderBottomWidth: 1, marginVertical: 10 }}></View>
    <View style={{ flexDirection: 'row' }}>
      <FontAwesome name="heart" size={18} color="#B87333" />
      <Text> {item.title}</Text>
    </View>
    <View style={{ borderBottomColor: '#ccc', borderBottomWidth: 1, marginVertical: 10 }}></View>
    <View style={{ flexDirection: 'row' }}>
      <FontAwesome name="calendar" size={18} color="#B87333" />
      <Text> {formatDate(item.createDate)}</Text>
    </View>
  </View>

  )};



  return (
    <SafeAreaView key={refreshKey}>
        {(leads.length > 0) ? (
          <FlatList
            data={leads}
            keyExtractor={(lead) => lead.id.toString()}
            renderItem={renderItem} />
        ) :
          (
            <ImageBackground style={{ flex: 1 }} source={require('../../../../assets/images/background.jpg')} imageStyle={{ opacity: 0.25, height: '100%', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ marginTop: 100, margin: 20, padding: 15, borderRadius: 12, backgroundColor: 'rgba(211, 211, 211, .35)' }}>
                <Text style={{ color: "#654321", fontSize: 20, fontWeight: '700', lineHeight: 30 }}>Looks like you do not have any projects. Click the add new project button below to get started.{'\n\n'}</Text>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ color: "#654321", fontSize: normalize(17), fontWeight: '600', fontStyle: 'italic', lineHeight: 30 }}> Go ahead and Peacock a bit.</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ color: "#654321", fontSize: normalize(17), fontWeight: '600', fontStyle: 'italic' }}>
                    We wont judge.</Text>
                </View>
              </View>
            </ImageBackground>)}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    borderColor: '#B87333',
    borderWidth: 1,
    marginBottom: 15,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
    margin: 20,
  },
});

export default Leads;
