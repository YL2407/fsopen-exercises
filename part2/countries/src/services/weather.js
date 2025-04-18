import axios from 'axios'

const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?'

const getWeatherForecast = (name)=>{
    const req = axios.get(`${baseUrl}q=${name}&appid=${import.meta.env.VITE_W_API_KEY}&units=metric`)
    return req.then(res=>res.data)
}

export default {getWeatherForecast}