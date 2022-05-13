// index.js
import Mustache from "mustache";
import fs from "fs";
import fetch from "node-fetch";
import dotenv from "dotenv";
const MUSTACHE_MAIN_DIR = "./main.mustache";
/**
 * DATA is the object that contains all
 * the data to be provided to Mustache
 * Notice the "name" and "date" property.
 */

/*
<p><a href="">🌱 I’m currently learning:   <strong><span color="black" font-size="18px" > >  > GSAP </span></strong></p>*/
dotenv.config();

let DATA = {
	name: "Murad Muqbel",
	city: "Berlin",
	refresh_date: new Date().toLocaleDateString("en-GB", {
		weekday: "long",
		month: "long",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
		timeZoneName: "short",
		timeZone: "Europe/Stockholm",
	}),
};

console.log(process.env.OPEN_WEATHER_MAP_KEY);
async function setWeatherInformation() {
	await fetch(
		`https://api.openweathermap.org/data/2.5/weather?q=Berlin&appid=${process.env.OPEN_WEATHER_MAP_KEY}&units=metric`
	)
		.then((r) => r.json())
		.then((r) => {
			console.log(r);
			DATA.city_temperature = Math.round(r.main.temp);
			DATA.city_weather = r.weather[0].description;
			DATA.city_weather_icon = r.weather[0].icon;
			DATA.sun_rise = new Date(r.sys.sunrise * 1000).toLocaleString("en-GB", {
				hour: "2-digit",
				minute: "2-digit",
				timeZone: "Europe/Berlin",
			});
			DATA.sun_set = new Date(r.sys.sunset * 1000).toLocaleString("en-GB", {
				hour: "2-digit",
				minute: "2-digit",
				timeZone: "Europe/Berlin",
			});
		});
}
/**
 * A - We open 'main.mustache'
 * B - We ask Mustache to render our file with the data
 * C - We create a README.md file with the generated output
 */
function generateReadMe() {
	fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
		if (err) throw err;
		const output = Mustache.render(data.toString(), DATA);
		fs.writeFileSync("README.md", output);
	});
}

async function action() {
	/**
	 * Fetch Weather
	 */
	await setWeatherInformation();

	/**
	 * Generate README
	 */
	await generateReadMe();
}

action();
