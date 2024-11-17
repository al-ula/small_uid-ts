// ex. scripts/build_npm.ts
import { build, emptyDir } from "@deno/dnt";
import { getName, getVersion } from "./extract_deno_json.ts";

await emptyDir("./npm");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  shims: {
    // see JS docs for overview and more options
    deno: true,
  },
  package: {
    // package.json properties
    name: getName(),
    version: getVersion(),
    description:
      "Small UIDs are lexicographically sortable short (64bit) unique identifiers designed to be used as an efficient database Primary Key and a readable (11/12 characters) URL safe UID when encoded.",
    license: "Apache-2.0 OR MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/al-ula/small_uid-ts.git",
    },
    bugs: {
      url: "https://github.com/al-ula/small_uid-ts/issues",
    },
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("LICENSE-APACHE", "npm/LICENSE-APACHE");
    Deno.copyFileSync("LICENSE-MIT", "npm/LICENSE-MIT");
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});
