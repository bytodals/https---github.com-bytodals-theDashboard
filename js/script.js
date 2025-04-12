// clock
function updateClock() {;
  const now = new Date();
  const time = now.toLocaleTimeString(); 
  const date = now.toLocaleDateString(); 

  document.getElementById('clock').textContent = time;
  document.getElementById('date').textContent = date;
}

updateClock();
setInterval(updateClock, 1000);

  // title
  const titleEl = document.getElementById("dashboard-title");
  titleEl.innerText = localStorage.getItem("dashboardTitle") || "My Dashboard";
  
  titleEl.addEventListener("input", () => {
    localStorage.setItem("dashboardTitle", titleEl.innerText);
  });
  

  
  // links
  function getFaviconUrl(url) {
    let faviconUrl = url + '/favicon.ico';
    return faviconUrl;
  }

  function getLinksFromStorage() {
    return JSON.parse(localStorage.getItem("savedLinks") || "[]");
  }
  
  function saveLinksToStorage(links) {
    localStorage.setItem("savedLinks", JSON.stringify(links));
  }
  
  function renderLinks() {
    const links = getLinksFromStorage();
    const list = document.getElementById("link-list");
    list.innerHTML = "";
  
    links.forEach((link, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <a href="${link.url}" target="_blank">${link.name}</a>
        <button onclick="removeLink(${index})">x</button>
      `;
      list.appendChild(li);
    });
  }
  
  function addLink() {
    const nameInput = document.getElementById("link-name");
    const urlInput = document.getElementById("link-url");
    const name = nameInput.value.trim();
    const url = urlInput.value.trim();
  
    if (!name || !url || !url.startsWith("http")) {
      alert("Please enter a valid name and full URL starting with http(s)");
      return;
    }
  
    const links = getLinksFromStorage();
    links.push({ name, url });
    saveLinksToStorage(links);
  
    nameInput.value = "";
    urlInput.value = "";
  
    renderLinks();
  }
  
  function removeLink(index) {
    const links = getLinksFromStorage();
    links.splice(index, 1);
    saveLinksToStorage(links);
    renderLinks();
  }
  
  
  renderLinks();

  // weather
  async function fetchWeather() {
    const weatherContainer = document.getElementById('weather-info');
    const WEATHER_API_KEY = process.env.WEATHER_API_KEY; 
;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            try {
                const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${lat},${lon}&days=3`);
                const data = await response.json();

                if (data.forecast) {
                    const today = data.forecast.forecastday[0];
                    const tomorrow = data.forecast.forecastday[1];
                    const dayAfterTomorrow = data.forecast.forecastday[2];

                    weatherContainer.innerHTML = `
                        <p><strong>Today:</strong> ${today.day.avgtemp_c}°C, ${today.day.condition.text}</p>
                        <p><strong>Tomorrow:</strong> ${tomorrow.day.avgtemp_c}°C, ${tomorrow.day.condition.text}</p>
                        <p><strong>Day After Tomorrow:</strong> ${dayAfterTomorrow.day.avgtemp_c}°C, ${dayAfterTomorrow.day.condition.text}</p>
                    `;
                } else {
                    weatherContainer.innerHTML = 'Could not load weather data!';
                }
            } catch (error) {
                console.error("Error loading weather data:", error);
                weatherContainer.innerHTML = 'Failed to load weather data!';
            }
        }, (error) => {
            console.error(error);
            weatherContainer.innerHTML = 'Failed to get geolocation data!';
        });
    } else {
        weatherContainer.innerHTML = 'Geolocation is not supported by this browser.';
    }
}


window.onload = fetchWeather;


  // notes
  const noteArea = document.getElementById("note-area");
  noteArea.value = localStorage.getItem("notes") || "";
  noteArea.addEventListener("input", () => {
    localStorage.setItem("notes", noteArea.value);
  });

  //news
  const apiKey = process.env.apiKey; 
  const newsUrl = `https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=${apiKey}`;
  
  function fetchNews() {
      fetch(newsUrl)
          .then(response => response.json())
          .then(data => {
              const newsContainer = document.getElementById('news');
              newsContainer.innerHTML = '';  
  
              if (data.articles && data.articles.length > 0) {
                  const newsList = document.createElement('ul');
  
                  data.articles.forEach(article => {
                      const listItem = document.createElement('li');
                      const articleLink = document.createElement('a');
                      articleLink.href = article.url;
                      articleLink.target = '_blank';
                      articleLink.textContent = article.title;
                      listItem.appendChild(articleLink);
                      newsList.appendChild(listItem);
                  });
  
                  newsContainer.appendChild(newsList);
              } else {
                  newsContainer.innerHTML = 'No news available.';
              }
          })
          .catch(error => {
              console.error('Error fetching news:', error);
              document.getElementById('news').innerHTML = 'Failed to load news.';
          });
  }
  
  window.onload = function() {
      fetchNews(); 
  };