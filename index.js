const chokidar = require("chokidar");
const { createHttpTerminator } = require("http-terminator");
const serverPath = "./server";

let app = require(serverPath);

function reloadApp() {
  try {
    delete require.cache[require.resolve(serverPath)];
    app = require(serverPath);
    return true;
  } catch (e) {
    console.warn("reload app failed");
    console.warn(e);
    return false;
  }
}

let httpTerminator;

async function restart() {
  if (await reloadApp()) {
    if (httpTerminator) {
      console.log("terminating...");
      await httpTerminator.terminate();
      console.log("terminated, restarting server...");
    }

    const server = app.listen(3000, () => {
      console.log("server listen to http://localhost:3000");
    });

    httpTerminator = createHttpTerminator({ server });
  }
}

chokidar.watch("./server.js").on("all", async (event, path) => {
  console.log(event, path);
  await restart();
});

process.stdin.resume();
process.stdin.setEncoding("utf8");
process.stdin.on("data", async (data) => {
  const str = data.toString().trim().toLowerCase();
  if (str === "rs") {
    await restart();
  }
});
