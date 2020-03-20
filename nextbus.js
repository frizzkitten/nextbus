const axios = require("axios");

// try {
//   get_time_until_bus();
// } catch (error) {
//   console.log(error);
// }

async function get_time_until_bus() {
  // extract the needed info
  const [route, stop, direction] = get_user_input();
  console.log("route:", route);

  // TODO: get the route id of the wanted route
  try {
    const route_id = get_route_id(route);
  } catch (error) {
    console.log("error: ", error);
    throw "Invalid route name.";
  }

  // TODO: get the stop id (value)

  // TODO: get the departures leaving from that stop

  // TODO: get the amount of time until the next departure
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

// TODO: takes in the name of a route and returns its id
function get_route_id(route_string) {
  return 0;
}

// TODO: takes in a bus departure object and returns the amount of time
// before that bus leaves
function get_minutes_remaining() {
  return 0;
}

axios
  .get("http://svc.metrotransit.org/NexTrip/903/4/CGTR")
  .then(response => {
    console.log("response.data: ", response.data);
    const departures = response.data;
    departures.forEach(d => {
      // get the timestamp in milliseconds for when the bus leaves
      const millis = parseInt(d.DepartureTime.substring(6, 19), 10);
      // get the number of milliseconds until the bus leaves
      const now = new Date();
      const remaining_millis = millis - now.getTime();

      // return the number of milliseconds left converted into minutes
      console.log("minutes left: ", remaining_millis / 60000);

      console.log("");
    });
  })
  .catch(error => {
    console.log("error: ", error);
  });

module.exports = {
  get_time_until_bus,
  get_user_input
};
