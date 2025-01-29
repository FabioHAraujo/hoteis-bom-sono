"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import PocketBase from "pocketbase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Configuração do PocketBase
const pb = new PocketBase("http://127.0.0.1:8090");

// Schemas de validação
const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

const registerSchema = z
  .object({
    name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

export function AuthForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  // Form para Login
  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Form para Registro
  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onLogin(data: LoginValues) {
    setIsLoading(true);
    try {
      const authData = await pb.collection("users").authWithPassword(data.email, data.password);
      console.log("Login data:", authData);

      // Verificar role e redirecionar
      const role = authData.record.role;
      if (role === "site-admin") {
        router.push("/dashboard");
      } else {
        router.push("/home");
      }

      alert(`Login realizado com sucesso! Role: ${role}`);
      toast.success("Login realizado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao fazer login:", error);
      alert(`Erro ao fazer login: ${error.message}`);
      toast.error("Erro ao fazer login. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  async function onRegister(data: RegisterValues) {
    setIsLoading(true);
    try {
      const user = await pb.collection("users").create({
        username: data.name,
        email: data.email,
        password: data.password,
        passwordConfirm: data.confirmPassword,
        role: "user", // Definir role padrão,
        name: data.name
      });

      console.log("Registro realizado:", user);
      alert("Registro realizado com sucesso!");
      toast.success("Registro realizado com sucesso!");

      // Autenticar após registro
      await pb.collection("users").authWithPassword(data.email, data.password);
      router.push("/home");
    } catch (error: any) {
      console.error("Erro ao fazer registro:", error);
      alert(`Erro ao fazer registro: ${error.message}`);
      toast.error("Erro ao fazer registro. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Tabs defaultValue="login" className="w-full rounded-md">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login" className="rounded-md">Login</TabsTrigger>
        <TabsTrigger value="register" className="rounded-md">Registro</TabsTrigger>
      </TabsList>

      {/* Formulário de Login */}
      <TabsContent value="login">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Bem-vindo de volta</h1>
            <p className="text-sm text-muted-foreground">Entre com suas credenciais para acessar sua conta</p>
          </div>
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="seu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </Form>
        </div>
      </TabsContent>

      {/* Formulário de Registro */}
      <TabsContent value="register">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Criar uma conta</h1>
            <p className="text-sm text-muted-foreground">Preencha os dados abaixo para se registrar</p>
          </div>
          <Form {...registerForm}>
            <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
              <FormField
                control={registerForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="seu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Registrando..." : "Registrar"}
              </Button>
            </form>
          </Form>
        </div>
      </TabsContent>
    </Tabs>
  );
}
