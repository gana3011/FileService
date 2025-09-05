import bcrypt from "bcrypt";

export class Password {
  static saltRounds = 10;
  static async toHash(password) {
    const hashedPassword = await bcrypt.hash(password, this.saltRounds);
    return hashedPassword;
  }

  static async comparePasswords(storedPassword, suppliedPassword) {
    // console.log("Stored Password:", storedPassword);
    // console.log("Supplied Password:", suppliedPassword);
    const match = await bcrypt.compare(suppliedPassword, storedPassword);
    return match;
  }
}