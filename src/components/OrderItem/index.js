import { StatusBar } from 'expo-status-bar';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import {Entypo} from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { DataStore } from 'aws-amplify';
import { User } from '../../models';


const  OrderItem = ({order})=> {
  
const navigation = useNavigation();
  
const [restaurant, setRestaurant] = useState();
const [orderUser, setOrderUser] = useState();



useEffect(()=>{
  
  order.Restaurant.then(setRestaurant)
  
  DataStore.query(User, order.userID).then(setOrderUser);

  
},[]);



return (
      <Pressable onPress = {()=>{navigation.navigate('OrderDeliveryScreen', {id: order.id})}} style = {{flexDirection:'row',  margin: 10, borderColor: "#3FC060", borderWidth: 2, borderRadius: 10}}>
        <Image 
          source={{uri: restaurant?.image}} 
          style = {{width: "25%", height: '100%', borderRadius: 10}}
        />
        <View style={{marginLeft: 10, flex: 1, padding: 5}}>
            <Text style={{fontSize: 18, fontWeight: '500'}}>{restaurant?.name}</Text>
             <Text style={{color: 'grey'}}>{restaurant?.address}</Text>
             <Text style={{marginTop: 10}}>Delivery Details:</Text>
             <Text style={{color: 'grey'}}>{orderUser?.name}</Text>
             <Text style={{color: 'grey'}}>{orderUser?.address}</Text>

        </View>
        <View style={{backgroundColor: '#3FC060', borderBottomRightRadius: 10, borderTopRightRadius: 10,  alignItems: 'center', justifyContent: 'center'}}>
          <Entypo name="check" size={30} color="white" style={{marginLeft: 'auto'}} />
        </View>
        <StatusBar style="auto" />
      </Pressable>
    );
}


export default OrderItem; 

const styles = StyleSheet.create({
  container: {
    
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
});
