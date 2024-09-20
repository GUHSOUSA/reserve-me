"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { AlertModal } from "@/components/modals/alert-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClientColumn, User, UserRole } from "@/@types";
import { LocalStorage } from "@/infra";
import { ManagerService } from "@/services/front/managerServices";
const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Formato de email inválido"),
    password: z.string().min(4, "A senha deve ter pelo menos 6 caracteres"),
    role: z.nativeEnum(UserRole, {
    errorMap: () => ({ message: "Role inválida" }),
    
  }),
  active: z.boolean(),
  
});

export type ClientFormValues = z.infer<typeof formSchema>;

interface ClientFormProps {
  initialData:
  | (ClientColumn)
  | null;
}

export const ClientForm: React.FC<ClientFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const title = initialData ? "Editar Usuário" : "Criar Usuário";
  const description = initialData
    ? "Editar detalhes do usuário."
    : "Adicionar um novo usuário";
  const toastMessage = initialData ? "Usuário atualizado." : "Usuário criado.";
  const action = initialData ? "Salvar alterações" : "Criar";
  const userId = Array.isArray(params.id) ? params.id[0] : params.id;
  const localStorage = new LocalStorage()
  const managerServices = new ManagerService(localStorage);
  
  // Adicionando a lógica para definir valores padrão
  const defaultValues = initialData
    ? {
        name: initialData.name || "",
        email: initialData.email,
        password: initialData.password,
        role: initialData.role as UserRole || UserRole.BARBER, // Converter 'role' de string para UserRole
        active: initialData.barberShop?.active || false, // Pega o valor de active se existir barberShop
      }
    : {
        name: "",
        email: "",
        password: "",
        active: false,
        role: UserRole.BARBER
      };

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: ClientFormValues) => {
    console.log('Form submit triggered');
    try {
      setLoading(true);
      if (initialData) {
        console.log(data)
        await managerServices.updateBarber(userId, data)
      } else {
        await managerServices.createBarber(data);
      }
      router.refresh();
      router.push(`/dashboard`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await managerServices.deleteBarber(userId);
      router.refresh();
      router.push(`/dashboard`);
      toast.success("Usuário deletado");
    } catch (error: any) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            Deletar usuario
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Nome do usuario"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Email do usuario"
                      {...field}
                    />
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
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Senha"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de usuário</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={UserRole.MANAGER}>Manager</SelectItem>
                      <SelectItem value={UserRole.BARBER}>Barber</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Condição para exibir o campo "active" apenas se a barbearia existir */}
            {initialData && (
              initialData.barberShop ? (
                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Barbearia Ativa</FormLabel>
                      <FormControl>
                        <Input
                          type="checkbox"
                          disabled={loading}
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <div className="col-span-3 mt-5 text-gray-500">
                  Barbearia ainda não criada.
                </div>
              )
            )}
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

