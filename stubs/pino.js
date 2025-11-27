const createLogger = () => {
  const noop = () => {};
  const logger = {
    info: noop,
    error: noop,
    warn: noop,
    debug: noop,
    fatal: noop,
    trace: noop,
    child: () => logger,
    bindings: () => ({}),
    flush: noop,
    level: "silent",
  };

  return logger;
};

createLogger.destination = () => ({
  write: () => {},
  flush: () => {},
});

module.exports = createLogger;
module.exports.default = createLogger;



