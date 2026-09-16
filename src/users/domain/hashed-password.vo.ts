import * as bcrypt from 'bcrypt';

export class HashedPassword {

    constructor(
        private readonly value: string
    ) {}

    hashedValue(): string {
        return this.value
    }
    /**
     * @description Hash a password to create a HashedPassword and persist it in the database
     * @param password - The password on plain text to hash
     * @returns The HashedPassword
     */
    static async hashPassword(password: string): Promise<HashedPassword> {
        const hashedPassword = await bcrypt.hash(password, 10)
        return new HashedPassword(hashedPassword)
    }
    
    /**
     * @description Compare a password on plain text with a HashedPassword to validate the login process
     * @param password - The password on plain text to compare with the HashedPassword
     * @returns True if the password is correct, false otherwise
     */
    async isMatch(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.value)
    }

    /**
     * @description Create a HashedPassword type from a hashed password to compare it on a login process
     * @param hashedPassword - The hashed password
     * @returns The HashedPassword
     */
    static async fromHash(hashedPassword: string): Promise<HashedPassword> {
        return new HashedPassword(hashedPassword)
    }
}