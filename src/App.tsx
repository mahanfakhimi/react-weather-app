import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useState } from "react";
import { MapPin, Search } from "react-feather";

const API_URL = "https://api.openweathermap.org/data/2.5";
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

type ApiRes = {
  name: string;
  sys: { country: string };
  dt: number;
  weather: [{ description: string }];
  main: { temp: number };
};

type DisplayData = {
  name: string;
  country: string;
  description: string;
  temp: number;
  location: string;
  date: string;
  weekday: string;
};

type WeatherFormProps = {
  setDisplayData: Dispatch<SetStateAction<DisplayData | null>>;
};

const WeatherForm = ({ setDisplayData }: WeatherFormProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!inputValue) return;

    try {
      const response = await fetch(
        `${API_URL}/weather?q=${inputValue}&units=metric&appid=${API_KEY}`
      );

      const data: ApiRes = await response.json();

      const {
        name,
        dt,
        main: { temp },
        sys: { country },
        weather: [{ description }],
      } = data;

      const date = new Date(dt * 1000);

      const formattedDate = date.toLocaleString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      const weekday = date.toLocaleString("en-US", { weekday: "long" });

      const location = `${country}, ${name}`;

      const weatherData = {
        name,
        country,
        description,
        temp,
        location,
        date: formattedDate,
        weekday,
      };

      document.body.style.backgroundImage = `url('${`https://picsum.photos/1600/900?random=${name}`}')`;

      setDisplayData(weatherData);
      setInputValue("");
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Search..." value={inputValue} onChange={handleChange} />

      <button type="submit">
        <Search />
      </button>
    </form>
  );
};

const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const WeatherDisplay = ({ displayData }: { displayData: DisplayData }) => (
  <div className="weather-display">
    <div className="weather-gradient"></div>
    <div className="date-container">
      <h2>{displayData.weekday}</h2>
      <p>{displayData.date}</p>
      <div className="location-container">
        <MapPin />
        <p>{displayData.location}</p>
      </div>
    </div>
    <div className="weather-info-container">
      <h1>{displayData.temp}°C</h1>
      <h3>{capitalizeFirstLetter(displayData.description)} </h3>
    </div>
  </div>
);

const App = () => {
  const [displayData, setDisplayData] = useState<DisplayData | null>(null);

  return (
    <div className="container">
      <WeatherForm setDisplayData={setDisplayData} />
      {displayData && <WeatherDisplay displayData={displayData} />}
    </div>
  );
};

export default App;
