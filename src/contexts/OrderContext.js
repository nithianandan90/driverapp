import {createContext, useState, useEffect, useContext} from 'react';
import { Auth, DataStore } from 'aws-amplify';
import { Courier, Order, OrderDish, User } from '../models';
import { useAuthContext } from './AuthContext';


const OrderContext = createContext({});


const OrderContextProvider = ({children}) => {
    const {dbCourier} = useAuthContext();

    const [order,setOrder] = useState(null);   
    const [orderUser,setOrderUser] = useState(null);   
    const [dishItems,setDishItems] = useState(null);   
    const [restaurant, setRestaurant] = useState(null);
    


    useEffect(()=>{
        if(!order){
            return;
        }

        const subscription = DataStore.observe(Order, order.id).subscribe(({opType, element})=> {
            if(opType==="UPDATE"){
                setOrder(element);
            }
        })

        return () => subscription.unsubscribe();
    },[order?.id])


    const fetchOrder = async (id)=>{
    
        if(!id){
            setOrder(null);
            return;
        }
        const fetchedOrder = await DataStore.query(Order, id);
            

        const fetchedOrderUser = await DataStore.query(User, fetchedOrder.userID);

        const fetchedOrderDishes =(await DataStore.query(OrderDish, od => od.orderID.eq(fetchedOrder.id)));
        
        const orderDishes = await getOrderDish(fetchedOrderDishes);
        
        const fetchedOrderRestaurant = await fetchedOrder.Restaurant;

        


        setOrder(fetchedOrder);
        setOrderUser(fetchedOrderUser);
        setDishItems(orderDishes);
        setRestaurant(fetchedOrderRestaurant);

    }

   
    const getOrderDish = async (orderDish) => {
        
        
        const dishesObject = Promise.all(
            orderDish.map(async (item)=>{
                return {Dish: await item.Dish, quantity: item.quantity};
            }));
        
        return dishesObject;
    }


    const pickupOrder = async () => {
        
        console.log("function reached");
        const updatedOrder = await DataStore.save(Order.copyOf(order, (updated)=>{
            updated.total = 10;
            updated.status = "PICKED_UP"; //updated to "ACCEPTED"

        }));

        setOrder(updatedOrder);
         
    }

    const completeOrder = async () => {
        const updatedOrder = await DataStore.save(Order.copyOf(order, (updated)=>{
            updated.status = "COMPLETED"; //updated to "ACCEPTED"
            updated.Courier = dbCourier;
        }));
        setOrder(updatedOrder);
    }



    const acceptOrder = async () => {
        DataStore.save(Order.copyOf(order, (updated)=>{
            updated.status = "ACCEPTED"; //updated to "ACCEPTED"
            updated.Courier = dbCourier;
        })).then(setOrder);
    }
    
    return (
        <OrderContext.Provider value={{acceptOrder, pickupOrder, completeOrder, order, orderUser, dishItems, restaurant, fetchOrder}} >{children}</OrderContext.Provider>
    )
}


export default OrderContextProvider;

export const useOrderContext = () => useContext(OrderContext);