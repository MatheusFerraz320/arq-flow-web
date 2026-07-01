"use client";

import {
  cloneElement,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
  type HTMLAttributes,
} from "react";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextType>({
  open: false,
  onOpenChange: () => {},
});

function Dialog({
  open: controlledOpen,
  onOpenChange,
  children,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = useCallback(
    (val: boolean) => {
      if (!isControlled) setInternalOpen(val);
      onOpenChange?.(val);
    },
    [isControlled, onOpenChange],
  );

  return (
    <DialogContext.Provider value={{ open, onOpenChange: setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

function DialogTrigger({
  children,
  className,
  render,
  ...props
}: HTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
  render?: ReactElement;
}) {
  const { onOpenChange } = useContext(DialogContext);
  const handleClick = () => onOpenChange(true);

  if (render) {
    const renderEl = render as React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>;
    return cloneElement(renderEl, {
      onClick: (e: React.MouseEvent) => {
        renderEl.props.onClick?.(e);
        handleClick();
      },
    });
  }

  return (
    <button
      type="button"
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: { showCloseButton?: boolean } & React.ComponentPropsWithoutRef<"dialog">) {
  const { open, onOpenChange } = useContext(DialogContext);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open) {
      el.showModal();
    } else {
      el.close();
    }
  }, [open]);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    const handleClose = () => onOpenChange(false);
    el.addEventListener("close", handleClose);
    return () => el.removeEventListener("close", handleClose);
  }, [onOpenChange]);

  const handleBackdropClick: React.MouseEventHandler<HTMLDialogElement> = (
    e,
  ) => {
    if (e.target === dialogRef.current) {
      onOpenChange(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      data-slot="dialog-content"
      className={cn(
        "fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-[calc(100%-2rem)] sm:max-w-md gap-5 rounded-xl bg-popover p-6 text-base text-popover-foreground ring-1 ring-border outline-none backdrop:bg-black/10 backdrop:backdrop-blur-xs open:animate-scale-in",
        className,
      )}
      onClick={handleBackdropClick}
      {...props}
    >
      {children}
      {showCloseButton && (
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute top-2 right-2 inline-flex items-center justify-center rounded-lg size-7 hover:bg-muted transition-colors"
          aria-label="Close"
        >
          <XIcon className="size-4" />
        </button>
      )}
    </dialog>
  );
}

function DialogHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function DialogFooter({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "-mx-6 -mb-6 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-5 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}

function DialogTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-slot="dialog-description"
      className={cn(
        "text-base text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
};
