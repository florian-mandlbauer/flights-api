// flight.js

document.addEventListener('DOMContentLoaded', () => {
    const flightDetails = JSON.parse(sessionStorage.getItem('flightDetails'));
    console.log('Flight Details Retrieved:', flightDetails); // Debugging
    if (flightDetails) {
        displayFlightDetails(flightDetails);
        fetchWeatherData(flightDetails.arrivalCity);
        fetchPhotoData(flightDetails.arrivalCity);
    } else {
        console.error('Flight details not found in sessionStorage.');
        document.getElementById('flight-info').textContent = 'Flugdetails konnten nicht gefunden werden.';
    }
});

function displayFlightDetails(flightDetails) {
    const { Departure, Arrival, OperatingCarrier, Equipment, Status, departureCity, arrivalCity } = flightDetails;
    const flightInfoElement = document.getElementById('flight-info');
    flightInfoElement.innerHTML = `
        <div><strong>Flug:</strong> ${OperatingCarrier.AirlineID}${OperatingCarrier.FlightNumber}</div>
        <div><strong>Abflugsstadt:</strong> ${departureCity}</div>
        <div><strong>Abflugzeit:</strong> ${Departure.Scheduled.Time}</div>
        <div><strong>Ankunftsstadt:</strong> ${arrivalCity}</div>
        <div><strong>Ankunftszeit:</strong> ${Arrival.Scheduled.Time}</div>
        <div><strong>Status:</strong> ${Status.Description}</div>
        <div><strong>Flugzeug:</strong> ${Equipment.AircraftCode}</div>
    `;
    console.log('Flight Info HTML:', flightInfoElement.innerHTML); // Debugging

    // Set the city name in the weather section
    document.getElementById('weather-city').textContent = arrivalCity;
}

async function fetchWeatherData(city) {
    const weatherApiKey = 'hB9p9aI9nOV3IRFsbKPjkA==UXTZ7n66ucUQUIp4';
    const weatherUrl = `https://api.api-ninjas.com/v1/weather?city=${city}`;

    try {
        const response = await fetch(weatherUrl, {
            headers: { 'X-Api-Key': weatherApiKey }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const weatherData = await response.json();
        console.log('Weather Data:', weatherData); // Debugging

        displayWeatherData(weatherData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        document.getElementById('current-weather').textContent = 'Wetterdaten sind leider nicht vorhanden.';
    }
}

function displayWeatherData(weatherData) {
    const weatherElement = document.getElementById('current-weather');
    weatherElement.innerHTML = `
        <div><strong>Temperatur:</strong> ${weatherData.temp}°C</div>
        <div><strong>Windgeschwindigkeit:</strong> ${weatherData.wind_speed} m/s</div>
        <div><strong>Luftfeuchtigkeit:</strong> ${weatherData.humidity}%</div>
    `;
    console.log('Weather Info HTML:', weatherElement.innerHTML); // Debugging
}

async function fetchPhotoData(city) {
    const pexelsApiKey = '6Z8Ug4o0EX0GMPx1PAFcT7pV8OpMtNUdLnmYLzn6zr8ElH6dARNTVBsL';
    const pexelsUrl = `https://api.pexels.com/v1/search?query=${city}&per_page=1`;

    try {
        const response = await fetch(pexelsUrl, {
            headers: { Authorization: `Bearer ${pexelsApiKey}` }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const photoData = await response.json();
        console.log('Photo Data:', photoData); // Debugging

        displayPhotoData(photoData);
    } catch (error) {
        console.error('Error fetching photo data:', error);
        document.getElementById('photo-container').textContent = 'Foto konnte nicht geladen werden.';
    }
}

function displayPhotoData(photoData) {
    const photoElement = document.getElementById('photo-container');
    if (photoData.photos && photoData.photos.length > 0) {
        const photo = photoData.photos[0];
        photoElement.innerHTML = `<img src="${photo.src.large}" alt="${photo.alt}" width="400">`;
    } else {
        photoElement.textContent = 'Kein Foto verfügbar.';
    }
    console.log('Photo Info HTML:', photoElement.innerHTML); // Debugging
}
