const axios = require("axios");

get_time_until_bus();

function get_time_until_bus() {
  // get the command line arguments
  const command_line_args = process.argv.slice(2);
  // ensure there are three of them - bus route, stop name, and direction
  if (command_line_args.length < 3)
    return console.log(
      `Not enough arguments. Usage: node nextbus.js "BUS ROUTE" "BUS STOP NAME" "DIRECTION"`
    );
  // extract the needed info
  const [route, stop, direction] = command_line_args;

  console.log("args:", command_line_args);
}

// axios
//   .get("https://svc.metrotransit.org/NexTrip/Providers")
//   .then(response => {
//     console.log("response.data: ", response.data);
//   })
//   .catch(error => {
//     console.log("error: ", error);
//   });
