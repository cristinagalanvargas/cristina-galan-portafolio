"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/**
 * Dialog popup for "projection" moments (reel, lightbox): near-opaque black
 * room instead of the default translucent overlay. Use inside shadcn <Dialog>.
 */
export function ProjectionContent({ className, children, ...props }: DialogPrimitive.Popup.Props) {
  return (
    <DialogPortal>
      <DialogOverlay className="bg-black/95 duration-300 supports-backdrop-filter:backdrop-blur-none" />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          "fixed inset-0 z-50 flex flex-col text-white outline-none data-open:animate-in data-open:duration-500 data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
          className,
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Popup>
    </DialogPortal>
  );
}
