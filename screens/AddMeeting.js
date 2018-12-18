import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    DatePickerIOS,
    TouchableOpacity,
    Image
} from 'react-native';
import axios from '../config/axios';
import { connect } from 'react-redux';
import { fetchUserMeetings } from "../store/meetingsAction";

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
        startAt: new Date()
    }

    handleInputChange = val => (e) => {
        this.setState({
            [val]: e
        });
    }

    addMeeting = (token) => {
        axios.post(`/meetings`, {headers: {token: token}}, {
            title: this.state.title,
            description: this.state.description,
            startAt: this.state.startAt
        })
            .then(({ data }) => {
                console.log('data', data);
                this.setState({
                    title: '',
                    description: '',
                    place: '',
                    startAt: new Date()
                })
                this.props.fetchUserMeetings(this.props.userId, this.props.token);
                this.props.navigation.navigate('Meetings')
            })
            .catch((err) => {
                console.log('Create Meeting Error: ', err);
            });
    }
    
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

                <View style={styles.pickTimeContainer}>
                    <Text style={styles.textPickTime}>
                        Pick your meeting time
                    </Text>
                    <Image style={styles.inputIcon} source={{uri: 'https://img.icons8.com/color/48/000000/calendar-plus.png'}}/>
                </View>
            
                <View style={styles.dateContainer}>
                    <DatePickerIOS
                        date={this.state.startAt}
                        onDateChange={this.handleInputChange('startAt')}
                    />
                </View>
    
                <TouchableOpacity style={[styles.buttonContainer, styles.createButton]} onPress={this.addMeeting}>
                    <Text style={styles.btnText}>Create Meeting</Text>
                </TouchableOpacity>
          </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.login.user.token,
        userId: state.login.user._id
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserMeetings: (userId, token) => dispatch(fetchUserMeetings(userId, token))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddMeeting);