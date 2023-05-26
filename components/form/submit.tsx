import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

export const FormSubmit: React.FC<{
  isLoading: boolean;
  onCancel: () => void;
  submitText: string;
  ariaLabel: string;
}> = ({ isLoading, onCancel, submitText, ariaLabel }) => {
  return (
    <div className="mt-5 flex w-full justify-end">
      <Button
        customColors
        customPadding
        className="flex items-center gap-x-2 bg-inprogress px-3 py-1.5 font-medium text-white hover:brightness-110"
        type="submit"
        name={ariaLabel}
        disabled={isLoading}
        aria-label={ariaLabel}
      >
        <span>{submitText}</span>
        {isLoading ? <Spinner white size="sm" /> : null}
      </Button>
      <Button
        customColors
        customPadding
        onClick={onCancel}
        className="px-3 py-1.5 font-medium text-inprogress underline-offset-2 hover:underline hover:brightness-110"
        name="cancel"
        aria-label={"cancel"}
      >
        Cancel
      </Button>
    </div>
  );
};
