import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OrderScreen from "../screens/OrdersScreen";
import OrderDelivery from "../screens/OrderDelivery";
import Profile from "../screens/ProfileScreen";
import { useAuthContext } from "../contexts/AuthContext";
import { ActivityIndicator } from "react-native";


const Stack = createNativeStackNavigator();


const Navigation = () => {
    
    const {dbCourier, loading} = useAuthContext();

    
    if(loading){
        return <ActivityIndicator size="large" color="gray" />
    }


    return (
    <Stack.Navigator screenOptions={{
        headerShown: false
    }}>

    {dbCourier?(<>
            <Stack.Screen name = "OrderScreen" component={OrderScreen}/>
            <Stack.Screen name = "OrderDeliveryScreen" component={OrderDelivery}/>
        </>):(<>
            <Stack.Screen name = "ProfileScreen" component={Profile}/>
        </>)}

        
        </Stack.Navigator>)

}

export default Navigation;