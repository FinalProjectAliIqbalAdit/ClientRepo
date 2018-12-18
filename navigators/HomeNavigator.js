import React from 'react'
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import Profile from '../screens/Profile';
import MeetingNavigator from './MeetingNavigator';
import AddNavigator from './AddNavigator';
import { Image } from 'react-native';
const HomeNavigator = createBottomTabNavigator({
    Meetings: {
        screen: MeetingNavigator,
        navigationOptions: ({ navigation }) => {
            return {
                tabBarIcon: ({ focused, tintColor }) => {
                    return <Image source={require('../assets/invitations.png')} style={{height: 25, width: 25}} />
                }
            }
        }
    },
    Add: {
        screen: AddNavigator,
        navigationOptions: ({ navigation }) => {
            return {
                tabBarIcon: ({ focused, tintColor }) => {
                    return <Image source={require('../assets/add.png')} style={{height: 35, width: 35}} />
                }
            }
        }
    },
    Profile: {
        screen: Profile,
        navigationOptions: ({ navigation }) => {
            return {
                tabBarIcon: ({ focused, tintColor }) => {
                    return <Image source={require('../assets/person.png')} style={{height: 25, width: 25}} />
                }
            }
        }
    }
}, {
    initialRouteName: 'Meetings',
    tabBarOptions: {
        activeTintColor: '#ffa500',
        inactiveTintColor: 'white',
        showLabel: false,
        labelStyle: {
            fontSize: 20,
            flex: 3
        },
        style: {
            // backgroundColor: '#183133',
            backgroundColor: 'black',
            borderColor: 'black',
            borderStyle: 'solid'
        }
    }
});

export default createAppContainer(HomeNavigator);