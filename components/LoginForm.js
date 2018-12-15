import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

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
    }
});

const LoginForm = (props) => {
    submitHandler=(props)=>{
      console.log('masuk',props);
    }
    return (
        <View style={styles.container}>
            <Text style={{marginBottom: 20, alignSelf: 'flex-start', fontWeight: '700', fontSize: 25}}>Log in</Text>
            <TextInput style={styles.textInput} value={props.email} placeholder="Email" onChangeText={props.handleInputChange('email')} />
            <TextInput style={styles.textInput} secureTextEntry={true} value={props.password} placeholder="Password" onChangeText={props.handleInputChange('password')} />
            <TouchableOpacity 
              style={styles.topacity}
              onPress= {() => props.loginHandler()}
            >
                <Text style={{color: 'white', fontWeight: '500', fontSize: 15}}>Log in</Text>
            </TouchableOpacity>
        </View>
    );
}

export default LoginForm;