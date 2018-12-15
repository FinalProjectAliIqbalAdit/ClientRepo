import firebase from "firebase"

let config = {
    apiKey: "AIzaSyCu1g8DP-wa8DdSkvYhcc9rbKN9Ciu4XI8",
    authDomain: "adishare-react-app.firebaseapp.com",
    databaseURL: "https://adishare-react-app.firebaseio.com",
    projectId: "adishare-react-app",
    storageBucket: "adishare-react-app.appspot.com",
    messagingSenderId: "902512475859"
};

firebase.initializeApp(config);

export default firebase.database()

