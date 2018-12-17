import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { connect } from 'react-redux'
import { logout } from '../store/loginAction'

// _id: "5c14964d8562ec29092d7517",
// name: "adit",
// email: "adit@mail.com",
// avatar: "",
// lat: "-6.1753924",
// lng: "106.8249641",
// score: 100,
// userMeetings: [{
//     "_id": "5c14a5af268d263a62a681d0",
//     "title": "Go Meeting",
//     "description": "Hows life Panjang Bnaget ini descripsinya harus sampe enter woiaskldjaskl dklasjd klas jdklasd jlaskd jaskld j",
//     "participants": ['5c12370715da6b39635d7039'],
//     "host": '5c12370715da6b39635d7039',
//     "lat": "-6.132055",
//     "lng": "106.871483",
//     "status": "upcoming",
//     "startAt": "2018-12-18T00:00:00.000Z",
//     "createdAt": "2018-12-15T06:56:47.940Z",
//     "updatedAt": "2018-12-15T06:56:47.940Z"
// }],
// meetingInvitation: ['5c123a57268d263a62a681ca']

class ProfileView extends Component {

    logoutHandler() {
        const { logout , navigation } = this.props
        navigation.replace('Auth')
        logout()
    }

    render() {
        const { user } = this.props

        if(!user) return (<ActivityIndicator></ActivityIndicator>)

        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <Image style={styles.avatar} source={{uri: 'https://bootdey.com/img/Content/avatar/avatar2.png'}}/>
                        <Text style={styles.name}>
                            {user.name}
                        </Text>
                    </View>
                </View>

                <View style={styles.profileDetail}>
                    <View style={styles.detailContent}>
                        <Text style={styles.title}>Score</Text>
                        <Text style={styles.count}>{user.score}</Text>
                    </View>
                    <View style={styles.detailContent}>
                        <Text style={styles.title}>Meetings</Text>
                        <Text style={styles.count}>{user.userMeetings.length}</Text>
                    </View>
                </View>

                <ScrollView style={styles.body}>
                    <View style={styles.bodyContent}>

                        <View style={styles.item}>
                            <View style={styles.iconContent}>
                                <Image style={styles.icon} source={{uri: 'https://png.icons8.com/user/ultraviolet/50/3498db'}}/>
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.info}>{user.name}</Text>
                            </View>
                        </View>
                        <View style={styles.item}>
                            <View style={styles.iconContent}>
                                <Image style={styles.icon} source={{uri: 'https://png.icons8.com/message/ultraviolet/50/3498db'}}/>
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.info}>{user.email}</Text>
                            </View>
                        </View>


                        <TouchableOpacity style={styles.buttonContainer} onPress={ () => this.logoutHandler()}>
                            <Text style={{color : 'white'}}>Logout</Text>  
                        </TouchableOpacity> 
                    </View>
                </ScrollView>
            </View>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        user: state.login.user
    }
}

const mapDispatchToProps = (dispatch) => ({
    logout: () => {dispatch(logout())}
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfileView)
  
// --------------------------------------------
const styles = StyleSheet.create({
    item:{
        flexDirection : 'row',
        marginBottom : 30,
        marginTop: 30
    },
    iconContent:{
        flex:1,
        alignItems:'flex-start',
        // paddingRight:5,
        paddingLeft:50
    },
    icon:{
        width:30,
        height:30,
        marginTop:10,
    },
    infoContent:{
        flex:1,
        alignItems:'flex-start',
    },
    info:{
        fontSize:18,
        marginTop:10,
        color: "gray",
        marginLeft:-50
    },
    header:{
        backgroundColor: "#183133",
    },
    headerContent:{
        padding:20,
        alignItems: 'center',
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: "white",
        marginBottom:10,
    },
    name:{
        fontSize:22,
        color:"white",
        fontWeight:'600',
    },
    profileDetail:{
        alignSelf: 'center',
        marginTop:130,
        alignItems: 'center',
        flexDirection: 'row',
        position:'absolute',
        backgroundColor: "#ffffff"
    },
    detailContent:{
        margin:20,
        alignItems: 'center'
    },
    title:{
        fontSize:25,
        color: "#183133"
    },
    count:{
        fontSize:25,
    },
    bodyContent: {
        flex: 1,
        alignItems: 'center',
        padding:30,
        marginTop:40,
        marginBottom:120
    },
    textInfo:{
        fontSize:18,
        marginTop:20,
        color: "#696969",
    },
    buttonContainer: {
        marginTop:10,
        height:45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:20,
        width:250,
        borderRadius:30,
        backgroundColor: "#183133",
    },
    description:{
        fontSize:20,
        color: "#183133",
        marginTop:10,
        textAlign: 'center'
    },
});