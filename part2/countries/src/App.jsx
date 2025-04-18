import { useEffect, useState } from "react"

import countryService from "./services/countries"
import weatherService from "./services/weather"

const SingleCountry = ({country}) => {
  const [countryData, setCountryData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  useEffect(() => {
    countryService.getSingleCountry(country).then(c=>setCountryData(c));
  }, [])

  useEffect(()=>{
    if(countryData!=null){
      weatherService.getWeatherForecast(countryData.capital[0]).then(d=>setWeatherData(d))
    }
  }, [countryData])


  return countryData==null?null: (
    <div>
      <h1>{countryData.name.official}</h1>
      <div>
      Capital {countryData.capital[0]}
      </div>
      <div>
      Area {countryData.area}
      </div>
      <h2>Languages</h2>
      <ul>
        {Object.values(countryData.languages).map(s=><li key={s}>{s}</li>)}
      </ul>
      <img src={countryData.flags.png} alt={countryData.flags.alt}/>
      {
        weatherData==null?null: 
        <>
        <h2>Weather in {countryData.capital[0]}</h2>
        Temperature {weatherData.main.temp} Celsius <br/>
        <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}/> <br/>
        Wind {weatherData.wind.speed} m/s<br/>
        </>
      }
    </div>
  )
}

const CountryInfo = ({query, countries, show, setShow}) => {
  const filteredCountries = countries.filter(c=>(c.name.common.toLowerCase().includes(query)));
  const [countryToShow, setCountryToShow] = useState("");

  const showCountry = (name) => () => {
    setShow(true);
    setCountryToShow(name);
  }

  if(filteredCountries.length==1){
    return(
      <SingleCountry country={filteredCountries[0].name.common}/>
    )
  }

  if(show||filteredCountries.length==1){
    return(
      <SingleCountry country={countryToShow}/>
    )
  }

  if(filteredCountries.length>10){
    return (
      <div>
        Too many matches, specify another filter
      </div>
    )
  }
  
  if(filteredCountries.length>1){
    return(
      <div>
        {filteredCountries.map(c=><div key={c.name.common}>
          {c.name.common}
          <button onClick={showCountry(c.name.common)}>Show</button>
          <br/>
        </div>)}
      </div>
    )
  }

}

function App() {
  const [query, setQuery] = useState("");

  const [show, setShow] = useState(false);

  const [countries, setCountries] = useState([]);

  useEffect(() => {
    countryService.getAllCountries().then(c=>setCountries(c));
  }, [])
  

  const handleQueryChange = (e) => {
    setQuery(e.target.value)
    setShow(false);
  }

  return (<div>
    find countries <input value={query} onChange={handleQueryChange}></input>
    {countries==null?null:<CountryInfo query={query} countries={countries} show={show} setShow={setShow}/>}
  </div>)
}

export default App
