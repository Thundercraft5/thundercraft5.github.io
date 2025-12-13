import makeErrors from "@thundercraft5/node-errors"
import {icons} from "../../components/getIcon";

export const { ComponentError, PageError, WorkerError, TopNavError } = makeErrors({
    ComponentError: {
        UNKNOWN_ICON: (icon: string) => `The specified icon "${icon}" is invalid. Valid icons are: "${icons.join('", "')}".`,
        CALLBACK_NOT_IMPLEMENTED: (state: "show" | "hide") => `A required callback function was not implemented in the component for ${state}.`
    },
    PageError: {
        INVALID_FRONTMATTER_DATE: (date: string) => `The specified frontmatter date "${date}" is not a valid date.`,
        MISSING_FRONTMATTER_DATE: (file: string) => `The frontmatter property 'last-updated' and 'created' is missing for page "${file}".`,
        MISSING_FRONTMATTER: (file: string) => `The frontmatter is missing for page "${file}". Did you forget to add export const getStaticProps = <...>?`,
        BLOG_MISSING_TITLE: (file: string) => `The blog post "${file}" is missing a title in its frontmatter.`
    },
    WorkerError: {
        INVALID_ENV: () => "The worker environment is invalid."
    },
    TopNavError: {
        "INVALID_GROUP": (group: string) => `The nav group "${group}" is invalid.`
    }
}, {
    ComponentError: class ComponentError extends Error { },
    PageError: class PageError extends Error { },
    WorkerError: class WorkerError extends Error { },
    TopNavError: class TopNavError extends Error {}
});