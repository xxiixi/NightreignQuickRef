"use client";
import {
  require_react
} from "./chunk-32EALFBN.js";
import {
  __toESM
} from "./chunk-G3PMV62Z.js";

// node_modules/vercount-react/dist/index.js
var import_react = __toESM(require_react());
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _async_to_generator(fn) {
  return function() {
    var self = this, args = arguments;
    return new Promise(function(resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(void 0);
    });
  };
}
function _ts_generator(thisArg, body) {
  var f, y, t, g, _ = {
    label: 0,
    sent: function() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  };
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
    return this;
  }), g;
  function verb(n) {
    return function(v) {
      return step([
        n,
        v
      ]);
    };
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [
        op[0] & 2,
        t.value
      ];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };
        case 5:
          _.label++;
          y = op[1];
          op = [
            0
          ];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }
          if (t && _.label < t[2]) {
            _.label = t[2];
            _.ops.push(op);
            break;
          }
          if (t[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e) {
      op = [
        6,
        e
      ];
      y = 0;
    } finally {
      f = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
}
var useVercount = function() {
  var _useState = (0, import_react.useState)({
    sitePv: "0",
    pagePv: "0",
    siteUv: "0"
  }), visitorData = _useState[0], setVisitorData = _useState[1];
  var hasFired = (0, import_react.useRef)(false);
  var getBaseUrl = function() {
    return "https://events.vercount.one";
  };
  var generateBrowserToken = function() {
    var screenInfo = window.screen.width + "x" + window.screen.height + "x" + window.screen.colorDepth;
    var timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    var languages = navigator.languages ? navigator.languages.join(",") : navigator.language || "";
    var canvas = document.createElement("canvas");
    var gl = canvas.getContext("webgl");
    var glInfo = gl ? gl.getParameter(gl.RENDERER) : "";
    var components = [
      screenInfo,
      timeZone,
      languages,
      navigator.userAgent,
      glInfo,
      (/* @__PURE__ */ new Date()).getTimezoneOffset()
    ].join("|");
    var hash = 0;
    for (var i = 0; i < components.length; i++) {
      hash = (hash << 5) - hash + components.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  };
  var fetchVisitorCount = _async_to_generator(function() {
    var baseUrl, apiUrl, browserToken, response, responseData, _responseData_data, site_pv, page_pv, site_uv, newData, corsError, fallbackResponse, responseData1, _responseData_data1, site_pv1, page_pv1, site_uv1, newData1, error, cachedData, parsedData;
    return _ts_generator(this, function(_state) {
      switch (_state.label) {
        case 0:
          baseUrl = getBaseUrl();
          apiUrl = "" + baseUrl + "/api/v2/log";
          browserToken = generateBrowserToken();
          _state.label = 1;
        case 1:
          _state.trys.push([
            1,
            9,
            ,
            10
          ]);
          _state.label = 2;
        case 2:
          _state.trys.push([
            2,
            5,
            ,
            8
          ]);
          return [
            4,
            fetch(apiUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Browser-Token": browserToken
              },
              body: JSON.stringify({
                url: window.location.href,
                token: browserToken,
                version: "v2"
                // Add version parameter for v2 API
              })
            })
          ];
        case 3:
          response = _state.sent();
          return [
            4,
            response.json()
          ];
        case 4:
          responseData = _state.sent();
          if (responseData.status === "success" && responseData.data) {
            _responseData_data = responseData.data, site_pv = _responseData_data.site_pv, page_pv = _responseData_data.page_pv, site_uv = _responseData_data.site_uv;
            newData = {
              sitePv: site_pv.toString(),
              pagePv: page_pv.toString(),
              siteUv: site_uv.toString()
            };
            setVisitorData(newData);
            localStorage.setItem("visitorCountData", JSON.stringify(newData));
          } else {
            console.warn("API returned error:", responseData.message);
            throw new Error(responseData.message || "API error");
          }
          return [
            3,
            8
          ];
        case 5:
          corsError = _state.sent();
          console.warn("CORS error with token header, retrying without custom header:", corsError);
          return [
            4,
            fetch(apiUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                url: window.location.href,
                token: browserToken,
                version: "v2"
                // Add version parameter for v2 API
              })
            })
          ];
        case 6:
          fallbackResponse = _state.sent();
          return [
            4,
            fallbackResponse.json()
          ];
        case 7:
          responseData1 = _state.sent();
          if (responseData1.status === "success" && responseData1.data) {
            _responseData_data1 = responseData1.data, site_pv1 = _responseData_data1.site_pv, page_pv1 = _responseData_data1.page_pv, site_uv1 = _responseData_data1.site_uv;
            newData1 = {
              sitePv: site_pv1.toString(),
              pagePv: page_pv1.toString(),
              siteUv: site_uv1.toString()
            };
            setVisitorData(newData1);
            localStorage.setItem("visitorCountData", JSON.stringify(newData1));
          } else {
            console.warn("API returned error:", responseData1.message);
            throw new Error(responseData1.message || "API error");
          }
          return [
            3,
            8
          ];
        case 8:
          return [
            3,
            10
          ];
        case 9:
          error = _state.sent();
          console.error("Error fetching visitor count:", error);
          cachedData = localStorage.getItem("visitorCountData");
          if (cachedData) {
            try {
              parsedData = JSON.parse(cachedData);
              setVisitorData(parsedData);
              console.log("Using cached visitor count data");
            } catch (cacheError) {
              console.error("Error parsing cached data:", cacheError);
            }
          }
          return [
            3,
            10
          ];
        case 10:
          return [
            2
          ];
      }
    });
  });
  (0, import_react.useEffect)(function() {
    if (hasFired.current) {
      return;
    }
    var storedData = localStorage.getItem("visitorCountData");
    if (storedData) {
      try {
        setVisitorData(JSON.parse(storedData));
      } catch (error) {
        console.error("Error parsing stored visitor data:", error);
      }
    }
    fetchVisitorCount();
    hasFired.current = true;
  }, []);
  return visitorData;
};
export {
  useVercount
};
//# sourceMappingURL=vercount-react.js.map
