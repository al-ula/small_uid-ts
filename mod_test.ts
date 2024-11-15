import { assertEquals } from "@std/assert";
import { SmallUid } from "./mod.ts";
import {atobu, btoau} from "./utils.ts";

// Deno.test(function addTest() {
//   assertEquals(add(2, 3), 5);
// });
Deno.test("SmallUid", () => {
    const uid = new SmallUid();
    const string = uid.string;
    const value = uid.value;
    const value2 = stringToValue(string);
    const string2 = genString(value);
    console.log(string);
    console.log(string2);
    console.log(value);
    console.log(value2);
    assertEquals(value, value2);
    assertEquals(string, string2);
    // assertEquals(typeof string, "string");
    // assertEquals(typeof value, "bigint");
    // assertEquals(string.length, 12);
    // assertEquals(Number(string[0]), 8); // timestamp should be at least 8
    // assertEquals(Number(string[string.length - 1]), 0); // random should be at most 0
});

Deno.test("stringToValue", () => {
    const uid = new SmallUid();
    const strippeduid = uid.string.replace(/=/g, '');
    console.log(strippeduid);
    console.log(uid.string);
    const value = stringToValue(strippeduid);
    console.log(value);
    console.log(uid.value);
    assertEquals(value, uid.value);
})

function stringToValue(string: string): bigint {
    const base64urlRegex = /^[A-Za-z0-9\-_]+=?=?$/;
    if (!base64urlRegex.test(string)) {
        throw new Error(`Invalid base64url encoded string: ${string}`);
    }
    const paddedString = string.padEnd(string.length + (4 - (string.length % 4)) % 4, '=');
    return BigInt('0x' + Array.from(atobu(paddedString)).map(byte => byte.toString(16).padStart(2, '0')).join(''));
}

function genString(value: bigint): string {
    return btoau(new Uint8Array(value.toString(16).match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))));
}