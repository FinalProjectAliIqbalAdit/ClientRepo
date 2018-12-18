import { createStackNavigator, createAppContainer } from 'react-navigation';
import AddMeeting from '../screens/AddMeeting';

const AddNavigator = createStackNavigator({
    Add: {
        screen: AddMeeting
    }
}, {
    initialRouteName: 'Add'
});

export default createAppContainer(AddNavigator);