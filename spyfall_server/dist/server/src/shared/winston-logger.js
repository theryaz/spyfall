"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_logger = __importStar(require("winston"));
const logform_1 = __importDefault(require("logform"));
const triple_beam_1 = __importDefault(require("triple-beam"));
const load_envs_1 = require("./load-envs");
let envs = load_envs_1.loadEnvs(['LOG_LEVEL'], false);
/**
* Custom transformers so log messages show up as expected
* https://medium.com/@stieg/winston-3-and-logging-error-stacks-cf70b2111289
*/
const errorHunter = logform_1.default.format(info => {
    if (info.error)
        return info;
    const splat = info[triple_beam_1.default.SPLAT] || [];
    info.error = splat.find(obj => obj instanceof Error);
    return info;
});
const errorPrinter = logform_1.default.format(info => {
    if (!info.error)
        return info;
    // Handle case where Error has no stack.
    const errorMsg = info.error.stack || info.error.toString();
    info.message += `\n${errorMsg}`;
    return info;
});
const objectHunter = logform_1.default.format(info => {
    if (info.object)
        return info;
    const splat = info[triple_beam_1.default.SPLAT] || [];
    info.object = splat.find(obj => obj instanceof Object);
    return info;
});
const objectPrinter = logform_1.default.format(info => {
    if (!info.object)
        return info;
    info.message += ` ${JSON.stringify(info.object, null, 2)}`;
    return info;
});
exports.logger = winston_logger.createLogger({
    transports: [
        new (winston_logger.transports.Console)({
            format: winston_logger.format.combine(errorHunter(), errorPrinter(), objectHunter(), objectPrinter(), winston_logger.format.timestamp(), winston_logger.format.colorize(), winston_logger.format.printf(msg => {
                // console.log("msg", msg);
                return `${msg.timestamp} ${msg.level}: ${msg.message}`;
            })),
            level: envs['LOG_LEVEL']
        }),
    ]
});
exports.createLogger = (label) => {
    return winston_logger.createLogger({
        transports: [
            new (winston_logger.transports.Console)({
                format: winston_logger.format.combine(errorHunter(), errorPrinter(), objectHunter(), objectPrinter(), winston_logger.format.label({ label: label }), winston_logger.format.timestamp(), winston_logger.format.colorize(), winston_logger.format.printf(msg => {
                    // console.log("msg", msg);
                    return `${msg.timestamp} ${msg.level} [${msg.label}]: ${msg.message}`;
                })),
                level: envs['LOG_LEVEL']
            }),
        ]
    });
};
// Test Logging Cases
// logger.info('Message');
// logger.info('Message String:',  'string');
// logger.info('Message Object',  {x: 'string'});
// logger.info('Message Error', new Error("Winston Test Error"));
// const testLogger = createLogger('winston-logger.ts');
// testLogger.info('Message');
// testLogger.info('Message String:', 'string');
// testLogger.info('Message Object', {x: 'string'});
// testLogger.info('Message Error', new Error("Winston Test Error"));
