import Image from "next/image";

export type IconProps = {
    src: string;
    alt: string;
    size?: number;
    width?: number;
    height?: number;
} & React.PropsWithoutRef<React.ComponentProps<typeof Image>>;

export function Icon({ src, alt, size, width = size, height = size, ...props }: React.PropsWithoutRef<IconProps>) {
    return <Image {...props} alt={alt} src={src} width={width} height={height} />;
}
