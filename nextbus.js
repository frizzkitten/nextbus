const axios = require("axios");

try {
  get_time_until_bus();
} catch (error) {
  console.log(error);
}

function get_time_until_bus() {
  // extract the needed info
  const [route, stop, direction] = get_user_input();
  console.log("route:", route);
}

// returns the first three user arguments
function get_user_input() {
  console.log("process.argv: ", process.argv);
  // get the command line arguments
  const command_line_args = process.argv.slice(2);
  // ensure there are three of them - bus route, stop name, and direction
  if (command_line_args.length < 3)
    throw `Not enough arguments. Usage: node nextbus.js "BUS ROUTE" "BUS STOP NAME" "DIRECTION"`;

  return command_line_args.slice(0, 3);
}

// axios
//   .get("https://svc.metrotransit.org/NexTrip/Providers")
//   .then(response => {
//     console.log("response.data: ", response.data);
//   })
//   .catch(error => {
//     console.log("error: ", error);
//   });

module.exports = {
  get_time_until_bus,
  get_user_input
};
