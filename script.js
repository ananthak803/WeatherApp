const city = document.getElementById('city');
const form=document.querySelector('form');
const tempC = document.getElementById('tempC');
const local = document.getElementById('local');
const extra = document.getElementById('extraDetails');
const date = document.getElementById('dateTime');
const wImg = document.querySelector('img');
const wMain = document.querySelector('.searchWeather');
const wShow = document.querySelector('.showWeather');
const box3= document.querySelector('.box3');
const currentBtn = document.getElementById('currentBtn');

//getting city name from form
form.addEventListener('submit',(e)=>{
    console.log(e);
    e.preventDefault();
    if(city.value)
    {
        getWeather(city.value);
        sub(1);
        city.value=""
    }

})

//function to set icons for forecast
function iconSet(data)
{
    if(data.totalprecip_in!=0)
        return "rainy.png";
    else if(data.avgtemp_c<0)
        return "snow.png"
    else if(data.avgtemp_c<=15 && data.is_day)
        return "sunny.png"
    else if(data.avgtemp_c<=15)
        return "cold.png"
    else if(data.avgtemp_c<=30)
        return "sunny.png"
    else if(data.avgtemp_c>30)
        return "veryhot.png"
    else if(!data.is_day)
        return "night.png"
    else
        return "default.png"
}

//function to set icon for current weather
function iconSetMain(data)
{
    if(data.precip_in!=0)
        return "rainy.png";
    else if(data.temp_c<0)
        return "snow.png"
    else if(data.temp_c<=15)
        return "cold.png"
    else if(data.temp_c<=30)
        return "sunny.png"
    else if(data.temp_c>30)
        return "veryhot.png"
    else if(!data.is_day)
        return "night.png"
    else
        return "default.png"
}

//error handling
function errorCheck(data){
    const error =document.querySelector('.error');
    const span = document.createElement('span');
    span.textContent=`Error code : ${data.error.code}, ${data.error.message}`;
    error.appendChild(span);
    wShow.style.display ="none";
    wMain.style.display ="none";
    error.style.display="block";
}

//function to display weather page if city found
function sub(x){
    
    // console.log(wMain.children);
    switch(x){
        case 1:
            wShow.style.display = "block";
            wMain.style.display="none";
            break;
        case 2:
            wMain.children[0].style.display ="block";
            wMain.children[1].style.display ="none";
    }
}

//to get user location
currentBtn.addEventListener("click",getLocation);
const google_key = 'AIzaSyDdVSKDBTopgjqZvOqLFWBvmSsN0-GHxfE'
function getLocation()
{
    sub(2)
    navigator.geolocation.getCurrentPosition(pos=>{
        console.log(pos);
        console.log(pos.coords.longitude);
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${pos.coords.latitude},${pos.coords.longitude}&key=${google_key}`).then(res=>{
            if(res.status>299)
                errorCheck(res);
            return res.json();
        }).then(data=>{
            if(data.status!="Ok")
                sub(1);
            const st =(data.results[0].formatted_address.split(','));
            getWeather(st[st.length-3]);
        });
    });
}


//base url and key
const key ='a40e3b417674403a8d4113712241412';
const url = ' https://api.weatherapi.com/v1';

//function calling api and displaying weather
function getWeather(cityName)
{
    //api call to get current weather
    fetch(`${url}/current.json?key=${key}&q=${cityName}`).then(res=>{
        return res.json();
    }).then(data=>{
        if(data.error)
            errorCheck(data);
        wImg.setAttribute("src",`${iconSetMain(data.current)}`)
        tempC.innerText=data.current.temp_c+"°C";
        local.innerText=`${data.location.name}, ${data.location.region}`;
        extra.innerText=`Wind : ${data.current.wind_kph} km/h\nHumidity : ${data.current.humidity}%\nVision : ${data.current.vis_km} km\nPrecipitation : ${data.current.precip_in}%`;
        date.innerText=data.location.localtime;
    })

    //api call to get forecast
    fetch(`${url}/forecast.json?key=${key}&q=${cityName}&days=6`).then(res=>{
        return res.json();
    }).then(data=>{
        for(let i=0;i<5;i++)
        {
            const span1 = document.createElement('span');
            span1.innerText=data.forecast.forecastday[i+1].date;
            const img = document.createElement('img');
            img.setAttribute('src',`${iconSet(data.forecast.forecastday[i+1].day)}`);
            const span2 = document.createElement('span');
            span2.innerText=`${data.forecast.forecastday[i+1].day.mintemp_c}°C,${data.forecast.forecastday[i+1].day.maxtemp_c}°C`;
            const subBox =document.createElement('div');
            subBox.setAttribute('class','subBox');
            subBox.appendChild(span1);
            subBox.appendChild(img);
            subBox.appendChild(span2);
            box3.appendChild(subBox);
        }
    })
}






