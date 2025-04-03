"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { DataTable } from "@/components/data-table"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { useQuery, useMutation, useQueryClient } from "react-query"
import axios from "axios"
import { toast } from "sonner"

export default function Page() {
    const queryClient = useQueryClient()
    const { data, isLoading, isError } = useQuery(
        ["products"],
        async () => {
            const response = await axios.get("https://api.escuelajs.co/api/v1/products")
            return response.data
        }
    )

    const deleteProductMutation = useMutation(
        async (productId) => {
            return await axios.delete(`https://api.escuelajs.co/api/v1/products/${productId}`)
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["products"])
                toast.success("Product deleted successfully")
            },
            onError: (error) => {
                console.error("Delete error:", error)
                toast.error("Failed to delete product")
            }
        }
    )

    const updateProductMutation = useMutation(
        async (updatedProduct: { id: number; title: string; price: number; description: string }) => {
            return await axios.put(
                `https://api.escuelajs.co/api/v1/products/${updatedProduct.id}`,
                {
                    title: updatedProduct.title,
                    price: updatedProduct.price,
                    description: updatedProduct.description,
                }
            )
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["products"])
                toast.success("Product updated successfully")
            },
            onError: (error) => {
                console.error("Update error:", error)
                toast.error("Failed to update product")
            }
        }
    )

    const handleDelete = (productId: void) => {
        deleteProductMutation.mutate(productId)
    }

    const handleUpdate = (product: { id: number; title: string; price: number; description: string }) => {
        updateProductMutation.mutate(product)
    }

    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            {isLoading ? (
                                <div className="flex items-center justify-center p-8">
                                    Loading products...
                                </div>
                            ) : isError ? (
                                <div className="flex items-center justify-center p-8 text-red-500">
                                    Error loading products
                                </div>
                            ) : (
                                <DataTable
                                    data={data as any}
                                    onDelete={handleDelete as any}
                                    onUpdate={handleUpdate}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}