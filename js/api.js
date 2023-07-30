//the default lat and long shows my city 
var defaultLatitude = 36.83927917;
var defaultLongitude = 54.43208694;
//map api
var apikey = 'AoYuqMaVdGCEPMrkhGTEBAkcHoPcPAGQGwaYeXwxrZX8TmmCInhcQKJeNiuOl0Yi';
var map;
//define default location for map
window.addEventListener("load", function () {
    map = new Microsoft.Maps.Map('#myMap', {
        credentials: 'AoYuqMaVdGCEPMrkhGTEBAkcHoPcPAGQGwaYeXwxrZX8TmmCInhcQKJeNiuOl0Yi',
        center: new Microsoft.Maps.Location(defaultLatitude, defaultLongitude),
    });
    Microsoft.Maps.Events.addHandler(map, 'click', function (e) { set_latitudes_and_longitude(e); });
});
//weather api
var api_key = 'a83508193fed8a31dc3df212110dafe0';
var cityname = "Gorgan";
//getting weather fot the default city 
fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityname}&appid=${api_key}`)
    .then(response => response.json())
    .then(data => {
        MakeData(data, defaultLatitude, defaultLongitude);
    }).catch(error => console.error(error));
//getting the weather of anywhere you choose on the map
function set_latitudes_and_longitude(map) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${map.location.latitude}&lon=${map.location.longitude}&appid=${api_key}`)
        .then(response => response.json())
        .then(data => {
            MakeData(data, map.location.latitude, map.location.longitude);
            Scrolltodiv();
        }).catch(error => console.error(error));
}
//I did not write the three functions bellow. I got them from websites
//the three functions bellow were used for date converting and getting unique ones
function DateConvert(dt) {
    const timestamp = dt;
    const date = new Date(timestamp * 1000); // Convert to milliseconds
    const options = { weekday: 'long', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const dateString = date.toLocaleDateString('en-US', options);
    return dateString;
}
Array.prototype.contains = function (v) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === v) return true;
    }
    return false;
};
Array.prototype.unique = function () {
    var arr = [];
    for (var i = 0; i < this.length; i++) {
        if (!arr.contains(this[i])) {
            arr.push(this[i]);
        }
    }
    return arr;
}
//splitting data for showing 
function MakeData(data, latitude, longitude) {
    //splitting data by dates
    const forecastsByDate = {};
    const forecasts = data.list;
    for (let i = 0; i < forecasts.length; i++) {
        const forecast = forecasts[i];
        const date = forecast.dt_txt.split(" ")[0];
        if (!forecastsByDate[date]) {
            forecastsByDate[date] = [];
        }
        forecastsByDate[date].push(forecast);
    }
    //the data for the last date might not be complete so I pop it
    const lastDate = Object.keys(forecastsByDate).pop();
    delete forecastsByDate[lastDate];
    document.getElementById("weather-container").innerHTML = "";
    const weathContainer = document.getElementById("weather-container");
    for (const date in forecastsByDate) {
        //for the first date, I want to show also the name of the city, so the api is different
        if (date == Object.keys(forecastsByDate)[0]) {
            MakeHourWeather(0, forecastsByDate, date, weathContainer, latitude, longitude);
        }
        else {
            MakeHourWeather(1, forecastsByDate, date, weathContainer, latitude, longitude);
        }
    }
}
//showing data 
function MakeHourWeather(id, forecastsByDate, date, forecastContainer, latitude, longitude) {
    var forecastData = forecastsByDate[date];
    var weather = document.createElement("div");
    weather.className = "row";
    var rowContainer = document.createElement("div");
    rowContainer.className = "col-lg-6 col-md-6 col-sm-10 col-xs-10";
    rowContainer.style.display = "flex";
    rowContainer.style.overflowX = "scroll";
    forecastContainer.appendChild(rowContainer);
    var city = "";
    var head = document.createElement("div");
    head.className = "row";
    if (id == 0) {
        //the first date and weather in shown with the name of city
        var url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${api_key}&units=metric`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const temperature = Math.round(data.main.temp);
                const weatherDescription = data.weather[0].description;
                city = data.name;
                var l = 'l@l';
                var ic = data.weather[0].icon + l[1] + "4x.png";
                var thisdate = new Date(date).toDateString();
                head.innerHTML = `
<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
<h2>${city} : ${thisdate}</h2>
</div>`;

                var str = `
<div class="col-lg-6 col-md-6 col-sm-10 col-xs-10">
<img style='width:200px;height:200px;' class='center-block' src='https://openweathermap.org/img/wn/${ic}'/>
<p class='aut'>Temperature: ${temperature}&deg;C</p>
<p class='aut'>feels like: ${data.main.feels_like}&deg;C</p>
<p class='aut'>Weather: ${weatherDescription}</p>
<p class='aut'>humidity: ${data.main.humidity}%</p>
</div>

                                                                   `
                    ;
                weather.innerHTML = weather.innerHTML + str;
                //for bellow, shows the weather for hours of the date
                for (let i = 0; i < forecastData.length; i++) {
                    const forecast = forecastData[i];
                    var l = 'l@l';
                    var ic = forecast.weather[0].icon + l[1] + "4x.png";
                    const temp = Math.round(forecast.main.temp - 273.15);
                    const tempfeel = Math.round(forecast.main.feels_like - 273.15);
                    const forecastHtml = `
                                                                  <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                                    <h4>${forecast.dt_txt.split(" ")[1]}</h4>
                                                                    <img style='width:200px;height:200px;' class='center-block' src='https://openweathermap.org/img/wn/${ic}'/>
                                                                    <p>Temperature: ${temp}&deg;C</p>
                                                                    <p>feels like: ${tempfeel}&deg;C</p>
                                                                    <p>humidity: ${forecast.main.humidity}%</p>
                                                                    <p>Weather: ${forecast.weather[0].description}</p>
                                                                    <p>wind: ${forecast.wind.speed}km/h</p>
                                                                  </div>
                                                                `;
                    var forecastDiv = document.createElement("div");
                    forecastDiv.style.margin = "1px";
                    forecastDiv.className = "row";
                    forecastDiv.style.backgroundColor = "white";
                    forecastDiv.style.borderRadius = "10px";
                    forecastDiv.innerHTML = forecastHtml;
                    rowContainer.appendChild(forecastDiv); 
                }
                weather.appendChild(rowContainer);
                document.getElementById("weather-container").prepend(weather);
                document.getElementById("weather-container").prepend(head);

            }).catch(error => console.error(error));

    }
    else {
        //for the rest of the dates, I show the 12 oclock weather for the day, and all the hours are listed for every day 
        for (let i = 0; i < forecastData.length; i++) {
            if (id == 1 && forecastData[i].dt_txt.split(" ")[1] == "12:00:00") {
                const forecast = forecastData[i];
                var l = 'l@l';
                var ic = forecast.weather[0].icon + l[1] + "4x.png";
                const temp = Math.round(forecast.main.temp - 273.15);
                const tempfeel = Math.round(forecast.main.feels_like - 273.15);
                var thisdate = new Date(date).toDateString();
                head.innerHTML = `
<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
<h2>${thisdate}</h2>
</div>`;
                var str = `

<div class="col-lg-6 col-md-6 col-sm-10 col-xs-10">
<img style='width:200px;height:200px;' class='center-block' src='https://openweathermap.org/img/wn/${ic}'/>
<p class='aut'>Temperature: ${temp}&deg;C</p>
<p class='aut'>feels like: ${tempfeel}&deg;C</p>
<p class='aut'>Weather: ${forecast.weather[0].description}</p>
<p class='aut'>humidity: ${forecast.main.humidity}%</p>
</div>`
                    ;
                weather.innerHTML = weather.innerHTML + str;
            }
            const forecast = forecastData[i];
            var l = 'l@l';
            var ic = forecast.weather[0].icon + l[1] + "4x.png";
            const temp = Math.round(forecast.main.temp - 273.15);
            const tempfeel = Math.round(forecast.main.feels_like - 273.15);
            const forecastHtml = `
                                                                  <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                                    <h4>${forecast.dt_txt.split(" ")[1]}</h4>
                                                                    <img style='width:200px;height:200px;' class='center-block' src='https://openweathermap.org/img/wn/${ic}'/>
                                                                    <p>Temperature: ${temp}&deg;C</p>
                                                                    <p>feels like: ${tempfeel}&deg;C</p>
                                                                    <p>humidity: ${forecast.main.humidity}%</p>
                                                                    <p>Weather: ${forecast.weather[0].description}</p>
                                                                    <p>wind: ${forecast.wind.speed}km/h</p>
                                                                  </div>
                                                                `;
            const forecastDiv = document.createElement("div");
            forecastDiv.style.margin = "1px";
            forecastDiv.className = "row";
            forecastDiv.style.backgroundColor = "white";
            forecastDiv.style.borderRadius = "10px";
            forecastDiv.innerHTML = forecastHtml;
            rowContainer.appendChild(forecastDiv);
        }
        weather.appendChild(rowContainer);
        document.getElementById("weather-container").appendChild(head);
        document.getElementById("weather-container").appendChild(weather);
    }
}
//whenever we get the data, it scrolls to the div that shows weather
function Scrolltodiv() {
    $('html, body').animate({
        scrollTop: $("#weatherRow").offset().top
    }, 2000);
}
//when a city name is searched, the function bellow gets called 
function SearchCity() {
    var name = document.getElementById("searchinput").value;
    var location;
    var latitude;
    var longitude;
    //get the lat and long of the city, and showing the city on the map
    Microsoft.Maps.loadModule('Microsoft.Maps.Search', function () {
        var searchManager = new Microsoft.Maps.Search.SearchManager(map);
        var requestOptions = {
            where: name,
            callback: function (result) {
                location = result.results[0].location;
                latitude = location.latitude;
                longitude = location.longitude;
                map = new Microsoft.Maps.Map('#myMap', {
                    credentials: 'AoYuqMaVdGCEPMrkhGTEBAkcHoPcPAGQGwaYeXwxrZX8TmmCInhcQKJeNiuOl0Yi',
                    center: new Microsoft.Maps.Location(latitude, longitude),
                });
                //get the forecast of the city and show weather
                var url = `https://api.openweathermap.org/data/2.5/forecast?q=${name}&appid=${api_key}`
                fetch(url)
                    .then(response => response.json())
                    .then(data => {
                        MakeData(data, latitude, longitude);
                        Scrolltodiv();
                    }).catch(error => console.error(error));
            },
            errorCallback: function (e) {
                console.log('Error: ' + e);
            }

        };
        searchManager.geocode(requestOptions);
    });
    document.getElementById("searchinput").value = "";
}
