// @ts-check

function initLinks()
{
    const navLinks = [
        { name: 'mail', url: 'https://mail.google.com/mail/u/0/' },
        { name: 'canvas', url: 'https://canvas.case.edu' },
        { name: 'sis', url: 'https://sis.case.edu' },
        { name: 'libgen', url: 'https://libgen.is' },
        { name:  'hcm', url: 'https://hcm.case.edu' },
        { name: 'calendar', url: 'https://calendar.google.com/u/0/r' },
    ]

    const launcher = document.getElementById('link-container')

    for(const link of navLinks) {
        const elem = document.createElement('div')
        elem.classList.add('launcher-link')
        elem.innerText = link.name
        elem.onclick = function() {
            window.open(link.url, '_blank')
        }

        launcher?.appendChild(elem)
    }
}

function initWeather() 
{
    const weatherIcons = [
        'null',
        'null',
        'thunderstorm',
        'weather_snowy',
        'null',
        'rainy',
        'ac_unit',
        'foggy',
        'TBD'
    ]

    const getWeatherData = (cityName) => {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=2528be2e5c053228dd0fd7a3285d22a3&units=imperial`).then((req) => {
            req.json().then((json) => {

                console.log(json)

                // Get the symbol for the weather

                // sys.sunset & sys.sunrise are in seconds
                const isDay = (Date.now() / 1000 - json.sys.sunset < 0)

                const weatherId = json.weather[0].id
                const weatherMain = parseInt(weatherId) / 100

                console.log(weatherId)

                let symbolName = 'null'

                if(Math.floor(weatherMain) === 8 && weatherId % 100 === 0) {
                    // Clear sky
                    symbolName = isDay ? 'light_mode' : 'dark_mode'
                } else if(Math.floor(weatherMain) === 8 && weatherId % 100 !== 0) {
                    // Clouds
                    symbolName = isDay ? 'partly_cloudy_day' : 'partly_cloudy_night'
                } else {
                    symbolName = weatherIcons[Math.floor(weatherMain)]
                }

                const weatherSymbolNode = document.getElementById('weather-symbol')

                if(weatherSymbolNode) weatherSymbolNode.innerText = symbolName

                const weatherTempNode = document.getElementById('weather-temp')

                if(weatherTempNode) weatherTempNode.innerText = `${Math.round(json.main.feels_like)} °F - ${json.weather[0].description}`
            }) 
        })
    }

    getWeatherData('Las Vegas')
}

function initTime()
{
    const setTime = () => {
        const now = new Date()

        const hour = String((now.getHours() - 12 > 0) ? now.getHours() - 12 : now.getHours()).padStart(2, '0')
        const minute = String(now.getMinutes()).padStart(2, '0')

        const hourNode = document.getElementById('time-hours')
        if(hourNode) hourNode.innerText = hour

        const minuteNode = document.getElementById('time-minutes')
        if(minuteNode) minuteNode.innerText = minute
    }

    setTime()
    setInterval(() => {
        setTime()
    }, 1000 * 60)
}


window.onload = function() {
    initTime()

    initLinks()
    initWeather()

    document.getElementById('search-input')?.addEventListener('submit', (e) => {
        e.preventDefault()
        const input = document.getElementById('search-text')
        // @ts-ignore
        const val = input.value

        window.open(`https://www.google.com/search?q=${val}`, '_blank')

        // @ts-ignore
        input.value = ''
    })
}