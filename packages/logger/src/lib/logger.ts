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
  DEFAULT = TRACE,
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
  [LogSeverity.DEFAULT, console.log], // tslint:disable-line no-console
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

  private logTags: Record<string, string> = {};
  private appLogLevel: LogSeverity;

  constructor(name: string) {
    this.component = name;
    this.appLog = logging ? logging.log(name) : null;
    this.setTags({});
    this.appLogLevel = this.setAppLogLevel();
  }

  public setTags(tags: Record<string, string>): Logger {
    if (!Object.keys(tags).length) {
      this.logTags = {};
    }
    this.logTags = { ...this.logTags, ...tags };
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

  private async log(
    severity: LogSeverity = LogSeverity.DEFAULT,
    data: any,
    tags?: Record<string, string>
  ): Promise<any> {
    if (this.skipLog(severity)) {
      return;
    }

    const logSeverity: Record<string, string> = {
      severity: LogSeverity[severity],
    };

    const logLabels: Record<string, string> = {
      ...this.logTags,
      ...tags,
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
      const metadata: any = {
        resource,
        ...logSeverity,
        ...{ labels: Object.keys(logLabels).length ? logLabels : undefined },
        ...traceParams,
      };
      return this.appLog.write(
        this.appLog.entry(metadata, {
          ...data,
        })
      );
    }
    const logFn = consoleLoggers.get(severity) || console.log; // tslint:disable-line no-console
    return Promise.resolve(
      logFn(
        JSON.stringify({
          ...logSeverity,
          ...{
            logLabels: Object.keys(logLabels).length ? logLabels : undefined,
          },
          ...data,
        })
      )
    );
  }

  public async alert(data: any, tags?: Record<string, string>): Promise<any> {
    return this.log(LogSeverity.ALERT, data, tags);
  }

  public async critical(
    data: any,
    tags?: Record<string, string>
  ): Promise<any> {
    return this.log(LogSeverity.CRITICAL, data, tags);
  }

  public async debug(data: any, tags?: Record<string, string>): Promise<any> {
    return this.log(LogSeverity.DEBUG, data, tags);
  }

  public async emergency(
    data: any,
    tags?: Record<string, string>
  ): Promise<any> {
    return this.log(LogSeverity.EMERGENCY, data, tags);
  }

  public async error(data: any, tags?: Record<string, string>): Promise<any> {
    return this.log(LogSeverity.ERROR, data, tags);
  }

  public async info(data: any, tags?: Record<string, string>): Promise<any> {
    return this.log(LogSeverity.INFO, data, tags);
  }

  public async notice(data: any, tags?: Record<string, string>): Promise<any> {
    return this.log(LogSeverity.NOTICE, data, tags);
  }

  public async warning(data: any, tags?: Record<string, string>): Promise<any> {
    return this.log(LogSeverity.WARNING, data, tags);
  }

  public async trace(data: any, tags?: Record<string, string>): Promise<any> {
    //explicitly set TRACE severity to DEFAULT
    return this.log(LogSeverity.DEFAULT, data, tags);
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
