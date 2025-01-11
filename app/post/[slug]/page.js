// app/[slug]/page.js
import Image from 'next/image';
import { supabaseService } from '@/app/components/Editor/utils/supabase/supabaseService';
import { notFound } from 'next/navigation';

// Remove force-dynamic since we want to use ISR
// export const dynamic = 'force-dynamic';

// Enable dynamic parameters
export const dynamicParams = true;

// Add revalidation time (e.g., every 60 seconds)
export const revalidate = 10;

// This generates the static paths at build time AND serves as our data source
export async function generateStaticParams() {
    try {
        const posts = await supabaseService.fetchEditorData();
        // Store the full post data in a global cache or external cache
        globalThis.postsCache = posts?.reduce((acc, post) => {
            acc[post.title.toLowerCase().replace(/ /g, '-')] = post;
            return acc;
        }, {});

        return posts?.map((post) => ({
            slug: post.title.toLowerCase().replace(/ /g, '-'),
        })) || [];
    } catch (error) {
        console.error('Error generating static params:', error);
        return [];
    }
}

// Modified to use cached data when available
async function getPostData(slug) {
    try {
        // First, try to get from cache if it exists
        if (globalThis.postsCache?.[slug]) {
            return globalThis.postsCache[slug];
        }

        // If not in cache, fetch from Supabase
        const titleFromSlug = slug.replace(/-/g, ' ');
        const { data: post, error } = await supabaseService.supabase
            .from('editor_data')
            .select('*')
            .ilike('title', titleFromSlug)
            .single();

        if (error) {
            console.error('Error fetching post:', error);
            return null;
        }

        // Update cache with new data
        if (!globalThis.postsCache) globalThis.postsCache = {};
        globalThis.postsCache[slug] = post;

        return post;
    } catch (error) {
        console.error('Error in getPostData:', error);
        return null;
    }
}

export default async function PostPage({ params }) {
    try {
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
                                loading="eager"
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
    } catch (error) {
        console.error('Error rendering post page:', error);
        return (
            <div className="max-w-2xl mx-auto py-8 px-4">
                Error loading post
            </div>
        );
    }
}