import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const inventory = await prisma.inventoryItem.findMany({
            orderBy: { name: 'asc' }
        });
        return NextResponse.json(inventory);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const newItem = await prisma.inventoryItem.create({
            data: {
                name: body.name,
                category: body.category,
                unit: body.unit,
                currentStock: parseFloat(body.currentStock) || 0,
                minStock: parseFloat(body.minStock) || 5,
                costPerUnit: body.costPerUnit ? parseFloat(body.costPerUnit) : null
            }
        });
        return NextResponse.json(newItem);
    } catch (error) {
        console.error("Error creating inventory item:", error);
        return NextResponse.json({ error: "Failed to create inventory item" }, { status: 500 });
    }
}
