const http = require("http");
const fs = require("fs");
const path = require("path");
const PORT = 8080;
const clients = [];
const MIME_TYPES = {
    ".html": "text/html",
    ".js": "application/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".svg": "image/svg+xml",
};

fs.watch("./", { recursive: true }, (event, filename) => {
    if (filename && !filename.includes("node_modules")) {
        console.log(`Changed: ${filename}`);
        clients.forEach((res) => res.write("data: reload\n\n"));
    }
});

http.createServer((req, res) => {
    if (req.url === "/__reload") {
        res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        });
        clients.push(res);
        req.on("close", () => {
            clients.splice(clients.indexOf(res), 1);
        });
        return;
    }

    let filePath = path.join(".", req.url === "/" ? "/index.html" : req.url);
    const ext = path.extname(filePath);

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end("Not found");
            return;
        }

        const contentType = MIME_TYPES[ext] || "application/octet-stream";
        res.writeHead(200, { "Content-Type": contentType });

        if (ext === ".html") {
            const injected = data
                .toString()
                .replace(
                    "</body>",
                    '<script src="/js/index.js"></script></body>',
                );
            res.end(injected);
        } else {
            res.end(data);
        }
    });
}).listen(PORT, "0.0.0.0", () =>
    console.log(`Live server running at http://localhost:${PORT}`),
);
