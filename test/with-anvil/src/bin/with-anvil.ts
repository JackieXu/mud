#!/usr/bin/env -S pnpm tsx
import { Instance, Server } from "prool";
import { ExecaError, execa } from "execa";

const command = process.argv.slice(2);
if (!command.length) {
  throw new Error("No command provided.");
}

const host = process.env.PROOL_ANVIL_HOST || "127.0.0.1";
const port = Number(process.env.PROOL_ANVIL_PORT) || 8556;

const server = Server.create({ instance: Instance.anvil(), host, port });

console.log("starting anvil proxy");
await server.start();

console.log(`running: ${command.join(" ")}`);
try {
  await execa(command[0], command.slice(1), {
    stdio: "inherit",
    env: { PROOL_ANVIL_URL: `http://${host}:${port}` },
  });
  process.exit(0);
} catch (error) {
  if (!(error instanceof ExecaError)) throw error;
  process.exit(error.exitCode ?? 1);
}
