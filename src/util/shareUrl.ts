export default async function shareUrl(text: string, url: string) {
    if (navigator.canShare({ text, url })) await navigator.share({ text, url });
    else {
        await navigator.clipboard.writeText(`${text} ${url}`)
        alert('Link copied to clipboard!');
    }
}