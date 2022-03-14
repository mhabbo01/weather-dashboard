//set global query selectors

let cities = [];
let searchFormEl = document.querySelector("#search-form");
let cityInputEl = document.querySelector("#city");
let pastSearchEl = document.querySelector("#past-search");
let currentWeatherEl = document.querySelector("#current-weather");
let searchedCityEl = document.querySelector("#searched-city");
let forcastEl = document.querySelector("#forecast");
let fiveDayEl = document.querySelector("#five-day-forecast");


let formSubmitHandler = function(event) {
    event.preventDefault();  //prevents the browser from refreshing
    let city = cityInputEl.value.trim();
    if (city) {
        cityWeather(city);

    }
}

// input the API key & url and fetch the data for the city that is searched
let cityWeather = function(city) {
    let appid = "b6f5efc6e0c2b9553c818aa502e235f3"
    let apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&" + appid
    fetch(apiUrl).then(function(response) {
        response.json().then(function(data) { //json displays the data in a readable format
            displayWeather(data, city);
        });
    });
};

let displayWeather = function(weather, searchCity) {
    currentWeatherEl.textContent = "";
    cityInputEl.textContent = "";

    console.log(weather);
}