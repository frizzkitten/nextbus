// require and set up testing libraries
let chai = require("chai");
const chai_as_promised = require("chai-as-promised");
chai.use(chai_as_promised);
const { expect } = chai;

const {
    get_time_until_bus,
    get_user_input,
    get_route_number
} = require("../nextbus");

const DEFAULT_ARGV = [
    "/Users/username/.nvm/versions/node/v10.15.1/bin/node",
    "/Users/username/target/nextbus.js"
];

describe("get_user_input", () => {
    it("should throw an error if there are fewer than three args", () => {
        const NOT_ENOUGH_ARGS_ERROR = `Not enough arguments. Usage: node nextbus.js "BUS ROUTE" "BUS STOP NAME" "DIRECTION"`;
        const prev_process_argv = [...process.argv];

        // 0 user args
        process.argv = [...DEFAULT_ARGV];
        expect(get_user_input).to.throw(NOT_ENOUGH_ARGS_ERROR);

        // 1 user arg
        process.argv.push("route name");
        expect(get_user_input).to.throw(NOT_ENOUGH_ARGS_ERROR);

        // 2 user args
        process.argv.push("stop name");
        expect(get_user_input).to.throw(NOT_ENOUGH_ARGS_ERROR);

        // cleanup
        process.argv = prev_process_argv;
    });

    it("should return three user args if there are three or more args", () => {
        const prev_process_argv = [...process.argv];

        // 3 user args
        process.argv = [...DEFAULT_ARGV, "route", "stop", "direction"];
        expect(get_user_input()).to.include.ordered.members([
            "route",
            "stop",
            "direction"
        ]);

        // 4 user args
        process.argv.push("additional arg");
        expect(get_user_input())
            .to.include.ordered.members(["route", "stop", "direction"])
            .and.to.have.lengthOf(3);

        // cleanup
        process.argv = prev_process_argv;
    });
});

describe("get_route_number", () => {
    it("should throw an error if there is no route input", () => {
        return expect(get_route_number()).to.be.rejectedWith("No route given.");
    });

    it("should throw an error if the route does not exist", () => {
        return expect(get_route_number("Not a route")).to.be.rejectedWith(
            "That route does not exist."
        );
    });

    it("should return the correct route number given valid input", () => {
        return expect(get_route_number("METRO Blue Line")).to.eventually.equal(
            "901"
        );
    });
});
