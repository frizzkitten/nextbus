// require and set up testing libraries
let chai = require("chai");
const chai_as_promised = require("chai-as-promised");
chai.use(chai_as_promised);
const { expect } = chai;

const {
    get_time_until_bus,
    get_user_input,
    get_direction_number,
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

    it("should throw an error with an invalid direction", () => {
        const prev_process_argv = [...process.argv];

        process.argv = [...DEFAULT_ARGV, "route", "stop", "BAD"];
        expect(get_user_input).to.throw(
            `Invalid direction. Should be "north" "east" "south" or "west"`
        );

        // cleanup
        process.argv = prev_process_argv;
    });

    it("should return three user args if there are three or more args", () => {
        const prev_process_argv = [...process.argv];

        // 3 user args
        process.argv = [...DEFAULT_ARGV, "route", "stop", "southbound"];
        expect(get_user_input()).to.include.ordered.members([
            "route",
            "stop",
            1
        ]);

        // 4 user args
        process.argv.push("additional arg");
        expect(get_user_input())
            .to.include.ordered.members(["route", "stop", 1])
            .and.to.have.lengthOf(3);

        // cleanup
        process.argv = prev_process_argv;
    });
});

describe("get_direction_number", () => {
    it("should return undefined for non-directions and undefined", () => {
        expect(get_direction_number()).to.be.an("undefined");
        expect(get_direction_number("not-a-direction")).to.be.an("undefined");
    });

    it("should work for `${direction}` and `${direction}bound`, lower and uppercase", () => {
        expect(get_direction_number("north")).to.be.equal(4);
        expect(get_direction_number("nOrTH")).to.be.equal(4);
        expect(get_direction_number("northbound")).to.be.equal(4);
        expect(get_direction_number("northBOUND")).to.be.equal(4);
    });

    it("should return the correct numbers for each direction", () => {
        expect(get_direction_number("north")).to.be.equal(4);
        expect(get_direction_number("west")).to.be.equal(3);
        expect(get_direction_number("east")).to.be.equal(2);
        expect(get_direction_number("south")).to.be.equal(1);
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
