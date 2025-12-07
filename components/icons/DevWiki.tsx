import { Icon, type IconProps } from "./Icon";

export function DevWikiIcon({ size, ...props }: IconProps) {
    return <Icon {...props} alt="FANDOM Developer's Wiki Logo" src="/icons/fandom-developers.png" height={size} width={size * 1.5} />;
}
