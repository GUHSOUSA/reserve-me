import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const CardHeaderComponent = () => {
  return (
    <CardHeader className="px-0 pt-0">
        <CardTitle>Bem vindos a Reserve-Me</CardTitle>
        <CardDescription>
          Use seu email para acessar seu painel de administracao
        </CardDescription>
      </CardHeader>
  )
}