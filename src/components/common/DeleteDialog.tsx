// import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DeleteDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onDelete: () => void
}

export default function DeleteDialog({ isOpen, onOpenChange, onDelete }: DeleteDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="flex justify-center mb-6">
          {/* <Image
            src="/placeholder.svg"
            alt="Delete Icon"
            width={40}
            height={40}
            className="rounded"
          /> */}
        </div>
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl text-center">
            Are you sure you want to delete this record?
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            This action cannot be undone. Please confirm if you wish to proceed.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center mt-6">
          <Button 
            variant="destructive" 
            className="w-full bg-[#F05656] hover:bg-[#E04646] text-white rounded-lg py-6"
            onClick={() => {
              onDelete()
              onOpenChange(false)
            }}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

