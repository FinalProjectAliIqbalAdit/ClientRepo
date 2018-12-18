import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ListView, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import axios from '../config/axios'
import { searchPlace } from '../store/meetingsAction';
import { fetchMeetingDetail } from '../store/detailMeetingAction';
import { fetchUninvitedUsers, setUninvited, setUninvitedToDefault } from '../store/uninvitedUsersAction';
import db from '../config/firebase.js'

class MeetingDetail extends Component {

    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRows(props.navigation.state.params.meeting.participants),
            lat: '',
            lng: '',
            populateLoading : true,
        };
    } 

    componentDidMount() {
        this.props.fetchMeetingDetail(this.props.navigation.state.params.meeting._id)
        this.props.fetchUninvitedUsers(this.props.navigation.state.params.meeting._id, this.props.token);
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

    inviteUser(userId, meetingId, token) {
        axios.get(`/meetings/invite/${meetingId}/${userId}`, {
            headers: {
                token: token
            }
        })
        .then(({ data }) => {
            this.props.fetchUninvitedUsers(this.props.navigation.state.params.meeting._id, this.props.token);
        })
        .catch((err) => {
            console.log('Invite User Error: ', err);
        });
    }

    searchUninvited = (name) => {
        const filteredUsers = this.props.defaultUninvited.filter(user => {
            const testCase = new RegExp(name, 'i');
            const regexTest = testCase.test(user.name);
            return regexTest;
        });

        if (name === '') {
            this.props.setUninvitedToDefault();
        } else {
            this.props.setUninvited(filteredUsers);
        }
    }

    sendScoreFeedback = (score, participant) => {
        // update user score dan remove dari database firebase  

        axios.put(`/meetings/feedback`, {
            meetingId : this.props.navigation.state.params.meeting._id,
            participantId : participant._id,
            feedbackScore : score
        })
        .then(({data}) => {
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
            this.props.navigation.navigate('List')
        }).catch((err) => {
            alert(JSON.stringify(err,null,2))
        });
    }

    render() {
        let scores = [20,40,60,80,100]
        
        const startAt = new Date(this.props.meeting.startAt);
        const date = new Date(this.props.meeting.startAt).toDateString();
        let realHour = startAt.getHours();
        let realMinute = startAt.getMinutes();

        if (realHour < 10) {
            realHour = '0' + realHour;
        }

        if (realMinute < 10) {
            realMinute = '0' + realMinute;
        }

        return (
            <ScrollView style={styles.container}>
                {this.props.loading ? <View style={styles.indicator}>
                        <ActivityIndicator size="large" color="#dd0752" />
                    </View> : 
                    <View style={{flex: 1, paddingHorizontal: 20, marginBottom: 20}}>
                        <View style={{flexDirection: 'column', marginBottom: 20}}>
                            <Text style={{fontSize: 30, fontWeight: '700', marginBottom: 5}}>{this.props.meeting.title}</Text>
                            <Text>{this.props.meeting.description}</Text>
                        </View>
                        <View style={{flexDirection: 'row', marginBottom: 20}}>
                            <View style={{flexDirection: 'column', flex: 1, alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                                <Text style={{fontWeight: '700', marginBottom: 5}}>Time</Text>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={{marginRight: 5}}>{date}</Text>
                                    <Text style={{fontWeight: '700', marginRight: 5}}>at</Text>
                                    <Text>{realHour}:{realMinute}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', marginBottom: 20}}>
                            <View style={{flexDirection: 'column', flex: 2, alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                                <Text style={{fontWeight: '700', marginBottom: 5}}>Place</Text>
                                <Text>{this.props.meeting.place}</Text>
                            </View>
                            <View style={{flexDirection: 'column', flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                                <Text style={{fontWeight: '700', marginBottom: 5}}>Participants</Text>
                                {this.props.meeting.participants.map(party => <Text style={{marginBottom: 5}} key={party.name}>
                                {party.name}
                                </Text>)}
                            </View>
                        </View>
                        <View style={{flexDirection: 'column'}}>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10}}>
                                <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                                    <Text style={{fontWeight: '700'}}>Invite People</Text>
                                </View>
                                <View style={styles.searchContainer}>
                                    <TextInput style={styles.searchInput} autoCapitalize="none" placeholder="Name" onChangeText={(e) => this.searchUninvited(e)} />
                                    <Image
                                        style={{width: 30, height: 30, justifyContent: 'center'}}
                                        source={{uri: 'https://img.icons8.com/color/50/000000/find-user-female.png'}}
                                    />
                                </View>
                            </View>
                            <View style={{flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center'}}>
                                {this.props.uninvitedUsers.map(user => <View style={styles.userView} key={user._id}>
                                    <View style={styles.nameView}>
                                        <Text style={{color: 'white', fontSize: 17, fontWeight: '600'}}>{user.name}</Text>
                                    </View>
                                    <TouchableOpacity style={styles.topacity} onPress={() => this.inviteUser(user._id, this.props.navigation.state.params.meeting._id, this.props.token)}>
                                        <Text style={{color: 'white', fontSize: 17, fontWeight: '600'}}>Invite</Text>
                                    </TouchableOpacity>
                                </View>)}
                            </View>
                        </View>
                    </View>
                }

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
            </ScrollView>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.login.user.token,
        uninvitedUsers: state.uninvitedUsers.uninvitedUsers,
        defaultUninvited: state.uninvitedUsers.defaultUninvited,
        searchLoading: state.meetings.searchLoading,
        searchResult : state.meetings.searchResult,
        meeting: state.detailMeeting.meeting,
        detailLoading: state.detailMeeting.loading
    }
}

const mapDispatchToProps = (dispatch) => {
    return  {
        fetchUninvitedUsers: (meetingId, token) => dispatch(fetchUninvitedUsers(meetingId, token)),
        setUninvitedToDefault: () => dispatch(setUninvitedToDefault()),
        setUninvited: (filteredUsers) => dispatch(setUninvited(filteredUsers)),
        searchPlace: (str) => dispatch(searchPlace(str)),
        fetchMeetingDetail: (meetingId) => dispatch(fetchMeetingDetail(meetingId))
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 10,
    },
    userView: {
        flexDirection: 'row',
        marginBottom: 10,
        height: 50
    },
    topacity: {
        flex: 1,
        backgroundColor: '#f20a44',
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    nameView: {
        width: 200,
        flex: 3,
        backgroundColor: '#003d4f',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start', 
        paddingHorizontal: 20
    },
    indicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center', 
        marginTop: 250
    },
    searchContainer: {
        flex: 1, 
        flexDirection: 'row', 
        justifyContent: 'flex-end', 
        paddingRight: 10, 
        alignItems: 'center'
    },
    searchInput: {
        height: 40,
        borderColor: '#ead7aa',
        width: 100
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
        padding:30,
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
    description:{
        fontSize:15,
        color: "#646464",
    },
    buttons:{
        flexDirection: 'row',
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
    icon:{
        width:20,
        height:20,
    },
    view: {
        backgroundColor: "#FF1493",
    },
    profile: {
        backgroundColor: "#1E90FF",
    },
    message: {
        backgroundColor: "#228B22",
    },
    buttonContainer: {
        marginTop:10,
        alignSelf : 'center',
        height:45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:80,
        width:250,
        borderRadius:30,
        backgroundColor: "#183133",
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(MeetingDetail);