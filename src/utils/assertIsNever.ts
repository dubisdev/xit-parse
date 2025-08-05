export const assertIsNever = (v: never): v is never => {
    throw new Error("Reached unreachable")
}
