export function generate(): bigint {
    const array = new BigUint64Array(1);
    crypto.getRandomValues(array);
    return BigInt(array[0]);
}