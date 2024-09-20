import { Input } from "@/components/ui/input";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { FieldError } from "react-hook-form";

interface FormFieldComponentProps {
  label: string;
  placeholder: string;
  type: string;
  field: any;
  error?: FieldError;
}

export const FormFieldComponent: React.FC<FormFieldComponentProps> = ({
  label,
  placeholder,
  type,
  field,
  error,
}) => {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Input {...field} placeholder={placeholder} type={type} />
      </FormControl>
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </FormItem>
  );
};
