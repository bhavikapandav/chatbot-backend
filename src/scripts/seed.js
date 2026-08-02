const seedAdmin = require("./adminSeed");
const seedRole = require("./roleSeed");
const connectDB = require("../config/database");
const seed = async () => {
    try {
        await connectDB();
        await seedRole();
        await seedAdmin();

        console.log("Seeding completed.");

        process.exit(0);
    } catch (error) {
        console.log(error);

        process.exit(1);
    }
}

seed();