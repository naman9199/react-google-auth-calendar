const router = require("express").Router();
const { google } = require("googleapis");

const GOOGLE_CLIENT_ID = "*****.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "GOOGLE_CLIENT_SECRET";

// const REFRESH_TOKEN =
//   "1//0gAFcMhRywkB5CgYIARAAGBASNwF-L9IrpsjpZ5ppIi7WKRA2U901ZvigJQe4rouh82iqVJpzFbjp52kK740VrLYgqmy0gJ_Wli0";

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  "http://localhost:3000"
);

router.get("/", async (req, res, next) => {
  res.send({ message: "Ok api is working 🚀" });
});

router.post("/create-tokens", async (req, res, next) => {
  try {
    const token = await oauth2Client.getToken(req.body.code);
    res.send(token);
  } catch (error) {
    next(error);
  }
});

router.post("/create-event", async (req, res, next) => {
  try {
    const {
      summary,
      description,
      location,
      startDateTime,
      endDateTime,
      refresh_token,
    } = req.body;

    oauth2Client.setCredentials({ refresh_token: refresh_token });
    const calendar = google.calendar("v3");
    const cal_response = await calendar.events.insert({
      auth: oauth2Client,
      calendarId: "primary",
      requestBody: {
        summary,
        description,
        location,
        colorId: "6",
        start: {
          dateTime: new Date(startDateTime),
        },
        end: {
          dateTime: new Date(endDateTime),
        },
      },
    });
    res.send(cal_response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
