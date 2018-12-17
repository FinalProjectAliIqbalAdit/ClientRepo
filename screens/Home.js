import React, { Component } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import MeetingCard from '../components/MeetingCard';
import styles from '../styles'
import { connect } from 'react-redux'
import { fetchMeetings } from "../store/meetingsAction";
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
                        <TextInput style={styles.textInput} autoCapitalize="none" value={params.keyword} placeholder="Meeting Title" onChangeText={params.handleInputChange} />
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
        this.props.fetchMeetings()
        
        this.props.navigation.setParams({
            keyword: this.state.keyword,
            handleInputChange: this.handleInputChange('keyword')
        });
    }

    shouldComponentUpdate() {
        return true
    }

    state = {
        keyword: '',
    }

    componentDidMount() {
        this.props.fetchMeetings()
        
        this.props.navigation.setParams({
            keyword: this.state.keyword,
            handleInputChange: this.handleInputChange('keyword')
        });
    }

    handleInputChange = val => (e) => {
        this.setState({
            [val]: e
        });
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
        const { meetings } = this.props
        if(!meetings) return (<ActivityIndicator></ActivityIndicator>)

        return (
            <ScrollView style={styles.homeContainer}>
                {meetings.map(meeting => <MeetingCard showDetail={this.showDetail} key={meeting._id} meeting={meeting} />)}
            </ScrollView>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        loading : state.meetings.loading,
        meetings : state.meetings.meetings,
        error : state.meetings.error,
        user: state.login.user
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchMeetings: () => {dispatch(fetchMeetings())}
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)
  