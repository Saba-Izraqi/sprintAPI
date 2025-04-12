declare global {
  interface Console {
    success: (...args: any[]) => void;
  }
}

import chalk from 'chalk';
import { File } from '../infrastructure/logger/fileLogger';

const originalLog = console.log;

console.log = (...args: any[]) => {
  const timestamp = chalk.gray(`[${new Date().toLocaleTimeString()}]`);
  originalLog(timestamp, ...args);
};

console.info = (...args: any[]) => {
  const timestamp = chalk.blueBright(`[INFO ${new Date().toLocaleTimeString()}] `);
  originalLog(timestamp, ...args);
};

console.warn = (...args: any[]) => {
  const timestamp = chalk.yellowBright(`[WARN ${new Date().toLocaleTimeString()}]`);
  originalLog(timestamp, ...args);
};

console.error = (...args: any[]) => {
  const timestamp = chalk.redBright(`[ERROR ${new Date().toLocaleTimeString()}]`);
  File.log(...args)
  originalLog(timestamp, ...args);
};

console.debug = (...args: any[]) => {
  const timestamp = chalk.magentaBright(`[DEBUG ${new Date().toLocaleTimeString()}]`);
  originalLog(timestamp, ...args);
}

console.success = (...args) => {
  const timestamp = chalk.greenBright(`[SUCCESS ${new Date().toLocaleTimeString()}]`)
  originalLog(timestamp, ...args)
}