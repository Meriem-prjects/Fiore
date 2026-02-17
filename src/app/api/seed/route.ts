import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Categories
        const categories = [
            { id: "cafe", name: "Café", icon: "Coffee" },
            { id: "food", name: "Food", icon: "Pizza" },
            { id: "dessert", name: "Dessert", icon: "IceCream" },
            { id: "drinks", name: "Drinks", icon: "Utensils" },
        ];

        for (const cat of categories) {
            await prisma.category.upsert({
                where: { id: cat.id },
                update: {},
                create: cat,
            });
        }

        // Products
        const products = [
            { name: "Espresso", price: 2.5, categoryId: "cafe", image: "☕" },
            { name: "Cappuccino", price: 3.5, categoryId: "cafe", image: "🥛" },
            { name: "Pizza Margherita", price: 12.0, categoryId: "food", image: "🍕" },
            { name: "Cheese Burger", price: 9.5, categoryId: "food", image: "🍔" },
            { name: "Chocolate Cake", price: 5.0, categoryId: "dessert", image: "🍰" },
            { name: "Ice Cream", price: 3.0, categoryId: "dessert", image: "🍦" },
            { name: "Orange Juice", price: 4.0, categoryId: "drinks", image: "🍹" },
            { name: "Coca Cola", price: 2.5, categoryId: "drinks", image: "🥤" },
        ];

        for (const prod of products) {
            await prisma.product.upsert({
                where: { id: prod.name.toLowerCase().replace(/\s/g, "-") },
                update: {},
                create: {
                    id: prod.name.toLowerCase().replace(/\s/g, "-"),
                    ...prod
                }
            });
        }

        return NextResponse.json({ message: "Database seeded successfully" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
    }
}
