import React from 'react';
import { View, StyleSheet, TextInput, Image } from 'react-native';

const SearchBar = (props) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1, 
            flexDirection: 'row', 
            justifyContent: 'flex-end', 
            paddingRight: 10, 
            alignItems: 'center'
        },
        textInput: {
            height: 40,
            borderColor: '#ead7aa',
            width: 200
        }
    })

    return (
        <View style={styles.container}>
            <TextInput style={styles.textInput} autoCapitalize="none" placeholder="Name" onChangeText={(e) => props.handleInputChange(e)} />
            <Image
                source={require('../assets/search.png')}
            />
        </View>
    );
};

export default SearchBar;