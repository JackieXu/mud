import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import glob from "fast-glob";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rewrites @latticexyz/* dependency versions in the scaffolded test-project to
// `link:` paths pointing at the in-repo packages. This lets create-mud's
// integration tests run against the current branch instead of pulling the
// last-published versions from npm (which would skip changes made in the PR).

(async () => {
  const projectDir = path.resolve(process.argv[2] ?? "test-project");
  const packageDir = path.resolve(__dirname, "..");
  const rootDir = path.resolve(packageDir, "../..");
  const packagesDir = path.join(rootDir, "packages");

  const packageFiles = await glob("*/package.json", { cwd: packagesDir });
  const mudPackages = new Map<string, string>();
  for (const file of packageFiles) {
    const json = JSON.parse(await fs.readFile(path.join(packagesDir, file), "utf-8"));
    if (json.name) {
      mudPackages.set(json.name, path.join(packagesDir, path.dirname(file)));
    }
  }

  const projectPackageFiles = await glob("**/package.json", {
    cwd: projectDir,
    ignore: ["**/node_modules/**"],
  });

  for (const file of projectPackageFiles) {
    const filePath = path.join(projectDir, file);
    const json = JSON.parse(await fs.readFile(filePath, "utf-8"));
    let modified = false;

    for (const depType of ["dependencies", "devDependencies"] as const) {
      const deps = json[depType];
      if (!deps) continue;
      for (const depName of Object.keys(deps)) {
        const target = mudPackages.get(depName);
        if (target) {
          deps[depName] = `link:${path.relative(path.dirname(filePath), target)}`;
          modified = true;
        }
      }
    }

    if (modified) {
      await fs.writeFile(filePath, JSON.stringify(json, null, 2) + "\n");
    }
  }
})();
