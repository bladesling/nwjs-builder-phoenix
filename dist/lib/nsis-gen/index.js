"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var Debug = require("debug");
var path_1 = require("path");
__export(require("./NsisComposer"));
__export(require("./NsisDiffer"));
__export(require("./Nsis7Zipper"));
var debug = Debug('nwjs-builder-phoenix:nsis-gen:downloader');
var DIR_ASSETS = path_1.resolve(path_1.dirname(module.filename), '../../../assets/');
var DIR_NSIS = path_1.resolve(DIR_ASSETS, 'nsis');
function nsisBuild(cwd, script, options) {
    if (options === void 0) { options = {
        mute: false,
    }; }
    return __awaiter(this, void 0, void 0, function () {
        var args, child;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    args = [path_1.win32.normalize(path_1.resolve(DIR_NSIS, 'makensis.exe')), '/NOCD', '/INPUTCHARSET', 'UTF8', path_1.win32.normalize(path_1.resolve(script))];
                    debug("spawning command " + args.join(' ') + " with cwd " + cwd);
                    if (process.platform != 'win32') {
                        args.unshift('wine');
                    }
                    child = child_process_1.spawn(args.shift(), args, {
                        cwd: cwd,
                    });
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            child.on('error', reject);
                            child.on('close', function (code, signal) {
                                if (code != 0) {
                                    return reject(new Error("ERROR_EXIT_CODE code = " + code));
                                }
                                resolve({ code: code, signal: signal });
                            });
                            if (!options.mute) {
                                child.stdout.pipe(process.stdout);
                                child.stderr.pipe(process.stderr);
                            }
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.nsisBuild = nsisBuild;
//# sourceMappingURL=index.js.map