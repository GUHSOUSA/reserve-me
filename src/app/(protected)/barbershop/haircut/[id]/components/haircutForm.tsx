"use client";

import * as z from "zod";
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
import { Haircut } from "@/@types";
import { BarberServices } from "@/services/front/barberServices";
import { LocalStorage } from "@/infra";

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  duration: z.coerce.number().min(1)
});

export type HaircutFormValues = z.infer<typeof formSchema>;

interface HaircutFormProps {
  initialData: Haircut | null;
}

export const HaircutForm: React.FC<HaircutFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const title = initialData ? "Editar Corte" : "Criar Corte";
  const description = initialData
    ? "Editar detalhes do corte de cabelo."
    : "Adicionar um novo corte";
  const toastMessage = initialData ? "Corte atualizado." : "Corte criado.";
  const action = initialData ? "Salvar alterações" : "Criar";
  
  const haircutId = Array.isArray(params.id) ? params.id[0] : params.id;
  const localStorage = new LocalStorage();
  const barberServices = new BarberServices(localStorage);

  const defaultValues = initialData
    ? {
        name: initialData.name || "",
        duration: parseInt(String(initialData?.duration)),
      }
    : {
        name: "",
        duration: 0
      };

  const form = useForm<HaircutFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: HaircutFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await barberServices.updateHaircut(haircutId, data);
      } else {
        await barberServices.createHaircut(data);
      }
      router.refresh();
      router.push(`/barbershop/haircut`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error("Algo deu errado");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await barberServices.deleteHaircut(haircutId);
      router.refresh();
      router.push(`/barbershop/haircut`);
      toast.success("Corte deletado");
    } catch (error: any) {
      toast.error("Algo deu errado");
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
            Deletar Corte
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="md:grid md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Nome do corte"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      type="number"
                      placeholder="Preço do corte"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
