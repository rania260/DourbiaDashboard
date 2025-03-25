import { FieldError } from "react-hook-form";

type InputFieldProps = {
  label: string;
  type?: string;
  register: any;
  name: string;
  defaultValue?: string;
  error?: FieldError;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  className?: string;
};

const InputField = ({
  label,
  type = "text",
  register,
  name,
  defaultValue,
  error,
  inputProps,
  className = "",
}: InputFieldProps) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-xs text-gray-500">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        {...register(name)}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent h-[42px]"
      />
      {error && <p className="text-xs text-red-400 mt-1">{error.message}</p>}
    </div>
  );
};

export default InputField;
