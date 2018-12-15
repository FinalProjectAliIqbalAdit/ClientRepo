import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, Image, TextInput } from 'react-native';
import MeetingCard from '../components/MeetingCard';
import axios from 'axios';

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    viewHeader: {
        flex: 1,
        flexDirection: 'row'
    },
    textInput: {
        height: 40,
        borderColor: '#ead7aa',
        width: 110
    },
});

class Home extends Component {
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            headerTitle: (
                <View style={styles.viewHeader}>
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

    state = {
        meetings: [
            {
                title: 'Meeting A',
                _id: 'aaa',
                description: 'Meeting A is bla bla bla bla bla bla bla bla bla',
                host: {
                    name: 'Ali'
                },
                lat: "-8.340539",
                lng: "115.091949",
                startAt: new Date(),
                status: 'Upcoming'
            },
            {
                title: 'Meeting B',
                _id: 'bbb',
                description: 'Meeting B is bla bla bla bla bla bla',
                host: {
                    name: 'Iqbal'
                },
                lat: "-8.340539",
                lng: "115.091949",
                startAt: new Date(),
                status: 'Ongoing'
            },
            {
                title: 'Meeting C',
                _id: 'ccc',
                description: 'Meeting C is bla bla bla bla bla bla',
                host: {
                    name: 'Adit'
                },
                lat: "-8.340539",
                lng: "115.091949",
                startAt: new Date(),
                status: 'Ongoing'
            },
            {
                title: 'Meeting D',
                _id: 'ddd',
                description: 'Meeting D is bla bla bla bla bla bla',
                host: {
                    name: 'Mr.1'
                },
                lat: "-8.340539",
                lng: "115.091949",
                startAt: new Date(),
                status: 'Upcoming'
            },
            {
                title: 'Meeting E',
                _id: 'eee',
                description: 'Meeting E is bla bla bla bla bla bla',
                host: {
                    name: 'Mr.2'
                },
                lat: "-8.340539",
                lng: "115.091949",
                startAt: new Date(),
                status: 'Ongoing'
            }
        ],
        keyword: '',
        user: {
            _id: '1',
            name: 'Ali'
        }
    }

    handleInputChange = val => (e) => {
        this.setState({
            [val]: e
        });
    }

    showDetail = (title, meeting) => {
        // axios.get(`/meetings/users/${meeting._id}`)
        //     .then(({data}) => {
        //         this.props.navigation.navigate('Map', { data, title, meeting, user : this.state.user })
        //     }).catch((err) => {
        //         alert(JSON.stringify(err.response,null,2))
        //     });
        this.props.navigation.navigate('Map', { title, meeting, user: this.state.user })
    }

    componentDidMount() {
        this.props.navigation.setParams({
            keyword: this.state.keyword,
            handleInputChange: this.handleInputChange('keyword')
        });
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                {this.state.meetings.map(meeting => <MeetingCard showDetail={this.showDetail} key={meeting._id} meeting={meeting} />)}
            </ScrollView>
        );
    }
}

export default Home;

