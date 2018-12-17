import React from "react";
import { createAppContainer, createBottomTabNavigator, createStackNavigator } from "react-navigation";
import store from './store/store'
import { Provider } from "react-redux"

import Map from './screens/Map'
import Login from './screens/Login'
import Home from './screens/Home'
import Profile from './screens/Profile'
import Meetings from "./screens/Meetings"
import MeetingDetail from './screens/MeetingDetail'
import Authentication from './screens/Authentication';
import RegisterForm from './screens/RegisterForm';
import HomeNavigator from './navigators/HomeNavigator';
console.disableYellowBox = true;


const AppNavigator = createStackNavigator({
    Auth: {
        screen: Authentication
    },
    Register: {
        screen: RegisterForm
    },
    Home: {
        screen: HomeNavigator,
        navigationOptions: () => ({
            header: null
        })
    }
}, {
    initialRouteName: 'Auth'
});

const AppsNavigator = createAppContainer(AppNavigator)

class App extends React.Component {
    render() {
        return(
          <Provider store={store}>
            <AppsNavigator />
          </Provider>  
        );
    }
}

export default App;