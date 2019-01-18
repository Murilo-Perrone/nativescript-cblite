var Cblite = require("nativescript-cblite").Cblite;
var cblite = new Cblite();

describe("greet function", function() {
    it("exists", function() {
        expect(cblite.greet).toBeDefined();
    });

    it("returns a string", function() {
        expect(cblite.greet()).toEqual("Hello, NS");
    });
});