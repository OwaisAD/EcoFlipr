const app = require("./app");
const config = require("./utils/config");
const logger = require("./utils/logger");

app.listen(config.PORT, (): void => {
  logger.info(`⚡️[server]: Server is running at http://localhost:${config.PORT}`);
});
