type Config = {
  showRequiredMarkInLabel: boolean;
};

let config: Config = {
  showRequiredMarkInLabel: true
};

export function getConfig() {
  return config;
}

export function configure(_config: Config) {
  config = _config;
}
