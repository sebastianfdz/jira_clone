import { type FieldError } from "react-hook-form";

const Error: React.FC<{ trigger: FieldError | undefined; message: string }> = ({
  message,
  trigger,
}) => {
  if (!trigger) return null;
  return (
    <span role="alert" className="text-xs text-red-600">
      {message} *
    </span>
  );
};

export { Error };
