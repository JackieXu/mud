import { setup } from "@ark/attest";

// Update snapshots locally; in CI, fail on mismatch instead of silently rewriting them.
export default () => setup({ updateSnapshots: !("CI" in process.env) });
