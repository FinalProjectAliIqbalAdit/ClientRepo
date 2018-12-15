import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import { connect } from 'react-redux'
import styles from '../styles'

import loginAction from '../store/loginAction'


export class Login extends Component {
    state = {
        email : '',
        password : ''
    }

    handleEmailInput = (text) => {
        this.setState({
            email : text
        })
    }

    handlePasswordInput = (text) => {
        this.setState({
            password : text
        })
    }

    
    submitHandler = (event) => {

        const { email, password } = this.state
        this.props.login(email, password)

        this.setState({
            email : '',
            password : ''
        })
    }


    render() {
        return (
        <View>
            <View >
                <TextInput style = {[styles.input]}
                    underlineColorAndroid = "transparent"
                    placeholder = "Email .."
                    placeholderTextColor = "#9a73ef"
                    autoCapitalize = "none"
                    onChangeText = {this.handleEmailInput}
                />
                <TextInput style = {[styles.input]}
                    underlineColorAndroid = "transparent"
                    placeholder = "Passwod .."
                    placeholderTextColor = "#9a73ef"
                    autoCapitalize = "none"
                    onChangeText = {this.handlePasswordInput}
                />
                <TouchableOpacity
                    style = {[styles.submitButton]}
                    onPress = {
                        () => this.submitHandler(this.state.commentInput)
                    }>
                    <Text style = {styles.submitButtonText}> Login </Text>
                </TouchableOpacity>
            </View>
        </View>
        )
    }
}

const mapStateToProps = (state) => ({
    loading : state.login.loading,
    error : state.login.error,
    errorMessage : state.login.errorMessage
})

const mapDispatchToProps = (dispatch) => ({
    login: (email,password) => dispatch(loginAction(email,password)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
