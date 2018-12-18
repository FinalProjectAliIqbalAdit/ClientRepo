import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity,TextInput,Button, ListView, Image, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import axios from '../config/axios'
import Searchbar from '../components/Searchbar';
import { searchPlace } from '../store/meetingsAction';
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
        return (
            <ScrollView style={styles.container}>
                <Searchbar handleInputChange={(e) => this.searchUninvited(e)} />
                {this.props.uninvitedUsers.map(user => <View style={styles.userView} key={user._id}>
                    <View style={styles.nameView}>
                        <Text style={{color: 'white', fontSize: 20}}>{user.name}</Text>
                    </View>
                    <TouchableOpacity style={styles.topacity} onPress={() => this.inviteUser(user._id, this.props.navigation.state.params.meeting._id, this.props.token)}>
                        <Text style={{fontSize: 30, padding: 10}}>+</Text>
                    </TouchableOpacity>
                </View>)}

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
        searchResult : state.meetings.searchResult
    }
}

const mapDispatchToProps = (dispatch) => {
    return  {
        fetchUninvitedUsers: (meetingId, token) => dispatch(fetchUninvitedUsers(meetingId, token)),
        setUninvitedToDefault: () => dispatch(setUninvitedToDefault()),
        setUninvited: (filteredUsers) => dispatch(setUninvited(filteredUsers)),
        searchPlace: (str)=> dispatch(searchPlace(str))
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 30,
    },
    userView: {
        flexDirection: 'row',
        alignSelf : 'center'
    },
    topacity: {
        width: 50,
        height: 50,
        backgroundColor: '#ff0074'
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