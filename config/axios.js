import axios from 'axios'

let server = axios.create({
    baseURL : 'http://35.220.135.134'
})

export default server