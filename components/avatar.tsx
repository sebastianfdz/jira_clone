import Image from "next/image";
import { TooltipWrapper } from "./ui/tooltip";
import { UnassignedUser } from "@/components/svgs";
type AvatarProps = {
  src: string | null | undefined;
  alt: string;
  size?: number;
};
const Avatar = ({ src, alt, size = 32, ...props }: AvatarProps) => {
  return (
    <TooltipWrapper text={alt}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          height={size}
          width={size}
          className="h-fit w-fit rounded-full"
          {...props}
        />
      ) : (
        <div>
          <UnassignedUser
            size={size}
            className="h-fit w-fit rounded-full bg-gray-200 text-gray-500"
          />
        </div>
      )}
    </TooltipWrapper>
  );
};

export { Avatar };
