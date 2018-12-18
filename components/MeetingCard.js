import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import styles from '../styles'
import moment from 'moment'
import axios from 'axios'


const MeetingCard = (props) => {
    // const { data } = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${Number(this.props.meeting.lat)},${Number(this.props.meeting.lng)}&radius=1000&key=AIzaSyBa-c-SNhtue6ozeAQajtfmhhnYhrNlGMY`,{})
    // console.log('ini pak',data.results);
    return (
        <View style={styles.outerContainer}>
            <View style={styles.firstContainer}>
                <Text style={styles.title}>{props.meeting.title}</Text>
                <TextInput style={styles.description} autoCapitalize="none" value={props.meeting.description} editable = {false} />
                <Text style={{marginBottom: 5}}>Hosted by <Text style={{fontWeight: 'bold'}}>{props.username}</Text></Text>
                <Text style={{color: '#20b2aa', fontWeight: '500'}}>{moment(props.meeting.startAt).format("dddd Do MMM YYYY")}</Text>
            </View>
            <View style={styles.statusContainer}>
                {props.meeting.status === 'upcoming' ? 
                    <TouchableOpacity onPress={() => props.showDetail(props.meeting.title, props.meeting)}>
                        <>
                            <View style={{borderRadius: 20, backgroundColor: '#3399ff', width: 90, alignItems: 'center', height: 30, justifyContent: 'center', marginBottom: 20}}>
                                <Text style={{color: 'white', fontWeight: '600'}}>Map</Text>
                            </View>
                            <Text style={{fontWeight: '900'}}>At {moment(props.meeting.startAt).format("HH:mm A")}</Text>
                        </>
                    </TouchableOpacity> : 
                    <TouchableOpacity>
                        <>
                            <View style={{borderRadius: 50, backgroundColor: '#f40059', width: 90, alignItems: 'center', height: 30, justifyContent: 'center', marginBottom: 20}}>
                                <Text style={{color: 'white', fontWeight: '600'}}>Map</Text>
                            </View>
                            <Text style={{fontWeight: '900'}}>At {moment(props.meeting.startAt).format("HH:mm A")}</Text>
                        </>
                    </TouchableOpacity>
                }
            </View>
        </View>
    );
};

export default MeetingCard;