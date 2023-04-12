import { useRef, useMemo, useState, useEffect } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import BottomSheet, {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import OrderItem from "../../components/OrderItem";
import MapView, {Marker} from 'react-native-maps';
import { getCurrentPositionAsync, useForegroundPermissions, PermissionStatus } from 'expo-location';
import {Entypo} from '@expo/vector-icons';
import { DataStore } from "aws-amplify";
import {Order, Restaurant} from '../../models';
import { useNavigation } from "@react-navigation/native";
import CustomMarker from "../../components/customMarker";


const OrderScreen = () => {

  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);

  const bottomSheetRef = useRef();  
  
  const snapPoints = useMemo(()=>['12%','95%'], []);

  const{width, height} = useWindowDimensions();

  const [permission, setPermission] = useState(null);
  
  const [locationPermissionInformation, requestPermission] = useForegroundPermissions();

  const[initialCoordinates, setInitialCoordinates] = useState();

  const [loading, setLoading] = useState(true); 

  const navigation = useNavigation();


  const getRestaurants  = async (orders) => {
    
    Promise.all(
      orders.map((order)=>{
        return order.Restaurant;
      }))
      .then((result)=>{setRestaurants(result)})

  }


  useEffect(()=>{
    getRestaurants(orders);
  },[orders])

  // useEffect(()=>{
    
    // const unsubscribe = navigation.addListener("focus", ()=>{
    //   console.log("on focus");
    //   DataStore.query(Order, (order)=>order.status.eq("READY_FOR_PICKUP")).then((result)=>{setOrders(result);});
    // })

  //   return unsubscribe; 
  // },[navigation]);

  useEffect(()=>{
    
    fetchOrders();
    const subscription = DataStore.observe(Order).subscribe(msg=>{
      if(msg.opType==="UPDATE"){
        fetchOrders();
      }
    })
    return () => subscription.unsubscribe();
    
  },[])


  useEffect(()=>{
    if(permission){  
      getCoords();
    }
  },[permission])

  useEffect(()=>{
    verifyPermissions();

   },[locationPermissionInformation]);  


   const fetchOrders = () => {
      DataStore.query(Order, (order)=>order.status.eq("READY_FOR_PICKUP")).then((result)=>{setOrders(result);});
    

   }

   const getCoords = async () => {
    const result = await getCurrentPositionAsync();
    setInitialCoordinates(result.coords);
    setLoading(false);
    console.log("arrived here");
   }



  const verifyPermissions = async () => {
   
    if(locationPermissionInformation){
      
   
      if (
            locationPermissionInformation.status ===
                PermissionStatus.UNDETERMINED ||
                locationPermissionInformation.status === PermissionStatus.DENIED
        ) {

            const permissionResponse = await requestPermission();
 
            setPermission(permissionResponse.granted);
        }
     
        if (locationPermissionInformation.status === PermissionStatus.DENIED) {
            Alert.alert(
                'Insufficient Permissions!',
                'You need to grant location permissions to use this app.'
            );
            setPermission(false);
        }
 
        setPermission(true);
         }
      }

    if(loading){
      return <ActivityIndicator size={'large'} color={'gray'}/>
     
    }

  return (
    
    <View style={{backgroundColor:'lightblue', flex: 1}}>
              
              
              {
              
              
                initialCoordinates?<MapView 
                  style={{height, width}} 
                  showsUserLocation = {true}
                  followUserLocation = {true}
                  initialRegion = {{
                  latitude: initialCoordinates.latitude,
                  longitude: initialCoordinates.longitude,
                  latitudeDelta: 0.07,
                  longitudeDelta: 0.07,
                }}
                >

                
                {restaurants?.map((restaurant, index)=>{
                  
                  
                  return (
                   <CustomMarker key = {index} data ={restaurant} type="RESTAURANT" /> 
                  ) 
                
    
                })                }
                
                </MapView>: <></>
              
              
              }
         
              
          <BottomSheet ref = {bottomSheetRef} snapPoints={snapPoints} >
          <View style={{alignItems: 'center', marginBottom: 30}}>
            <Text style = {{fontSize: 20, fontWeight: '600', letterSpacing:0.5, paddingBottom:5}}>
                You're online 
            </Text>
            <Text style = {{letterSpacing:0.5, color: 'grey'}}>
                Available Orders: {orders.length}
            </Text>
          </View>
          <BottomSheetFlatList 
                style={{flex: 1, height: 500}}
                data={orders}
                renderItem={({item})=><OrderItem order={item}/>}
          />
          </BottomSheet>
    </View>
  )
}

export default OrderScreen;

const styles = StyleSheet.create({})