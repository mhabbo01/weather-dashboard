// key words from index
// id past-search for past city searches
// class btnDiv for div parent of class city
// class city for <input>
//class fiveDay for five day forecast
// id currentCity
//id currentDate


// let apiKey = "b6f5efc6e0c2b9553c818aa502e235f3";
let citySearch = document.querySelector(".current-city");
let fiveDay = $("#fiveDay");
let todayBody = $("#todayBody");

let date = moment().format("LL");

let searchHistory = [];

$(".search-btn").on("click", function (event){
    event.preventDefault();
    let city = $("#city").val().trim();
    console.log(city)
    // set a loop to append the search history under the search bar
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        let searchedCity = $(`
        <li class="list-group-item bg-dark text-light">${city}</li>`);
        $("#searchHistory").append(searchedCity);
    };

    localStorage.setItem("city", JSON.stringify(searchHistory));

    console.log("click");
    getWeather(city);
});

// search history items to be clickable
$(document).on("click", ".list-group-item", function() {
    let lastCity = $(this).text();
    getWeather(lastCity);
});

// sets the last searched city when the page is reloaded
$(document).ready(function() {
    let searchHisArr = JSON.parse(localStorage.getItem("city"));
    if (searchHisArr !== null) {
        let searchHisIndex = searchHisArr.length - 1;
        let lastSearchedCity = searchHisArr[searchHisIndex];
        getWeather(lastSearchedCity);

    }
});



function getWeather(city) {
    let queryUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=b6f5efc6e0c2b9553c818aa502e235f3`;
    todayBody.empty(); //empties out the today info from the last search

    fetch(queryUrl)
        .then(function (response) {
            return response.json(); // returns the data in a readable form
        })    
        .then(function (response) {
            // console.log(response);
            $("#currentCity").text(response.name);
            $("#currentDate").text(date);
            //grabbing the icons from the response
            // let icon = response.weather[0].icon;
            let weatherIcon = document.createElement("img")
            weatherIcon.setAttribute("src", "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png");
            citySearch.appendChild(weatherIcon);
            //creating elements for the icons and appending
            let tempEl = document.createElement("p"); //create a <p> element and append it to todayBody
            tempEl.textContent = "Temperature: " + response.main.temp + " °F";
            todayBody.append(tempEl);
            let humidEl = document.createElement("p");
            humidEl.textContent = "Humidity: " + response.main.humidity + " %";
            todayBody.append(humidEl);
            let windEl = document.createElement("p");
            windEl.textContent = "Wind Speed: " + response.wind.speed + " MPH";
            todayBody.append(windEl);

            let cityLat = response.coord.lat;
            let cityLon = response.coord.lon;
            console.log(cityLat)

            getFiveDay(cityLat, cityLon);

            let uviUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&units=imperial&appid=b6f5efc6e0c2b9553c818aa502e235f3`;

            fetch(uviUrl)
                .then(function (response) {
                    return response.json();
                })
                .then(function (response) {
                    console.log(response);
                    let uviPEl = document.createElement("p");
                    uviPEl.textContent = ("UV Index: ");
                    todayBody.append(uviPEl);
                    let todayUvi = document.createElement("span");
                    todayUvi.textContent = response.current.uvi;
                    let uviEl = response.current.uvi;
                    uviPEl.append(todayUvi);


                    if (uviEl >= 0 && uviEl <= 2) {
                        todayUvi.setAttribute("style", "background-color: green");
                    } else if (uviEl > 2 && uviEl <= 5) {
                        todayUvi.setAttribute("style", "background-color: yellow");
                    } else if (uviEl > 5 && uviEl <= 7) {
                        todayUvi.setAttribute("style", "background-color: orange");
                    } else if (uviEl > 7 && uviEl <= 10) {
                        todayUvi.setAttribute("style", "background-color: red");
                    } else todayUvi.setAttribute("style", "background-color: purple");
                });


        });
        
    
};

function getFiveDay(cityLat, cityLon) {
    let fiveDayUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&units=imperial&appid=b6f5efc6e0c2b9553c818aa502e235f3`

            fetch(fiveDayUrl)
                .then(function (response) {
                    return response.json();
                })
                .then(function (response) {
                    fiveDay.empty(); //empties out the five day from the last search
                    //get info for 5 days and loop
                    for (let i = 1; i < 6; i++) {
                        //store info into an object to make things easier
                        let fiveDayInfo = {
                            date: response.daily[i].dt,
                            icon: response.daily[i].weather[0].icon,
                            temp: response.daily[i].temp.day,
                            wind: response.daily[i].wind_speed,
                            humid: response.daily[i].humidity

                        };
                        // set date for each day
                        let currentDate = moment.unix(fiveDayInfo.date).format("LL");
                        // set the url for the icons that will be used for each day
                        let weatherIcon = `<img src="https://openweathermap.org/img/w/${fiveDayInfo.icon}.png" alt="${response.daily[i].weather[0].main}" />`
                        
                        // create lines of HTML to be appended under fiveDay
                        let fiveDayCard = $(`
                        <div class="col pl-3">
                            <div class="card pl-3 pt-3 mb-3 bg-dark text-light" style="width: 12rem">
                                <div class="card-body">
                                    <h5>${currentDate}</h5>
                                    <p>${weatherIcon}</p>
                                    <p>Temp: ${fiveDayInfo.temp} °F</p>
                                    <p>Humidity: ${fiveDayInfo.humid}\%</p>
                                    <p>Wind Speed: ${fiveDayInfo.wind} MPH</p>
                                </div>
                            </div>
                        <div>
                    `);

                        fiveDay.append(fiveDayCard);

                    };

                });
};