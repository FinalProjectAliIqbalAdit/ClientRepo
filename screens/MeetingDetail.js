import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import axios from '../config/axios'
import Searchbar from '../components/Searchbar';
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
    }
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
            </ScrollView>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.login.user.token,
        uninvitedUsers: state.uninvitedUsers.uninvitedUsers,
        defaultUninvited: state.uninvitedUsers.defaultUninvited
    }
}

const mapDispatchToProps = (dispatch) => {
    return  {
        fetchUninvitedUsers: (meetingId, token) => dispatch(fetchUninvitedUsers(meetingId, token)),
        setUninvitedToDefault: () => dispatch(setUninvitedToDefault()),
        setUninvited: (filteredUsers) => dispatch(setUninvited(filteredUsers))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MeetingDetail);