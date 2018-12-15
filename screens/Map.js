import React, { Component } from 'react';
import { Platform,Text,View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from '../config/axios'
import db from '../config/firebase'
import { PermissionsAndroid } from 'react-native';

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
    participants : []
  };

  // componentWillMount =  () => {
    
    // PermissionsAndroid.request(
    //   PermissionsAndroid.PERMISSIONS.CAMERA,
    //   {
    //     'title': 'Cool Photo App Camera Permission',
    //     'message': 'Cool Photo App needs access to your camera ' +
    //                'so you can take awesome pictures.'
    //   }
    // )
    // .then((result) => {
    //   alert(JSON.stringify(result,null,2))
    // }).catch((err) => {
    //   alert(JSON.stringify(err,null,2))
      
    // });
 
  // }

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
      (error) => {
          this.setState({
              error: error.message
          })
      },
      {enableHighAccuracy : false, timeout: 20000, maximumAge: 10000, distanceFilter: 10 }
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
          alert(JSON.stringify(error.message,null,2))
      },
      {enableHighAccuracy : false, timeout: 20000, maximumAge: 10000}
    )
  }

  updatePositionToDB = (position) => {
    let meeting = this.props.navigation.state.params.meeting
    let user = this.props.navigation.state.params.user
    db.ref(`meetings/${meeting.title}/${user.name}`).set({
      _id : user._id,
      name : user.name,
      lat : position.coords.latitude,
      lng : position.coords.longitude,
    }).then((data)=>{
        // alert(JSON.stringify(data.val(),null,2))
    }).catch((error)=>{
        alert(JSON.stringify(error,null,2))
    })
  }

  componentWillUnmount = () => {
    navigator.geolocation.clearWatch(this.watchId);
  }

  render() {
    if (!this.state.region) {
      return (<Text>Loading</Text>)
    }else{
      this.getDeviceCurrentPosition()
      return (
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: Number(this.props.navigation.state.params.meeting.lat),
            longitude: Number(this.props.navigation.state.params.meeting.lng),
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          
          <Marker 
            key={'0'} 
            title={'Meeting Location'} 
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
      );
    }
    
  }
}

export default Map;