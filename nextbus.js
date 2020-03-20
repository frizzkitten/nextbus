const axios = require("axios");

axios
  .get("https://svc.metrotransit.org/NexTrip/Providers")
  .then(response => {
    console.log("response.data: ", response.data);
  })
  .catch(error => {
    console.log("error: ", error);
  });
