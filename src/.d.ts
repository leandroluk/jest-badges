declare namespace Jest {
  type ShowConfigResult = {
    configs: ShowConfigResult.Config[];
  };
  namespace ShowConfigResult {
    type Config = {
      coverageDirectory: string;
    };
  }
  type Report = {
    total: {
      lines: {pct: number;};
      statements: {pct: number;};
      functions: {pct: number;};
      branches: {pct: number;};
    };
  };
}

declare interface GenericConstructor<T> {
  new(...args: any[]): T;
}

declare interface Args {
  in: string;
  out: string;
  prefix: string;
  style: string;
  colorDanger: string;
  colorWarn: string;
  colorOk: string;
  thresholdDanger: number;
  thresholdWarn: number;
}