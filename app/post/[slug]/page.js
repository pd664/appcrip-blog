// app/post/[slug]/page.jsx
'use client'
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSupabase } from '@/app/components/Editor/hooks/useSupabase';
import { dbToLexicalData, convertLexicalDataToHtml } from '@/app/components/Home/lexical-html';
import Image from 'next/image';
// import Header from '@/components/Header';

export default function PostPage() {
    const params = useParams();
    const { editorData, loading, error } = useSupabase();
    const [post, setPost] = useState(null);
    const [htmlContent, setHtmlContent] = useState('');
console.log("posts are", post)
    useEffect(() => {
        if (editorData && params.slug) {
            const currentPost = editorData.find(post => 
                post.title.toLowerCase().replace(/ /g, '-') === params.slug
            );

            if (currentPost) {
                setPost(currentPost);
                try {
                    const lexicalData = dbToLexicalData(currentPost.content);
                    const html = convertLexicalDataToHtml(lexicalData);
                    setHtmlContent(html);
                } catch (error) {
                    console.error('Error processing post data:', error);
                }
            }
        }
    }, [editorData, params.slug]);

    if (loading) {
        return <div className="max-w-2xl mx-auto py-8 px-4">Loading...</div>;
    }

    if (error) {
        return <div className="max-w-2xl mx-auto py-8 px-4">Error loading post</div>;
    }

    if (!post) {
        return <div className="max-w-2xl mx-auto py-8 px-4">Post not found</div>;
    }

    return (
        <div>
            <article className="max-w-2xl mx-auto py-8 px-4">

                <h1 className="text-3xl font-bold mb-6">{post.title}</h1>
                {post.image_url && <Image
                    src={post.image_url}
                    alt={post.title}
                    width={1000}  // Set a large width for aspect ratio
                    height={500}  // Set a corresponding height for aspect ratio
                    layout="responsive"  // This makes the image responsive
                    />}
                <div className="prose prose-lg" dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </article>
        </div>
    );
}