import * as fs from "node:fs";
import * as path from "node:path";
import * as readline from "node:readline";

const out = process.argv[2] || "www";
const now = new Date().toJSON();
const servers = [];

for await (const file of readline.createInterface({input: process.stdin})) {
	const _server = JSON.parse(fs.readFileSync(file));
	const server_json_content = {
		server: _server,
		_meta: {
			"io.modelcontextprotocol.registry/official": {
				status: "active",
				statusChangedAt: now,
				publishedAt: now,
				updatedAt: now,
				isLatest: true,
			},
		},
	};

	const server_json = path.join(out, "v0.1", "servers", _server.name, "versions", _server.version, "server.json");
	console.log(`Writing ${server_json}... based on ${file}`);
	fs.mkdirSync(path.dirname(server_json), { recursive: true });
	fs.writeFileSync(server_json, JSON.stringify(server_json_content, null, 2), "utf8");
	servers.push(server_json_content);
}

const index_json_content = {
	metadata: { count: servers.length },
	servers: servers,
};
const index_json = path.join(out, "v0.1", "servers", "index.json");

console.log(`Writing ${index_json}...`);
fs.mkdirSync(path.dirname(index_json), { recursive: true });
fs.writeFileSync(index_json, JSON.stringify(index_json_content, null, 2), "utf8");
