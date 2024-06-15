import React, { useEffect, useState } from 'react'
import './index.css'

const WeatherApp = () => {

    const [mode , setMode] = useState(false);
    const [latitude , setLatitude] = useState("")
    const [longitude , setLongitude] = useState("")

    const [add ,setAdd] = useState("")
    const [city , setCity] = useState("None");
    
    const [weatherData , setWeatherData] = useState(null);
    const darkMode = mode ? "dark dark-border" : "";
    const loweredMode = mode ? "lower-border" : "";


    // https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude)    

    const date = new Date();
    const hours = date.getHours();
    const mins = date.getMinutes();
    const month = date.getMonth();
    const day = date.getDate();
    const year = date.getFullYear();
    const amPm = hours > 12 ? "PM" : "AM"
    const formattedTime = `${hours}:${mins} ${amPm}`

     

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    

    const API_KEY = "4483f94d856e51347c74e5f13c284e81"

    useEffect( () => {

        navigator.geolocation.getCurrentPosition (pos=> {
        setLatitude(pos.coords.latitude)
        setLongitude(pos.coords.longitude)

        const {latitude, longitude} = pos.coords;
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`

        
        fetch(url).then(res=>res.json()).then(data=>setAdd(data.address))
        
        
        })
    
    }, [])
    
    
    const handleInput = (event)=>{
        setCity(event.target.value);
    }

    const fetchingData = async () => {
        
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`)
            const data = await response.json();
            setWeatherData(data);
        
    }

    const fetchingData2 = async () => {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`)
                const data = await response.json();
                console.log(data)
                setWeatherData(data);
    }
    
    useEffect(()=>{
        if(city===""){
            fetchingData2()
        }
        fetchingData();
        
    },[])

   

    

    const handleForm = (event)=>{
        event.preventDefault();
        fetchingData();
        

    }

    const handleMode = ()=>{
        setMode(!mode);
        fetchingData();
        
    }


    const getWeatherIcon = (main)=>{
        switch(main){
            case "Clouds":
                return "/clouds.png";
            case "Rain":
                return "/rain.png";
            case "Mist":
                return "/tornado.png";
            case "Sun":
                return "/sun.png";
            case "Clear":
                return "/mist.png";
            case "Haze":
                return "/haze.png"
            case "Dust":
                return "/tornado.png"
            default:
                return null;
        }
    }
    

  return (
    <div className='main-container'>
      <div className={`weather-container ${darkMode}`}>
        
                <div className={`heading-container ${loweredMode}`}>
                <h1 className="heading">Weather Query</h1>
                <div className={`modes-container ${darkMode}`} onClick={handleMode} >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="icon size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                    </svg>
                    /
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="icon size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                    </svg>
                </div>
            </div>
            
           {weatherData !== null ? (
           <div className='content-container'>
            <div className='container1'>
                <div className='date-time-container'>
                    <h4 className='date'>{day} {months[month]} , {year}</h4>
                    <h4 className='date'>{formattedTime}</h4>
                </div>
                
                <div className={`temp-container ${darkMode}`}>
                    <h1 className='temp'>{(weatherData.main.temp - 275).toFixed(2)} <sup>o</sup> C</h1>
                    <img src={getWeatherIcon(weatherData.weather[0].main)} alt="weather icon" height="50px" width="50px" className='weather-icon'/>
                    <h3 className='temp-type'>{weatherData.weather[0].main}</h3>
                    {city==="None" ? <h2 className='city'>{add.county}</h2> :<h1 className='city'>{weatherData.name}</h1>}
                </div>
            </div>
            
            <div className={`temp-container2 ${darkMode}`}>
                <div>
                    <h3 className='humidity'>Humidity</h3>
                    <p className='value'>{weatherData.main.humidity} %</p>
                </div>
                <div>
                    <h3 className='humidity'>Wind Speed</h3>
                    <p className='value'>{weatherData.wind.speed} Km/h</p>
                </div> 
            </div>
                
            </div>) : (<p>error</p>)
            }

        <form className='search-container' onSubmit={handleForm}>
            <input type='search' className='search-bar' placeholder='Enter the city' onChange={(handleInput)}/>
            <button type='submit' className={`button ${darkMode}`}>Spectate Temperature</button>
        </form>
        
      </div>
    </div>
  )
}

export default WeatherApp
