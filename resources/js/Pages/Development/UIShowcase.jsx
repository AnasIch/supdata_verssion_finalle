import { Head } from "@inertiajs/react";
import { useState } from "react";
import {
    AlertCircle,
    CheckCircle2,
    Info,
    AlertTriangle,
    Inbox,
    ChevronRight,
    Loader2,
    Search,
    User,
    Settings,
    CreditCard,
    LogOut,
} from "lucide-react";

import { Button } from "@/Components/UI/Button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/UI/Card";
import { Input } from "@/Components/UI/Input";
import { Textarea } from "@/Components/UI/Textarea";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
    SelectSeparator,
} from "@/Components/UI/Select";
import { Checkbox } from "@/Components/UI/Checkbox";
import { Switch } from "@/Components/UI/Switch";
import { Badge } from "@/Components/UI/Badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/UI/Avatar";
import { Alert, AlertTitle, AlertDescription } from "@/Components/UI/Alert";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/UI/Dialog";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/Components/UI/Drawer";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/UI/DropdownMenu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/UI/Table";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/Components/UI/Pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/UI/Tabs";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/UI/Breadcrumb";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/UI/Tooltip";
import { Skeleton } from "@/Components/UI/Skeleton";
import { Spinner } from "@/Components/UI/Spinner";
import { EmptyState } from "@/Components/UI/EmptyState";
import { SearchInput } from "@/Components/UI/SearchInput";
import { DataTable } from "@/Components/UI/DataTable";
import { PageHeader } from "@/Components/UI/PageHeader";

const Section = ({ title, children }) => (
    <div className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">{title}</h2>
        <div className="space-y-4">{children}</div>
    </div>
);

export default function UIShowcase() {
    const [search, setSearch] = useState("");
    const [selectValue, setSelectValue] = useState("");
    const [page, setPage] = useState(1);
    const [dataLoading, setDataLoading] = useState(false);

    const sampleData = [
        { id: 1, name: "Alice Martin", email: "alice@supdata.com", role: "Admin", status: "Active" },
        { id: 2, name: "Bob Dupont", email: "bob@supdata.com", role: "Manager", status: "Active" },
        { id: 3, name: "Claire Leroy", email: "claire@supdata.com", role: "User", status: "Inactive" },
        { id: 4, name: "David Moreau", email: "david@supdata.com", role: "User", status: "Active" },
        { id: 5, name: "Emma Petit", email: "emma@supdata.com", role: "Admin", status: "Active" },
    ];

    const columns = [
        { header: "Name", accessorKey: "name" },
        { header: "Email", accessorKey: "email" },
        { header: "Role", accessorKey: "role" },
        {
            header: "Status",
            cell: (row) => (
                <Badge variant={row.status === "Active" ? "success" : "secondary"}>
                    {row.status}
                </Badge>
            ),
        },
    ];

    return (
        <TooltipProvider>
            <Head title="UI Showcase" />
            <div className="min-h-screen bg-background">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header */}
                    <PageHeader
                        title="UI Showcase"
                        description="SUPDATA Design System Preview"
                    />

                    <div className="mt-8 flex flex-col gap-12">
                        {/* Section 1: Typography */}
                        <Section title="Typography">
                            <div className="space-y-3">
                                <h1 className="text-4xl font-bold">Heading 1</h1>
                                <h2 className="text-3xl font-bold">Heading 2</h2>
                                <h3 className="text-2xl font-semibold">Heading 3</h3>
                                <h4 className="text-xl font-semibold">Heading 4</h4>
                                <h5 className="text-lg font-medium">Heading 5</h5>
                                <h6 className="text-base font-medium">Heading 6</h6>
                                <p className="text-base">
                                    Body text — Le quick brown fox saute par-dessus le chien paresseux.
                                </p>
                                <p className="text-sm">
                                    Small text —用于辅助说明的文字。
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Muted text — Information secondaire.
                                </p>
                            </div>
                        </Section>

                        {/* Section 2: Colors */}
                        <Section title="Colors">
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                                {[
                                    { name: "Primary", color: "bg-primary text-primary-foreground" },
                                    { name: "Secondary", color: "bg-secondary text-secondary-foreground" },
                                    { name: "Success", color: "bg-success text-success-foreground" },
                                    { name: "Warning", color: "bg-warning text-warning-foreground" },
                                    { name: "Destructive", color: "bg-destructive text-destructive-foreground" },
                                    { name: "Info", color: "bg-info text-info-foreground" },
                                    { name: "Background", color: "bg-background border" },
                                    { name: "Card", color: "bg-card border" },
                                    { name: "Muted", color: "bg-muted text-muted-foreground" },
                                    { name: "Accent", color: "bg-accent text-accent-foreground" },
                                    { name: "Border", color: "bg-border" },
                                    { name: "Ring", color: "bg-ring" },
                                ].map((c) => (
                                    <div
                                        key={c.name}
                                        className={`rounded-lg p-4 flex items-end min-h-[5rem] ${c.color}`}
                                    >
                                        <span className="text-xs font-medium">{c.name}</span>
                                    </div>
                                ))}
                            </div>
                        </Section>

                        {/* Section 3: Buttons */}
                        <Section title="Buttons">
                            <div className="space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    <Button>Default</Button>
                                    <Button variant="secondary">Secondary</Button>
                                    <Button variant="outline">Outline</Button>
                                    <Button variant="ghost">Ghost</Button>
                                    <Button variant="link">Link</Button>
                                    <Button variant="destructive">Destructive</Button>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <Button size="sm">Small</Button>
                                    <Button>Default</Button>
                                    <Button size="lg">Large</Button>
                                    <Button size="icon"><Settings /></Button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Button disabled>Disabled</Button>
                                    <Button disabled>
                                        <Loader2 className="animate-spin" data-icon="inline-start" />
                                        Loading...
                                    </Button>
                                </div>
                            </div>
                        </Section>

                        {/* Section 4: Inputs */}
                        <Section title="Inputs">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Default</label>
                                    <Input placeholder="Default input" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Password</label>
                                    <Input type="password" placeholder="Password" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <Input type="email" placeholder="email@supdata.com" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Number</label>
                                    <Input type="number" placeholder="0" />
                                </div>
                                <div className="space-y-2 sm:col-span-2">
                                    <label className="text-sm font-medium">Textarea</label>
                                    <Textarea placeholder="Write something..." />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Search Input</label>
                                    <SearchInput
                                        placeholder="Search..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onClear={() => setSearch("")}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Disabled</label>
                                    <Input placeholder="Disabled" disabled />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-destructive">Error</label>
                                    <Input aria-invalid placeholder="Invalid input" className="border-destructive" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-success">Success</label>
                                    <Input placeholder="Valid input" className="border-success" />
                                </div>
                            </div>
                        </Section>

                        {/* Section 5: Select */}
                        <Section title="Select">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Simple Select</label>
                                    <Select value={selectValue} onValueChange={setSelectValue}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Choose..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Roles</SelectLabel>
                                                <SelectItem value="admin">Admin</SelectItem>
                                                <SelectItem value="manager">Manager</SelectItem>
                                                <SelectItem value="user">User</SelectItem>
                                            </SelectGroup>
                                            <SelectSeparator />
                                            <SelectGroup>
                                                <SelectLabel>Other</SelectLabel>
                                                <SelectItem value="guest">Guest</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Status</label>
                                    <Select>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select status..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="inactive">Inactive</SelectItem>
                                                <SelectItem value="pending">Pending</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </Section>

                        {/* Section 6: Checkbox */}
                        <Section title="Checkbox">
                            <div className="flex flex-wrap items-center gap-6">
                                <label className="flex items-center gap-2">
                                    <Checkbox defaultChecked />
                                    <span className="text-sm">Checked</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <Checkbox />
                                    <span className="text-sm">Unchecked</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <Checkbox disabled />
                                    <span className="text-sm">Disabled</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <Checkbox disabled defaultChecked />
                                    <span className="text-sm">Disabled Checked</span>
                                </label>
                            </div>
                        </Section>

                        {/* Section 7: Switch */}
                        <Section title="Switch">
                            <div className="flex flex-wrap items-center gap-6">
                                <label className="flex items-center gap-2">
                                    <Switch defaultChecked />
                                    <span className="text-sm">ON</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <Switch />
                                    <span className="text-sm">OFF</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <Switch disabled />
                                    <span className="text-sm">Disabled</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <Switch disabled defaultChecked />
                                    <span className="text-sm">Disabled ON</span>
                                </label>
                            </div>
                        </Section>

                        {/* Section 8: Badges */}
                        <Section title="Badges">
                            <div className="flex flex-wrap gap-2">
                                <Badge>Default</Badge>
                                <Badge variant="secondary">Secondary</Badge>
                                <Badge variant="destructive">Destructive</Badge>
                                <Badge variant="outline">Outline</Badge>
                                <Badge variant="success">Success</Badge>
                                <Badge variant="warning">Warning</Badge>
                                <Badge variant="info">Info</Badge>
                            </div>
                        </Section>

                        {/* Section 9: Avatar */}
                        <Section title="Avatar">
                            <div className="flex flex-wrap items-center gap-4">
                                <Avatar className="size-8">
                                    <AvatarFallback className="text-xs">SM</AvatarFallback>
                                </Avatar>
                                <Avatar className="size-10">
                                    <AvatarFallback>MD</AvatarFallback>
                                </Avatar>
                                <Avatar className="size-14">
                                    <AvatarFallback className="text-lg">LG</AvatarFallback>
                                </Avatar>
                                <Avatar className="size-10">
                                    <AvatarImage src="https://i.pravatar.cc/150?img=3" alt="User" />
                                    <AvatarFallback>US</AvatarFallback>
                                </Avatar>
                                <Avatar className="size-10">
                                    <AvatarFallback><User className="size-4" /></AvatarFallback>
                                </Avatar>
                            </div>
                        </Section>

                        {/* Section 10: Alert */}
                        <Section title="Alert">
                            <div className="grid gap-4 md:grid-cols-2">
                                <Alert variant="success">
                                    <CheckCircle2 />
                                    <AlertTitle>Success</AlertTitle>
                                    <AlertDescription>Action completed successfully.</AlertDescription>
                                </Alert>
                                <Alert variant="info">
                                    <Info />
                                    <AlertTitle>Info</AlertTitle>
                                    <AlertDescription>This is an informational message.</AlertDescription>
                                </Alert>
                                <Alert variant="warning">
                                    <AlertTriangle />
                                    <AlertTitle>Warning</AlertTitle>
                                    <AlertDescription>Please review before continuing.</AlertDescription>
                                </Alert>
                                <Alert variant="destructive">
                                    <AlertCircle />
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>Something went wrong.</AlertDescription>
                                </Alert>
                            </div>
                        </Section>

                        {/* Section 11: Dialog */}
                        <Section title="Dialog">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button>Open Dialog</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Edit Profile</DialogTitle>
                                        <DialogDescription>
                                            Make changes to your profile here. Click save when you&apos;re done.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex flex-col gap-4 py-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Name</label>
                                            <Input defaultValue="John Doe" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Email</label>
                                            <Input defaultValue="john@example.com" />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit">Save changes</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </Section>

                        {/* Section 12: Drawer */}
                        <Section title="Drawer">
                            <Drawer>
                                <DrawerTrigger asChild>
                                    <Button>Open Drawer</Button>
                                </DrawerTrigger>
                                <DrawerContent>
                                    <DrawerHeader>
                                        <DrawerTitle>Drawer Title</DrawerTitle>
                                        <DrawerDescription>
                                            This is a drawer component that slides from the bottom.
                                        </DrawerDescription>
                                    </DrawerHeader>
                                    <div className="p-4">
                                        <p className="text-sm text-muted-foreground">
                                            Drawer content goes here. You can put any content you want.
                                        </p>
                                    </div>
                                    <DrawerFooter>
                                        <Button>Submit</Button>
                                        <DrawerClose asChild>
                                            <Button variant="outline">Cancel</Button>
                                        </DrawerClose>
                                    </DrawerFooter>
                                </DrawerContent>
                            </Drawer>
                        </Section>

                        {/* Section 13: Dropdown Menu */}
                        <Section title="Dropdown Menu">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">Open Menu</Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <User className="mr-2 size-4" />
                                        Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <CreditCard className="mr-2 size-4" />
                                        Billing
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Settings className="mr-2 size-4" />
                                        Settings
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <LogOut className="mr-2 size-4" />
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </Section>

                        {/* Section 14: Tabs */}
                        <Section title="Tabs">
                            <Tabs defaultValue="account">
                                <TabsList>
                                    <TabsTrigger value="account">Account</TabsTrigger>
                                    <TabsTrigger value="password">Password</TabsTrigger>
                                    <TabsTrigger value="settings">Settings</TabsTrigger>
                                </TabsList>
                                <TabsContent value="account" className="mt-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Account</CardTitle>
                                            <CardDescription>
                                                Make changes to your account here.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Name</label>
                                                <Input defaultValue="Pedro Duarte" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Username</label>
                                                <Input defaultValue="@peduarte" />
                                            </div>
                                        </CardContent>
                                        <CardFooter>
                                            <Button>Save changes</Button>
                                        </CardFooter>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="password" className="mt-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Password</CardTitle>
                                            <CardDescription>
                                                Change your password here.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Current password</label>
                                                <Input type="password" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">New password</label>
                                                <Input type="password" />
                                            </div>
                                        </CardContent>
                                        <CardFooter>
                                            <Button>Update password</Button>
                                        </CardFooter>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="settings" className="mt-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Settings</CardTitle>
                                            <CardDescription>
                                                Manage your settings here.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center gap-4">
                                                <label className="text-sm font-medium">Notifications</label>
                                                <Switch defaultChecked />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </Section>

                        {/* Section 15: Breadcrumb */}
                        <Section title="Breadcrumb">
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href="#">Home</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>Current Page</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </Section>

                        {/* Section 16: Tooltip */}
                        <Section title="Tooltip">
                            <div className="flex flex-wrap gap-2">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline">Hover me</Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Default tooltip</p>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline">Info</Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>This is helpful information</p>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button size="icon" variant="ghost">
                                            <Info className="size-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Icon tooltip</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </Section>

                        {/* Section 17: Table */}
                        <Section title="Table">
                            <div className="rounded-lg border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {sampleData.map((row) => (
                                            <TableRow key={row.id}>
                                                <TableCell className="font-medium">{row.name}</TableCell>
                                                <TableCell>{row.email}</TableCell>
                                                <TableCell>{row.role}</TableCell>
                                                <TableCell>
                                                    <Badge variant={row.status === "Active" ? "success" : "secondary"}>
                                                        {row.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </Section>

                        {/* Section 18: Pagination */}
                        <Section title="Pagination">
                            <div className="flex flex-col items-center gap-4">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious href="#" />
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink href="#">1</PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink href="#" isActive>2</PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink href="#">3</PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink href="#">10</PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationNext href="#" />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(Math.max(1, page - 1))}
                                        disabled={page === 1}
                                    >
                                        Prev
                                    </Button>
                                    <span className="flex items-center px-3 text-sm">Page {page}</span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(page + 1)}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </Section>

                        {/* Section 19: Skeleton */}
                        <Section title="Skeleton">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-4">
                                    <Skeleton className="size-12 rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-48" />
                                        <Skeleton className="h-3 w-32" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-5/6" />
                                    <Skeleton className="h-4 w-4/6" />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <Skeleton className="h-24 rounded-lg" />
                                    <Skeleton className="h-24 rounded-lg" />
                                    <Skeleton className="h-24 rounded-lg" />
                                </div>
                            </div>
                        </Section>

                        {/* Section 20: Spinner */}
                        <Section title="Spinner">
                            <div className="flex flex-wrap items-center gap-4">
                                <Spinner className="size-4" />
                                <Spinner className="size-6" />
                                <Spinner className="size-8" />
                                <Spinner className="size-12" />
                            </div>
                        </Section>

                        {/* Section 21: Empty State */}
                        <Section title="Empty State">
                            <Card>
                                <CardContent className="p-0">
                                    <EmptyState
                                        title="No projects yet"
                                        description="Get started by creating your first project."
                                    >
                                        <Button>Create Project</Button>
                                    </EmptyState>
                                </CardContent>
                            </Card>
                        </Section>

                        {/* Section 22: Data Table */}
                        <Section title="Data Table">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-2">
                                    <SearchInput
                                        placeholder="Search users..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onClear={() => setSearch("")}
                                        className="max-w-sm"
                                    />
                                    <Button
                                        variant="outline"
                                        onClick={() => setDataLoading(!dataLoading)}
                                    >
                                        {dataLoading ? "Stop Loading" : "Show Loading"}
                                    </Button>
                                </div>
                                <DataTable
                                    columns={columns}
                                    data={search
                                        ? sampleData.filter((d) =>
                                            d.name.toLowerCase().includes(search.toLowerCase())
                                        )
                                        : sampleData
                                    }
                                    isLoading={dataLoading}
                                    emptyMessage="No results found."
                                />
                            </div>
                        </Section>

                        {/* Section 23: Page Header */}
                        <Section title="Page Header">
                            <div className="flex flex-col gap-6">
                                <PageHeader
                                    title="Simple Header"
                                    description="Just a title and description."
                                />
                                <PageHeader
                                    title="With Actions"
                                    description="Header with action buttons."
                                >
                                    <Button variant="outline">Cancel</Button>
                                    <Button>Save</Button>
                                </PageHeader>
                                <PageHeader
                                    title="Title Only"
                                />
                            </div>
                        </Section>

                        {/* Section 24: Cards */}
                        <Section title="Cards">
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Basic Card</CardTitle>
                                        <CardDescription>Default card with header and content.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            This is the card content area.
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>With Footer</CardTitle>
                                        <CardDescription>Card that includes a footer.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            Content goes here.
                                        </p>
                                    </CardContent>
                                    <CardFooter>
                                        <Button size="sm">Action</Button>
                                    </CardFooter>
                                </Card>
                                <Card className="border-primary">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            Highlighted
                                            <Badge variant="success">New</Badge>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            Card with a border highlight.
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </Section>
                    </div>
                </div>
            </div>
        </TooltipProvider>
    );
}
