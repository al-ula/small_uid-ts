import { SmallUid } from "./mod.ts";

Deno.bench({
  name: "generate",
  fn() {
    SmallUid.gen();
  },
});
