import Image from "next/image";

type BrandMarkProps = {
  className?: string;
};

export function BrandMark({ className = "h-20 w-20" }: BrandMarkProps) {
  return (
    <Image
      alt=""
      aria-hidden="true"
      className={className}
      height={200}
      src="/Logo.jpg"
      width={200}
    />
  );
}
