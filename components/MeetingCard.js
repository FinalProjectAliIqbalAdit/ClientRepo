import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableHighlight } from 'react-native';

const MeetingCard = (props) => {
    const styles = StyleSheet.create({
        outerContainer: {
            flex: 1,
            borderBottomWidth: 1,
            marginHorizontal: 20,
            borderColor: '#e5e4e2',
            flexDirection: 'row'
        },
        firstContainer: {
            flex: 7,
            paddingVertical: 18,
            paddingRight: 10
        },
        statusContainer: {
            flex: 3, 
            paddingVertical: 18,
            alignItems: 'center', 
        },
        title: {
            fontSize: 18,
            fontWeight: '500',
            marginBottom: 6
        },
        description: {
            marginBottom: 20
        }
    });

    const hour = ('[ ' + props.meeting.startAt.getHours());
    const minute = (props.meeting.startAt.getMinutes() + ' ]');

    return (
        <View style={styles.outerContainer}>
            <View style={styles.firstContainer}>
                <Text style={styles.title}>{props.meeting.title}</Text>
                <TextInput style={styles.description} autoCapitalize="none" value={props.meeting.description} />
                <Text style={{marginBottom: 5}}>Hosted by <Text style={{fontWeight: 'bold'}}>{props.meeting.host.name}</Text></Text>
                <Text style={{color: '#20b2aa', fontWeight: '500'}}>{props.meeting.startAt.toDateString()}</Text>
            </View>
            <View style={styles.statusContainer}>
                {props.meeting.status === 'Upcoming' ? 
                    <TouchableHighlight onPress={() => props.showDetail(props.meeting.title, props.meeting)}>
                        <View style={{borderRadius: 20, backgroundColor: '#3399ff', width: 90, alignItems: 'center', height: 30, justifyContent: 'center', marginBottom: 20}}>
                            <Text style={{color: 'white', fontWeight: '600'}}>{props.meeting.status}</Text>
                        </View>
                        {/* <Text style={{fontWeight: '900'}}>{hour} : {minute}</Text> */}
                    </TouchableHighlight> : 
                    <TouchableHighlight>
                        <View style={{borderRadius: 50, backgroundColor: '#f40059', width: 90, alignItems: 'center', height: 30, justifyContent: 'center', marginBottom: 20}}>
                            <Text style={{color: 'white', fontWeight: '600'}}>{props.meeting.status}</Text>
                        </View>
                        {/* <Text style={{fontWeight: '900'}}>{hour} : {minute}</Text> */}
                    </TouchableHighlight>
                }
            </View>
        </View>
    );
};

export default MeetingCard;