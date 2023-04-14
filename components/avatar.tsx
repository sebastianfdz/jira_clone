import clsx from "clsx";
import Image from "next/image";
type AvatarProps = {
  src: string;
  alt: string;
  size?: number;
  className?: string;
};
const Avatar = ({ src, alt, size = 32, className, ...props }: AvatarProps) => {
  return (
    <Image
      className={clsx("rounded-full", className)}
      src={src}
      alt={alt}
      height={size}
      width={size}
      {...props}
    />
  );
};

export { Avatar };
