import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from 'lucide-react';

export const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, resourceName, isDeleting }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
               <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-500" />
            </div>
            <DialogTitle>Delete Resource</DialogTitle>
          </div>
          <DialogDescription className="pt-3">
            Are you sure you want to delete <span className="font-semibold text-slate-900 dark:text-slate-100">{resourceName}</span>? 
            This action cannot be undone and will permanently remove this facility from the campus catalogue.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end mt-4">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete Resource"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
