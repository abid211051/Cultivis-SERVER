import { Hono } from "hono";
import data from "./mock.json";
const weather = new Hono();

weather.get("/currentweather", async (c) => {
  try {
    // const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=23.0257246&lon=91.3782869&appid=${process.env.APP_ID}&units=metric`);
    // const data = await res.json();
    return c.json(data.currentWeatherData);
  } catch (error) {
    console.log(error);
  }
});

weather.get("/hourlyforecast", async (c) => {
  try {
    let fivehourlydata = [];
    let currentHour = new Date().getHours();
    let flag = false;
    // const res = await fetch(`https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=23.0128&lon=91.3965&cnt=48&appid=${process.env.APP_ID}&units=metric`);
    // const data = await res.json();
    for (const element of data?.hourlyWeatherData?.list) {
      const dt_hour = new Date(`${element.dt_txt}`).getHours();
      if (flag && fivehourlydata.length < 6) {
        fivehourlydata.push({
          dt: dt_hour + ":00",
          icon: element?.weather?.[0].icon,
          precipitation: Math.round(parseFloat(element?.pop) * 100),
          temperature: Math.round(parseFloat(element?.main?.temp)),
        });
      } else if (currentHour === dt_hour) {
        flag = true;
        fivehourlydata.push({
          dt: "Now",
          icon: element?.weather?.[0].icon,
          precipitation: Math.round(parseFloat(element?.pop) * 100),
          temperature: Math.round(parseFloat(element?.main?.temp)),
        });
      }
      if (fivehourlydata.length === 5) {
        break;
      }
    }

    return c.json(fivehourlydata);
  } catch (error) {
    console.log(error);
  }
});

weather.get("/dailyforecast", async (c) => {
  try {
    const currentday = new Date().toDateString();
    let fivedaydata = [];
    let flag = false;

    // const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast/daily?lat=23.0128&lon=91.3965&cnt=5&appid=${process.env.APP_ID}&units=metric`);
    // const data = await res.json();
    for (const element of data?.dailyWeatherData?.list) {
      const dataInData = new Date(parseInt(element.dt) * 1000).toDateString();
      const dt_day = dataInData.split(" ");
      if (flag && fivedaydata.length < 6) {
        fivedaydata.push({
          dt: dt_day[0] + " " + dt_day[2],
          icon: element?.weather?.[0].icon,
          precipitation: Math.round(parseFloat(element?.pop) * 100),
          temperature:
            Math.round(parseFloat(element?.temp.max)) +
            "/" +
            Math.round(parseFloat(element?.temp.min)),
        });
      } else if (currentday === dataInData) {
        flag = true;
        fivedaydata.push({
          dt: "Today",
          icon: element?.weather?.[0].icon,
          precipitation: Math.round(parseFloat(element?.pop) * 100),
          temperature:
            Math.round(parseFloat(element?.temp.max)) +
            "/" +
            Math.round(parseFloat(element?.temp.min)),
        });
      }
      if (fivedaydata.length === 5) {
        break;
      }
    }
    return c.json(fivedaydata);
  } catch (error) {
    console.log(error);
  }
});
export default weather;
