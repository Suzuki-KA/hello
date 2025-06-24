const express = require("express");
const expressWs = require("express-ws");

const app = express();
expressWs(app);

const port = process.env.PORT || 3001;
let connects = [];

app.use(express.static("public"));

function decorateMessage(message) {
  const index = 1;
  const content = " ".repeat(index) + message + " ".repeat(index);
  const border = "+".padEnd(content.length + 1, "-") + "+";
  const middle = "|" + content + "|";
  return `${border}\n${middle}\n${border}`;
}

app.ws("/ws", (ws, req) => {
  connects.push(ws);

  ws.on("message", (message) => {
    console.log("Received:", message);

    const decorated = decorateMessage(message.toString());

    connects.forEach((socket) => {
      if (socket.readyState === 1) {
        // Check if the connection is open
        socket.send(decorated);
      }
    });
  });

  ws.on("close", () => {
    connects = connects.filter((conn) => conn !== ws);
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
