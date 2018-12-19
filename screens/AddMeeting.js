import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    DatePickerIOS,
    TouchableOpacity,
    Image,
    Platform,
    DatePickerAndroid,
    TimePickerAndroid
} from 'react-native';
import axios from '../config/axios';
import { connect } from 'react-redux';
import { fetchUserMeetings,searchPlace,fetchMeetings } from "../store/meetingsAction";
import db from '../config/firebase'
import realAxios from 'axios'
import moment from 'moment'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginLeft: 20,
        marginRight: 20,
        paddingVertical: 10
    },
    inputContainer: {
        borderBottomColor: '#f4f1ec',
        backgroundColor: '#FFFFFF',
        borderRadius: 30,
        borderBottomWidth: 1,
        width: 300,
        height: 45,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center'
    },
    pickTimeContainer: {
        backgroundColor: '#f6546a',
        borderRadius: 10,
        width: 300,
        height: 45,
        marginBottom: 20,
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    pickTimeButton: {
        backgroundColor: 'blue',
        borderRadius: 10,
        width: 100,
        height: 45,
        marginBottom: 5,
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    dateContainer: {
        borderColor: '#f4f1ec',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        width: 300,
        height: 200,
        marginBottom: 27
    },
    inputs:{
        height: 45,
        marginLeft: 20,
        borderBottomColor: '#FFFFFF',
        flex: 1
    },
    inputIcon:{
        width: 30,
        height: 30,
        marginRight: 20,
        justifyContent: 'center'
    },
    buttonContainer: {
        height: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        width: 180,
        borderRadius: 30,
        backgroundColor: 'transparent'
    },
    createButton: {
        backgroundColor: "#11a29a"
    },
    btnText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '600'
    },
    textPickTime: {
        marginLeft: 20,
        flex: 1,
        fontWeight: '700',
        fontSize: 15,
        color: 'white'
    }
});  

class AddMeeting extends Component {
    static navigationOptions = {
        title: 'Create',
        headerStyle: {
            borderBottomWidth: 0
        },
        headerTitleStyle: { color: 'black' },
    }

    state = {
        title: '',
        description: '',
        place: '',
        lat: '',
        lng: '',
        hideSuggestion: false,
        startAt: new Date(),
        chosenAndroidTime: '00:00',
        androidDate: `${new Date().getUTCDate()}/${new Date().getUTCMonth() + 1}/${new Date().getUTCFullYear()}`,
        value: 50,
    }

    handleInputChange = val => (e) => {
        if (val == 'place') {
          this.setState({
            hideSuggestion: false
          })
          this.props.searchPlace(e)
        }
        this.setState({
            [val]: e
        });
    }

    addMeeting = () => { 
        console.log('masuk');
        axios.post(`/meetings`, {
            title: this.state.title,
            description: this.state.description,
            lat: this.state.lat,
            lng: this.state.lng,
            place: this.state.place,
            startAt: this.state.startAt
        },{headers: {token: this.props.token}})
            .then(() => {
                console.log('hrusnya kebuat', this.props.user);
                realAxios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${Number(this.props.user.lat)},${Number(this.props.user.lng)}&destinations=${Number(this.state.lat)},${Number(this.state.lng)}&mode=driving&key=AIzaSyBa-c-SNhtue6ozeAQajtfmhhnYhrNlGMY`)
                .then(({ data })=>{
                  console.log('data ===> hasil nembak', data);
                  db.ref(`meetings/${this.state.title}/${this.props.user.name}`).set({
                    _id : this.props.user._id,
                    name : this.props.user.name,
                    lat : this.props.user.lat,
                    lng : this.props.user.lng,
                    duration: data.rows[0].elements[0].duration.text,
                    distance: data.rows[0].elements[0].distance.text
                  })
                  .then(()=>{
                    this.setState({
                      title: '',
                      description: '',
                      place: '',
                      lat: '',
                      lng: '',
                      startAt: new Date()
                    })
                    this.props.fetchMeetings()
                    this.props.navigation.navigate('Meetings')
                  })
                
            })
            .catch((err) => {
                console.log('Create Meeting Error: ', err);
            });
          })
        }
    
        setDate(newDate) {
            this.setState({ chosenDate: newDate });
        }
          
        setDateAndroid = async () => {
            try {
                const { action, year, month, day, } = await DatePickerAndroid.open({
                    date: new Date(),
                    minDate: new Date(),
                });
                if (action !== DatePickerAndroid.dismissedAction) {
                    this.setState({ androidDate: `${day}/${month + 1}/${year}` });
                }
            } catch ({ code, message }) {
                console.warn('Cannot open date picker', message);
            }
        };
          
        setTimeAndroid = async () => {
            try {
                const { action, hour, minute } = await TimePickerAndroid.open({
                    hour: 14,
                    minute: 0,
                    is24Hour: false, // Will display '2 PM'
                });
                if (action !== TimePickerAndroid.dismissedAction) {
                        // Selected hour (0-23), minute (0-59)
                    const m = (minute < 10) ? `0${minute}` : minute;
                    const h = (hour < 10) ? `0${hour}` : hour;
                    this.setState({ chosenAndroidTime: `${h}:${m}` });
                }
            } catch ({ code, message }) {
                 console.warn('Cannot open time picker', message);
            }
          };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <TextInput style={styles.inputs}
                        placeholder="Title"
                        value={this.state.title}
                        underlineColorAndroid='transparent'
                        onChangeText={this.handleInputChange('title')}/>
                    <Image style={styles.inputIcon} source={{uri: 'https://img.icons8.com/color/50/000000/scroll.png'}}/>
                </View>
    
                <View style={styles.inputContainer}>
                    <TextInput style={styles.inputs}
                        placeholder="Description"
                        value={this.state.description}
                        underlineColorAndroid='transparent'
                        onChangeText={this.handleInputChange('description')}/>
                    <Image style={styles.inputIcon} source={{uri: 'https://img.icons8.com/color/48/000000/typewriter-with-paper.png'}}/>
                </View>

                <View style={styles.inputContainer}>
                    <TextInput style={styles.inputs}
                        placeholder="Place"
                        value={this.state.place}
                        underlineColorAndroid='transparent'
                        onChangeText={this.handleInputChange('place')}/> 
                    <Image style={styles.inputIcon} source={{uri: 'https://img.icons8.com/color/48/000000/map-marker.png'}}/>
                </View>
                {!this.state.hideSuggestion && 
                  <View>
                    {this.props.searchResult.length !== 0 && this.props.searchResult.map(elem => 
                      <TouchableOpacity key={elem.id} style={{width: 300}} onPress= {()=>{
                        this.setState({
                          lat: elem.geometry.location.lat,
                          lng: elem.geometry.location.lng,
                          place: elem.name,
                          hideSuggestion: true
                        })
                      }}>
                          <Text style={{color: 'black'}}>{elem.name}</Text>
                          <TextInput style={{color: 'grey'}} editable = {false}>{elem.formatted_address}</TextInput>
                      </TouchableOpacity>)} 
                  </View>
                }
                 

                <View style={styles.pickTimeContainer}>
                    <Text style={styles.textPickTime}>
                        Pick your meeting time
                    </Text>
                    <Image style={styles.inputIcon} source={{uri: 'https://img.icons8.com/color/48/000000/calendar-plus.png'}}/>
                </View>
            
                <View style={styles.dateContainer}>
                    {Platform.OS == 'ios' ? 
                        (<DatePickerIOS
                            date={this.state.startAt}
                            onDateChange={this.handleInputChange('startAt')}
                        />) : 
                        (<View style={{padding: 10, alignContent: 'center', justifyContent: 'center', alignItems: 'center'}}>
                            <TouchableOpacity onPress={() => this.setDateAndroid()}>
                                <View style={styles.pickTimeButton}>
                                    <Text style={styles.textPickTime}>
                                        Pick Date
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.setTimeAndroid()}>
                                <View style={styles.pickTimeButton}>
                                    <Text style={styles.textPickTime}>
                                        Pick Time
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <Text>
                                { moment(this.state.androidDate+''+this.state.chosenAndroidTime, 'DD/MM/YYYY hh:mm').format("DD-MM-YYYY hh:mm A") }
                            </Text>
                            <TouchableOpacity onPress={() => this.setState({
                                startAt : moment(this.state.androidDate+''+this.state.chosenAndroidTime, 'DD/MM/YYYY hh:mm')
                            })}>
                                <View style={styles.pickTimeButton}>
                                    <Text style={styles.textPickTime}>
                                        Confirm
                                    </Text>
                                </View>
                            </TouchableOpacity>
                       
                        </View>) }
                </View>
    
                <TouchableOpacity style={[styles.buttonContainer, styles.createButton]} onPress={()=> this.addMeeting()}>
                    <Text style={styles.btnText}>Create Meeting</Text>
                </TouchableOpacity>
          </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.login.user.token,
        userId: state.login.user._id,
        searchLoading: state.meetings.searchLoading,
        searchResult : state.meetings.searchResult,
        user: state.login.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserMeetings: (userId, token) => dispatch(fetchUserMeetings(userId, token)),
        searchPlace: (str)=> dispatch(searchPlace(str)),
        fetchMeetings: () => dispatch(fetchMeetings())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddMeeting);