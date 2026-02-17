import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PUT(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const body = await request.json();
        const product = await prisma.product.update({
            where: { id: params.id },
            data: {
                name: body.name,
                price: body.price,
                categoryId: body.categoryId,
                subcategoryId: body.subcategoryId || null,
                attributes: body.attributes,
                ingredients: {
                    deleteMany: {},
                    create: body.ingredients?.map((ing: any) => ({
                        inventoryItemId: ing.id,
                        quantityRequired: parseFloat(ing.quantity) || 0
                    }))
                }
            },
        });
        return NextResponse.json(product);
    } catch (error) {
        console.error("Error updating product:", error);
        return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        await prisma.product.delete({
            where: { id: params.id },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting product:", error);
        return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
    }
}
