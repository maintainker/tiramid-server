import chalk from "chalk";

const getTimeStamp = (): string => {
  return new Date().toISOString();
};

const info = (namespace: string, message: string, object?: any) => {
  if (object) {
    console.log(
      chalk.cyan(
        `[${getTimeStamp()}] [INFO] [${namespace}] ${message}`,
        object,
      ),
    );
  } else {
    console.log(
      chalk.cyan(`[${getTimeStamp()}] [INFO] [${namespace}] ${message}`),
    );
  }
};
const error = (namespace: string, message: string, object?: any) => {
  if (object) {
    console.log(
      chalk.red(
        `[${getTimeStamp()}] [ERROR] [${namespace}] ${message}`,
        object,
      ),
    );
  } else {
    console.log(
      chalk.red(`[${getTimeStamp()}] [ERROR] [${namespace}] ${message}`),
    );
  }
};
const debug = (namespace: string, message: string, object?: any) => {
  if (object) {
    console.log(
      chalk.magenta(
        `[${getTimeStamp()}] [DEBUG] [${namespace}] ${message}`,
        object,
      ),
    );
  } else {
    console.log(
      chalk.magenta(`[${getTimeStamp()}] [DEBUG] [${namespace}] ${message}`),
    );
  }
};
const warn = (namespace: string, message: string, object?: any) => {
  if (object) {
    console.log(
      chalk.yellow(
        `[${getTimeStamp()}] [WARN] [${namespace}] ${message}`,
        object,
      ),
    );
  } else {
    console.log(
      chalk.yellow(`[${getTimeStamp()}] [WARN] [${namespace}] ${message}`),
    );
  }
};

export default {
  info,
  warn,
  error,
  debug,
};
