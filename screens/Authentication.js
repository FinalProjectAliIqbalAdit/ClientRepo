import React, { Component } from 'react';
import { 
    View, 
    Text, 
    Image, 
    TouchableHighlight, 
    TouchableOpacity,
    Button
} from 'react-native';
import axios from '../config/axios'
import LoginForm from '../components/LoginForm';
import { connect } from 'react-redux';
import loginAction from '../store/loginAction'
import styles from '../styles'

class Authentication extends Component {
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            headerTitle: (
                <View style={styles.viewHeader}>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        {params.showLogin && <View style={{paddingLeft: 10}}>
                            <Button onPress={params.toggleLogin} title="Cancel" />
                        </View>}
                    </View>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                        <Image
                            source={require('../assets/alarm.png')}
                        />
                    </View>
                    <View style={{flex: 1}}></View>
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
        showLogin: false, 
        email: '',
        password: ''
    }

    goToRegister = () => {
        this.props.navigation.navigate('Register');
    }

    handleInputChange = val => (e) => {
        this.setState({
            [val]: e
        });
    }

    loginHandler = () => {
        axios.post(`/login`,{
            email: this.state.email,
            password: this.state.password
        })
        .then(({ data })=>{
            this.props.loginAction(this.state.email,this.state.password)      
            this.props.navigation.navigate('Meetings')
        })
        .catch((err)=>{
            alert(JSON.stringify(err.response))
        })
    }

    toggleLogin = () => {
        if (this.state.showLogin === false) {
            this.setState({
                showLogin: true
            }, () => {
                this.props.navigation.setParams({
                    showLogin: true,
                    toggleLogin: this.toggleLogin
                });
            });
        } else {
            this.setState({
                showLogin: false
            }, () => {
                this.props.navigation.setParams({
                    showLogin: false,
                    toggleLogin: this.toggleLogin
                });
            });
        }
    }

    componentDidMount() {
        this.props.navigation.setParams({
            showLogin: this.state.showLogin,
            toggleLogin: this.toggleLogin
        });
    }

    render() {
        return (
            <View style={styles.container}>
                {!this.state.showLogin ? 
                    <>
                        <View style={styles.content}>
                            <Text style={styles.openingText}>Track your</Text>
                            <Text style={styles.openingText}>meeting participants</Text>
                            <Text style={styles.openingText}>real time.</Text>
                            <TouchableHighlight 
                                onPress={this.goToRegister} 
                                style={styles.thighlight} 
                                underlayColor='#f8bc4d'
                            >
                                <Text style={styles.btnTextRegister}>Register</Text>
                            </TouchableHighlight>
                        </View>
                        <View style={styles.viewToLogin}>
                            <Text style={styles.textToLogin}>Have an account already? </Text>
                            <TouchableOpacity style={styles.btnToLogin} onPress={this.toggleLogin}>
                                <Text style={styles.btnTextLogin}>Log in</Text>
                            </TouchableOpacity>
                        </View>
                    </> :
                    <View>
                        <LoginForm email={this.state.email} password={this.state.password} handleInputChange={this.handleInputChange} loginHandler={() => this.props.loginAction(this.state.email, this.state.password, this.props)}/>
                    </View>
                }
            </View>
        );
    }
}
const mapDispatchToProps = (dispatch) => {
  return {
    loginAction: (email, password, props) => dispatch(loginAction(email, password, props))
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.login.user,
    isLogin: state.login.isLogin,
    login: state.login
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Authentication);