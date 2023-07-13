// Weather Dashboard JavaScript code

const form = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const historyList = document.getElementById('history-list');
const currentWeatherDetails = document.getElementById('current-weather-details');
const forecastDetails = document.getElementById('forecast-details');
const apiKey = '5738d2e0fe8424d7a95a018fc8953eb0';
const searchedCities = [];

// Event listener for form submission
form.addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent form submission

  const city = cityInput.value.trim(); // Get the entered city

  if (city !== '') {
    searchCity(city);
    cityInput.value = ''; // Clear the input field
  }
});

// Function to search for a city and display weather information
function searchCity(city) {
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
}

// Function to fetch coordinates for the given city, state code, and country code from the OpenWeatherMap Geocoding API
function getCoordinates(city, stateCode = '', countryCode = '') {
  const apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city},${stateCode},${countryCode}&limit=1&appid=${apiKey}&units=imperial`;

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
  const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

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
    <p>Temperature: ${temp}°F</p>
    <p>Humidity: ${humidity}%</p>
    <p>Wind Speed: ${wind_speed} MPH</p>
  `;

  // Update the UI with current weather details
  currentWeatherDetails.innerHTML = markup;
}

// Function to update the forecast details in the UI
function updateForecast(forecastData) {
  // Clear existing forecast details
  forecastDetails.innerHTML = '';

  // Extract the required data from forecastData object
  const forecast = forecastData.slice(1, 6); // Get the forecast for the next 5 days

  // Create forecast cards
  forecast.forEach(day => {
    const { dt, temp, humidity, wind_speed } = day;
    const date = new Date(dt * 1000).toLocaleDateString('en-US');

    const card = document.createElement('div');
    card.classList.add('forecast-card');

    const markup = `
      <h3>${date}</h3>
      <p>Temperature: ${temp.day}°F</p>
      <p>Humidity: ${humidity}%</p>
      <p>Wind Speed: ${wind_speed} MPH</p>
    `;

    card.innerHTML = markup;
    forecastDetails.appendChild(card);
  });
}

// Function to add the searched city to the search history
function addCityToHistory(city) {
  // Check if the city is already in the search history
  if (searchedCities.includes(city)) {
    return; // Skip adding duplicate cities
  }

  searchedCities.push(city); // Add the city to the searchedCities array

  const listItem = document.createElement('li');
  listItem.textContent = city;
  historyList.appendChild(listItem);

  // Add event listener to the list item
  listItem.addEventListener('click', function() {
    // Trigger a search for the clicked city
    searchCity(city);
  });
}

// Function to get the current date in the required format
function getCurrentDate() {
  const date = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}