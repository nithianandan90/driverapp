import { StyleSheet } from "react-native";


export default StyleSheet.create({
    container: {
        backgroundColor: 'lightblue', 
        flex: 1
    },
    handleIndicator : {
        backgroundColor: 'grey',
        width: 100
    },

    handleIndcatorContainer: {
        marginTop:10, 
        flexDirection:'row', 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginBottom: 20
    },
    routeDetailsText: {
        fontSize: 25,
        letterSpacing : 1
    },
    deliveryDetailsContainer: {
        paddingHorizontal: 20
    },
    restaurantName: {
        fontSize: 25, 
        letterSpacing: 1, 
        paddingVertical: 20, 
        textAlign: 'center'
    },
    addressContainer: {flexDirection: 'row', marginBottom: 20},
    addressText: {fontSize: 20, color: 'grey', fontWeight: '500', letterSpacing: 0.5, marginLeft:15, textAlign: 'center'},
    orderItemText: {fontSize: 18, color: 'grey', fontWeight: '500', marginBottom: 0.5, letterSpacing: 0.5},
    orderDetailsContainer: {borderTopWidth: 1, borderColor: 'lightgrey', paddingTop: 10},
    buttonContainer: {backgroundColor: "#3FC060", marginTop: 'auto', marginVertical: 30, marginHorizontal: 10, borderRadius: 10},
    buttonText:{color: 'white', paddingVertical: 10, fontSize: 25, fontWeight: '500', textAlign: 'center'}
});