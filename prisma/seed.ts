import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    // Clear existing data in reverse order of dependencies
    await prisma.productIngredient.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.inventoryItem.deleteMany(); // New cleanup
    await prisma.subcategory.deleteMany();
    await prisma.category.deleteMany();

    // Inventory Items
    const inventoryItems = [
        { id: "coffee-bean", name: "Coffee Beans", category: "BEVERAGE_INGREDIENT", unit: "kg", currentStock: 10, minStock: 2, costPerUnit: 15 },
        { id: "milk-whole", name: "Whole Milk", category: "BEVERAGE_INGREDIENT", unit: "L", currentStock: 20, minStock: 5, costPerUnit: 1.2 },
        { id: "flour", name: "Flour", category: "FOOD_INGREDIENT", unit: "kg", currentStock: 50, minStock: 10, costPerUnit: 0.8 },
        { id: "coca-can", name: "Coca Cola Can", category: "BEVERAGE_INGREDIENT", unit: "pcs", currentStock: 100, minStock: 24, costPerUnit: 0.5 },
    ];

    for (const item of inventoryItems) {
        await prisma.inventoryItem.create({ data: item });
    }

    // Categories
    const categories = [
        { id: "cafe", name: "Café", icon: "Coffee", type: "BEVERAGE" },
        { id: "food", name: "Nourriture", icon: "Pizza", type: "FOOD" },
        { id: "dessert", name: "Dessert", icon: "IceCream", type: "FOOD" },
        { id: "drinks", name: "Boissons", icon: "Utensils", type: "BEVERAGE" },
    ];

    for (const cat of categories) {
        await prisma.category.create({
            data: cat,
        });
    }

    // Subcategories
    const subcategories = [
        { id: "coffee-hot", name: "Cafés Chauds", categoryId: "cafe" },
        { id: "coffee-cold", name: "Cafés Froids", categoryId: "cafe" },
        { id: "pizza", name: "Pizzas", categoryId: "food" },
        { id: "burger", name: "Burgers", categoryId: "food" },
        { id: "cake", name: "Gâteaux", categoryId: "dessert" },
        { id: "softs", name: "Sodas", categoryId: "drinks" },
    ];

    for (const sub of subcategories) {
        await prisma.subcategory.create({
            data: sub,
        });
    }

    // Products
    const products = [
        {
            name: "Espresso",
            price: 2.5,
            categoryId: "cafe",
            subcategoryId: "coffee-hot",
            image: "☕",
            attributes: { size: "S", roast: "Dark" },
            ingredients: {
                create: [
                    { inventoryItemId: "coffee-bean", quantityRequired: 0.018 } // 18g coffee
                ]
            }
        },
        {
            name: "Cappuccino",
            price: 3.5,
            categoryId: "cafe",
            subcategoryId: "coffee-hot",
            image: "🥛",
            attributes: { size: "M", milk: "Whole" },
            ingredients: {
                create: [
                    { inventoryItemId: "coffee-bean", quantityRequired: 0.018 },
                    { inventoryItemId: "milk-whole", quantityRequired: 0.2 } // 200ml milk
                ]
            }
        },
        {
            name: "Iced Latte",
            price: 4.0,
            categoryId: "cafe",
            subcategoryId: "coffee-cold",
            image: "🧊",
            attributes: { size: "L", milk: "Oat" }
        },
        {
            name: "Pizza Margherita",
            price: 12.0,
            categoryId: "food",
            subcategoryId: "pizza",
            image: "🍕",
            attributes: { size: "30cm", crust: "Thin" },
            ingredients: {
                create: [
                    { inventoryItemId: "flour", quantityRequired: 0.25 } // 250g flour base
                ]
            }
        },
        {
            name: "Cheese Burger",
            price: 9.5,
            categoryId: "food",
            subcategoryId: "burger",
            image: "🍔",
            attributes: { cooking: "Medium", extras: ["Cheese", "Bacon"] }
        },
        {
            name: "Coca Cola",
            price: 2.5,
            categoryId: "drinks",
            subcategoryId: "softs",
            image: "🥤",
            attributes: { size: "33cl" },
            ingredients: {
                create: [
                    { inventoryItemId: "coca-can", quantityRequired: 1 } // 1 can
                ]
            }
        }
    ];

    for (const prod of products) {
        await prisma.product.create({
            data: prod,
        });
    }

    console.log("Seed complete with Inventory, Categories, Subcategories, and Products.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
