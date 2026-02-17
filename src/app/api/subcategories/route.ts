import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const subcategories = await prisma.subcategory.findMany({
            include: { category: true, _count: { select: { products: true } } },
            orderBy: { name: 'asc' }
        });
        return NextResponse.json(subcategories);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch subcategories" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const subcategory = await prisma.subcategory.create({
            data: {
                name: body.name,
                categoryId: body.categoryId
            }
        });
        return NextResponse.json(subcategory);
    } catch (error) {
        console.error("Error creating subcategory:", error);
        return NextResponse.json({ error: "Failed to create subcategory" }, { status: 500 });
    }
}
