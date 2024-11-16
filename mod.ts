import { atobu, btoau } from "./utils.ts";
import { generate } from "./generator.ts";

/**
 * The `SmallUid` class generates small, url-safe, lexicographically sortable, unique ids.
 *
 * The generated ids are 64-bit bigint, which are base64url encoded.
 * The first 44 bits contain the timestamp with millisecond precision.
 * The remaining 20 bits are filled with a random value.
 *
 * The `SmallUid` class is immutable and its instances are safe to be used
 * as keys in objects or as identifiers in any other context.
 *
 * @example
 * import { SmallUid } from 'jsr:@al-ula/small-uid'
 *
 * const uid = new SmallUid();
 * console.log(uid.string); // 'XxXxXxXxXxX='
 * console.log(uid.unPad().string); // 'XxXxXxXxXxX'
 * console.log(uid.value); // 0n
 */
export class SmallUid {
  static MAX_U64: bigint = BigInt(18446744073709551615n);
  #value: bigint = 0n;
  #string: string = "";

  /**
   * Constructs a new `SmallUid` instance.
   *
   * If no argument is provided, the instance is generated with a random value and the current timestamp.
   *
   * If a `bigint` is provided, the instance is initialized with that value.
   *
   * If a `string` is provided, the instance is initialized with the decoded value of the base64url encoded string.
   * The string could accept a base64url encoded string with or without padding.
   *
   * @param input the value to initialize the instance with.
   * It can be either a `bigint`, a `string`, or `undefined`.
   */
  constructor(input?: bigint | string) {
    if (input === undefined || input === null) {
      this.gen();
    } else if (typeof input === "bigint") {
      this.#value = input;
      this.#string = this.#genString(input);
    } else {
      this.#value = this.#stringToValue(input);
      this.#string = input;
    }
  }

  /**
   * The underlying numeric value of the small-uid.
   */
  get value(): bigint {
    return this.#value;
  }

  /**
   * Returns the base64url encoded string representation of the small-uid.
   */
  get string(): string {
    return this.#string;
  }

  /**
   * Generates a new `SmallUid` with a random value and the current timestamp.
   * Updates the internal string representation and numeric value.
   * @returns The updated instance of `SmallUid`.
   */
  gen(): SmallUid {
    const random = generate();
    const timestamp = BigInt(Date.now());
    this.#value = this.#assemble(timestamp, random);
    this.#string = this.#genString(this.#value);
    return this;
  }

  /**
   * Generates a new `SmallUid` using a specified timestamp and a random value.
   *
   * @param timestamp - The timestamp to use for the ID generation.
   * @returns The updated instance of `SmallUid`.
   */
  fromTimestamp(timestamp: bigint): SmallUid {
    const random = generate();
    this.#value = this.#assemble(timestamp, random);
    this.#string = this.#genString(this.#value);
    return this;
  }

  /**
   * Generates a new `SmallUid` using a specified random value and the current timestamp.
   *
   * @param random - The random value to use for the ID generation.
   * @returns The updated instance of `SmallUid`.
   */
  fromRandom(random: bigint): SmallUid {
    const timestamp = BigInt(Date.now());
    this.#value = this.#assemble(timestamp, random);
    this.#string = this.#genString(this.#value);
    return this;
  }

  /**
   * Creates a new `SmallUid` using a specified timestamp and random value.
   *
   * @param timestamp - The timestamp to use for the ID creation.
   * @param random - The random value to use for the ID creation.
   * @returns The updated instance of `SmallUid`.
   */
  fromParts(timestamp: bigint, random: bigint): SmallUid {
    this.#value = this.#assemble(timestamp, random);
    this.#string = this.#genString(this.#value);
    return this;
  }

  unPad(): SmallUid {
    this.#string = this.#string.replace(/=/g, "");
    return this;
  }

  /**
   * Parses a base64url encoded string and returns the corresponding `SmallUid`
   * instance.
   *
   * If the given string is not a valid base64url encoded string, an error is
   * thrown.
   *
   * @returns The parsed `SmallUid` instance.
   * @param value
   */
  #genString(value: bigint): string {
    return btoau(
      new Uint8Array(
        value.toString(16).match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)),
      ),
    );
  }

  /**
   * Parses a base64url encoded string and returns the corresponding `SmallUid`
   * instance.
   *
   * If the given string is not a valid base64url encoded string, an error is
   * thrown.
   *
   * @param string - The base64url encoded string to parse.
   * @returns The parsed `SmallUid` instance.
   */
  #stringToValue(string: string): bigint {
    if (string.length > 12) {
      throw new Error(`Input too long: ${string}`);
    }
    const base64urlRegex = /^[A-Za-z0-9\-_]+=?=?$/;
    if (!base64urlRegex.test(string)) {
      throw new Error(`Invalid base64url encoded string: ${string}`);
    }
    const paddedString = string.padEnd(
      string.length + (4 - (string.length % 4)) % 4,
      "=",
    );
    return BigInt(
      "0x" +
        Array.from(atobu(paddedString)).map((byte) =>
          byte.toString(16).padStart(2, "0")
        ).join(""),
    );
  }

  /**
   * Assembles a `SmallUid` value from a given timestamp and random value.
   *
   * The timestamp is expected to be a positive `bigint` representing the
   * number of milliseconds since the Unix epoch.
   *
   * The random value is expected to be a positive `bigint` with at most 20
   * bits. It is used to add entropy to the generated `SmallUid`.
   *
   * The returned `SmallUid` is guaranteed to be a positive `bigint` with at
   * most 64 bits.
   *
   * @param timestamp - The timestamp to use when assembling the `SmallUid`.
   * @param random - The random value to use when assembling the `SmallUid`.
   */
  #assemble(timestamp: bigint, random: bigint): bigint {
    if (timestamp < 0n || random < 0n) {
      throw new Error(
        `timestamp and random must be positive, but got ${timestamp} and ${random}`,
      );
    }
    const value = (timestamp << 20n) | random;
    return value & SmallUid.MAX_U64;
  }
}
