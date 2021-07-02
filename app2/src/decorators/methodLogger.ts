import { logger } from '../utils';

interface MethodLoggerParams {
  className?: string;
  logError?: boolean;
  logSuccess?: boolean;
  timed?: boolean;
}

function MethodLogger({
  className,
  logError,
  logSuccess,
  timed,
}: MethodLoggerParams = {}) {
  const options = {
    logError: logError === undefined || logError,
    logSuccess: logSuccess === undefined || logSuccess,
    timed: timed === undefined || timed,
  };
  return (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor => {
    const { logError, logSuccess, timed } = options;
    const originalMethod = descriptor.value;
    const head = className || target.constructor.name;
    const logMessage = (message: string, time?: number) =>
      timed && time
        ? `${head}:${propertyKey} - ${message} in ${time}ms`
        : `${head}:${propertyKey} - ${message}`;

    descriptor.value = function method(...args: any[]) {
      const boundOriginalMethod = originalMethod.bind(this);
      const ref = Date.now();
      const result = boundOriginalMethod(...args);
      const isPromise =
        result &&
        typeof result === 'object' &&
        typeof result.catch === 'function' &&
        typeof result.then === 'function';

      if (isPromise) {
        if (logSuccess) {
          result.then(() =>
            logger.info(logMessage('called successfully', Date.now() - ref)),
          );
        }
        if (logError) {
          result.catch((err: Error) =>
            logger.error(logMessage(`${err.name}: ${err.message}`)),
          );
        }
      } else {
        logger.info(logMessage('called successfully'));
      }
      return result;
    };
    return descriptor;
  };
}

export default MethodLogger;
