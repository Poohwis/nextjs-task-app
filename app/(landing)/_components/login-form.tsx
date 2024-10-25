"use client";
import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { login } from "@/actions/login";
import { useEffect, useState, useTransition } from "react";
import { toast } from "@/components/ui/use-toast";

export default function Loginform() {
  const [isPending, startTransition] = useTransition();
  const [toastMessage, setToastMessage] = useState<{
    message: string | undefined;
    status: string | undefined;
  }>({ message: "", status: "" });
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setToastMessage({ message: "", status: "" });
    startTransition(() => {
      login(values).then((data) => {
        if (data) {
          setToastMessage(data);
        }
      });
    });
  };

  useEffect(() => {
    if (toastMessage.status === "error") {
      toast({
        title: toastMessage.message,
        variant:
          toastMessage.status === "error"
            ? "destructive"
            : "default",
      });
    }
  }, [toastMessage]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          Login
        </Button>
      </form>
    </Form>
  );
}
