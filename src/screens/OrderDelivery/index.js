import { View, useWindowDimensions,  ActivityIndicator } from 'react-native'
import { useRef, useState, useEffect } from "react";
import styles from './styles';
import MapView, {Marker} from 'react-native-maps';
import { getCurrentPositionAsync, watchPositionAsync, Accuracy } from 'expo-location';
import {Entypo, MaterialIcons, Ionicons} from '@expo/vector-icons';
import MapViewDirections from 'react-native-maps-directions';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useOrderContext } from '../../contexts/OrderContext';
import BottomSheetDetails from './bottomSheetDetails';
import CustomMarker from '../../components/customMarker';
import { Courier } from '../../models';
import { useAuthContext } from '../../contexts/AuthContext';
import { DataStore } from 'aws-amplify';



const OrderDelivery = () => {

    const{order, orderUser, restaurant, fetchOrder} = useOrderContext();
   
    const {dbCourier} = useAuthContext();

    const mapRef = useRef(null);
  
    const {width, height} = useWindowDimensions();
  
    const navigation = useNavigation();

    const[initialCoordinates, setInitialCoordinates] = useState();

    const [totalMinutes, setTotalMinutes] = useState(0);

    const [totalKm, setTotalKm] = useState(0); 

    // const [deliveryStatus, setDeliveryStatus] = useState(ORDER_STATUSES.READY_FOR_PICK_UP);

    
    
    const route = useRoute();

    const id = route.params?.id;


    useEffect(()=>{
        fetchOrder(id);
    },[id]);
    

    useEffect(()=>{
        console.log(dbCourier);
        if(!initialCoordinates){
            return;
        }

        DataStore.save(Courier.copyOf(dbCourier, (updated)=>{
            updated.lat=initialCoordinates.latitude
            updated.lng = initialCoordinates.longitude
        }))

    }, [initialCoordinates])


    useEffect(()=>{
        getCurrentPositionAsync().then((result)=>setInitialCoordinates(result.coords));
       
        let isSubscribed = true;

        
        const foregroundSubscription = isSubscribed?watchPositionAsync({
            accuracy: Accuracy.High, 
            distanceInterval: 500
        }, (updatedLocation)=>{
            setInitialCoordinates({
                latitude: updatedLocation.coords.latitude,
                longitude: updatedLocation.coords.longitude
            })
        }):null;
        
        return ()=>{
            isSubscribed = false;
        }

    },[])  
   


    const zoomInOnDriver = () => {
        mapRef.current.animateToRegion({
            latitude: initialCoordinates.latitude,
            longitude: initialCoordinates.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005  
          });
    }






    

    
    const restaurantLocation = {latitude: restaurant?.lat, longitude: restaurant?.lng}

    const deliveryLocation = {latitude: orderUser?.lat, longitude: orderUser?.lng}


        

    if(!order || !initialCoordinates || !restaurant){
        return(
            <ActivityIndicator size={'large'} color='gray '/>
        )
    }



    return (
    <View style={styles.container}> 

   


        {initialCoordinates? <MapView style={{width, height}} 
        ref={mapRef}
        showsUserLocation
        followsUserLocation
        initialRegion = {{
            latitude: initialCoordinates.latitude,
            longitude: initialCoordinates.longitude,
            // latitude: 3.123456,
            // longitude: 101.59096,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}

        >
            <MapViewDirections
                origin={{
                    latitude: initialCoordinates.latitude,
                    longitude: initialCoordinates.longitude
                    // latitude: 3.124456,
                    // longitude: 101.59396,
                }}
                destination={
                
                    order?.status==="ACCEPTED" ?
                    restaurantLocation
                    :
                    deliveryLocation
            
                }
                waypoints = {
                    order?.status === "READY_FOR_PICKUP" ? 
                    [restaurantLocation]: [] }
                apikey={"AIzaSyD-G9wb1uwhVWGYWyxLfgKCuanpMCCLAb0"}
                strokeWidth={10}
                strokeColor="#3FC060"
                onReady={(result)=>{
                    
                    setTotalMinutes(result.duration);
                    setTotalKm(result.distance);
                }}
                
                 
            />
            <CustomMarker data={restaurant} type="RESTAURANT" />
            <CustomMarker data={orderUser} type="USER" />

        </MapView>: <></>}
        <BottomSheetDetails totalKm={totalKm} totalMinutes={totalMinutes} onAccepted={zoomInOnDriver} initialCoordinates={initialCoordinates} />
        {order?.status !== "ACCEPTED" && (   
            <Ionicons
                onPress={()=>{navigation.goBack()}}
                name="arrow-back-circle"
                size={45}
                color="black"
                style={{top: 40, left: 15, position: 'absolute'}}        
            />)
        }
   
    </View>
  )
}

export default OrderDelivery
