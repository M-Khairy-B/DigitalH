"use client"

import * as React from "react"
import axios from "axios"
import {
    DndContext,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    closestCenter,
    useSensor,
    useSensors,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
    SortableContext,
    arrayMove,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
    ColumnDef,
    ColumnFiltersState,
    Row,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronsLeftIcon,
    ChevronsRightIcon,
    ColumnsIcon,
    GripVerticalIcon,
    MoreVerticalIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

function DragHandle({ id }: { id: string }) {
    const { attributes, listeners } = useSortable({
        id,
    })

    return (
        <Button
            {...attributes}
            {...listeners}
            variant="ghost"
            size="icon"
            className="size-7 text-muted-foreground hover:bg-transparent"
        >
            <GripVerticalIcon className="size-3 text-muted-foreground" />
            <span className="sr-only">Drag to reorder</span>
        </Button>
    )
}

function ProductCellViewer({ item, onUpdate }: { item: any; onUpdate: (updatedItem: any) => void }) {
    const [formData, setFormData] = React.useState({
        title: item.title,
        category: item.category?.name || "",
        price: item.price,
        description: item.description
    })

    const handleInputChange = (e: { target: { id: any; value: any } }) => {
        const { id, value } = e.target
        setFormData(prev => ({
            ...prev,
            [id]: id === 'price' ? parseFloat(value) : value
        }))
    }

    const handleUpdate = () => {
        onUpdate({
            id: item.id,
            title: formData.title,
            price: formData.price,
            description: formData.description,
        })
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="link" className="w-fit px-0 text-left text-foreground">
                    {item.title}
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col">
                <SheetHeader className="gap-1">
                    <SheetTitle>{item.title}</SheetTitle>
                    <SheetDescription>
                        {item.slug || item.id}
                    </SheetDescription>
                </SheetHeader>
                <div className="flex flex-1 flex-col gap-4 overflow-y-auto py-4 text-sm">
                    <div className="overflow-hidden rounded-md">
                        <img
                            src={item.images?.[0] || "/placeholder-product.jpg"}
                            alt={item.title}
                            className="aspect-video w-full object-cover"
                        />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex gap-2 font-medium leading-none">
                            Price: ${item.price}
                        </div>
                        <div className="text-muted-foreground">
                            {item.description}
                        </div>
                    </div>

                    <form className="flex flex-col gap-4">
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="category">Category</Label>
                                <Input
                                    id="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="price">Price</Label>
                                <Input
                                    id="price"
                                    value={formData.price}
                                    type="number"
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                value={formData.description}
                                onChange={handleInputChange}
                            />
                        </div>
                    </form>
                </div>
                <SheetFooter className="mt-auto flex gap-2 sm:flex-col sm:space-x-0">
                    <Button className="w-full" onClick={handleUpdate}>
                        Update
                    </Button>
                    <SheetClose asChild>
                        <Button variant="outline" className="w-full">
                            Cancel
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

function AddProductForm({ onProductAdded }: { onProductAdded: () => void }) {
    const [formData, setFormData] = React.useState({
        title: "",
        price: 0,
        description: "",
        categoryId: 1,
        images: [] as string[]
    })
    const [isLoading, setIsLoading] = React.useState(false)
    const [previewImage, setPreviewImage] = React.useState<string | null>(null)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setFormData(prev => ({
            ...prev,
            [id]: id === 'price' ? parseFloat(value) : value
        }))
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                const base64String = reader.result as string
                setFormData(prev => ({
                    ...prev,
                    images: [base64String]
                }))
                setPreviewImage(base64String)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.images.length) {
            toast.error("Please upload an image")
            return
        }

        setIsLoading(true)

        try {
            const response = await axios.post(
                'https://api.escuelajs.co/api/v1/products/',
                formData
            )
            toast.success("Product added successfully!")
            setFormData({
                title: "",
                price: 0,
                description: "",
                categoryId: 1,
                images: []
            })
            setPreviewImage(null)
            onProductAdded()
        } catch (error) {
            toast.error("Failed to add product")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="px-3">
                    <span className="hidden md:inline">Add Product</span>
                    <span className="md:hidden">Add</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col">
                <SheetHeader>
                    <SheetTitle>Add New Product</SheetTitle>
                    <SheetDescription>Create a new product entry</SheetDescription>
                </SheetHeader>
                <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4 py-4">
                    <div className="flex flex-col gap-3">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label htmlFor="price">Price</Label>
                        <Input
                            id="price"
                            type="number"
                            value={formData.price}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label htmlFor="image">Product Image</Label>
                        <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            required
                        />
                        {previewImage && (
                            <div className="mt-2">
                                <img
                                    src={previewImage}
                                    alt="Preview"
                                    className="h-32 w-32 object-cover rounded-md"
                                />
                            </div>
                        )}
                    </div>
                    <SheetFooter className="mt-auto">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Adding..." : "Add Product"}
                        </Button>
                        <SheetClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </SheetClose>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}

function DraggableRow({ row }: { row: Row<any> }) {
    const { transform, transition, setNodeRef, isDragging } = useSortable({
        id: row.original.id,
    })

    return (
        <TableRow
            data-state={row.getIsSelected() && "selected"}
            data-dragging={isDragging}
            ref={setNodeRef}
            className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
            style={{
                transform: CSS.Transform.toString(transform),
                transition: transition,
            }}
        >
            {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
            ))}
        </TableRow>
    )
}

interface DataTableProps {
    data: Array<{ id: string; title: string; price: number; category?: { name: string }; images?: string[]; description?: string; slug?: string }>;
    onDelete: (id: string) => void;
    onUpdate: (updatedItem: any) => void;
}

export function DataTable({ data: initialData, onDelete, onUpdate }: DataTableProps) {
    if (!initialData || initialData.length === 0) {
        return <div className="flex items-center justify-center p-8">Loading products...</div>
    }

    const [data, setData] = React.useState(() => initialData)
    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] = React.useState({})
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    })
    const sortableId = React.useId()
    const sensors = useSensors(
        useSensor(MouseSensor, {}),
        useSensor(TouchSensor, {}),
        useSensor(KeyboardSensor, {})
    )

    React.useEffect(() => {
        setData(initialData)
    }, [initialData])

    const columns = React.useMemo(() => [
        {
            id: "drag",
            header: () => null,
            cell: ({ row }: { row: Row<any> }) => <DragHandle id={row.original.id} />,
        },
        {
            id: "select",
            header: ({ table }: { table: any }) => (
                <div className="flex items-center justify-center">
                    <Checkbox
                        checked={
                            table.getIsAllPageRowsSelected() ||
                            (table.getIsSomePageRowsSelected() && "indeterminate")
                        }
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                    />
                </div>
            ),
            cell: ({ row }: { row: Row<any> }) => (
                <div className="flex items-center justify-center">
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                    />
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "title",
            header: "Product",
            cell: ({ row }: { row: Row<any> }) => {
                return (
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 overflow-hidden rounded-full">
                            <img
                                src={row.original.images?.[0] || "/placeholder-product.jpg"}
                                alt={row.original.title}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <ProductCellViewer item={row.original} onUpdate={onUpdate} />
                    </div>
                )
            },
            enableHiding: false,
        },
        {
            accessorKey: "category.name",
            header: "Category",
            cell: ({ row }: { row: Row<any> }) => (
                <div className="w-32">
                    <Badge variant="outline" className="px-1.5 text-muted-foreground">
                        {row.original.category?.name || "Uncategorized"}
                    </Badge>
                </div>
            ),
        },
        {
            accessorKey: "price",
            header: () => <div className="w-full text-right">Price</div>,
            cell: ({ row }: { row: Row<any> }) => (
                <div className="text-right font-medium">
                    ${row.original.price}
                </div>
            ),
        },
        {
            id: "actions",
            cell: ({ row }: { row: Row<any> }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
                            size="icon"
                        >
                            <MoreVerticalIcon />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem onClick={() => toast.info("Duplicated product")}>
                            Make a copy
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onDelete(row.original.id)}>
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ], [onDelete, onUpdate])

    const dataIds = React.useMemo(
        () => data?.map(({ id }) => id) || [],
        [data]
    )

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
            pagination,
        },
        getRowId: (row) => row.id.toString(),
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    })

    function handleDragEnd(event: { active: any; over: any }) {
        const { active, over } = event
        if (active && over && active.id !== over.id) {
            setData((data) => {
                const oldIndex = dataIds.indexOf(active.id)
                const newIndex = dataIds.indexOf(over.id)
                return arrayMove(data, oldIndex, newIndex)
            })
        }
    }

    const handleProductAdded = () => {
        // You might want to refresh the data here
        // For now, we'll just show a success message
    }

    return (
        <Tabs
            defaultValue="products"
            className="flex w-full flex-col justify-start gap-6"
        >
            <div className="flex items-center justify-between px-4 lg:px-6">
                <TabsList className="@4xl/main:flex">
                    <TabsTrigger value="products">Products</TabsTrigger>
                    <TabsTrigger value="categories" className="gap-1">
                        Categories{" "}
                        <Badge
                            variant="secondary"
                            className="flex h-5 w-5 items-center justify-center rounded-full bg-muted-foreground/30"
                        >
                            5
                        </Badge>
                    </TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <ColumnsIcon className="mr-2 h-4 w-4" />
                                <span className="hidden lg:inline">Columns</span>
                                <ChevronDownIcon className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            {table
                                .getAllColumns()
                                .filter(
                                    (column) =>
                                        typeof column.accessorFn !== "undefined" &&
                                        column.getCanHide()
                                )
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id === "category.name" ? "Category" : column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <AddProductForm onProductAdded={handleProductAdded} />
                </div>
            </div>
            <TabsContent
                value="products"
                className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
            >
                <div className="overflow-hidden rounded-lg border">
                    <DndContext
                        collisionDetection={closestCenter}
                        modifiers={[restrictToVerticalAxis]}
                        onDragEnd={handleDragEnd}
                        sensors={sensors}
                        id={sortableId}
                    >
                        <Table>
                            <TableHeader className="sticky top-0 z-10 bg-muted">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead key={header.id} colSpan={header.colSpan}>
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                </TableHead>
                                            )
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    <SortableContext
                                        items={dataIds}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        {table.getRowModel().rows.map((row) => (
                                            <DraggableRow key={row.id} row={row} />
                                        ))}
                                    </SortableContext>
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className="h-24 text-center"
                                        >
                                            No products found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </DndContext>
                </div>
                <div className="flex items-center justify-between px-4">
                    <div className="hidden flex-1 text-sm text-muted-foreground md:flex">
                        {table.getFilteredSelectedRowModel().rows.length} of{" "}
                        {table.getFilteredRowModel().rows.length} product(s) selected.
                    </div>
                    <div className="flex w-full items-center gap-8 lg:w-fit">
                        <div className="hidden items-center gap-2 lg:flex">
                            <Label htmlFor="rows-per-page" className="text-sm font-medium">
                                Rows per page
                            </Label>
                            <Select
                                value={`${table.getState().pagination.pageSize}`}
                                onValueChange={(value) => {
                                    table.setPageSize(Number(value))
                                }}
                            >
                                <SelectTrigger className="w-20" id="rows-per-page">
                                    <SelectValue
                                        placeholder={table.getState().pagination.pageSize}
                                    />
                                </SelectTrigger>
                                <SelectContent side="top">
                                    {[10, 20, 30, 40, 50].map((pageSize) => (
                                        <SelectItem key={pageSize} value={`${pageSize}`}>
                                            {pageSize}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex w-fit items-center justify-center text-sm font-medium">
                            Page {table.getState().pagination.pageIndex + 1} of{" "}
                            {table.getPageCount()}
                        </div>
                        <div className="ml-auto flex items-center gap-2 lg:ml-0">
                            <Button
                                variant="outline"
                                className="hidden h-8 w-8 p-0 lg:flex"
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">Go to first page</span>
                                <ChevronsLeftIcon />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">Go to previous page</span>
                                <ChevronLeftIcon />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Go to next page</span>
                                <ChevronRightIcon />
                            </Button>
                            <Button
                                variant="outline"
                                className="hidden size-8 lg:flex"
                                size="icon"
                                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Go to last page</span>
                                <ChevronsRightIcon />
                            </Button>
                        </div>
                    </div>
                </div>
            </TabsContent>
            <TabsContent
                value="categories"
                className="flex flex-col px-4 lg:px-6"
            >
                <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
                    Categories content will appear here
                </div>
            </TabsContent>
        </Tabs>
    )
}