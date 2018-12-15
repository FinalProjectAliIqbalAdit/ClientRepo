import { StyleSheet } from 'react-native'

export default styles = StyleSheet.create({
    box : {
        borderWidth: 1,
        borderRadius: 2,
        borderColor: '#ddd',
        borderBottomWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        marginBottom: 10,
        width : '97%',
        padding : 10
    },
    boxHeader : {
        justifyContent :'space-between',
        flexDirection : 'row',
        alignItems : 'center'
    },
    inline : {
        flexWrap: 'wrap', 
        alignItems: 'flex-start',
        flexDirection:'row',
    },
    input: {
        margin: 5,
        height: 40,
        borderColor: '#7a42f4',
        borderWidth: 1
    },
    submitButton: {
        backgroundColor: '#7a42f4',
        padding: 10,
        margin: 5,
        height: 40,
    },
    submitButtonText:{
        color: 'white'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 50
    },
    content: {
        width: 350,
        height: 230,
        justifyContent: 'center',
        paddingHorizontal: 25,
        paddingVertical: 20,
        flex: 9
    },
    thighlight: {
        height: 50,
        backgroundColor: '#ffa500',
        alignItems: 'center',
        justifyContent: 'center',
        width: 300, 
        marginTop: 30,
        alignSelf: 'center',
        borderRadius: 50
    },
    openingText: {
        fontSize: 30,
        fontWeight: 'bold'
    },
    btnTextRegister: {
        color: 'white',
        fontSize: 20,
        fontWeight: '500'
    },
    viewToLogin: {
        flex: 1, 
        flexDirection: 'row',
        justifyContent: 'flex-start',
        height: 20,
        alignSelf: 'flex-start',
        marginLeft: 40,
        alignItems: 'center'
    },
    btnToLogin: {
        height: 20,
        color: 'blue'
    },
    textToLogin: {
        fontSize: 15,
        height: 20
    }, 
    btnTextLogin: {
        color: 'blue'
    },
    viewHeader: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        height: 40
    }
});