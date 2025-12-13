import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export default function readMDXMetadata(filePath: string) {
  console.log("Reading MDX metadata from:", filePath);
  // Read MDX content
  const fileContent = fs.readFileSync(path.resolve(filePath), 'utf-8')
  // Use gray-matter to extract frontmatter
  const { data } = matter(fileContent)
  
  return data
}