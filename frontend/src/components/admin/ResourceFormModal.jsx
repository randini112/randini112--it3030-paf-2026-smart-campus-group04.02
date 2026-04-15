import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(100),
  description: z.string().max(500).optional().or(z.literal('')),
  type: z.enum(['HALL', 'LAB', 'MEETING_ROOM', 'EQUIPMENT'], {
    required_error: "Please select a resource type",
  }),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1").max(10000),
  location: z.string().min(2, "Location is required").max(150),
  status: z.enum(['ACTIVE', 'OUT_OF_SERVICE']).default('ACTIVE'),
  availStart: z.string().min(1, "Start time required"),
  availEnd: z.string().min(1, "End time required"),
});

export const ResourceFormModal = ({ isOpen, onClose, onSave, editingResource, isSaving }) => {
  const isEditing = !!editingResource;

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      type: 'HALL',
      capacity: 30,
      location: '',
      status: 'ACTIVE',
      availStart: '08:00',
      availEnd: '18:00'
    }
  });

  useEffect(() => {
    if (isOpen) {
      if (editingResource) {
        // Reset form with editing resource values
        reset({
          name: editingResource.name || '',
          description: editingResource.description || '',
          type: editingResource.type || 'HALL',
          capacity: editingResource.capacity || 30,
          location: editingResource.location || '',
          status: editingResource.status || 'ACTIVE',
          availStart: editingResource.availStart || '08:00',
          availEnd: editingResource.availEnd || '18:00'
        });
      } else {
        // Reset to default empty values
        reset({
          name: '',
          description: '',
          type: 'HALL',
          capacity: 30,
          location: '',
          status: 'ACTIVE',
          availStart: '08:00',
          availEnd: '18:00'
        });
      }
    }
  }, [isOpen, editingResource, reset]);

  const onSubmit = async (data) => {
    await onSave(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
               <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-500" />
            </div>
            <div>
              <DialogTitle>{isEditing ? 'Edit Facility' : 'Add New Facility'}</DialogTitle>
              <DialogDescription>
                {isEditing ? 'Update the details of the existing facility below.' : 'Enter details to register a new campus facility.'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2 md:col-span-1">
              <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
              <Input id="name" placeholder="e.g. Main Auditorium" {...register('name')} />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2 col-span-2 md:col-span-1">
              <Label htmlFor="type">Resource Type <span className="text-red-500">*</span></Label>
              <Select 
                onValueChange={(val) => setValue('type', val)} 
                defaultValue={watch('type')} 
                value={watch('type')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HALL">Lecture Hall</SelectItem>
                  <SelectItem value="LAB">Laboratory</SelectItem>
                  <SelectItem value="MEETING_ROOM">Meeting Room</SelectItem>
                  <SelectItem value="EQUIPMENT">Equipment</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <p className="text-xs text-red-500">{errors.type.message}</p>}
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" placeholder="Brief description of the facility" {...register('description')} />
              {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
            </div>

            <div className="space-y-2 col-span-2 md:col-span-1">
              <Label htmlFor="location">Location <span className="text-red-500">*</span></Label>
              <Input id="location" placeholder="e.g. Building A, 2nd Floor" {...register('location')} />
              {errors.location && <p className="text-xs text-red-500">{errors.location.message}</p>}
            </div>

            <div className="space-y-2 col-span-2 md:col-span-1">
              <Label htmlFor="capacity">Capacity <span className="text-red-500">*</span></Label>
              <Input id="capacity" type="number" min="1" {...register('capacity')} />
              {errors.capacity && <p className="text-xs text-red-500">{errors.capacity.message}</p>}
            </div>
            
            {/* Availability Times */}
            <div className="space-y-2 col-span-2 md:col-span-1">
              <Label htmlFor="availStart">Availability Start <span className="text-red-500">*</span></Label>
              <Input id="availStart" type="time" {...register('availStart')} />
              {errors.availStart && <p className="text-xs text-red-500">{errors.availStart.message}</p>}
            </div>

            <div className="space-y-2 col-span-2 md:col-span-1">
              <Label htmlFor="availEnd">Availability End <span className="text-red-500">*</span></Label>
              <Input id="availEnd" type="time" {...register('availEnd')} />
              {errors.availEnd && <p className="text-xs text-red-500">{errors.availEnd.message}</p>}
            </div>
            
            {isEditing && (
              <div className="space-y-2 col-span-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  onValueChange={(val) => setValue('status', val)} 
                  defaultValue={watch('status')}
                  value={watch('status')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active (Available)</SelectItem>
                    <SelectItem value="OUT_OF_SERVICE">Out of Service (Maintenance)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isSaving}>
              {isSaving ? "Saving..." : (isEditing ? "Update Facility" : "Add Facility")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
