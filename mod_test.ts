import { assertEquals, assertNotEquals } from "@std/assert";
import { escapeUrl, SmallUid } from "./mod.ts";

Deno.test("new", () => {
  const uid = new SmallUid();
  console.log(uid.string);
  console.log(uid.value);
  assertEquals(uid.string, "");
  assertEquals(uid.value, 0n);
});

Deno.test("generate", () => {
  const uid = SmallUid.gen();
  console.log(uid.string);
  console.log(uid.value);
  assertNotEquals(uid.string, "");
  assertNotEquals(uid.value, 0n);
});

Deno.test("from timestamp", () => {
  const uid = SmallUid.gen();
  const uidTimestamp = uid.timestamp;
  const uid2 = SmallUid.fromTimestamp(uidTimestamp);
  const uid2Timestamp = uid2.timestamp;
  assertEquals(uidTimestamp, uid2Timestamp);
});

Deno.test("from random", () => {
  const uid = SmallUid.gen();
  const uidRandom = uid.random;
  const uid2 = SmallUid.fromRandom(uidRandom);
  const uid2Random = uid2.random;
  console.log("random 1:", uidRandom);
  console.log("random 2:", uid2Random);
  console.log("value2:", uid2.value);
  assertEquals(uidRandom, uid2Random);
});

Deno.test("from parts", () => {
  const uid = SmallUid.gen();
  const [uidTimestamp, uidRandom] = uid.disassembled;
  const uid2 = SmallUid.fromParts(uidTimestamp, uidRandom);
  const [uid2Timestamp, uid2Random] = uid2.disassembled;
  assertEquals(uidTimestamp, uid2Timestamp);
  assertEquals(uidRandom, uid2Random);
});

Deno.test("get timestamp", () => {
  const uid = SmallUid.gen();
  const timestamp = uid.timestamp;
  assertEquals(typeof timestamp, "bigint");
  assertEquals(timestamp >= 0n, true);
});

Deno.test("get random", () => {
  const random: bigint = SmallUid.gen().random;
  const uid = SmallUid.fromRandom(random);
  const uidRandom: bigint = uid.random;
  console.log("random 1:", random.toString(2));
  console.log("random 2:", uidRandom.toString(2));
  assertEquals(uidRandom, random);
});

Deno.test("Disassemble", () => {
  const uid = SmallUid.gen();
  const [timestamp, random] = uid.disassembled;
  console.log(timestamp);
  console.log(random);
  assertEquals(typeof timestamp, "bigint");
  assertEquals(typeof random, "bigint");
});

Deno.test("Convert Base64", () => {
  const base64 = "PDw/Pz8+Pg==";
  const base64url = "PDw_Pz8-Pg";
  assertEquals(escapeUrl(base64), base64url);
});
