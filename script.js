function kelvinToF(kelvin) {
  return (kelvin - 273.15) * (9 / 5) + 32;
}

function kelvinToC(kelvin) {
  return kelvin - 273.15;
}

function mpsToMph(mps) {
  return mps * 2.237;
}

function offsetToTime(seconds) {
  const date = new Date();
  const hmsUTC = (date.getUTCHours() * 3600) + (date.getUTCMinutes() * 60) + date.getUTCSeconds();
  const hmsLocal = (hmsUTC + seconds + 86400) % 86400;
  const hoursLocal = Math.floor(hmsLocal / 3600);
  const minutesLocal = Math.floor((hmsLocal % 3600) / 60);
  const hoursLocal12 = hoursLocal === 0 ? 12 : hoursLocal % 12;
  const minutesLocal60 = (`0${minutesLocal}`).slice(-2);
  const ampm = hoursLocal > 11 ? 'PM' : 'AM';
  return `As of ${hoursLocal12}:${minutesLocal60} ${ampm}`;
}

let kelvin;

function refresh(string) {
  const root = document.documentElement;
  const main = document.getElementsByTagName('main')[0];
  let url = 'https://api.openweathermap.org/data/2.5/weather?q=';
  url += string;
  url += '&APPID=209daafaa67615e32e492416f4039224';
  fetch(url, { mode: 'cors' })
    .then((response) => response.json())
    .then((response) => {
      console.log(response);

      if (document.getElementById('error') !== null) {
        document.getElementById('error').remove();
      }

      if (response.cod === '404') {
        const errorBox = document.createElement('section');
        errorBox.id = 'error';
        errorBox.innerHTML = 'City not found.';
        main.appendChild(errorBox);
        return;
      }
      if (response.dt > response.sys.sunrise && response.dt < response.sys.sunset) {
        root.style.setProperty('--text-color-secondary', '#8bb9ff');
        root.style.setProperty('--background-color', '#0f56b4');
        console.log('hey');
      } else {
        root.style.setProperty('--text-color-secondary', '#4e87d4');
        root.style.setProperty('--background-color', '#082b59');
        console.log('ho');
      }
      const forecast = document.getElementById('forecast');
      forecast.innerHTML = '';

      const h1 = document.createElement('h1');
      h1.innerHTML = `${response.name}, ${response.sys.country}`;
      forecast.appendChild(h1);

      const when = document.createElement('div');
      when.id = 'when';
      when.innerHTML = offsetToTime(response.timezone);
      forecast.appendChild(when);

      const temperature = document.createElement('div');
      temperature.id = 'temperature';
      forecast.appendChild(temperature);

      const tempNumber = document.createElement('div');
      tempNumber.id = 'temp-number';
      tempNumber.innerHTML = kelvinToF(response.main.temp).toFixed(0);
      kelvin = response.main.temp;
      temperature.appendChild(tempNumber);

      const units = document.createElement('div');
      units.id = 'units';
      temperature.appendChild(units);
      const f = document.createElement('span');
      f.id = 'fahrenheit';
      f.className = 'active';
      f.innerHTML = '\xB0F';
      const c = document.createElement('span');
      c.id = 'celcius';
      c.className = 'inactive';
      c.innerHTML = '\xB0C';
      const bar = document.createTextNode(' | ');
      units.appendChild(f);
      units.appendChild(bar);
      units.appendChild(c);

      const icon = document.createElement('div');
      icon.id = 'icon';
      if (response.weather[0].main === 'Clear') {
        if (response.dt > response.sys.sunrise && response.dt < response.sys.sunset) {
          icon.style.backgroundImage = "url('icons/Sun.svg')";
        } else {
          icon.style.backgroundImage = "url('icons/Moon.svg')";
        }
      } else if (response.weather[0].main === 'Clouds') {
        icon.style.backgroundImage = "url('icons/Cloud.svg')";
      } else if (response.weather[0].main === 'Mist') {
        icon.style.backgroundImage = "url('icons/Haze.svg')";
      } else if (response.weather[0].main === 'Rain') {
        icon.style.backgroundImage = "url('icons/Rain.svg')";
      } else if (response.weather[0].main === 'Snow') {
        icon.style.backgroundImage = "url('icons/Snow.svg')";
      }
      forecast.appendChild(icon);

      const condition = document.createElement('div');
      condition.id = 'condition';
      condition.innerHTML = response.weather[0].main;
      forecast.appendChild(condition);

      const humidity = document.createElement('div');
      humidity.id = 'humidity';
      humidity.innerHTML = `Humidity: ${response.main.humidity}%`;
      forecast.appendChild(humidity);

      const wind = document.createElement('div');
      wind.id = 'wind';
      wind.innerHTML = `Wind speed: ${mpsToMph(response.wind.speed).toFixed(1)} mph`;
      forecast.appendChild(wind);
    });
}

document.addEventListener('click', (e) => {
  const tempNumber = document.getElementById('temp-number');
  const fahrenheit = document.getElementById('fahrenheit');
  const celcius = document.getElementById('celcius');
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');
  if (e.target.className === 'inactive') {
    if (e.target === fahrenheit) {
      tempNumber.innerHTML = kelvinToF(kelvin).toFixed(0);
      celcius.className = 'inactive';
      fahrenheit.className = 'active';
    } else if (e.target === celcius) {
      tempNumber.innerHTML = kelvinToC(kelvin).toFixed(0);
      celcius.className = 'active';
      fahrenheit.className = 'inactive';
    }
  } else if (e.target === searchButton && searchInput.value !== '') {
    refresh(searchInput.value);
  }
});

document.addEventListener('keyup', (e) => {
  const searchInput = document.getElementById('search-input');
  if (e.code === 'Enter' && document.activeElement === searchInput) {
    if (searchInput.value !== '') {
      refresh(searchInput.value);
    }
  }
});

refresh('palm springs');
