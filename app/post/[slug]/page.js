// app/[slug]/page.js
import Image from 'next/image';
import { supabaseService } from '@/app/components/Editor/utils/supabase/supabaseService';
import { notFound } from 'next/navigation';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
// Disable static params
export const dynamicParams = true;

// This function is only used to pre-render some common paths at build time
// but won't restrict dynamic paths
export async function generateStaticParams() {
    try {
        const posts = await supabaseService.fetchEditorData();
        return posts?.map((post) => ({
            slug: post.title.toLowerCase().replace(/ /g, '-'),
        })) || [];
    } catch (error) {
        console.error('Error generating static params:', error);
        return [];
    }
}

async function getPostBySlug(slug) {
    try {
        // Convert slug back to title format
        const titleFromSlug = slug.replace(/-/g, ' ');
        
        // Use the raw Supabase client for direct querying
        const { data: post, error } = await supabaseService.supabase
            .from('editor_data')
            .select('*')
            .ilike('title', titleFromSlug) // Using case-insensitive matching
            .single();

        if (error) {
            console.error('Error fetching post:', error);
            return null;
        }

        return post;
    } catch (error) {
        console.error('Error in getPostBySlug:', error);
        return null;
    }
}

export default async function PostPage({ params }) {
    try {
       let sl = await params.slug
        const post = await getPostBySlug(sl);
        
        // If no post is found, show 404
        if (!post) {
            notFound();
        }

        // Ensure content exists and has the expected structure
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