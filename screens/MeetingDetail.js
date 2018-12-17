import React, { Component } from 'react'
import { View, Text, Image, FlatList, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import styles from '../styles'


export class MeetingDetail extends Component {

    render() {
        return (
            <>
                <View>
                    <Text> ini detail</Text>
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
