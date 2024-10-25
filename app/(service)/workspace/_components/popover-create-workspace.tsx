"use client";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewWorkspaceSchema } from "@/schemas";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { createWorkspace } from "@/actions/workspace-action";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import Link from "next/link";
import { WORKSPACE_URL } from "@/lib/constant";

interface PopoverCreateWorkspaceProps {
  children: React.ReactNode;
}
export default function PopoverCreateWorkspace({
  children,
}: PopoverCreateWorkspaceProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<z.infer<typeof NewWorkspaceSchema>>({
    resolver: zodResolver(NewWorkspaceSchema),
    defaultValues: {
      name: "",
      description: "",
      // and colorscheme
    },
  });
  const onSubmit = (values: z.infer<typeof NewWorkspaceSchema>) => {
    if (!session || !session.user) {
      return { message: "User not authenticated", statas: "error" };
    }

    const userId = session.user.id;
    startTransition(async () => {
      const result = await createWorkspace({ ...values }, userId!);

      if (result.status === "success") {
        router.push(`${WORKSPACE_URL}/${result.workspaceId}`);
        handleClose();
      } else if (result.status === "error") {
        toast({
          title: result.title,
          description: result.description,
          variant: "dark",
          action: (
            <Link href={"/dnd"}>
              <ToastAction altText="Go to workspaces page.">Manage</ToastAction>
            </Link>
          ),
        });
      }
    });
  };
  const handleClose = () => {
    form.reset();
    setIsOpen(false);
  };
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent align="start" className="flex flex-col ">
        <div className="flex flex-row justify-between">
          <div className="font-bold text-xs mb-3">Create new workspace</div>
          <PopoverClose asChild>
            <X size={14} color="gray" className="hover:cursor-pointer" />
          </PopoverClose>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-1 ">
                  <div className="flex flex-row justify-between">
                    <FormLabel className="text-xs">Name</FormLabel>
                    <FormMessage className="text-xs" />
                  </div>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      className="h-8 text-black text-xs px-1"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-xs">Description</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      className="h-8 text-black text-xs px-1"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-center items-end w-full h-10 ">
              <Button
                type="submit"
                className="w-full h-8 "
                variant="confirm"
                disabled={isPending}
              >
                <div className="text-xs">Create workspace</div>
              </Button>
            </div>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
