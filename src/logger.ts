type LogFN = (message?: any, ...optionalParams: any[]) => void;

export interface Logger {
  info: LogFN;
  debug: LogFN;
  warn: LogFN;
  error: LogFN;
  setLogger: (logger: Logger) => void;
}

let l;

function setLogger(logger: Logger): void {
  l = logger;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const NULL_FN = (): void => {
};

const logger: Logger = new Proxy<Logger>(
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  { setLogger },
  {
    get(_, p): any {
      if (p === 'setLogger') return _[p];
      return l ? l[p] || NULL_FN : NULL_FN;
    },
  },
);

export default logger;
