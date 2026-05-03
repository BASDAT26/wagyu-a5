import { useState } from "react";
import { Button } from "@wagyu-a5/ui/components/button";
import { Input } from "@wagyu-a5/ui/components/input";
import { Label } from "@wagyu-a5/ui/components/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@wagyu-a5/ui/components/card";
import { Chip } from "@wagyu-a5/ui/components/chip";
import { Checkbox } from "@wagyu-a5/ui/components/checkbox";
import {
  Modal,
  ModalBody,
  ModalClose,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalPopup,
  ModalTitle,
  ModalTrigger,
} from "@wagyu-a5/ui/components/modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@wagyu-a5/ui/components/dropdown-menu";
import Navbar from "@/components/Navbar";

export default function DesignSystem() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <div className="w-full min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Design System Showcase</h1>
          <p className="text-muted-foreground">Components and their variants</p>
        </div>

        {/* Buttons Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Buttons</h2>

          <div className="space-y-4">
            {/* Variants */}
            <div>
              <h3 className="text-sm font-medium mb-2">Variants</h3>
              <div className="flex flex-wrap gap-2">
                <Button variant="default">Default</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link</Button>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="text-sm font-medium mb-2">Sizes</h3>
              <div className="flex flex-wrap gap-2 items-center">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>

            {/* States */}
            <div>
              <h3 className="text-sm font-medium mb-2">States</h3>
              <div className="flex flex-wrap gap-2">
                <Button>Normal</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Input Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Inputs</h2>

          <div className="space-y-4 max-w-sm">
            <div>
              <Label htmlFor="input-default">Default Input</Label>
              <Input id="input-default" placeholder="Enter text..." />
            </div>

            <div>
              <Label htmlFor="input-email">Email Input</Label>
              <Input id="input-email" type="email" placeholder="Enter email..." />
            </div>

            <div>
              <Label htmlFor="input-disabled">Disabled Input</Label>
              <Input id="input-disabled" placeholder="Disabled..." disabled />
            </div>

            <div>
              <Label htmlFor="input-error">Error Input</Label>
              <Input id="input-error" placeholder="Error state..." aria-invalid="true" />
            </div>
          </div>
        </section>

        {/* Chip Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Chips</h2>

          <div className="space-y-4">
            {/* Variants */}
            <div>
              <h3 className="text-sm font-medium mb-2">Variants</h3>
              <div className="flex flex-wrap gap-2">
                <Chip variant="default">Default</Chip>
                <Chip variant="secondary">Secondary</Chip>
                <Chip variant="outline">Outline</Chip>
                <Chip variant="destructive">Destructive</Chip>
                <Chip variant="success">Success</Chip>
                <Chip variant="warning">Warning</Chip>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="text-sm font-medium mb-2">Sizes</h3>
              <div className="flex flex-wrap gap-2 items-center">
                <Chip size="sm">Small</Chip>
                <Chip size="default">Default</Chip>
                <Chip size="lg">Large</Chip>
              </div>
            </div>

            {/* Removable */}
            <div>
              <h3 className="text-sm font-medium mb-2">Removable</h3>
              <div className="flex flex-wrap gap-2">
                <Chip removable onRemove={() => {}}>
                  Removable Chip
                </Chip>
              </div>
            </div>
          </div>
        </section>

        {/* Checkbox Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Checkboxes</h2>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Checkbox id="check-1" defaultChecked />
              <Label htmlFor="check-1">Checked</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="check-2" />
              <Label htmlFor="check-2">Unchecked</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="check-3" disabled defaultChecked />
              <Label htmlFor="check-3">Disabled Checked</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="check-4" disabled />
              <Label htmlFor="check-4">Disabled Unchecked</Label>
            </div>
          </div>
        </section>

        {/* Card Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Cards</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Default Card</CardTitle>
                <CardDescription>This is a default card with title and description</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Card content goes here. This is a flexible container for various content types.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Small Card</CardTitle>
                <CardDescription>This is a small variant card</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Compact content with reduced padding.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Card with Multiple Sections</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Main content area.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Modal Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Modals</h2>

          <div className="flex flex-wrap gap-4">
            {/* Basic Modal */}
            <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
              <ModalTrigger asChild>
                <Button>Open Basic Modal</Button>
              </ModalTrigger>
              <ModalPopup>
                <ModalHeader>
                  <ModalTitle>Basic Modal</ModalTitle>
                  <ModalDescription>This is a simple modal dialog</ModalDescription>
                </ModalHeader>
                <ModalBody>
                  <p>Modal content goes here. You can put any content inside.</p>
                </ModalBody>
                <ModalFooter>
                  <ModalClose>
                    <Button variant="outline">Close</Button>
                  </ModalClose>
                  <Button>Action</Button>
                </ModalFooter>
              </ModalPopup>
            </Modal>

            {/* Destructive Modal */}
            <Modal open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
              <ModalTrigger asChild>
                <Button variant="destructive">Delete Confirmation</Button>
              </ModalTrigger>
              <ModalPopup>
                <ModalHeader>
                  <ModalTitle>Hapus Data</ModalTitle>
                  <ModalDescription>Apakah kamu yakin ingin menghapus data ini?</ModalDescription>
                </ModalHeader>
                <ModalBody>
                  <p>Data yang dihapus tidak dapat dikembalikan.</p>
                </ModalBody>
                <ModalFooter>
                  <ModalClose>
                    <Button variant="outline">Batal</Button>
                  </ModalClose>
                  <Button variant="destructive">Hapus</Button>
                </ModalFooter>
              </ModalPopup>
            </Modal>
          </div>
        </section>

        {/* DropdownMenu Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Dropdown Menus</h2>

          <div className="flex flex-wrap gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>Open Menu</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Options</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Copy</DropdownMenuItem>
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </section>

        {/* Headers Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Headers</h2>

          <div className="space-y-8">
            {/* Guest Header */}
            <div>
              <h3 className="text-sm font-medium mb-2">Guest Header</h3>
              <div className="border rounded-lg overflow-hidden">
                <Navbar />
              </div>
            </div>

            {/* Customer Header */}
            <div>
              <h3 className="text-sm font-medium mb-2">Customer Header</h3>
              <div className="border rounded-lg overflow-hidden">
                <Navbar role="CUSTOMER" />
              </div>
            </div>

            {/* Organizer Header */}
            <div>
              <h3 className="text-sm font-medium mb-2">Organizer Header</h3>
              <div className="border rounded-lg overflow-hidden">
                <Navbar role="ORGANIZER" />
              </div>
            </div>

            {/* Admin Header */}
            <div>
              <h3 className="text-sm font-medium mb-2">Admin Header</h3>
              <div className="border rounded-lg overflow-hidden">
                <Navbar role="ADMIN" />
              </div>
            </div>
          </div>
        </section>

        {/* Typography Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Typography</h2>

          <div className="space-y-2">
            <h3 className="text-3xl font-bold">Heading 3 (Bold)</h3>
            <h4 className="text-2xl font-semibold">Heading 4 (Semibold)</h4>
            <p className="text-base">Body text (base)</p>
            <p className="text-sm">Small text</p>
            <p className="text-xs">Extra small text</p>
            <p className="text-muted-foreground">Muted foreground text</p>
          </div>
        </section>
      </div>
    </div>
  );
}
