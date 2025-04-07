const apiKey = process.env.WEATHER_API_KEY;
const baseUrl = 'https://api.weatherapi.com/v1';

document.querySelector('#getWeatherBtn').addEventListener('click', async () => {
  const city = document.querySelector('#cityInput').value;

  if (!city) return alert("Please enter a city.");

  const currentUrl = `${baseUrl}/current.json?key=${apiKey}&q=${city}`;
  const currentRes = await fetch(currentUrl);
  const currentData = await currentRes.json();

  const currentWeatherHtml = `
    <h2>Current Weather in ${currentData.location.name}</h2>
    <p>${currentData.current.condition.text}</p>
    <p>Temperature: ${currentData.current.temp_c}°C</p>
    <a href="https:${currentData.current.condition.icon}" target="_blank">
      <img src="https:${currentData.current.condition.icon}" />
    </a>
  `;
  document.querySelector('#currentWeather').innerHTML = currentWeatherHtml;
  document.querySelector('#currentWeather').classList.add('fade-in');

  const forecastUrl = `${baseUrl}/forecast.json?key=${apiKey}&q=${city}&days=3`;
  const forecastRes = await fetch(forecastUrl);
  const forecastData = await forecastRes.json();

  const forecastHtml = forecastData.forecast.forecastday.map(day => `
    <div>
      <h3>${day.date}</h3>
      <p>${day.day.condition.text}</p>
      <p>Max: ${day.day.maxtemp_c}°C, Min: ${day.day.mintemp_c}°C</p>
      <a href="https:${day.day.condition.icon}" target="_blank">
        <img src="https:${day.day.condition.icon}" />
      </a>
    </div>
  `).join('');

  document.querySelector('#forecastWeather').innerHTML = `
    <h2>3-Day Forecast</h2>
    ${forecastHtml}
  `;
  document.querySelector('#forecastWeather').classList.add('fade-in');

  const dateToday = new Date().toISOString().split('T')[0];

  function createMoonButton(city) {
    const existingButton = document.querySelector('#getMoonBtn');
    if (existingButton) existingButton.remove();

    document.querySelector('#moonContainer').innerHTML = '';
    document.querySelector('#mapContainer').innerHTML = '';

    const moonBtn = document.createElement('button');
    moonBtn.id = 'getMoonBtn';
    moonBtn.classList.add('button');
    moonBtn.textContent = 'Get Moon Phase';
    document.querySelector('#moonContainer').appendChild(moonBtn);
    document.querySelector('#moonContainer').classList.add('visible');

    const mapBtn = document.createElement('button');
    mapBtn.id = 'getMapBtn';
    mapBtn.classList.add('button');
    mapBtn.textContent = 'Get City Map';
    document.querySelector('#mapContainer').appendChild(mapBtn);
    document.querySelector('#mapContainer').classList.add('visible');

    moonBtn.addEventListener('click', async () => {
      document.querySelector('#moonContainer').classList.add('visible');
      const dateToday = new Date().toISOString().split('T')[0];
      const astroUrl = `${baseUrl}/astronomy.json?key=${apiKey}&q=${city}&dt=${dateToday}`;
      const astroRes = await fetch(astroUrl);
      const astroData = await astroRes.json();
      const astro = astroData.astronomy.astro;

      const moonInfo = document.createElement('div');
      moonInfo.innerHTML = `
        <h2>Astronomy Info</h2>
        <p>Sunrise: ${astro.sunrise}</p>
        <p>Sunset: ${astro.sunset}</p>
        <p>Moon Phase: ${astro.moon_phase}</p>
      `;

      const moonPhaseImage = getMoonPhaseImage(astro.moon_phase);
      moonInfo.innerHTML += `
        <img src="${moonPhaseImage}" alt="${astro.moon_phase}" style="width: 100px; height: auto; margin-top: 10px;" />
      `;

      moonInfo.classList.add('fade-in');
      document.querySelector('#moonContainer').appendChild(moonInfo);
      moonBtn.disabled = true;
    });

    mapBtn.addEventListener('click', async () => {
        const city = document.querySelector('#cityInput').value;

        const currentUrl = `${baseUrl}/current.json?key=${apiKey}&q=${city}`;
        const currentRes = await fetch(currentUrl);
        const currentData = await currentRes.json();
        const lat = currentData.location.lat;
        const lon = currentData.location.lon;

        const mapInfo = document.createElement('div');
        mapInfo.innerHTML = `
          <h2>City Map</h2>
          <iframe 
            width="100%" 
            height="400px" 
            src="https://www.openstreetmap.org/export/embed.html?bbox=${lon-0.1},${lat-0.1},${lon+0.1},${lat+0.1}&layer=mapnik&marker=${lon},${lat}" 
            frameborder="0" style="border: 0; max-width: 100%; max-height: 400px;" target="_blank"></iframe>
        `;
        mapInfo.classList.add('fade-in');
        document.querySelector('#mapContainer').appendChild(mapInfo);
        mapBtn.disabled = true;
      });
  }

  createMoonButton(city);
});

function getMoonPhaseImage(phase) {
  const phases = {
    "New Moon": "/images/new_moon.png",
    "Waxing Crescent": "/images/waxing_crescent.png",
    "First Quarter": "/images/first_quarter.png",
    "Waxing Gibbous": "/images/waxing_gibbous.png",
    "Full Moon": "/images/full_moon.png",
    "Waning Gibbous": "/images/waning_gibbous.png",
    "Last Quarter": "/images/last_quarter.png",
    "Waning Crescent": "/images/waning_crescent.png"
  };
  return phases[phase] || "/images/new_moon.png";
}