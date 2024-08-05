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

interface ProjectLeads {
  id: number;
  userName: string;
  phoneNumber: string;
  email: string;
  title: string;
  createDate: string;
}

const Leads: React.FC = () => {
  const [leads, setData] = useState<ProjectLeads[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      fetchData();
      setRefreshKey((prevKey) => prevKey + 1);
    }, [])
  );

  const { userId } = useSession();
  const fetchData = async () => {
    try {
      const url = BASE_URL + '/api/ProjectLeads/users/' + userId;
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

  // useEffect(() => {
  //   fetchData();
  // }, []);

  const renderItem: ListRenderItem<ProjectLeads> = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={{ flexDirection: 'row' }}>
        <FontAwesome name="user" size={18} color="#B87333" />
        <Text> {item.userName}</Text>
      </View>
      <View style={styles.separator} />
      <View style={{ flexDirection: 'row' }}>
        <FontAwesome name="phone" size={18} color="#B87333" />
        <Text> {item.phoneNumber}</Text>
      </View>
      <View style={styles.separator} />
      <View style={{ flexDirection: 'row' }}>
        <FontAwesome name="envelope" size={18} color="#B87333" />
        <Text> {item.email}</Text>
      </View>
      <View style={styles.separator} />
      <View style={{ flexDirection: 'row' }}>
        <FontAwesome name="heart" size={18} color="#B87333" />
        <Text> {item.title}</Text>
      </View>
      <View style={styles.separator} />
      <View style={{ flexDirection: 'row' }}>
        <FontAwesome name="calendar" size={18} color="#B87333" />
        <Text> {formatDate(item.createDate)}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {leads.length > 0 ? (
          <FlatList
            data={leads}
            keyExtractor={(lead) => lead.id.toString()}
            renderItem={renderItem}
          />
        ) : (
          <ImageBackground
            source={require('../../../../assets/images/register-background.jpg')}
            style={styles.backgroundImage}
            imageStyle={{ opacity: 1 }}
          >
            <View style={styles.itemContainer}>
              <Text style={{ color: "#000", fontSize: normalize(30), fontWeight: '200', lineHeight: normalize(30) }}>
                you do not have any leads. 
                create projects to generate leads. 
              </Text>
            </View>
          </ImageBackground>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',

    // justifyContent: 'center',
    // alignItems: 'center',
  },
  noLeadsContainer: {
    marginTop: 100,
    margin: 20,
    padding: 15,
    borderRadius: 12,
    backgroundColor: 'rgba(211, 211, 211, .35)',
  },
  noLeadsText: {
    color: "#654321",
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 30,
  },
  itemContainer: {
    borderColor: '#B87333',
    borderWidth: 1,
    padding: 20,
    backgroundColor: '#fff',
    opacity: .9,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
    margin: 20,
  },
  separator: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginVertical: 10,
  },
});

export default Leads;
