import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get('categoryId');

        const where = categoryId ? { categoryId } : {};

        const products = await prisma.product.findMany({
            where,
            include: {
                category: true,
                subcategory: true,
                ingredients: { include: { inventoryItem: true } }
            },
            orderBy: { name: 'asc' }
        });
        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const product = await prisma.product.create({
            data: {
                name: body.name,
                price: body.price,
                description: body.description,
                categoryId: body.categoryId,
                subcategoryId: body.subcategoryId || null,
                image: body.image,
                attributes: body.attributes,
                ingredients: {
                    create: body.ingredients?.map((ing: any) => ({
                        inventoryItemId: ing.id,
                        quantityRequired: parseFloat(ing.quantity) || 0
                    }))
                }
            }
        });
        return NextResponse.json(product);
    } catch (error) {
        console.error("Error creating product:", error);
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }
}
