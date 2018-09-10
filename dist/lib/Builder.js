"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
var Bluebird = require("bluebird");
var fs_extra_1 = require("fs-extra");
var path_1 = require("path");
var semver = require("semver");
var common_1 = require("./common");
var config_1 = require("./config");
var Downloader_1 = require("./Downloader");
var FFmpegDownloader_1 = require("./FFmpegDownloader");
var nsis_gen_1 = require("./nsis-gen");
var SignableNsisInstaller_1 = require("./nsis-gen/SignableNsisInstaller");
var util_1 = require("./util");
var debug = require('debug')('build:builder');
var globby = require('globby');
var rcedit = require('rcedit');
var plist = require('plist');
var Builder = /** @class */ (function () {
    function Builder(options, dir) {
        if (options === void 0) { options = {}; }
        this.dir = dir;
        this.options = util_1.mergeOptions(Builder.DEFAULT_OPTIONS, options);
        debug('in constructor', 'dir', dir);
        debug('in constructor', 'options', this.options);
    }
    Builder.prototype.build = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var tasks, _i, _a, task, _b, platform, arch, pkg, config, _c, tasks_1, _d, platform, arch, started, err_1;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        tasks = [];
                        ['win', 'mac', 'linux'].map(function (platform) {
                            ['x86', 'x64'].map(function (arch) {
                                if (_this.options[platform] && _this.options[arch]) {
                                    tasks.push([platform, arch]);
                                }
                            });
                        });
                        for (_i = 0, _a = this.options.tasks; _i < _a.length; _i++) {
                            task = _a[_i];
                            _b = task.split('-'), platform = _b[0], arch = _b[1];
                            if (['win', 'mac', 'linux'].indexOf(platform) >= 0) {
                                if (['x86', 'x64'].indexOf(arch) >= 0) {
                                    tasks.push([platform, arch]);
                                }
                            }
                        }
                        if (!this.options.mute) {
                            console.info('Starting building tasks...', {
                                tasks: tasks,
                                concurrent: this.options.concurrent,
                            });
                        }
                        if (tasks.length == 0) {
                            throw new Error('ERROR_NO_TASK');
                        }
                        if (!this.options.concurrent) return [3 /*break*/, 2];
                        return [4 /*yield*/, Bluebird.map(tasks, function (_a) {
                                var platform = _a[0], arch = _a[1];
                                return __awaiter(_this, void 0, void 0, function () {
                                    var options, builder, started;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                options = {};
                                                options[platform] = true;
                                                options[arch] = true;
                                                options.mirror = this.options.mirror;
                                                options.concurrent = false;
                                                options.mute = true;
                                                builder = new Builder(options, this.dir);
                                                started = Date.now();
                                                if (!this.options.mute) {
                                                    console.info("Building for " + platform + ", " + arch + " starts...");
                                                }
                                                return [4 /*yield*/, builder.build()];
                                            case 1:
                                                _a.sent();
                                                if (!this.options.mute) {
                                                    console.info("Building for " + platform + ", " + arch + " ends within " + this.getTimeDiff(started) + "s.");
                                                }
                                                return [2 /*return*/];
                                        }
                                    });
                                });
                            })];
                    case 1:
                        _e.sent();
                        return [3 /*break*/, 10];
                    case 2: return [4 /*yield*/, fs_extra_1.readJson(path_1.resolve(this.dir, this.options.chromeApp ? 'manifest.json' : 'package.json'))];
                    case 3:
                        pkg = _e.sent();
                        config = new config_1.BuildConfig(pkg);
                        debug('in build', 'config', config);
                        _c = 0, tasks_1 = tasks;
                        _e.label = 4;
                    case 4:
                        if (!(_c < tasks_1.length)) return [3 /*break*/, 10];
                        _d = tasks_1[_c], platform = _d[0], arch = _d[1];
                        started = Date.now();
                        if (!this.options.mute) {
                            console.info("Building for " + platform + ", " + arch + " starts...");
                        }
                        _e.label = 5;
                    case 5:
                        _e.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, this.buildTask(platform, arch, pkg, config)];
                    case 6:
                        _e.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        err_1 = _e.sent();
                        console.warn(err_1);
                        return [3 /*break*/, 8];
                    case 8:
                        if (!this.options.mute) {
                            console.info("Building for " + platform + ", " + arch + " ends within " + this.getTimeDiff(started) + "s.");
                        }
                        _e.label = 9;
                    case 9:
                        _c++;
                        return [3 /*break*/, 4];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    Builder.prototype.getTimeDiff = function (started) {
        return ((Date.now() - started) / 1000).toFixed(2);
    };
    Builder.prototype.writeStrippedManifest = function (path, pkg, config) {
        return __awaiter(this, void 0, void 0, function () {
            var json, key;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        json = {};
                        for (key in pkg) {
                            if (pkg.hasOwnProperty(key) && config.strippedProperties.indexOf(key) === -1) {
                                json[key] = pkg[key];
                            }
                        }
                        return [4 /*yield*/, fs_extra_1.writeFile(path, JSON.stringify(json))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Builder.prototype.parseOutputPattern = function (pattern, options, pkg, config) {
        return pattern.replace(/\$\{\s*(\w+)\s*\}/g, function (match, key) {
            switch (key.toLowerCase()) {
                case 'name':
                    return options.name;
                case 'version':
                    return options.version;
                case 'platform':
                    return options.platform;
                case 'arch':
                    return options.arch;
                default:
                    throw new Error('ERROR_KEY_UNKNOWN');
            }
        });
    };
    Builder.prototype.combineExecutable = function (executable, nwFile) {
        return new Promise(function (resolve, reject) {
            var nwStream = fs_extra_1.createReadStream(nwFile);
            var stream = fs_extra_1.createWriteStream(executable, {
                flags: 'a',
            });
            nwStream.on('error', reject);
            stream.on('error', reject);
            stream.on('finish', resolve);
            nwStream.pipe(stream);
        });
    };
    Builder.prototype.readPlist = function (path) {
        return fs_extra_1.readFile(path, {
            encoding: 'utf-8',
        })
            .then(function (data) { return plist.parse(data); });
    };
    Builder.prototype.writePlist = function (path, p) {
        return fs_extra_1.writeFile(path, plist.build(p));
    };
    Builder.prototype.updateWinResources = function (targetDir, appRoot, pkg, config) {
        var _this = this;
        var pathResolve = path_1.resolve;
        return new Promise(function (resolve, reject) {
            var path = pathResolve(targetDir, 'nw.exe');
            var rc = {
                'product-version': util_1.fixWindowsVersion(config.win.productVersion),
                'file-version': util_1.fixWindowsVersion(config.win.fileVersion),
                'version-string': __assign({ ProductName: config.win.productName, CompanyName: config.win.companyName, FileDescription: config.win.fileDescription, LegalCopyright: config.win.copyright }, config.win.versionStrings),
                'icon': config.win.icon ? pathResolve(_this.dir, config.win.icon) : undefined,
            };
            rcedit(path, rc, function (err) { return err ? reject(err) : resolve(); });
        });
    };
    Builder.prototype.renameWinApp = function (targetDir, appRoot, pkg, config) {
        var src = path_1.resolve(targetDir, 'nw.exe');
        var dest = path_1.resolve(targetDir, config.win.productName + ".exe");
        return fs_extra_1.rename(src, dest);
    };
    Builder.prototype.signApp = function (config, cwd, filesToSignGlobs, ignore, isWin) {
        if (filesToSignGlobs === void 0) { filesToSignGlobs = config.signing.filesToSignGlobs; }
        if (ignore === void 0) { ignore = []; }
        if (isWin === void 0) { isWin = true; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, signtoolPath, cliArgsInterpolated, resolvedSigntool_1, nodeGlobArgs, filesToSign, cliArgsArr, code, depthSortedFiles, promise, retValsArray, errs, uniqueErrs;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = config.signing, signtoolPath = _a.signtoolPath, cliArgsInterpolated = _a.cliArgsInterpolated;
                        if (!(signtoolPath && cliArgsInterpolated)) return [3 /*break*/, 10];
                        resolvedSigntool_1 = path_1.resolve(signtoolPath);
                        return [4 /*yield*/, util_1.fileExistsAsync(resolvedSigntool_1)];
                    case 1:
                        if (!((_b.sent()) && filesToSignGlobs)) return [3 /*break*/, 9];
                        nodeGlobArgs = { strict: false, cwd: cwd, ignore: ignore };
                        debug("signApp: about to use glob to search for files:", filesToSignGlobs, nodeGlobArgs);
                        return [4 /*yield*/, globby(filesToSignGlobs, nodeGlobArgs)];
                    case 2:
                        filesToSign = _b.sent();
                        if (!filesToSign) return [3 /*break*/, 7];
                        debug("signApp: found files to sign:", filesToSign);
                        if (!isWin) return [3 /*break*/, 4];
                        cliArgsArr = cliArgsInterpolated.concat(filesToSign);
                        debug("signWinApp: before signing, cliArgs will be", cliArgsArr);
                        return [4 /*yield*/, util_1.spawnAsync(resolvedSigntool_1, cliArgsArr, { cwd: cwd })];
                    case 3:
                        code = (_b.sent()).code;
                        if (code !== 0) {
                            throw new Error("ERROR_SIGNING args = " + cliArgsArr.join(' '));
                        }
                        return [3 /*break*/, 6];
                    case 4:
                        depthSortedFiles = util_1.sortByDepth(filesToSign);
                        debug("signApp: Mac - about to sign: ", depthSortedFiles, nodeGlobArgs, cliArgsInterpolated);
                        // noinspection TsLint
                        console.log("signApp: signing starts-----------------");
                        promise = Bluebird.mapSeries(depthSortedFiles, function (filePath) {
                            // noinspection TsLint
                            console.log("signApp: - " + filePath + " ...");
                            return util_1.spawnAsync(resolvedSigntool_1, cliArgsInterpolated.concat([filePath]), { cwd: cwd });
                        });
                        return [4 /*yield*/, promise];
                    case 5:
                        retValsArray = _b.sent();
                        errs = retValsArray.filter(function (_a) {
                            var code = _a.code;
                            return code !== 0;
                        }).map(function (_a) {
                            var code = _a.code, signal = _a.signal;
                            return "caught nonzero exit code: " + code + ": " + signal;
                        });
                        if (errs) {
                            uniqueErrs = errs.reduce(function (prev, cur) {
                                if (prev.indexOf(cur) === -1) {
                                    prev.push(cur);
                                }
                                return prev;
                            }, []);
                            // noinspection TsLint
                            console.log("SignApp: encountered " + uniqueErrs.length + " errors");
                            // noinspection TsLint
                            uniqueErrs.map(function (err) { return console.log("SignApp: err - " + err); });
                            // noinspection TsLint
                            console.log("SignApp: it's possible that if there is a single null error " +
                                "then this is a recoverable error.");
                            // noinspection TsLint
                            console.log("SignApp: run build with DEBUG=build* to see error details");
                        }
                        _b.label = 6;
                    case 6:
                        // noinspection TsLint
                        console.log("signApp: signing ends-----------------");
                        return [3 /*break*/, 8];
                    case 7:
                        debug("signWinApp: no files to sign matched " + filesToSignGlobs);
                        _b.label = 8;
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        debug("signWinApp: " + resolvedSigntool_1 + " does NOT exist");
                        _b.label = 10;
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    Builder.prototype.updatePlist = function (targetDir, appRoot, pkg, config) {
        return __awaiter(this, void 0, void 0, function () {
            var path, plist, key;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        path = path_1.resolve(targetDir, './nwjs.app/Contents/Info.plist');
                        return [4 /*yield*/, this.readPlist(path)];
                    case 1:
                        plist = _a.sent();
                        plist.CFBundleIdentifier = config.appId;
                        plist.CFBundleName = config.mac.name;
                        plist.CFBundleDisplayName = config.mac.displayName;
                        plist.CFBundleVersion = config.mac.version;
                        plist.CFBundleShortVersionString = config.mac.version;
                        for (key in config.mac.plistStrings) {
                            if (config.mac.plistStrings.hasOwnProperty(key)) {
                                plist[key] = config.mac.plistStrings[key];
                            }
                        }
                        return [4 /*yield*/, this.writePlist(path, plist)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Builder.prototype.updateMacIcon = function (targetDir, appRoot, pkg, config) {
        return __awaiter(this, void 0, void 0, function () {
            var path;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        path = path_1.resolve(targetDir, './nwjs.app/Contents/Resources/app.icns');
                        if (!config.mac.icon) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, fs_extra_1.copy(path_1.resolve(this.dir, config.mac.icon), path)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Builder.prototype.fixMacMeta = function (targetDir, appRoot, pkg, config) {
        return __awaiter(this, void 0, void 0, function () {
            var files, _i, files_1, file, path, data, encoding, strings, newStrings;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, globby(['**/InfoPlist.strings'], {
                            cwd: targetDir,
                        })];
                    case 1:
                        files = _a.sent();
                        _i = 0, files_1 = files;
                        _a.label = 2;
                    case 2:
                        if (!(_i < files_1.length)) return [3 /*break*/, 6];
                        file = files_1[_i];
                        path = path_1.resolve(targetDir, file);
                        return [4 /*yield*/, fs_extra_1.readFile(path)];
                    case 3:
                        data = _a.sent();
                        encoding = data.indexOf(Buffer.from('43004600', 'hex')) >= 0
                            ? 'ucs2' : 'utf-8';
                        strings = data.toString(encoding);
                        newStrings = strings.replace(/([A-Za-z]+)\s+=\s+"(.+?)";/g, function (match, key, value) {
                            switch (key) {
                                case 'CFBundleName':
                                    return key + " = \"" + config.mac.name + "\";";
                                case 'CFBundleDisplayName':
                                    return key + " = \"" + config.mac.displayName + "\";";
                                case 'CFBundleGetInfoString':
                                    return key + " = \"" + config.mac.version + "\";";
                                case 'NSContactsUsageDescription':
                                    return key + " = \"" + config.mac.description + "\";";
                                case 'NSHumanReadableCopyright':
                                    return key + " = \"" + config.mac.copyright + "\";";
                                default:
                                    return key + " = \"" + value + "\";";
                            }
                        });
                        return [4 /*yield*/, fs_extra_1.writeFile(path, Buffer.from(newStrings, encoding))];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 2];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Builder.prototype.renameMacApp = function (targetDir, appRoot, pkg, config) {
        var src = path_1.resolve(targetDir, 'nwjs.app');
        var dest = path_1.resolve(targetDir, config.mac.displayName + ".app");
        return fs_extra_1.rename(src, dest);
    };
    Builder.prototype.fixLinuxMode = function (targetDir, appRoot, pkg, config) {
        return __awaiter(this, void 0, void 0, function () {
            var path;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        path = path_1.resolve(targetDir, 'nw');
                        return [4 /*yield*/, fs_extra_1.chmod(path, 484)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Builder.prototype.renameLinuxApp = function (targetDir, appRoot, pkg, config) {
        var src = path_1.resolve(targetDir, 'nw');
        var dest = path_1.resolve(targetDir, "" + pkg.name);
        return fs_extra_1.rename(src, dest);
    };
    Builder.prototype.prepareWinBuild = function (targetDir, appRoot, pkg, config) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updateWinResources(targetDir, appRoot, pkg, config)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Builder.prototype.prepareMacBuild = function (targetDir, appRoot, pkg, config) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updatePlist(targetDir, appRoot, pkg, config)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.updateMacIcon(targetDir, appRoot, pkg, config)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.fixMacMeta(targetDir, appRoot, pkg, config)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Builder.prototype.prepareLinuxBuild = function (targetDir, appRoot, pkg, config) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fixLinuxMode(targetDir, appRoot, pkg, config)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Builder.prototype.copyFiles = function (platform, targetDir, appRoot, pkg, config) {
        return __awaiter(this, void 0, void 0, function () {
            var generalExcludes, dependenciesExcludes, ignore, files, _a, nwFile, tempDir, executable, _i, files_2, file, _b, files_3, file;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        generalExcludes = [
                            '**/node_modules/.bin',
                            '**/node_modules/*/{ example, examples, test, tests }',
                            '**/{ .DS_Store, .git, .hg, .svn, *.log }',
                        ];
                        return [4 /*yield*/, util_1.findExcludableDependencies(this.dir, pkg)
                                .then(function (excludable) {
                                return excludable.map(function (excludable) { return [excludable, excludable + "/**/*"]; });
                            })
                                .then(function (excludes) {
                                return Array.prototype.concat.apply([], excludes);
                            })];
                    case 1:
                        dependenciesExcludes = _c.sent();
                        debug('in copyFiles', 'dependenciesExcludes', dependenciesExcludes);
                        ignore = config.excludes.concat(generalExcludes, dependenciesExcludes, [config.output, config.output + "/**/*"]);
                        debug('in copyFiles', 'ignore', ignore);
                        return [4 /*yield*/, globby(config.files, {
                                cwd: this.dir,
                                // TODO: https://github.com/isaacs/node-glob#options, warn for cyclic links.
                                follow: true,
                                mark: true,
                                ignore: ignore,
                                // ignore EPERM issues with scandir in windows
                                // https://github.com/isaacs/node-glob/issues/284
                                strict: false
                            })];
                    case 2:
                        files = _c.sent();
                        debug('in copyFiles', 'config.files', config.files);
                        debug('in copyFiles', 'files', files);
                        if (!config.packed) return [3 /*break*/, 21];
                        _a = platform;
                        switch (_a) {
                            case 'win32': return [3 /*break*/, 3];
                            case 'win': return [3 /*break*/, 3];
                            case 'linux': return [3 /*break*/, 3];
                            case 'darwin': return [3 /*break*/, 13];
                            case 'osx': return [3 /*break*/, 13];
                            case 'mac': return [3 /*break*/, 13];
                        }
                        return [3 /*break*/, 19];
                    case 3: return [4 /*yield*/, util_1.tmpName({
                            postfix: '.zip',
                        })];
                    case 4:
                        nwFile = _c.sent();
                        return [4 /*yield*/, util_1.compress(this.dir, files.filter(function (file) { return !file.endsWith('/'); }), 'zip', nwFile)];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, util_1.tmpDir()];
                    case 6:
                        tempDir = (_c.sent()).path;
                        return [4 /*yield*/, this.writeStrippedManifest(path_1.resolve(tempDir, 'package.json'), pkg, config)];
                    case 7:
                        _c.sent();
                        return [4 /*yield*/, util_1.compress(tempDir, ['./package.json'], 'zip', nwFile)];
                    case 8:
                        _c.sent();
                        return [4 /*yield*/, fs_extra_1.remove(tempDir)];
                    case 9:
                        _c.sent();
                        return [4 /*yield*/, util_1.findExecutable(platform, targetDir)];
                    case 10:
                        executable = _c.sent();
                        return [4 /*yield*/, this.combineExecutable(executable, nwFile)];
                    case 11:
                        _c.sent();
                        return [4 /*yield*/, fs_extra_1.remove(nwFile)];
                    case 12:
                        _c.sent();
                        return [3 /*break*/, 20];
                    case 13:
                        _i = 0, files_2 = files;
                        _c.label = 14;
                    case 14:
                        if (!(_i < files_2.length)) return [3 /*break*/, 17];
                        file = files_2[_i];
                        return [4 /*yield*/, util_1.copyFileAsync(path_1.resolve(this.dir, file), path_1.resolve(appRoot, file))];
                    case 15:
                        _c.sent();
                        _c.label = 16;
                    case 16:
                        _i++;
                        return [3 /*break*/, 14];
                    case 17: return [4 /*yield*/, this.writeStrippedManifest(path_1.resolve(appRoot, 'package.json'), pkg, config)];
                    case 18:
                        _c.sent();
                        return [3 /*break*/, 20];
                    case 19: throw new Error('ERROR_UNKNOWN_PLATFORM');
                    case 20: return [3 /*break*/, 27];
                    case 21:
                        _b = 0, files_3 = files;
                        _c.label = 22;
                    case 22:
                        if (!(_b < files_3.length)) return [3 /*break*/, 25];
                        file = files_3[_b];
                        return [4 /*yield*/, util_1.copyFileAsync(path_1.resolve(this.dir, file), path_1.resolve(appRoot, file))];
                    case 23:
                        _c.sent();
                        _c.label = 24;
                    case 24:
                        _b++;
                        return [3 /*break*/, 22];
                    case 25: return [4 /*yield*/, this.writeStrippedManifest(path_1.resolve(appRoot, 'package.json'), pkg, config)];
                    case 26:
                        _c.sent();
                        _c.label = 27;
                    case 27: return [2 /*return*/];
                }
            });
        });
    };
    Builder.prototype.integrateFFmpeg = function (platform, arch, targetDir, pkg, config) {
        return __awaiter(this, void 0, void 0, function () {
            var downloader, ffmpegDir, src, dest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        downloader = new FFmpegDownloader_1.FFmpegDownloader({
                            platform: platform, arch: arch,
                            version: config.nwVersion,
                            useCaches: true,
                            showProgress: this.options.mute ? false : true,
                        });
                        if (!this.options.mute) {
                            console.info('Fetching FFmpeg prebuilt...', {
                                platform: downloader.options.platform,
                                arch: downloader.options.arch,
                                version: downloader.options.version,
                            });
                        }
                        return [4 /*yield*/, downloader.fetchAndExtract()];
                    case 1:
                        ffmpegDir = _a.sent();
                        return [4 /*yield*/, util_1.findFFmpeg(platform, ffmpegDir)];
                    case 2:
                        src = _a.sent();
                        return [4 /*yield*/, util_1.findFFmpeg(platform, targetDir)];
                    case 3:
                        dest = _a.sent();
                        return [4 /*yield*/, fs_extra_1.copy(src, dest)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Builder.prototype.buildNsisDiffUpdater = function (platform, arch, versionInfo, fromVersion, toVersion, pkg, config) {
        return __awaiter(this, void 0, void 0, function () {
            var diffNsis, fromDir, _a, _b, toDir, _c, _d, data, script;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        diffNsis = path_1.resolve(this.dir, config.output, pkg.name + "-" + toVersion + "-from-" + fromVersion + "-" + platform + "-" + arch + "-Update.exe");
                        _a = path_1.resolve;
                        _b = [this.dir, config.output];
                        return [4 /*yield*/, versionInfo.getVersion(fromVersion)];
                    case 1:
                        fromDir = _a.apply(void 0, _b.concat([(_e.sent()).source]));
                        _c = path_1.resolve;
                        _d = [this.dir, config.output];
                        return [4 /*yield*/, versionInfo.getVersion(toVersion)];
                    case 2:
                        toDir = _c.apply(void 0, _d.concat([(_e.sent()).source]));
                        return [4 /*yield*/, (new nsis_gen_1.NsisDiffer(fromDir, toDir, {
                                // Basic.
                                appName: config.win.productName,
                                companyName: config.win.companyName,
                                description: config.win.fileDescription,
                                version: util_1.fixWindowsVersion(config.win.productVersion),
                                copyright: config.win.copyright,
                                icon: config.nsis.icon ? path_1.resolve(this.dir, config.nsis.icon) : undefined,
                                unIcon: config.nsis.unIcon ? path_1.resolve(this.dir, config.nsis.unIcon) : undefined,
                                // Compression.
                                compression: 'lzma',
                                solid: true,
                                languages: config.nsis.languages,
                                installDirectory: config.nsis.installDirectory,
                                // Output.
                                output: diffNsis,
                            })).make()];
                    case 3:
                        data = _e.sent();
                        return [4 /*yield*/, util_1.tmpName()];
                    case 4:
                        script = _e.sent();
                        return [4 /*yield*/, fs_extra_1.writeFile(script, data)];
                    case 5:
                        _e.sent();
                        return [4 /*yield*/, nsis_gen_1.nsisBuild(toDir, script, {
                                mute: this.options.mute,
                            })];
                    case 6:
                        _e.sent();
                        return [4 /*yield*/, fs_extra_1.remove(script)];
                    case 7:
                        _e.sent();
                        return [4 /*yield*/, versionInfo.addUpdater(toVersion, fromVersion, arch, diffNsis)];
                    case 8:
                        _e.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Builder.prototype.buildDirTarget = function (platform, arch, runtimeDir, pkg, config) {
        return __awaiter(this, void 0, void 0, function () {
            var targetDir, runtimeRoot, appRoot, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        targetDir = path_1.resolve(this.dir, config.output, this.parseOutputPattern(config.outputPattern, {
                            name: pkg.name,
                            version: pkg.version,
                            platform: platform, arch: arch,
                        }, pkg, config));
                        return [4 /*yield*/, util_1.findRuntimeRoot(platform, runtimeDir)];
                    case 1:
                        runtimeRoot = _b.sent();
                        appRoot = path_1.resolve(targetDir, (function () {
                            switch (platform) {
                                case 'win32':
                                case 'win':
                                case 'linux':
                                    return './';
                                case 'darwin':
                                case 'osx':
                                case 'mac':
                                    return './nwjs.app/Contents/Resources/app.nw/';
                                default:
                                    throw new Error('ERROR_UNKNOWN_PLATFORM');
                            }
                        })());
                        return [4 /*yield*/, fs_extra_1.emptyDir(targetDir)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, fs_extra_1.copy(runtimeRoot, targetDir, {})];
                    case 3:
                        _b.sent();
                        if (!config.ffmpegIntegration) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.integrateFFmpeg(platform, arch, targetDir, pkg, config)];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5: return [4 /*yield*/, fs_extra_1.ensureDir(appRoot)];
                    case 6:
                        _b.sent();
                        _a = platform;
                        switch (_a) {
                            case 'win32': return [3 /*break*/, 7];
                            case 'win': return [3 /*break*/, 7];
                            case 'darwin': return [3 /*break*/, 11];
                            case 'osx': return [3 /*break*/, 11];
                            case 'mac': return [3 /*break*/, 11];
                            case 'linux': return [3 /*break*/, 16];
                        }
                        return [3 /*break*/, 20];
                    case 7: return [4 /*yield*/, this.prepareWinBuild(targetDir, appRoot, pkg, config)];
                    case 8:
                        _b.sent();
                        return [4 /*yield*/, this.copyFiles(platform, targetDir, appRoot, pkg, config)];
                    case 9:
                        _b.sent();
                        return [4 /*yield*/, this.renameWinApp(targetDir, appRoot, pkg, config)];
                    case 10:
                        _b.sent();
                        return [3 /*break*/, 21];
                    case 11: return [4 /*yield*/, this.prepareMacBuild(targetDir, appRoot, pkg, config)];
                    case 12:
                        _b.sent();
                        return [4 /*yield*/, this.copyFiles(platform, targetDir, appRoot, pkg, config)];
                    case 13:
                        _b.sent();
                        return [4 /*yield*/, this.renameMacApp(targetDir, appRoot, pkg, config)];
                    case 14:
                        _b.sent();
                        return [4 /*yield*/, this.signApp(config.mac, targetDir, config.mac.signing.filesToSignGlobs, [], false)];
                    case 15:
                        _b.sent();
                        return [3 /*break*/, 21];
                    case 16: return [4 /*yield*/, this.prepareLinuxBuild(targetDir, appRoot, pkg, config)];
                    case 17:
                        _b.sent();
                        return [4 /*yield*/, this.copyFiles(platform, targetDir, appRoot, pkg, config)];
                    case 18:
                        _b.sent();
                        return [4 /*yield*/, this.renameLinuxApp(targetDir, appRoot, pkg, config)];
                    case 19:
                        _b.sent();
                        return [3 /*break*/, 21];
                    case 20: throw new Error('ERROR_UNKNOWN_PLATFORM');
                    case 21: return [2 /*return*/, targetDir];
                }
            });
        });
    };
    Builder.prototype.buildArchiveTarget = function (type, sourceDir) {
        return __awaiter(this, void 0, void 0, function () {
            var targetArchive, files;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        targetArchive = path_1.resolve(path_1.dirname(sourceDir), path_1.basename(sourceDir) + "." + type);
                        return [4 /*yield*/, fs_extra_1.remove(targetArchive)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, globby(['**/*'], {
                                cwd: sourceDir,
                            })];
                    case 2:
                        files = _a.sent();
                        return [4 /*yield*/, util_1.compress(sourceDir, files, type, targetArchive)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, targetArchive];
                }
            });
        });
    };
    Builder.prototype.buildNsisTarget = function (platform, arch, sourceDir, pkg, config) {
        return __awaiter(this, void 0, void 0, function () {
            var installerNsisTarget, versionInfo, _i, _a, version;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (platform != 'win') {
                            if (!this.options.mute) {
                                console.info("Skip building nsis target for " + platform + ".");
                            }
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.buildNsisTargetSigned(sourceDir, config)];
                    case 1:
                        installerNsisTarget = _b.sent();
                        versionInfo = new common_1.NsisVersionInfo(path_1.resolve(this.dir, config.output, 'versions.nsis.json'));
                        return [4 /*yield*/, versionInfo.addVersion(pkg.version, '', sourceDir)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, versionInfo.addInstaller(pkg.version, arch, installerNsisTarget)];
                    case 3:
                        _b.sent();
                        if (!config.nsis.diffUpdaters) return [3 /*break*/, 8];
                        _i = 0;
                        return [4 /*yield*/, versionInfo.getVersions()];
                    case 4:
                        _a = _b.sent();
                        _b.label = 5;
                    case 5:
                        if (!(_i < _a.length)) return [3 /*break*/, 8];
                        version = _a[_i];
                        if (!semver.gt(pkg.version, version)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.buildNsisDiffUpdater(platform, arch, versionInfo, version, pkg.version, pkg, config)];
                    case 6:
                        _b.sent();
                        _b.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 5];
                    case 8: return [4 /*yield*/, versionInfo.save()];
                    case 9:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Builder.prototype.buildNsisTargetSigned = function (sourceDir, config, compressonType) {
        if (compressonType === void 0) { compressonType = ''; }
        return __awaiter(this, void 0, void 0, function () {
            var distDir, appname, installerFileName, installerNsisTarget, doSigning, nsisComposerOptions, installerComposer, uninstallerComposer, uninstallerGeneratorPath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        distDir = path_1.resolve(path_1.dirname(sourceDir));
                        appname = path_1.basename(sourceDir);
                        installerFileName = appname + "-Setup.exe";
                        installerNsisTarget = path_1.resolve(distDir, installerFileName);
                        doSigning = config.win.signing.signtoolPath && config.win.signing.cliArgsInterpolated;
                        nsisComposerOptions = {
                            // Basic.
                            appName: config.win.productName,
                            companyName: config.win.companyName,
                            copyright: config.win.copyright,
                            description: config.win.fileDescription,
                            version: util_1.fixWindowsVersion(config.win.productVersion),
                            icon: config.nsis.icon ? path_1.resolve(this.dir, config.nsis.icon) : undefined,
                            unIcon: config.nsis.unIcon ? path_1.resolve(this.dir, config.nsis.unIcon) : undefined,
                            // Compression.
                            compression: 'lzma',
                            solid: true,
                            languages: config.nsis.languages,
                            installDirectory: config.nsis.installDirectory,
                            output: installerNsisTarget,
                        };
                        installerComposer = new nsis_gen_1.NsisComposer(nsisComposerOptions);
                        if (!doSigning) return [3 /*break*/, 5];
                        uninstallerComposer = new SignableNsisInstaller_1.SignableNsisInstaller(true, __assign({}, nsisComposerOptions, { output: path_1.resolve(sourceDir, 'make-Uninstall.exe') }));
                        return [4 /*yield*/, this.doNsisBuild(sourceDir, uninstallerComposer, '-uninstaller-generator')];
                    case 1:
                        uninstallerGeneratorPath = _a.sent();
                        // generate the uninstaller by executing the generated fake installer
                        return [4 /*yield*/, util_1.spawnAsync(uninstallerGeneratorPath, [])];
                    case 2:
                        // generate the uninstaller by executing the generated fake installer
                        _a.sent();
                        // remove the uninstaller generator
                        return [4 /*yield*/, fs_extra_1.remove(uninstallerGeneratorPath)];
                    case 3:
                        // remove the uninstaller generator
                        _a.sent();
                        // sign the generated installer
                        debug('signApp: before signing installer contents including uninstaller');
                        return [4 /*yield*/, this.signApp(config.win, sourceDir, ['**/*.+(exe|dll)'], [
                                path_1.basename(uninstallerGeneratorPath),
                                uninstallerGeneratorPath.replace('\\\\', '\\')
                            ])];
                    case 4:
                        _a.sent();
                        installerComposer = new SignableNsisInstaller_1.SignableNsisInstaller(false, nsisComposerOptions);
                        _a.label = 5;
                    case 5: return [4 /*yield*/, this.doNsisBuild(sourceDir, installerComposer)];
                    case 6:
                        _a.sent();
                        if (!doSigning) return [3 /*break*/, 8];
                        debug('signApp: before signing installer');
                        return [4 /*yield*/, this.signApp(config.win, distDir, [installerFileName])];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8: return [2 /*return*/, installerNsisTarget];
                }
            });
        });
    };
    Builder.prototype.doNsisBuild = function (sourceDir, composer, nsisScriptSuffix) {
        if (nsisScriptSuffix === void 0) { nsisScriptSuffix = ''; }
        return __awaiter(this, void 0, void 0, function () {
            var distDir, scriptContents, scriptPath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        distDir = path_1.resolve(path_1.dirname(sourceDir));
                        return [4 /*yield*/, composer.make()];
                    case 1:
                        scriptContents = _a.sent();
                        scriptPath = path_1.resolve(distDir, "make-" + path_1.basename(sourceDir) + nsisScriptSuffix + ".nsi");
                        return [4 /*yield*/, fs_extra_1.outputFile(scriptPath, scriptContents)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, nsis_gen_1.nsisBuild(sourceDir, scriptPath, {
                                mute: this.options.mute,
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, path_1.resolve(composer.options.output)];
                }
            });
        });
    };
    Builder.prototype.buildNsis7zTarget = function (platform, arch, sourceDir, pkg, config) {
        return __awaiter(this, void 0, void 0, function () {
            var sourceArchive, versionInfo, targetNsis, data, script, _i, _a, version;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (platform != 'win') {
                            if (!this.options.mute) {
                                console.info("Skip building nsis7z target for " + platform + ".");
                            }
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.buildArchiveTarget('7z', sourceDir)];
                    case 1:
                        sourceArchive = _b.sent();
                        versionInfo = new common_1.NsisVersionInfo(path_1.resolve(this.dir, config.output, 'versions.nsis.json'));
                        targetNsis = path_1.resolve(path_1.dirname(sourceDir), path_1.basename(sourceDir) + "-Setup.exe");
                        return [4 /*yield*/, (new nsis_gen_1.Nsis7Zipper(sourceArchive, {
                                // Basic.
                                appName: config.win.productName,
                                companyName: config.win.companyName,
                                description: config.win.fileDescription,
                                version: util_1.fixWindowsVersion(config.win.productVersion),
                                copyright: config.win.copyright,
                                icon: config.nsis.icon ? path_1.resolve(this.dir, config.nsis.icon) : undefined,
                                unIcon: config.nsis.unIcon ? path_1.resolve(this.dir, config.nsis.unIcon) : undefined,
                                // Compression.
                                compression: 'lzma',
                                solid: true,
                                languages: config.nsis.languages,
                                installDirectory: config.nsis.installDirectory,
                                // Output.
                                output: targetNsis,
                            })).make()];
                    case 2:
                        data = _b.sent();
                        return [4 /*yield*/, util_1.tmpName()];
                    case 3:
                        script = _b.sent();
                        return [4 /*yield*/, fs_extra_1.writeFile(script, data)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, nsis_gen_1.nsisBuild(sourceDir, script, {
                                mute: this.options.mute,
                            })];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, fs_extra_1.remove(script)];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, versionInfo.addVersion(pkg.version, '', sourceDir)];
                    case 7:
                        _b.sent();
                        return [4 /*yield*/, versionInfo.addInstaller(pkg.version, arch, targetNsis)];
                    case 8:
                        _b.sent();
                        if (!config.nsis.diffUpdaters) return [3 /*break*/, 13];
                        _i = 0;
                        return [4 /*yield*/, versionInfo.getVersions()];
                    case 9:
                        _a = _b.sent();
                        _b.label = 10;
                    case 10:
                        if (!(_i < _a.length)) return [3 /*break*/, 13];
                        version = _a[_i];
                        if (!semver.gt(pkg.version, version)) return [3 /*break*/, 12];
                        return [4 /*yield*/, this.buildNsisDiffUpdater(platform, arch, versionInfo, version, pkg.version, pkg, config)];
                    case 11:
                        _b.sent();
                        _b.label = 12;
                    case 12:
                        _i++;
                        return [3 /*break*/, 10];
                    case 13: return [4 /*yield*/, versionInfo.save()];
                    case 14:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Builder.prototype.buildTask = function (platform, arch, pkg, config) {
        return __awaiter(this, void 0, void 0, function () {
            var downloader, runtimeDir, started, targetDir, _i, _a, target, started_1, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (platform === 'mac' && arch === 'x86' && !config.nwVersion.includes('0.12.3')) {
                            if (!this.options.mute) {
                                console.info("The NW.js binary for " + platform + ", " + arch + " isn't available for " + config.nwVersion + ", skipped.");
                            }
                            throw new Error('ERROR_TASK_MAC_X86_SKIPPED');
                        }
                        downloader = new Downloader_1.Downloader({
                            platform: platform, arch: arch,
                            version: config.nwVersion,
                            flavor: config.nwFlavor,
                            mirror: this.options.mirror,
                            useCaches: true,
                            showProgress: this.options.mute ? false : true,
                        });
                        if (!this.options.mute) {
                            console.info('Fetching NW.js binary...', {
                                platform: downloader.options.platform,
                                arch: downloader.options.arch,
                                version: downloader.options.version,
                                flavor: downloader.options.flavor,
                            });
                        }
                        return [4 /*yield*/, downloader.fetchAndExtract()];
                    case 1:
                        runtimeDir = _c.sent();
                        if (!this.options.mute) {
                            console.info('Building targets...');
                        }
                        started = Date.now();
                        if (!this.options.mute) {
                            console.info("Building directory target starts...");
                        }
                        return [4 /*yield*/, this.buildDirTarget(platform, arch, runtimeDir, pkg, config)];
                    case 2:
                        targetDir = _c.sent();
                        if (!this.options.mute) {
                            console.info("Building directory target ends within " + this.getTimeDiff(started) + "s.");
                        }
                        _i = 0, _a = config.targets;
                        _c.label = 3;
                    case 3:
                        if (!(_i < _a.length)) return [3 /*break*/, 12];
                        target = _a[_i];
                        started_1 = Date.now();
                        _b = target;
                        switch (_b) {
                            case 'zip': return [3 /*break*/, 4];
                            case '7z': return [3 /*break*/, 4];
                            case 'nsis': return [3 /*break*/, 6];
                            case 'nsis7z': return [3 /*break*/, 8];
                        }
                        return [3 /*break*/, 10];
                    case 4:
                        if (!this.options.mute) {
                            console.info("Building " + target + " archive target starts...");
                        }
                        return [4 /*yield*/, this.buildArchiveTarget(target, targetDir)];
                    case 5:
                        _c.sent();
                        if (!this.options.mute) {
                            console.info("Building " + target + " archive target ends within " + this.getTimeDiff(started_1) + "s.");
                        }
                        return [3 /*break*/, 11];
                    case 6:
                        if (!this.options.mute) {
                            console.info("Building nsis target starts...");
                        }
                        return [4 /*yield*/, this.buildNsisTarget(platform, arch, targetDir, pkg, config)];
                    case 7:
                        _c.sent();
                        if (!this.options.mute) {
                            console.info("Building nsis target ends within " + this.getTimeDiff(started_1) + "s.");
                        }
                        return [3 /*break*/, 11];
                    case 8:
                        if (!this.options.mute) {
                            console.info("Building nsis7z target starts...");
                        }
                        return [4 /*yield*/, this.buildNsis7zTarget(platform, arch, targetDir, pkg, config)];
                    case 9:
                        _c.sent();
                        if (!this.options.mute) {
                            console.info("Building nsis7z target ends within " + this.getTimeDiff(started_1) + "s.");
                        }
                        return [3 /*break*/, 11];
                    case 10: throw new Error('ERROR_UNKNOWN_TARGET');
                    case 11:
                        _i++;
                        return [3 /*break*/, 3];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    Builder.DEFAULT_OPTIONS = {
        win: false,
        mac: false,
        linux: false,
        x86: false,
        x64: false,
        tasks: [],
        chromeApp: false,
        mirror: Downloader_1.Downloader.DEFAULT_OPTIONS.mirror,
        concurrent: false,
        mute: true,
    };
    return Builder;
}());
exports.Builder = Builder;
//# sourceMappingURL=Builder.js.map