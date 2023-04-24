import clsx from "clsx";
import Image from "next/image";
import { Fragment } from "react";
import { FaUser } from "react-icons/fa";
type AvatarProps = {
  src: string | null;
  alt: string;
  size?: number;
  className?: string;
};
const Avatar = ({ src, alt, size = 32, className, ...props }: AvatarProps) => {
  return (
    <Fragment>
      {src ? (
        <div style={{ width: size, height: size }} className={className}>
          <Image
            className="rounded-full"
            src={src}
            alt={alt}
            height={size}
            width={size}
            {...props}
          />
        </div>
      ) : (
        <div
          className={clsx(
            "flex items-center justify-center rounded-full bg-zinc-400 ",
            className
          )}
          style={{ width: size, height: size }}
        >
          <FaUser className="text-white" />
        </div>
      )}
    </Fragment>
  );
};

export { Avatar };
