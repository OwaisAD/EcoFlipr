const app = require("./app");
import { PORT } from "./utils/config";
import { infoLog } from "./utils/logger";

app.listen(PORT, (): void => {
  infoLog(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
