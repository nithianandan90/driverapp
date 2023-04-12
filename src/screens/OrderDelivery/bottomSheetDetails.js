import { StyleSheet, Text, View, Pressable, ActivityIndicator, } from 'react-native'
import { useRef, useMemo, useState, useEffect } from "react";
import BottomSheet from '@gorhom/bottom-sheet';
import {FontAwesome5, Fontisto} from '@expo/vector-icons'
import styles from './styles';
import { useOrderContext } from '../../contexts/OrderContext';
import { useNavigation } from '@react-navigation/native';







const BottomSheetDetails = (props) => {

    
    const {totalKm, totalMinutes, onAccepted} = props;

    const isDriverClose = totalKm <= 1;

    const{order, orderUser, dishItems, restaurant, acceptOrder, completeOrder, pickupOrder, fetchOrder} = useOrderContext();


    const bottomSheetRef = useRef(null);  

    const snapPoints = useMemo(()=>['12%','95%'], []);
 
    const [loading, setLoading] = useState(false);    
    const navigation = useNavigation();
    
    
    const onButtonPressed = async ()=>{
        
        const {status} = order;

        // if(deliveryStatus === ORDER_STATUSES.READY_FOR_PICK_UP) {
        if(status === "READY_FOR_PICKUP") {
     
        bottomSheetRef.current?.collapse();
           
            // setDeliveryStatus(ORDER_STATUSES.ACCEPTED);
            acceptOrder();
            onAccepted();
        }
    
        // if(deliveryStatus === ORDER_STATUSES.ACCEPTED) {
        if(status === "ACCEPTED") {
            
            console.log("pickup reached")
            bottomSheetRef.current?.collapse();
            // setDeliveryStatus(ORDER_STATUSES.PICKED_UP);
            await pickupOrder();
    
        }
        // if(deliveryStatus===ORDER_STATUSES.PICKED_UP) {
        if(status==="PICKED_UP") {   
            
            setLoading(true);
            await completeOrder();
            setLoading(false);
            bottomSheetRef.current?.collapse();
            console.warn('Delivery Finished');
            navigation.goBack();
        }
    }
    

    const STATUS_TO_TITLE = {
        READY_FOR_PICKUP:"Accept Order",
        ACCEPTED: "Pick-up Order",
        PICKED_UP: "Complete Delivery"
    }


    
    
    const isButtonDisabled = () => {
        
        
        if(order?.status==="READY_FOR_PICKUP"){
            return false;
        }
        if(order?.status==="ACCEPTED" && isDriverClose){
            return false;
        }
        if(order?.status==="PICKED_UP" && isDriverClose){
            return false;
        }
        return true;
    }
    


    return (<BottomSheet ref = {bottomSheetRef} snapPoints={snapPoints} handleIndicatorStyle={styles.handleIndicator}>
            <View style={styles.handleIndcatorContainer}>            
                <Text style={{fontSize: 25, letterSpacing: 1}}>{totalMinutes.toFixed(0)} min</Text>
                <FontAwesome5
                    name="shopping-bag"
                    size={30}
                    color="#3FC060"
                    style={{marginHorizontal: 10}}
                />
                <Text style={styles.routeDetailsText}>{totalKm.toFixed(1)} KM</Text>
                </View>
                <View style={styles.deliveryDetailsContainer}>   
                    <Text style={styles.restaurantName}>{restaurant.name}</Text>
                <View style = {styles.addressContainer}>  
                    <Fontisto name="shopping-store" size={22} color='grey' />
                    <Text style = {styles.addressText}>{restaurant.address}</Text>
                </View>
                <View style = {styles.addressContainer}>  
                    <FontAwesome5 name="map-marker-alt" size={30 } color='grey' />
                    <Text style = {styles.addressText}>{orderUser.address}</Text>
                </View>
                <View style={styles.orderDetailsContainer}>
                  {dishItems.map((dishItem, index)=>(
                        <Text key = {index} style={styles.orderItemText}>{dishItem.Dish.name} x {dishItem.quantity}</Text>
                    
                  ))}
                    
                    
                </View>
                </View>
                <Pressable style={{...styles.buttonContainer, backgroundColor: isButtonDisabled()?'grey': '#3FC060'}} onPress={onButtonPressed} disabled={isButtonDisabled()}>
                    {loading?<ActivityIndicator size={'large'} color='gray '/>:<Text style={styles.buttonText}>{STATUS_TO_TITLE[order.status]}</Text>}
                    
                </Pressable>
        </BottomSheet>);
}


export default BottomSheetDetails;