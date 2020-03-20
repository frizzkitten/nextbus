const axios = require("axios");

const nextrip_url = "http://svc.metrotransit.org/NexTrip";

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
            return reject("Invalid route name.");
        }

        console.log("route_number: ", route_number);

        // get the stop id (value)
        try {
            var stop_id = await get_stop_id(route_number, stop, direction);
        } catch (error) {
            return reject("Invalid stop name.");
        }

        console.log("stop id: ", stop_id);

        // TODO: get the departures leaving from that stop

        // TODO: get the amount of time until the next departure
    });
}

// returns the first three user arguments
function get_user_input() {
    // get the command line arguments
    const command_line_args = process.argv.slice(2);
    // ensure there are three of them - bus route, stop name, and direction
    if (command_line_args.length < 3)
        throw `Not enough arguments. Usage: node nextbus.js "BUS ROUTE" "BUS STOP NAME" "DIRECTION"`;

    let [route, stop, direction] = command_line_args;

    // turn the direction into the number that the APIs will expect
    const direction_number = get_direction_number(direction);
    if (!direction_number)
        throw `Invalid direction. Should be "north" "east" "south" or "west"`;

    return [route, stop, direction_number];
}

// gets the number that the api uses to identify directions
function get_direction_number(direction) {
    if (!direction) return undefined;

    const d = direction.toLowerCase();

    switch (d) {
        case "north":
        case "northbound":
            return 4;
        case "west":
        case "westbound":
            return 3;
        case "east":
        case "eastbound":
            return 2;
        case "south":
        case "southbound":
            return 1;
        default:
            return undefined;
    }
}

// takes in the name of a route and returns its id
async function get_route_number(route_string) {
    return new Promise(async (resolve, reject) => {
        if (!route_string) return reject("No route given.");

        // get a list of all the routes
        try {
            const response = await axios.get(`${nextrip_url}/Routes`);
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

// takes route number and stop name and number direction and returns the stop id
async function get_stop_id(route_number, stop, direction) {
    return new Promise(async (resolve, reject) => {
        if (!route_number) return reject("No route given to get_stop_id.");
        if (!stop) return reject("No stop given to get_stop_id.");
        if (!direction) return reject("No direction given to get_stop_id.");

        // get a list of all the stops
        try {
            const response = await axios.get(
                `${nextrip_url}/Stops/${route_number}/${direction}`
            );
            var stops = response.data;
        } catch (error) {
            console.log("ERROR GETTING STOP ID: ", error);
            return reject(error);
        }

        // find the stop with the given name
        const stop_lowercase = stop.toLowerCase();
        const found_stop = stops.find(stop =>
            stop.Text.toLowerCase().includes(stop_lowercase)
        );

        // ensure the stop and stop value exist
        if (!found_stop || !found_stop.Value)
            return reject("That stop does not exist.");

        // return the stop value
        return resolve(found_stop.Value);
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
    get_user_input,
    get_direction_number,
    get_route_number
};
