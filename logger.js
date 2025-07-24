const { createLogger, format, transports } = require('winston');
const isDev = 'local';


const consoleFormat = format.combine(
 
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message }) => {
        return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    }),
    format.colorize({
    all:true
  })
);

const fileFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
  })
);


const logger = createLogger({
  level: 'debug',
  transports: [
    new transports.Console({
        format: consoleFormat
    }),
    new transports.File({ filename: 'logs/app.log' , format: fileFormat}),
    new transports.File({ filename: 'logs/errors.log', level: 'error' , format: fileFormat })
  ]
});


module.exports = logger;