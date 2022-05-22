import "./App.css";
import { GoogleLogin } from "react-google-login";
import { gapi } from "gapi-script";
import axios from "axios";
import { useState } from "react";

function App() {
  gapi.load("client:auth2", () => {
    gapi.client.init({
      clientId: "*****.apps.googleusercontent.com",
      plugin_name: "chat",
    });
  });

  let REFRESH_TOKEN;

  if (localStorage.getItem("REFRESH_TOKEN")) {
    REFRESH_TOKEN = localStorage.getItem("REFRESH_TOKEN");
  }

  const [summary, setSummary] = useState("test");
  const [description, setDescription] = useState("hello");
  const [location, setLocation] = useState("bhopal");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cal_response = await axios.post("/api/create-event", {
      summary,
      description,
      location,
      startDateTime,
      endDateTime,
      refresh_token: REFRESH_TOKEN,
    });
    console.log("Response from calendar => ", cal_response);
  };

  async function responseGoogle(res) {
    if (res.code) {
      const response = await axios.post("/api/create-tokens", {
        code: res.code,
      });
      if (response.status == 200) {
        setIsSignedIn(true);
      }
      if (response.data.tokens.refresh_token) {
        localStorage.setItem(
          "REFRESH_TOKEN",
          response.data.tokens.refresh_token
        );
      }
      console.log(response.data.tokens);
    }
  }

  return (
    <div className="App">
      <h1>Hello</h1>
      {!isSignedIn ? (
        <GoogleLogin
          clientId="*****.apps.googleusercontent.com"
          buttonText="Login"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          responseType="code"
          accessType="offline"
          cookiePolicy={"single_host_origin"}
          scope="openid email profile https://www.googleapis.com/auth/calendar"
        />
      ) : (
        <div>
          <form onSubmit={handleSubmit}>
            <label htmlFor="summary">Summary</label>
            <br />
            <input
              type={"text"}
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
            <br />
            <label htmlFor="description">description</label>
            <br />
            <input
              type={"text"}
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <br />
            <label htmlFor="location">location</label>
            <br />
            <input
              type={"text"}
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <br />
            <label htmlFor="startDateTime">startDateTime</label>
            <br />
            <input
              type={"datetime-local"}
              id="startDateTime"
              value={startDateTime}
              onChange={(e) => setStartDateTime(e.target.value)}
            />
            <br />
            <label htmlFor="endDateTime">endDateTime</label>
            <br />
            <input
              type={"datetime-local"}
              id="endDateTime"
              value={endDateTime}
              onChange={(e) => setEndDateTime(e.target.value)}
            />
            <br />
            <button type="submit">Submit Data</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
