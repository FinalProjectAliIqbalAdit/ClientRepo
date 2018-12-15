import React, {Component} from 'react';
import { View, ActivityIndicator, FlatList, Text } from 'react-native';
import { connect } from 'react-redux'

import { fetchMeetings } from "../store/meetingsAction";

import MeetingCard from '../components/MeetingCard'
import axios from '../config/axios'

class Meetings extends Component {

    componentDidMount(){
      this.props.fetchMeetings()
    }
    
    showDetail = (title, meeting) => {
      axios.get(`/meetings/users/${meeting._id}`)
        .then(({data}) => {
          this.props.navigation.navigate('Map', { data, title, meeting, user : this.props.user })
        }).catch((err) => {
          alert(JSON.stringify(err.response,null,2))
        });
    }
    
    render(){
      if(this.props.loading){
        return(
          <View style={{flex: 1, padding: 20}}>
            <ActivityIndicator/>
          </View>
        )
      }
  
      return(
        <View style={{flex: 1}}>
          <FlatList
            data={this.props.meetings}
            renderItem={({item}) => {
              return (<MeetingCard
                key={item._id}
                meeting={item}
                showDetail={ this.showDetail }
              ></MeetingCard>)}
            }
            keyExtractor={({_id}, index) => _id}
          />
        </View>
      )
    }
}

const mapStateToProps = (state) => {
  return {
    loading : state.meetings.loading,
    meetings : state.meetings.meetings,
    error : state.meetings.error,
    user: state.login.user
  }
}

const mapDispatchToProps = (dispatch) => ({
  fetchMeetings: () => {dispatch(fetchMeetings())}
})

export default connect(mapStateToProps, mapDispatchToProps)(Meetings)
