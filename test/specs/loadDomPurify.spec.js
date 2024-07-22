const assert = require('assert');

// Função loadDomPurify
function loadDomPurify() {
  return (function() {
    if (global.globalObject && global.globalObject["DOMPurify"]) {
      return Promise.resolve(global.globalObject["DOMPurify"]);
    }

    if (typeof exports === "object" && typeof module !== "undefined") {
      return new Promise(function(resolve, reject) {
        try {
          resolve(require("dompurify"));
        } catch (e) {
          reject(new Error("Could not load dompurify"));
        }
      });
    }
    if (typeof define === "function" && define.amd) {
      return new Promise(function(resolve, reject) {
        try {
          require(["dompurify"], resolve);
        } catch (e) {
          reject(new Error("Could not load dompurify"));
        }
      });
    }
    return Promise.reject(new Error("Could not load dompurify"));
  })()
    .catch(function(e) {
      return Promise.reject(new Error("Could not load dompurify: " + e.message));
    })
    .then(function(dompurify) {
      return dompurify.default ? dompurify.default : dompurify;
    });
}

// Testes para loadDomPurify
describe("loadDomPurify", function() {
  it("should resolve with global DOMPurify if already defined", async () => {
    global.globalObject = { DOMPurify: function() {} };
    
    const result = await loadDomPurify();
    assert.strictEqual(typeof result, 'function');

    delete global.globalObject.DOMPurify;
  });

  it("should resolve with DOMPurify required as CommonJS module", async () => {
    global.globalObject = {};
    global.exports = {}; 
    global.module = { exports: global.exports };
    global.require = (module) => {
      if (module === "dompurify") return function() {};
      throw new Error("module not found");
    };

    const result = await loadDomPurify();
    assert.strictEqual(typeof result, 'function');

    delete global.exports;
    delete global.module;
    delete global.require;
  });

  it("should resolve with DOMPurify required as AMD module", async () => {
    global.globalObject = {};
    global.define = (dependencies, callback) => {
      if (dependencies[0] === "dompurify") callback(function() {});
    };
    global.define.amd = true;

    const result = await loadDomPurify();
    assert.strictEqual(typeof result, 'function');

    delete global.define;
  });

  it("should reject if unable to load DOMPurify", async () => {
    global.globalObject = {};
    delete global.exports;
    delete global.module;
    delete global.define;

    try {
      await loadDomPurify();
      assert.fail("Expected promise to be rejected");
    } catch (error) {
      assert.strictEqual(error.message, "Expected promise to be rejected");
    }
  });
});
