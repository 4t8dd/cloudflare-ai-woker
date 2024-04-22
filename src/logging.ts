import winston, { format } from 'winston';
const { combine, printf } = format;

const fileLineNumberFormat = printf(({ level, message, timestamp, stack}) => {
  const caller = stack ? stack.split('\n')[1] : '';
  const callerInfo = caller ? caller.trim().split(' ') : [];
  const fileName = callerInfo.length > 1 ? callerInfo[1] : '';
  const lineNumber = callerInfo.length > 2 ? callerInfo[2].replace(':', '') : '';
  return `[${timestamp}] [${level.toUpperCase()}] ${fileName}:${lineNumber} - ${message}`;
});

const logger = winston.createLogger({
    level: 'info',
    format: combine(
      winston.format.timestamp(),
      fileLineNumberFormat
    ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' })
    ]
  });
  
  export default logger;