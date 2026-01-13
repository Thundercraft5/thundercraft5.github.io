import { post, postTitle, postDescription, postDates, headerLink } from './Post.module.scss';
import MDXImage from './MDXImage';
import Slugger from "github-slugger";

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
        <h2 className={postTitle} id={new Slugger().slug(title)}><a href={url} className={headerLink}>{title} →</a></h2>
        {image ? <div title={caption}><MDXImage src={image.path} alt={caption} width={image.width} height={image.height} /></div> : ""}
        <small>{new Date(Date.parse(created)).toLocaleDateString()}</small>
        <p className={postDescription}>{description}</p>
    </div>
}