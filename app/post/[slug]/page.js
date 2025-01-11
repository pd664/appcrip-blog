// app/[slug]/page.js
import Image from 'next/image';
import { supabaseService } from '@/app/components/Editor/utils/supabase/supabaseService';
import { notFound } from 'next/navigation';
import { unstable_cache } from 'next/cache';

// Set revalidation time (e.g., 60 seconds)
export const revalidate = 10;

// Enable dynamic parameters
export const dynamicParams = true;

// Cache the data fetching
// const getCachedPosts = unstable_cache(
//     async () => {
//         const posts = await supabaseService.fetchEditorData();
//         return posts;
//     },
//     ['posts-cache'], // cache key
//     {
//         revalidate: 60, // revalidate every 60 seconds
//         tags: ['posts'] // tag for manual revalidation
//     }
// );

// export async function generateStaticParams() {
//     const posts = await getCachedPosts();
    
//     return posts?.map((post) => ({
//         slug: post.title.toLowerCase().replace(/ /g, '-'),
//     })) || [];
// }

async function getPostData(slug) {
    const posts = await getCachedPosts();
    
    // Find the post in our cached data
    const post = posts?.find(
        post => post.title.toLowerCase().replace(/ /g, '-') === slug
    );
    
    if (post) return post;

    // Fallback to direct database query if not found in cache
    const { data } = await supabaseService.supabase
        .from('editor_data')
        .select('*')
        .ilike('title', slug.replace(/-/g, ' '))
        .single();
        
    return data;
}

export default async function PostPage({ params }) {
    const post = await getPostData(params.slug);
    
    if (!post) {
        notFound();
    }

    const htmlContent = post.content?.content || '';

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
                        />
                    </div>
                )}
                
                <div
                    className="prose prose-lg py-5 max-w-none"
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
            </article>
        </div>
    );
}