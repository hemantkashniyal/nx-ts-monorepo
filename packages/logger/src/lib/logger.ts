import { Log, Logging } from '@google-cloud/logging';

function isAppEngine() {
  return false;
}

export enum LogSeverity {
  EMERGENCY,
  ALERT,
  CRITICAL,
  ERROR,
  WARNING,
  NOTICE,
  INFO,
  DEBUG,
  TRACE,
}

const consoleLoggers: Map<LogSeverity, (val: any) => void> = new Map([
  [LogSeverity.DEBUG, console.debug], // tslint:disable-line no-console
  [LogSeverity.INFO, console.info], // tslint:disable-line no-console
  [LogSeverity.NOTICE, console.log], // tslint:disable-line no-console
  [LogSeverity.WARNING, console.warn], // tslint:disable-line no-console
  [LogSeverity.ERROR, console.error], // tslint:disable-line no-console
  [LogSeverity.CRITICAL, console.error], // tslint:disable-line no-console
  [LogSeverity.ALERT, console.error], // tslint:disable-line no-console
  [LogSeverity.EMERGENCY, console.error], // tslint:disable-line no-console
  [LogSeverity.TRACE, console.log], // tslint:disable-line no-console
]);
const resource = {
  type: 'gae_app',
  labels: {
    // project_id: env.logger.projectId,
    // version_id: env.logger.versionId,
    // module_id: env.logger.moduleId
  },
};
const logging = isAppEngine() ? new Logging() : null;
const TRACE_KEY = 'logging.googleapis.com/trace';

class Logger {
  private component: string;

  private appLog: Log | null;

  private tags: any;
  private appLogLevel: LogSeverity;

  constructor(name: string) {
    this.component = name;
    this.appLog = logging ? logging.log(name) : null;
    this.setTags({});
    this.appLogLevel = this.setAppLogLevel();
  }

  public setTags(tags: object): Logger {
    if (!Object.keys(tags).length) {
      this.tags = {
        // 'logComponent': this.component,
      };
    }
    this.tags = { ...this.tags, ...tags };
    return this;
  }

  private setAppLogLevel(): LogSeverity {
    let appLogLevel = LogSeverity.INFO;
    if (process.env['APP_LOG_LEVEL']) {
      let logLevelacceptedvalues: (string | number)[] = [];

      // error
      logLevelacceptedvalues = ['error', 'err', LogSeverity.ERROR];
      if (
        logLevelacceptedvalues.includes(
          process.env['APP_LOG_LEVEL'].toLowerCase()
        )
      ) {
        appLogLevel = LogSeverity.ERROR;
      }

      // warning
      logLevelacceptedvalues = ['warn', 'warning', LogSeverity.WARNING];
      if (
        logLevelacceptedvalues.includes(
          process.env['APP_LOG_LEVEL'].toLowerCase()
        )
      ) {
        appLogLevel = LogSeverity.WARNING;
      }

      // info
      logLevelacceptedvalues = ['info', LogSeverity.INFO];
      if (
        logLevelacceptedvalues.includes(
          process.env['APP_LOG_LEVEL'].toLowerCase()
        )
      ) {
        appLogLevel = LogSeverity.INFO;
      }

      // debug
      logLevelacceptedvalues = ['debug', 'dbg', LogSeverity.DEBUG];
      if (
        logLevelacceptedvalues.includes(
          process.env['APP_LOG_LEVEL'].toLowerCase()
        )
      ) {
        appLogLevel = LogSeverity.DEBUG;
      }

      // trace
      logLevelacceptedvalues = ['trace', LogSeverity.TRACE];
      if (
        logLevelacceptedvalues.includes(
          process.env['APP_LOG_LEVEL'].toLowerCase()
        )
      ) {
        appLogLevel = LogSeverity.TRACE;
      }
    }

    return appLogLevel;
  }

  private skipLog(severity: LogSeverity): boolean {
    return severity > this.appLogLevel;
  }

  private async log(severity: LogSeverity, data: any): Promise<any> {
    if (this.skipLog(severity)) {
      return;
    }

    const logLevel: any = {
      logLevel: LogSeverity[severity],
    };

    if (this.appLog) {
      //   const traceCtx = tracer.getCurrentSpan()?.context()
      const traceParams = {};
      //   if (traceCtx) {
      //     traceParams = {
      //       spanId: traceCtx.spanId,
      //       trace: `projects/${process.env.GOOGLE_CLOUD_PROJECT}/traces/${traceCtx.traceId}`
      //     }
      //   }
      const metadata: any = { resource, severity, ...traceParams };
      return this.appLog.write(
        this.appLog.entry(metadata, { ...logLevel, ...this.tags, ...data })
      );
    }
    const logFn = consoleLoggers.get(severity) || console.log; // tslint:disable-line no-console
    return Promise.resolve(
      logFn(JSON.stringify({ ...logLevel, ...this.tags, ...data }))
    );
  }

  public async alert(data: any): Promise<any> {
    return this.log(LogSeverity.ALERT, data);
  }

  public async critical(data: any): Promise<any> {
    return this.log(LogSeverity.CRITICAL, data);
  }

  public async debug(data: any): Promise<any> {
    return this.log(LogSeverity.DEBUG, data);
  }

  public async emergency(data: any): Promise<any> {
    return this.log(LogSeverity.EMERGENCY, data);
  }

  public async error(data: any): Promise<any> {
    return this.log(LogSeverity.ERROR, data);
  }

  public async info(data: any): Promise<any> {
    return this.log(LogSeverity.INFO, data);
  }

  public async notice(data: any): Promise<any> {
    return this.log(LogSeverity.NOTICE, data);
  }

  public async warning(data: any): Promise<any> {
    return this.log(LogSeverity.WARNING, data);
  }

  public async trace(data: any): Promise<any> {
    return this.log(LogSeverity.TRACE, data);
  }
}

const loggers: Map<string, Logger> = new Map();

export const getLogger = (name: string): Logger => {
  let logger = loggers.get(name);
  if (logger) {
    return logger;
  }
  logger = new Logger(name);
  loggers.set(name, logger);
  return logger;
};
