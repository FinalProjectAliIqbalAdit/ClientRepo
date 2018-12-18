import React, { Component } from 'react';
import { ScrollView, View, Text, Image, TextInput, ActivityIndicator } from 'react-native';
import MeetingCard from '../components/MeetingCard';
import styles from '../styles'
import { connect } from 'react-redux'
import { fetchUserMeetings, setMeetings, setMeetingsToDefault } from "../store/meetingsAction";
import axios from '../config/axios'

class Home extends Component {

    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            headerTitle: (
                <View style={styles.homeViewHeader}>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', paddingLeft: 20, alignItems: 'center'}}>
                        <Text style={{fontSize: 15, fontWeight: '500'}}>Meeting List</Text>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', paddingRight: 10, alignItems: 'center'}}>
                        <TextInput style={styles.textInput} autoCapitalize="none" placeholder="Meeting Title" onChangeText={(e) => params.handleInputChange(e)} />
                        <Image
                            source={require('../assets/search.png')}
                        />
                    </View>
                </View>
            ),
            headerTitleStyle: { color: 'white' },
            headerStyle: {
                borderBottomWidth: 0,
                marginTop: 8
            }
        };
    }

    componentDidMount() {
        this.props.fetchUserMeetings(this.props.user._id, this.props.user.token)
        
        this.props.navigation.setParams({
            handleInputChange: (e) => this.searchMeeting(e)
        });
    }

    searchMeeting = (title) => {
        const filteredMeetings = this.props.defaultMeetings.filter(meeting => {
            const testCase = new RegExp(title, 'i');
            const regexTest = testCase.test(meeting.title);
            return regexTest;
        });

        if (title === '') {
            this.props.setMeetingsToDefault();
        } else {
            this.props.setMeetings(filteredMeetings);
        }
    }

    shouldComponentUpdate() {
        return true
    }

    showDetail = (title, meeting) => {
        // this.props.navigation.navigate('Map', { title, meeting, user: this.props.user })
        axios.get(`/meetings/users/${meeting._id}`)
        .then(({data}) => {
          let arr = data.filter(elem => elem.participant._id == this.props.user._id)
          console.log('ini ambil 1 aja', arr);
          this.props.navigation.navigate('Map', { data, title, meeting, user : this.props.user , arr: arr})
        }).catch((err) => {
          alert(JSON.stringify(err.response,null,2))
        });
    }

    render() {
        const { meetings, loading } = this.props

        return (
            <ScrollView style={styles.homeContainer}>
                {loading ? <View style={styles.meetingsIndicator}>
                    <ActivityIndicator size="large" color="#dd0752" />
                </View> : meetings.map(meeting => <MeetingCard showDetail={this.showDetail} key={meeting._id} meeting={meeting} username={this.props.user.name} />)}
            </ScrollView>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        loading : state.meetings.loading,
        meetings : state.meetings.meetings,
        defaultMeetings: state.meetings.defaultMeetings,
        error : state.meetings.error,
        user: state.login.user
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchUserMeetings: (userId, token) => dispatch(fetchUserMeetings(userId, token)),
    setMeetings: (filteredMeetings) => dispatch(setMeetings(filteredMeetings)),
    setMeetingsToDefault: () => dispatch(setMeetingsToDefault())
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)
  