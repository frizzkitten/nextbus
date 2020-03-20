const axios = require("axios");

// get and then print the number of minutes until the next bus
get_time_until_bus()
    .then(minutes => {
        console.log(`${minutes} Minutes`);
    })
    .catch(error => {
        console.log(error);
    });

async function get_time_until_bus() {
    return new Promise(async (resolve, reject) => {
        // extract the info given by the user
        try {
            var [route, stop, direction] = get_user_input();
        } catch (error) {
            return reject(error);
        }

        // get the route number of the wanted route
        try {
            var route_number = await get_route_number(route);
        } catch (error) {
            console.log("error: ", error);
            return reject("Invalid route name.");
        }

        console.log("route_number: ", route_number);

        // TODO: get the stop id (value)

        // TODO: get the departures leaving from that stop

        // TODO: get the amount of time until the next departure
    });
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

// takes in the name of a route and returns its id
async function get_route_number(route_string) {
    return new Promise(async (resolve, reject) => {
        // get a list of all the routes
        try {
            const response = await axios.get(
                "http://svc.metrotransit.org/NexTrip/Routes"
            );
            var routes = response.data;
        } catch (error) {
            return reject(error);
        }

        // find the route with the given name
        const route_string_lowercase = route_string.toLowerCase();
        const route = routes.find(route =>
            route.Description.toLowerCase().includes(route_string_lowercase)
        );

        // ensure the route and route number exist
        if (!route || !route.Route) return reject("That route does not exist.");

        // return the route number
        return resolve(route.Route);
    });
}

// TODO: takes in a bus departure object and returns the amount of time
// before that bus leaves
function get_minutes_remaining() {
    return 0;
}

// axios
//   .get("http://svc.metrotransit.org/NexTrip/903/4/CGTR")
//   .then(response => {
//     console.log("response.data: ", response.data);
//     const departures = response.data;
//     departures.forEach(d => {
//       // get the timestamp in milliseconds for when the bus leaves
//       const millis = parseInt(d.DepartureTime.substring(6, 19), 10);
//       // get the number of milliseconds until the bus leaves
//       const now = new Date();
//       const remaining_millis = millis - now.getTime();
//
//       // return the number of milliseconds left converted into minutes
//       console.log("minutes left: ", remaining_millis / 60000);
//
//       console.log("");
//     });
//   })
//   .catch(error => {
//     console.log("error: ", error);
//   });

module.exports = {
    get_time_until_bus,
    get_user_input
};
