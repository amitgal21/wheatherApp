let lastCity = ''; 

document.getElementById('weather-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const city = document.getElementById('city').value.trim();
    lastCity = city;
    fetchWeatherData(city);
    fetchForecastData(city);
});

document.getElementById('unit').addEventListener('change', function () {
    if (lastCity) {
        fetchWeatherData(lastCity);
        fetchForecastData(lastCity);
    }
});

function fetchWeatherData(city) {
    const unit = document.getElementById('unit').value;
    fetch('config.json')
        .then(response => response.json())
        .then(config => {
            const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=${unit}&appid=${config.apiKey}`;
            return fetch(apiUrl);
        })
        .then(response => response.json())
        .then(data => {
            displayWeather(data, unit);
        })
        .catch(error => console.error(error));
}

function fetchForecastData(city) {
    const unit = document.getElementById('unit').value;
    fetch('config.json')
        .then(response => response.json())
        .then(config => {
            const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=${unit}&appid=${config.apiKey}`;
            return fetch(apiUrl);
        })
        .then(response => response.json())
        .then(data => {
            displayForecast(data, unit);
        })
        .catch(error => console.error(error));
}

function displayWeather(data, unit) {
    const weatherOutput = document.getElementById('weather-output');
    const backgroundImage = document.querySelector('.background-image img');
    const tempUnit = unit === 'metric' ? '°C' : '°F';

    weatherOutput.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <p><strong>Temperature:</strong> ${data.main.temp}${tempUnit}</p>
        <p><strong>Weather:</strong> ${data.weather[0].description}</p>
        <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather Icon">
    `;

    const weatherCondition = data.weather[0].main.toLowerCase();

    switch (weatherCondition) {
        case 'clear':
            backgroundImage.src = './sunny.jpg'; 
            break;
        case 'clouds':
            backgroundImage.src = './cloudy.jpg'; 
            break;
        case 'rain':
            backgroundImage.src = './rainy.jpg'; 
            break;
        case 'drizzle':
            backgroundImage.src = './drizzle.jpg'; 
            break;
        case 'thunderstorm':
            backgroundImage.src = './storm.jpg'; 
            break;
        case 'snow':
            backgroundImage.src = './snowy.jpg'; 
            break;
        case 'mist':
        case 'fog':
        case 'smoke':
        case 'haze':
        case 'dust':
        case 'sand':
        case 'ash':
        case 'squall':
        case 'tornado':
            backgroundImage.src = './atmosphere.jpg'; 
            break;
        default:
            backgroundImage.src = './snowy.jpg'; 
            break;
    }
}



function displayForecast(data, unit) {
    const forecastOutput = document.getElementById('forecast-output');
    forecastOutput.innerHTML = '<h3>5-Day Forecast</h3>';
    const tempUnit = unit === 'metric' ? '°C' : '°F';
    const forecasts = data.list.filter(item => item.dt_txt.includes('12:00:00'));
    forecasts.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        forecastOutput.innerHTML += `
            <div class="forecast-day">
                <h4>${date.toLocaleDateString('en-US', { weekday: 'short' })}</h4>
                <p>${forecast.main.temp}${tempUnit}</p>
                <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="Weather Icon">
                <p>${forecast.weather[0].description}</p>
            </div>
        `;
    });
}
