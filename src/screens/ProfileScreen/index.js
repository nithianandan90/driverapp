import { View, Text, TextInput, StyleSheet, Button, Alert, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Auth, DataStore } from "aws-amplify";
import { Courier } from "../../models";
import { useAuthContext } from "../../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import {MaterialIcons, FontAwesome5} from '@expo/vector-icons';
import { TransportationModes } from "../../models";


const Profile = () => {

  const {dbCourier, sub, setDbCourier} = useAuthContext();

  const [name, setName] = useState(dbCourier?.name || "");
  const [address, setAddress] = useState(dbCourier?.address || "");
  const [lat, setLat] = useState(dbCourier?.lat + "" || "0");
  const [lng, setLng] = useState(dbCourier?.lng + "" || "0");
  const [transportationMode, setTransportationMode] = useState(TransportationModes.DRIVING);




  const navigation = useNavigation();

  const onSave = async () => {
    
    if(dbCourier){
      await updateCourier();
    }else {
      await createCourier();
    }

    navigation.goBack();
  };


const updateCourier = async () => {
  
  
  const lat_float = parseFloat(lat);
  const lng_float = parseFloat(lng);
  const courier = await DataStore.save(
    Courier.copyOf(dbCourier, (updated)=>{
      updated.name = name;
      updated.transportationMode = transportationMode;
    })
  );

  setDbCourier(courier);
}

  const createCourier = async () => {
    try{
      console.log(parseFloat(lat));
      const courier = await DataStore.save(new Courier({
        name, 
        sub,
        transportationMode
    }));
      
     

      setDbCourier(courier);  
    }catch(e){
        Alert.alert("Error", e.message)
      }
  }

  return (
    <SafeAreaView>
      <Text style={styles.title}>Profile</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Name"
        style={styles.input}
      />
     
    <View style={{flexDirection:'row'}}>
        <Pressable 
            onPress={()=>{setTransportationMode(TransportationModes.BICYCLING)}}
            style = {{backgroundColor: 
            transportationMode===TransportationModes.BICYCLING?'lightgreen':'white', margin: 10, padding: 10, borderWidth: 1, borderColor: 'grey', borderRadius: 10}}>
            <MaterialIcons name = "pedal-bike" size={40} color="black" />
        </Pressable>
        <Pressable 
            onPress={()=>{setTransportationMode(TransportationModes.DRIVING)}}
            style = {{backgroundColor: 
            transportationMode===TransportationModes.DRIVING?'lightgreen':'white', margin: 10, padding: 10, borderWidth: 1, borderColor: 'grey', borderRadius: 10}}>
            <FontAwesome5 name = "car" size={40} color="black" />
            
        </Pressable>

    </View>     
      <Button onPress={onSave} title="Save" style={{margin: 10}}/>
      <Text onPress={()=>Auth.signOut()} style = {{textAlign: 'center', color: 'red', margin: 10}}>Sign Out</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    margin: 10,
  },
  input: {
    margin: 10,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 5,
  },
});

export default Profile;
