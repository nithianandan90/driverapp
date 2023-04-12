import { StatusBar } from 'expo-status-bar';
import { FlatList, Image, StyleSheet, Text, View, } from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import OrderDelivery from './src/screens/OrderDelivery';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './src/navigation';
import {Amplify} from 'aws-amplify';
import awsconfig from './src/aws-exports';
import {withAuthenticator} from 'aws-amplify-react-native';
import AuthContextProvider from './src/contexts/AuthContext';
import OrderContextProvider from './src/contexts/OrderContext';
import '@azure/core-asynciterator-polyfill'; 


Amplify.configure({...awsconfig, Analytics: {disabled: true}});



function App() {
  return (
  <GestureHandlerRootView style={{flex:1}}>
    <NavigationContainer>
        <AuthContextProvider>
          <OrderContextProvider>
             <Navigation/>
          </OrderContextProvider>
        </AuthContextProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default withAuthenticator(App);

const styles = StyleSheet.create({
  
});
