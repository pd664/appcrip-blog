// app/post/[slug]/page.js
import Image from 'next/image';
import { supabaseService } from '@/app/components/Editor/utils/supabase/supabaseService';

// Enable static page generation with fallback
export const dynamicParams = true;

export async function generateStaticParams() {
    const { data: posts } = await supabaseService.supabase
        .from('editor_data')
        .select('title') // Only select title for generating slugs
        .order('created_at', { ascending: true });

    return posts?.map((post) => ({
        slug: post.title.toLowerCase().replace(/ /g, '-'),
    })) || [];
}

// ISR: Set revalidate interval to 10 seconds
export const revalidate = 10;

async function getPostBySlug(slug) {
    const formattedSlug = slug.replace(/ /g, '-');
    const post = await supabaseService.fetchPostBySlug(formattedSlug);
    return post;
}

export default async function PostPage({ params }) {
    const post = await getPostBySlug(params.slug);

    if (!post) {
        return (
            <div className="max-w-2xl mx-auto py-8 px-4">
                Post not found
            </div>
        );
    }

    return (
        <div>
            <article className="max-w-2xl mx-auto py-8 px-4">
                <h1 className="text-3xl font-bold mb-6">{post.title}</h1>
                {post.image_url && (
                    <div className="relative aspect-video mb-6">
                        <Image
                            src={post.image_url}
                            alt={post.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw"
                            priority
                            className="object-cover rounded-lg"
                            loading="eager"
                        />
                    </div>
                )}
                <div className="prose prose-lg py-5 max-w-none" dangerouslySetInnerHTML={{ __html: post.content.content }} />
            </article>
        </div>
    );
}


// try {
    //     console.log("converting", post)
    //     const lexicalData = dbToLexicalData(post.content);
    //     console.log("lexical", lexicalData)
    //     htmlContent = convertLexicalDataToHtml(lexicalData);
    //     console.log("html ", htmlContent)
    // } catch (error) {
    //     console.error('Error processing post data:', error);
    //     // Return a more graceful error UI
    //     return (
    //         <div className="max-w-2xl mx-auto py-8 px-4">
    //             <h1 className="text-3xl font-bold mb-6">{post.title}</h1>
    //             <p>There was an error processing this post's content.</p>
    //         </div>
    //     );
    // }