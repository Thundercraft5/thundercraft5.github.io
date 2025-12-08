import makeErrors from "@thundercraft5/node-errors"
import {icons} from "../../components/getIcon";

export const { ComponentError, PageError } = makeErrors({
    ComponentError: {
        UNKNOWN_ICON: (icon: string) => `The specified icon "${icon}" is invalid. Valid icons are: "${icons.join('", "')}".`,
    },
    PageError: {
        INVALID_FRONTMATTER_DATE: (date: string) => `The specified frontmatter date "${date}" is not a valid date.`,
        MISSING_FRONTMATTER_DATE: (file: string) => `The frontmatter property 'last-updated' and 'created' is missing for page "${file}".`,
        MISSING_FRONTMATTER: (file: string) => `The frontmatter is missing for page "${file}". Did you forget to add export const getStaticProps = <...>?`,
    }
}, {
    ComponentError: class ComponentError extends Error { },
    PageError: class PageError extends Error { }
});