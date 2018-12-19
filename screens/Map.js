import React, { Component } from 'react';
import { Platform,Text,View, ActivityIndicator, StyleSheet, TouchableOpacity, Modal, ScrollView, ListView , Image} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from '../config/axios'
import realAxios from 'axios'
import db from '../config/firebase'
import { PermissionsAndroid } from 'react-native';
import moment from 'moment'
import { connect } from 'react-redux';
import { fetchMeetings } from '../store/meetingsAction'


class Map extends Component {

    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRows(props.navigation.state.params.meeting.participants),
            lat: '',
            lng: '',
            populateLoading : true,
            modalVisible : false,
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
    }

    pressHandler = () => {
        this.toggleModal()
    }

    toggleModal = () => {
        this.setState({
            modalVisible : !this.state.modalVisible
        })
    }

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

        axios.get(`/meetings/${this.props.navigation.state.params.meeting._id}`)
        .then(({data}) => {
            this.setState({
                dataSource : new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(data.participants),
                populateLoading : false
            })
        }).catch((err) => {
            alert(JSON.stringify(err.response,null,2))
        });
    }

    sendScoreFeedback = (score, participant) => {
        axios.put(`/meetings/feedback/${this.props.navigation.state.params.meeting._id}`, {
            meetingId : this.props.navigation.state.params.meeting._id,
            participantId : participant._id,
            feedbackScore : score
        }, {
            headers : {
                token : this.props.token
            }
        })
        .then(({data}) => {
            console.log(data);
            return db.ref(`meetings/${this.props.navigation.state.params.meeting.title}/${participant.name}`).remove()
        })
        .then(() => {
            
        }).catch((err) => {
            alert(JSON.stringify(err,null,2))
        });
    }

    closeMeeting = () => {
        axios.put(`/meetings/${this.props.navigation.state.params.meeting._id}`, {
            status : 'done'
        }, {
            headers : {
                token : this.props.token
            }
        })
        .then(() => {
            return db.ref(`meetings/${this.props.navigation.state.params.meeting.title}`).remove()
        })
        .then(() => {
            navigator.geolocation.clearWatch(this.watchId);
            this.props.fetchMeetings()
            this.props.navigation.navigate('List')
        }).catch((err) => {
            alert(JSON.stringify(err,null,2))
        });
    }

    WatchRealTimeDatabase = () => {
        let meeting = this.props.navigation.state.params.meeting
        db.ref(`meetings/${meeting.title}`).on('value',  (snapshot) => {
            if(!snapshot.exists() || !snapshot.child(`${this.props.navigation.state.params.user.name}`).exists()) {
                navigator.geolocation.clearWatch(this.watchId);
                this.props.fetchMeetings()
                this.props.navigation.replace('List')
            } else {
              let dataParticipants = Object.values(snapshot.val())
              this.setState({
                   participants : snapshot.val(),
                   dataSource : new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(dataParticipants),
                   populateLoading : false
               })
            }
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
        realAxios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${Number(position.coords.latitude)},${Number(position.coords.longitude)}&destinations=${Number(meeting.lat)},${Number(meeting.lng)}&mode=driving&key=AIzaSyBa-c-SNhtue6ozeAQajtfmhhnYhrNlGMY`)
          .then(({ data })=>{
            db.ref(`meetings/${meeting.title}/${user.name}`).set({
              _id : user._id,
              name : user.name,
              lat : Number(position.coords.latitude),
              lng : Number(position.coords.longitude),
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
        let scores = [20,40,60,80,100]
        if (!this.state.region) return (<ActivityIndicator></ActivityIndicator>)
        this.getDeviceCurrentPosition()
        let isHost = this.props.navigation.state.params.meeting.host._id == this.props.user._id
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
                            coordinate={{
                                latitude: Number(this.state.participants[key].lat),
                                longitude: Number(this.state.participants[key].lng)
                            }} 
                            image={require('../assets/location.png')}
                        >
                            <MapView.Callout>
                                <Text>{this.state.participants[key].name}</Text>
                                <Text>Estimate Time : {this.state.participants[key].duration}</Text>
                                <Text>Distance : {this.state.participants[key].distance}</Text>
                            </MapView.Callout>    
                        </Marker>
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
                    marginBottom : 20,
                }}>
                    {this.showParticipants()}
                    { isHost && <TouchableOpacity 
                      onPress={()=>{
                        this.toggleModal()
                      }}
                      style={{
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(255,255,255,1)',
                        borderRadius: 20,
                        height: 30,
                        marginTop: 10,}}
                    >
                            <Text style={{marginHorizontal: 10, fontWeight: '600' }} >
                                Meeting Control
                            </Text>
                    </TouchableOpacity>}
                </View>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        console.log('Modal has been closed.');
                    }}
                    >
                    <View style={{ flex: 1 ,flexDirection: 'column', justifyContent: 'flex-end'}}>
                        <View style={{ height: "100%" ,width: '100%', backgroundColor:"#fff" , alignItems: 'center'}}>
                            <ScrollView style={styles.container}>
                                <Text style={{fontSize : 22,marginLeft: 10, marginBottom:20, justifyContent: 'center', alignItems: 'center'}}> Send Feedback to Participants </Text>
                                { this.state.populateLoading ? <ActivityIndicator></ActivityIndicator> : (<ListView 
                                    enableEmptySections={true}
                                    dataSource={this.state.dataSource}
                                    renderRow={(participant) => {
                                        return (
                                            <View style={styles.box}>
                                                <Image style={styles.image} source={{uri: "https://bootdey.com/img/Content/avatar/avatar1.png"}} />
                                                <View style={styles.boxContent}>
                                                    <Text style={styles.title}>{participant.name}</Text>
                                                    {/* <Text style={styles.description}>Lorem ipsum dolor sit amet, elit consectetur</Text> */}
                                                    <View style={styles.starContainer}>
                                                        {scores.map((score,i) => {
                                                            return (
                                                                <TouchableOpacity key={i} onPress={() => this.sendScoreFeedback(score, participant)}>
                                                                    <Image style={styles.star} source={{uri:"https://img.icons8.com/color/40/000000/star.png"}}/>
                                                                </TouchableOpacity>
                                                            )
                                                        })}
                                                    </View>
                                                </View>
                                            </View>
                                        )
                                    }}
                                />)}
                                <TouchableOpacity style={[styles.buttonContainer, {marginTop: 30}]} onPress={ () => this.closeMeeting()}>
                                    <Text style={{color : 'white'}}>Close Meeting</Text>  
                                </TouchableOpacity> 
                                <TouchableOpacity style={[styles.buttonContainerBack, {marginTop: 30}]} onPress={ () => this.toggleModal()}>
                                    <Text style={{color : 'white'}}>Back</Text>  
                                </TouchableOpacity> 
                            </ScrollView>
                        </View>
                    </View>
                </Modal>

            </View>
        );
        
        
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 30,
    },
    nameView: {
        width: 240,
        padding: 10,
        backgroundColor: '#435562'
    },
    image: {
        width: 60,
        height:60,
    },
    starContainer:{
        justifyContent:'flex-start', 
        marginHorizontal:5, 
        flexDirection:'row', 
        marginTop:1
    },
    star:{
        width:40,
        height:40,
    },
    box: {
        padding:5,
        marginTop:5,
        marginBottom:5,
        backgroundColor: 'white',
        flexDirection: 'row',
    },
    boxContent: {
        flex:1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginLeft:10,
    },
    title:{
        fontSize:18,
        color:"#151515",
        marginLeft:10,
    },
    button: {
        height:35,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius:10,
        width:50,
        marginRight:5,
        marginTop:5,
    },
    buttonContainer: {
        marginTop:10,
        alignSelf : 'center',
        height:45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:20,
        width:250,
        borderRadius:30,
        backgroundColor: "#183133",
    },
    buttonContainerBack: {
        marginTop:10,
        alignSelf : 'center',
        height:45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:20,
        width:130,
        borderRadius:30,
        backgroundColor: "#f40059",
    }
});

const mapStateToProps = (state) => {
    return {
        token: state.login.user.token,
        user : state.login.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return  {
        fetchMeetings : () => dispatch(fetchMeetings())
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(Map);