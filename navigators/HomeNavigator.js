import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import Profile from '../screens/Profile';
import MeetingNavigator from './MeetingNavigator';

const HomeNavigator = createBottomTabNavigator({
    Meetings: {
        screen: MeetingNavigator
    },
    Profile: {
        screen: Profile
    }
}, {
    initialRouteName: 'Meetings',
    tabBarOptions: {
        activeTintColor: '#ffa500',
        inactiveTintColor: 'white',
        labelStyle: {
            fontSize: 20,
            flex: 3
        },
        style: {
            backgroundColor: '#183133',
            borderColor: 'black',
            borderStyle: 'solid'
        }
    }
});

export default createAppContainer(HomeNavigator);