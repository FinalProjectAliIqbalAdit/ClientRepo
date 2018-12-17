import React, { Component } from 'react';
import { Platform,Text,View, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from '../config/axios'
import realAxios from 'axios'
import db from '../config/firebase'
import { PermissionsAndroid } from 'react-native';
import moment from 'moment'

class Map extends Component {
    state = {
        region: null,
        location: null,
        errorMessage: null,
        mylatitude: -6.1754,
        mylongitude: 106.8272,
        latitudeDelta: 0.002,
        longitudeDelta: 0.002,
        error : null,
        participants : {}
    };

    componentDidMount() {
        this.watchId = navigator.geolocation.watchPosition(
            (position) => {
                const obj = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                this.setState({
                    mylatitude: position.coords.latitude,
                    mylongitude: position.coords.longitude,
                    region : obj
                })
            }, 
            
            {enableHighAccuracy : false, timeout: 50000, maximumAge: 10000, distanceFilter: 10 }
        )

        this.WatchRealTimeDatabase()
        
    }

    WatchRealTimeDatabase = () => {
        let meeting = this.props.navigation.state.params.meeting
        db.ref(`meetings/${meeting.title}`).on('value',  (snapshot) => {
            // alert(JSON.stringify(snapshot.val(),null,2))
            this.setState({
                participants : snapshot.val()
            })
        });
    }

    getDeviceCurrentPosition = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.updatePositionToDB(position)
            },
            (error) => {
                this.setState({error: error.message})
                // alert(JSON.stringify(error.message,null,2))
            },
            {enableHighAccuracy : false, timeout: 50000, maximumAge: 10000}
        )
    }

    updatePositionToDB = (position) => {
        let meeting = this.props.navigation.state.params.meeting
        let user = this.props.navigation.state.params.user
        realAxios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${Number(user.lat)},${Number(user.lng)}&destinations=${Number(meeting.lat)},${Number(meeting.lng)}&mode=driving&language=id&key=AIzaSyBa-c-SNhtue6ozeAQajtfmhhnYhrNlGMY`)
          .then(({ data })=>{
            db.ref(`meetings/${meeting.title}/${user.name}`).set({
              _id : user._id,
              name : user.name,
              lat : position.coords.latitude,
              lng : position.coords.longitude,
              duration: data.rows[0].elements[0].duration.text,
              distance: data.rows[0].elements[0].distance.text
            })
            .then(()=>{})
          })
        .catch((error)=>{
            // alert(JSON.stringify(error,null,2))
        })
    }

    componentWillUnmount = () => {
        navigator.geolocation.clearWatch(this.watchId);
    }

    showDepartTime() {
        const {participants} = this.state
        let participantsArr = Object.values(participants)
        return (
            <View style={{flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(255,255,255,1)',
                borderRadius: 20,
                height: 40,
                marginTop: 10,}}>
                <TouchableOpacity onPress={() => {this.map.fitToSuppliedMarkers(participantsArr.map(m => m.id), {edgePadding : {top: 200, right: 100, bottom: 100, left: 400}})}}>
                    <Text style={{marginHorizontal: 10, fontWeight: '600' }}>
                        { moment(this.props.navigation.state.params.arr[0].departTime).format("dddd Do MMM YYYY") } {"\n"}
                        You should go at : { moment(this.props.navigation.state.params.arr[0].departTime).format("HH:mm A") }
                        
                        {/* { moment(new Date).format("dddd Do MMM YYYY HH:mm A") } */}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
    showParticipants() {
        
        const {participants} = this.state;
        let participantsArr = Object.values(participants)
        return participantsArr.map(member => {
            return (
                <View key={member._id} style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255,255,255,1)',
                    borderRadius: 20,
                    height: 30,
                    marginTop: 10,
                }}>
                    <View style={[{
                        height: 30,
                        width: 30,
                        borderRadius: 15,
                    }, {
                        backgroundColor: '#183133'
                    }]}/>
                    <TouchableOpacity onPress={() => {this.map.fitToCoordinates([{latitude : member.lat, longitude: member.lng}])}}>
                        <Text style={{ marginHorizontal: 10 }}>{member.name}</Text>
                    </TouchableOpacity>
                </View>
            );
        });
    }

    render() {
        if (!this.state.region) return (<ActivityIndicator></ActivityIndicator>)
        this.getDeviceCurrentPosition()
        return (
            <View style={{...StyleSheet.absoluteFillObject,
                justifyContent: 'space-between',
                alignItems: 'center',}}
            >
                <MapView
                    style={{ ...StyleSheet.absoluteFillObject }}
                    ref={ref => {this.map = ref}}
                    initialRegion={{
                        latitude: Number(this.props.navigation.state.params.meeting.lat),
                        longitude: Number(this.props.navigation.state.params.meeting.lng),
                        latitudeDelta: 0.011,
                        longitudeDelta: 0.011,
                    }}
                >
                    
                    <Marker 
                        key={'0'} 
                        title={ `Start At :${moment(this.props.navigation.state.params.meeting.startAt).format("dddd Do MMM YYYY HH:mm A")}` } 
                        coordinate={{
                        latitude: Number(this.props.navigation.state.params.meeting.lat), 
                        longitude: Number(this.props.navigation.state.params.meeting.lng)
                        }} 
                    />

                    {this.state.participants && Object.keys(this.state.participants).map(key => 
                        <Marker 
                        key={this.state.participants[key]._id} 
                        title={this.state.participants[key].name} 
                        coordinate={{
                            latitude: Number(this.state.participants[key].lat),
                            longitude: Number(this.state.participants[key].lng)
                        }} 
                        image={require('../assets/location.png')}
                        />
                    )}
                
                </MapView>

                <View style={{
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    width: '100%',
                    paddingHorizontal: 10,
                }}>
                    {this.showDepartTime()}
                </View>

                <View style={{
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    width: '100%',
                    paddingHorizontal: 10,
                    marginBottom : 30,
                }}>
                    {this.showParticipants()}
                </View>

            </View>
        );
        
        
    }
}

export default Map;