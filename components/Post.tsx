import { post, postTitle, postDescription, postDates } from './Post.module.scss';
import MDXImage from './MDXImage';

export type PostProps = {
    title: string,
    description: string,
    lastUpdated: string,
    created: string,
    url: string,
    image: {
        width: number,
        caption: string,
        height: number,
        path: string,
    },
}

export default function Post({ title, description, caption, created, image, url }: PostProps) {
    return <div className={post}>
        <h2 className={postTitle}><a href={url}>{title}</a></h2>
        <small>{new Date(Date.parse(created)).toLocaleDateString()}</small>
        {image ? <div title={caption}><MDXImage src={image.path} alt={caption} width={image.width} height={image.height} /></div> : ""}
        <p className={postDescription}>{description}</p>
    </div>
}