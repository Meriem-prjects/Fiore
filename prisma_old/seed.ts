import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    const categories = [
        { name: "Café", icon: "Coffee" },
        { name: "Food", icon: "Pizza" },
        { name: "Dessert", icon: "IceCream" },
        { name: "Drinks", icon: "Utensils" },
    ];

    for (const cat of categories) {
        const category = await prisma.category.upsert({
            where: { id: cat.name.toLowerCase() },
            update: {},
            create: {
                id: cat.name.toLowerCase(),
                name: cat.name,
                icon: cat.icon,
            },
        });

        if (cat.name === "Café") {
            await prisma.product.createMany({
                data: [
                    { name: "Espresso", price: 2.5, categoryId: category.id, image: "☕" },
                    { name: "Cappuccino", price: 3.5, categoryId: category.id, image: "🥛" },
                ],
            });
        }
    }

    // Create an admin user
    await prisma.user.upsert({
        where: { pin: "1234" },
        update: {},
        create: {
            name: "Admin",
            role: "ADMIN",
            pin: "1234",
        },
    });

    console.log("Seed data created successfully");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
