import bcrypt from "bcryptjs";

const password = "HrPassword123!";

const hash = await bcrypt.hash(password, 12);

console.log(hash);