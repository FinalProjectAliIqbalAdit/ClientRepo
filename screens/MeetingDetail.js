import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity,TextInput,Button } from 'react-native';
import { connect } from 'react-redux';
import axios from '../config/axios'
import Searchbar from '../components/Searchbar';
import { searchPlace } from '../store/meetingsAction';
import { fetchUninvitedUsers, setUninvited, setUninvitedToDefault } from '../store/uninvitedUsersAction';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 30
    },
    userView: {
        flexDirection: 'row'
    },
    topacity: {
        width: 50,
        height: 50,
        backgroundColor: '#ff0074'
    },
    nameView: {
        width: 200,
        backgroundColor: '#435562'
    },
    lat: '',
    lng: ''  
});

class MeetingDetail extends Component {
    inviteUser(userId, meetingId, token) {
        axios.get(`/meetings/invite/${meetingId}/${userId}`, {headers: {
            token: token
        }})
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

    componentDidMount() {
        this.props.fetchUninvitedUsers(this.props.navigation.state.params.meeting._id, this.props.token);
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <Searchbar handleInputChange={(e) => this.searchUninvited(e)} />
                {this.props.uninvitedUsers.map(user => <View style={styles.userView} key={user._id}>
                    <View style={styles.nameView}>
                        <Text style={{color: 'white'}}>{user.name}</Text>
                    </View>
                    <TouchableOpacity style={styles.topacity} onPress={() => this.inviteUser(user._id, this.props.navigation.state.params.meeting._id, this.props.token)}>
                        <Text>Invite</Text>
                    </TouchableOpacity>
                </View>)}

                <Searchbar handleInputChange={(e) => this.props.searchPlace(e)} />
                {this.props.searchResult.length !== 0 && this.props.searchResult.map(elem => <View key={elem.id}>
                    <View>
                        <Text style={{color: 'black'}}>{elem.name}</Text>
                        <TextInput style={{color: 'grey'}} editable = {false}>{elem.formatted_address}</TextInput>
                        <Button 
                          title='getLatLng'
                          onPress= {()=>{
                            this.setState({
                              lat: elem.geometry.location.lat,
                              lng: elem.geometry.location.lng
                            })
                            alert(`Ini lat : ${Number(elem.geometry.location.lat)}/n Ini lng : ${Number(elem.geometry.location.lng)}`)
                          }}
                        >Pick</Button>
                    </View>
                </View>)}
                  
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

export default connect(mapStateToProps, mapDispatchToProps)(MeetingDetail);