import { createStackNavigator, createAppContainer,createMaterialTopTabNavigator } from 'react-navigation';
import Home from '../screens/Home';
// import MeetingDetail from '../screens/MeetingDetail';
import Map from '../screens/Map';
import MeetingDetailScreen from '../screens/MeetingDetail'
const MapNavigator = createMaterialTopTabNavigator({
  Map: {
    screen: Map
  },
  MeetingDetail:{
    screen: MeetingDetailScreen
  }
},{
    initialRouteName: 'Map'
})
const MeetingNavigator = createStackNavigator({
    List: {
      screen: Home
    },
    Map: {
      screen : MapNavigator
    }
}, {
    initialRouteName: 'List'
});

export default createAppContainer(MeetingNavigator);