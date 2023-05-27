import Image from "next/image";
import { TooltipWrapper } from "./ui/tooltip";
type AvatarProps = {
  src: string | null | undefined;
  alt: string;
  size?: number;
};
const Avatar = ({ src, alt, size = 32, ...props }: AvatarProps) => {
  return (
    <TooltipWrapper text={alt}>
      <Image
        src={src ?? "https://www.gravatar.com/avatar?d=mp"}
        alt={alt}
        height={size}
        width={size}
        className="h-fit w-fit rounded-full"
        {...props}
      />
    </TooltipWrapper>
  );
};

export { Avatar };
