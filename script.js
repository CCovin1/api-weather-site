const form = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const historyList = document.getElementById('history-list');
const currentWeatherDetails = document.getElementById('current-weather-details');
const forecastDetails = document.getElementById('forecast-details');
const apiKey = '5738d2e0fe8424d7a95a018fc8953eb0';

// Event listener for form submission
form.addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent form submission

  const city = cityInput.value.trim(); // Get the entered city

  if (city !== '') {
    getCoordinates(city)
      .then(coordinates => getWeather(coordinates.lat, coordinates.lon))
      .then(data => {
        // Process the weather data and update the UI
        updateCurrentWeather(data.current);
        updateForecast(data.daily);
        addCityToHistory(city);
      })
      .catch(error => {
        console.error('Error:', error);
      });

    cityInput.value = ''; // Clear the input field
  }
});

// Function to fetch coordinates for the given city from an API
function getCoordinates(city) {
  const apiUrl = `https://api.openweathermap.org/geo/3.0/direct?q=${city}&limit=1&appid=${apiKey}`;

  return fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      if (data.length > 0) {
        const { lat, lon } = data[0];
        return { lat, lon };
      } else {
        throw new Error('City not found');
      }
    });
}

// Function to fetch weather data from the OpenWeatherMap API
function getWeather(lat, lon) {
  const apiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  return fetch(apiUrl)
    .then(response => response.json());
}

// Function to update the current weather details in the UI
function updateCurrentWeather(currentData) {
  // Extract the required data from currentData object
  const { temp, humidity, wind_speed } = currentData;

  // Create HTML markup for current weather details
  const markup = `
    <h3>${cityInput.value}</h3>
    <p>Date: ${getCurrentDate()}</p>
    <p>Temperature: ${temp}°C</p>
    <p>Humidity: ${humidity}%</p>
    <p>Wind Speed: ${wind_speed} m/s</p>
  `;

  // Update the UI with current weather details
  currentWeatherDetails.innerHTML = markup;
}

// Function to update the forecast details in the UI
function updateForecast(forecastData) {
  // Extract the required data from forecastData object
  const forecast = forecastData.slice(1, 6); // Get the forecast for the next 5 days

  // Create HTML markup for forecast details
  let markup = '';
  forecast.forEach(day => {
    const { dt, temp, humidity, wind_speed } = day;
    const date = new Date(dt * 1000).toLocaleDateString('en-US', { weekday: 'long' });

    markup += `
      <div class="forecast-day">
        <p>Date: ${date}</p>
        <p>Temperature: ${temp.day}°C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${wind_speed} m/s</p>
      </div>
    `;
  });

  // Update the UI with forecast details
  forecastDetails.innerHTML = markup;
}

// Function to add the searched city to the search history
function addCityToHistory(city) {
  const listItem = document.createElement('li');
  listItem.textContent = city;
  historyList.appendChild(listItem);
}

// Function to get the current date in the required format
function getCurrentDate() {
  const date = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}