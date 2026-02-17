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
        const updated = await prisma.inventoryItem.update({
            where: { id: params.id },
            data: {
                name: body.name,
                category: body.category,
                unit: body.unit,
                currentStock: parseFloat(body.currentStock),
                minStock: parseFloat(body.minStock) || 5,
                costPerUnit: body.costPerUnit ? parseFloat(body.costPerUnit) : null
            }
        });
        return NextResponse.json(updated);
    } catch (error) {
        console.error("Error updating inventory:", error);
        return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const deleted = await prisma.inventoryItem.delete({
            where: { id: params.id },
        });
        return NextResponse.json({ success: true, deleted });
    } catch (error) {
        console.error("Error deleting inventory item:", error);
        return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
    }
}
