import Image from "next/image";

type BrandMarkProps = {
  className?: string;
};

export function BrandMark({ className = "h-10 w-10" }: BrandMarkProps) {
  return (
    <Image
      alt=""
      aria-hidden="true"
      className={className}
      height={48}
      src="/eck-mark.svg"
      width={48}
    />
  );
}
