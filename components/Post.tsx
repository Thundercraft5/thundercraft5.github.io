import { post, postTitle, postDescription, postDates } from './Post.module.scss';
import Image from 'next/image';

export type PostProps = {
    title: string,
    description: string,
    lastUpdated: string,
    created: string,
    url: string,
    image: {
        width: number,
        height: number,
        path: string,
    },
}

export default function Post({ title, description, lastUpdated, created, image, url }: PostProps) {
    return <div className={post}>
        <h2 className={postTitle}><a href={url}>{title}</a></h2>
        <small>{new Date(Date.parse(created)).toLocaleDateString()}</small>
        {image ? <div title={description}><Image src={image.path} alt={description} width={image.width} height={image.height} /></div> : ""}
        <p className={postDescription}>{description}</p>
    </div>
}