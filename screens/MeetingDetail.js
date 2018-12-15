import React, { Component } from 'react'
import { View, Text, Image, FlatList, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import styles from '../styles'


export class MeetingDetail extends Component {

    state = {
        commentInput : ''
    }

    handleCommentInpput = (text) => {
        this.setState({
            commentInput : text
        })
    }

    submitHandler = () => {
        alert(this.state.commentInput)
    }

    static navigationOptions = ({navigation}) => {
        return {
        title : navigation.getParam('title')
        }
    }

    render() {
        const meeting = this.props.navigation.state.params.meeting
        return (
            <>
                <View>
                    <Text> {JSON.stringify(this.props.navigation.state.params.meeting,null,2)} </Text>
                </View>
            </>
        );
    }
}



const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = (props) => ({
  
})

export default connect(mapStateToProps, mapDispatchToProps)(MeetingDetail)
