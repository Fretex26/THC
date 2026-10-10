import { ensureTestDB } from "./helpers/ensure-test-db";

export default async function globalSetup(): Promise<void> {
    await ensureTestDB()
}