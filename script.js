function getWeather() {

    let city = document.getElementById("city").value;

    if (city === "") {
        alert("Entrer une ville");
        return;
    }

    // 1. récupérer coordonnées
    let geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}`;

    let xhr = new XMLHttpRequest();
    xhr.open("GET", geoUrl, true);

    xhr.onload = function () {
        let geoData = JSON.parse(xhr.responseText);

        if (!geoData.results) {
            document.getElementById("result").innerHTML = "Ville non trouvée ❌";
            return;
        }

        let lat = geoData.results[0].latitude;
        let lon = geoData.results[0].longitude;

        // 2. météo + 5 jours
        let weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min&current_weather=true&timezone=auto`;

        let xhr2 = new XMLHttpRequest();
        xhr2.open("GET", weatherUrl, true);

        xhr2.onload = function () {
            let data = JSON.parse(xhr2.responseText);

            // météo actuelle
            document.getElementById("result").innerHTML =
                `🌍 ${city}<br>🌡️ ${data.current_weather.temperature} °C`;

            // 5 jours
            let forecastHTML = "";

            for (let i = 0; i < 5; i++) {
                forecastHTML += `
                    <div class="card">
                        <h4>${data.daily.time[i]}</h4>
                        🌡️ Max: ${data.daily.temperature_2m_max[i]}°C<br>
                        ❄️ Min: ${data.daily.temperature_2m_min[i]}°C
                    </div>
                `;
            }

            document.getElementById("forecast").innerHTML = forecastHTML;
        };

        xhr2.send();
    };

    xhr.send();
}