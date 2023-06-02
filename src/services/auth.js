import axios from './index'
import { apiUrl } from '../config/constant'

export default {
  login (userData) {
    // console.log('en auth', userData)
    try {
      return axios.post(`${apiUrl}/login`, userData)
    } catch (error) {
      console.log(error)
      throw error
    }
  },
  register (userData) {
    return axios.post('/api/register', userData)
  }
}
