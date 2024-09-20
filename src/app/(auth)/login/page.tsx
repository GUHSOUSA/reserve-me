"use client";
import { Card, CardContent } from "@/components/ui/card";
import { LoginSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Form, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { CardHeaderComponent } from "./components/card-header";
import { FormFieldComponent } from "./components/form-card";
import { ClipLoader } from "react-spinners";
import { LocalStorage } from "@/infra";
import { UserContext } from "@/context/useContext";
import { loginUser } from "@/services/front/authServices";
import { User } from "@/@types";

const SignIn = () => {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>("");
  const localStorage = new LocalStorage();
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(UserContext);
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setLoading(true);
    try {
      await loginUser(localStorage, values.email, values.password);
      const userProfile = await localStorage.get<User>("userProfile");
      if (userProfile) {
        setUser(userProfile);
        router.push("/dashboard");
      } else {
        setError("Falha ao carregar os dados do usuário.");
      }
    } catch (error: any) {
      setError(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Card className="w-full h-full p-8">
      <CardHeaderComponent />
      <CardContent className="space-y-5 px-0 pb-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2.5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormFieldComponent
                  label="Email"
                  placeholder="Email"
                  type="email"
                  field={field}
                  error={form.formState.errors.email}
                />
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormFieldComponent
                  label="Senha"
                  placeholder="Senha"
                  type="password"
                  field={field}
                  error={form.formState.errors.password}
                />
              )}
            />
            <FormError message={error} />
            <Button disabled={loading} type="submit" className="w-full">
              {loading ? (
                <div>
                  <ClipLoader size={25} color="white" className="p-2" />
                </div>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
export default SignIn;
