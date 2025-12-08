import { post, postTitle, postDescription, postDates } from './Post.module.scss';

export type PostProps = {
    title: string,
    description: string,
    lastUpdated: string,
    created: string,
    url: string,
}

export default function Post({ title, description, lastUpdated, created, url }: PostProps) {
    return <div className={post}>
        <h2 className={postTitle}><a href={url}>{title}</a></h2>
        <small>{new Date(Date.parse(created)).toLocaleDateString()}</small>
        <p className={postDescription}>{description}</p>
    </div>
}