import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        marginLeft: 20,
        marginRight: 20,
        paddingVertical: 10,
        flex: 1,
        alignItems: 'center'
    },
    textInput: {
        height: 50,
        borderBottomWidth: 1,
        borderColor: '#ead7aa',
        marginBottom: 20,
        width: 335
    },
    topacity: {
        backgroundColor: '#6a0ff2',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        width: 100,
        borderRadius: 5,
        marginTop: 10
    },
    viewHeader: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        height: 40
    }
});

class RegisterForm extends Component {
    static navigationOptions = {
        headerTitle: (
            <View style={styles.viewHeader}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                    <Image
                        source={require('../assets/alarm.png')}
                    />
                </View>
            </View>
        ),
        headerTitleStyle: { color: 'white' },
        headerStyle: {
            borderBottomWidth: 0,
            marginTop: 8
        }
    }

    state = {
        name: '',
        email: '',
        password: ''
    }

    handleInputChange = val => (e) => {
        this.setState({
            [val]: e
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={{marginBottom: 20, alignSelf: 'center', fontWeight: '700', fontSize: 25}}>Create your account</Text>
                <TextInput style={styles.textInput} value={this.state.name} placeholder="Name" onChangeText={this.handleInputChange('name')} />
                <TextInput style={styles.textInput} value={this.state.email} placeholder="Email" onChangeText={this.handleInputChange('email')} />
                <TextInput style={styles.textInput} secureTextEntry={true} value={this.state.password} placeholder="Password" onChangeText={this.handleInputChange('password')} />
                <TouchableOpacity style={styles.topacity}>
                    <Text style={{color: 'white', fontWeight: '500', fontSize: 15}}>Register</Text>
                </TouchableOpacity>
            </View>
        );
    }   
}

export default RegisterForm;