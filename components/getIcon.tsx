export const icons = ["JS", "Lua", "Obsidian", "Chrome", "GitHub", "TS"] as const;
export type Icon = (typeof icons)[number];


import { ComponentError } from "../src/util/errors";
import { GithubIcon, JavaScriptIcon, LuaIcon, ChromeIcon, ObsidianIcon } from "./icons";
import { IconProps } from "./icons/Icon";
import TypescriptIcon from './icons/TypescriptIcon';
export function getIcon(icon: Icon, props: Partial<IconProps> = {}) {
    switch (icon) {
        case "JS":
            return <JavaScriptIcon {...props} />;
        case "Lua":
            return <LuaIcon {...props} />;
        case "Obsidian":
            return <ObsidianIcon {...props} />;
        case "Chrome":
            return <ChromeIcon {...props} />;
        case "GitHub":
            return <GithubIcon {...props} />;
        case "TS":
            return <TypescriptIcon {...props} />;
        default:
            throw new ComponentError("UNKNOWN_ICON", icon);
    }
}