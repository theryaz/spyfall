import * as winston_logger from 'winston';
import logform from 'logform';
import tripleBeam from 'triple-beam';

import { loadEnvs } from './load-envs';

let envs = loadEnvs(['LOG_LEVEL'],false);


/**
* Custom transformers so log messages show up as expected
* https://medium.com/@stieg/winston-3-and-logging-error-stacks-cf70b2111289
*/
const errorHunter = logform.format(info => {
  if (info.error) return info;

  const splat = info[tripleBeam.SPLAT] || [];
  info.error = splat.find(obj => obj instanceof Error);

  return info;
});
const errorPrinter = logform.format(info => {
  if (!info.error) return info;

  // Handle case where Error has no stack.
  const errorMsg = info.error.stack || info.error.toString();
  info.message += `\n${errorMsg}`;

  return info;
});


const objectHunter = logform.format(info => {
  if (info.object) return info;
  const splat = info[tripleBeam.SPLAT] || [];
  info.object = splat.find(obj => obj instanceof Object);
  return info;
});
const objectPrinter = logform.format(info => {
  if (!info.object) return info;
  info.message += ` ${JSON.stringify(info.object, null, 2)}`;
  return info;
});


export const logger = winston_logger.createLogger({
	transports: [
		new (winston_logger.transports.Console)({
			format: winston_logger.format.combine(
				errorHunter(),
				errorPrinter(),
				objectHunter(),
				objectPrinter(),
				winston_logger.format.timestamp(),
				winston_logger.format.colorize(),
				winston_logger.format.printf(msg => {
					// console.log("msg", msg);
					return `${msg.timestamp} ${msg.level}: ${msg.message}`;
				}),
			),
			level: envs['LOG_LEVEL']
		}),
	]
});


export const createLogger = (label: string) => {
	return winston_logger.createLogger({
	  transports: [
			new (winston_logger.transports.Console)({
				format: winston_logger.format.combine(
					errorHunter(),
					errorPrinter(),
					objectHunter(),
					objectPrinter(),
					winston_logger.format.label({label: label}),
					winston_logger.format.timestamp(),
					winston_logger.format.colorize(),
					winston_logger.format.printf(msg => {
						// console.log("msg", msg);
						return `${msg.timestamp} ${msg.level} [${msg.label}]: ${msg.message}`;
					}),
				),
				level: envs['LOG_LEVEL']
			}),
		]
	});
}

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
