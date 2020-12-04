type Config = {
  showRequiredMarkInLabel: boolean;
};

let config: Config = {
  showRequiredMarkInLabel: true
};

export function getConfig(): Config {
  return config;
}

export function configure(_config: Config): void {
  config = _config;
}
