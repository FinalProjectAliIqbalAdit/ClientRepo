import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { connect } from 'react-redux'
import { logout } from '../store/loginAction'
import axios from '../config/axios'
import realAxios from 'axios'
import {fetchMeetings} from '../store/meetingsAction'
import db from '../config/firebase.js'

class ProfileView extends Component {

    state = {
        user : null,
        loading : true
    }

    fetchUser = (userId, token) => {
        axios.get(`/users/${userId}`, {
            headers : {
                token : token
            }
        })
        .then((result) => {
            this.setState({
                user : result.data,
                loading : false
            })
        }).catch((err) => {
            alert(JSON.stringify(err.response,null,2))
        });
    }

    logoutHandler() {
        const { logout , navigation } = this.props
        navigation.replace('Auth')
        logout()
    }

    acceptInvitation = (meetingObj) => {
        axios.get(`/meetings/accept/${meetingObj._id}`, {
            headers : {
                token : this.props.token
            }
        })
        .then((result) => {
            this.fetchUser(this.props.user._id, this.props.token)
            this.props.fetchMeetings()
            this.asignToFirebasDatabase(meetingObj)
        }).catch((err) => {
            alert(JSON.stringify(err.response,null,2))            
        });
    }

    asignToFirebasDatabase =  (meetingObj) => {
        let user = this.props.user
        realAxios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${Number(user.lat)},${Number(user.lng)}&destinations=${Number(meetingObj.lat)},${Number(meetingObj.lng)}&mode=driving&key=AIzaSyBa-c-SNhtue6ozeAQajtfmhhnYhrNlGMY`)
          .then(({ data })=>{
            db.ref(`meetings/${meetingObj.title}/${user.name}`).set({
              _id : user._id,
              name : user.name,
              lat : Number(user.lat),
              lng : Number(user.lng),
              duration: data.rows[0].elements[0].duration.text,
              distance: data.rows[0].elements[0].distance.text

            })
            .then(()=>{
                
            })
          })
        .catch((error)=>{
            alert(JSON.stringify(error,null,2))
        })
    }

    render() {
        const { user, token } = this.props

        if(!user) return (<ActivityIndicator style={{marginTop:29}}></ActivityIndicator>)
        else if(this.state.loading) {
            this.fetchUser(user._id, token)
            return (<ActivityIndicator style={{marginTop:29}}></ActivityIndicator>)
        }

        return (
            <View style={{marginTop:29}}>
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <Image style={styles.avatar} source={{uri: 'https://bootdey.com/img/Content/avatar/avatar2.png'}}/>
                    </View>
                </View>

                <ScrollView style={styles.body}>
                    <View style={styles.bodyContent}>

                        <View style={styles.item}>
                            <View style={styles.iconContent}>
                                <Image style={styles.icon} source={{uri: 'https://png.icons8.com/user/ultraviolet/50/3498db'}}/>
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.info}>{this.state.user.name}</Text>
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
                        <View style={styles.item}>
                            <View style={styles.iconContent}>
                                <Image style={styles.icon} source={{uri: 'https://png.icons8.com/edit-file/color/40'}}/>
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.info}>Score {user.score} / {user.userMeetings.length} Meetings </Text>
                            </View>
                        </View>

                        <Text style={{fontSize:20, margin : 25}}>You have {this.state.user.meetingInvitation.length} Meeting Invitation</Text>

                        {this.state.user.meetingInvitation.map((meetingInvite,i) => {
                            return (
                                <View  style={styles.box}>
                                    <Text style={{padding : 15, fontSize: 18}} >{meetingInvite.title}</Text>
                                    <TouchableOpacity onPress={() => this.acceptInvitation(meetingInvite) }>
                                        <View style={styles.iconContent2}>
                                            <Image style={styles.icon} source={{uri: "https://png.icons8.com/ok/androidL/30/ffffff"}}/>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )
                        })}

                        <TouchableOpacity style={[styles.buttonContainer, {marginTop: 30}]} onPress={ () => this.logoutHandler()}>
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
        user: state.login.user,
        token : state.login.user.token
    }
}

const mapDispatchToProps = (dispatch) => ({
    logout: () => {dispatch(logout())},
    fetchMeetings: () => {dispatch(fetchMeetings())}
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfileView)
  
// --------------------------------------------
const styles = StyleSheet.create({
    box: {
        justifyContent : 'space-between',
        marginTop:5,
        marginBottom:5,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        shadowColor: 'black',
        shadowOpacity: .2,
        shadowOffset: {
          height:1,
          width:-2
        },
        elevation:2,
        width: 300
      },
    item:{
        flexDirection : 'row',
        marginBottom : 10,
        marginTop: 10
    },
    iconContent:{
        flex:1,
        alignItems:'flex-start',
        // paddingRight:5,
        paddingLeft:50
    },
    iconContent2:{
        width: 60,
        height: 60,
        backgroundColor: '#183133',
        marginLeft: 'auto',
        alignItems: 'center'
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
        padding:10,
        alignItems: 'center',
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: "white",
        // marginBottom:10,
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
        padding:10,
        marginTop:5,
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
 