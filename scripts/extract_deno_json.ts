export function getVersion(): string {
  const denoJson = JSON.parse(Deno.readTextFileSync("deno.json"));
  return denoJson.version;
}

export function getName(): string {
  const denoJson = JSON.parse(Deno.readTextFileSync("deno.json"));
  return denoJson.name.split("/").pop()!;
}
