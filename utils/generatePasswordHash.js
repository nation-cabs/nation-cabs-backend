import bcrypt from "bcryptjs";

const password = "HrPassword123!";

const adminPassword = "AdminPassword123!"

const hash = await bcrypt.hash(password, 12);

const admiHash = await bcrypt.hash(adminPassword,12)

console.log(hash);

console.log (admiHash);