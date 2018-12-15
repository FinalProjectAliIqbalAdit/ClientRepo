import { createStackNavigator, createAppContainer } from 'react-navigation';
import Home from '../screens/Home';
// import MeetingDetail from '../screens/MeetingDetail';
import Map from '../screens/Map';

const MeetingNavigator = createStackNavigator({
    List: {
        screen: Home
    },
    Map: {
        screen: Map
    }
}, {
    initialRouteName: 'List'
});

export default createAppContainer(MeetingNavigator);