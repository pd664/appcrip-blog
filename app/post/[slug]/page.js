import Image from 'next/image';
import { supabaseService } from '@/app/components/Editor/utils/supabase/supabaseService';

// Enable dynamic params for new posts
export const dynamicParams = true;

// Generate static params during build time
export async function generateStaticParams() {
    const posts = await supabaseService.fetchEditorData();
    
    return posts?.map((post) => ({
        slug: post.title.toLowerCase().replace(/ /g, '-'),
    })) || [];
}

// Force dynamic rendering for new posts
export const dynamic = 'force-dynamic';

// Remove the revalidate constant since we're using force-dynamic
// export const revalidate = 10;

async function getPostBySlug(slug) {
    const formattedSlug = slug.replace(/ /g, '-');
    // Directly fetch from Supabase to get latest data
    const { data: post, error } = await supabaseService.supabase
        .from('editor_data')
        .select('*')
        .eq('title', formattedSlug.replace(/-/g, ' '))
        .single();

    if (error) {
        console.error('Error fetching post:', error);
        return null;
    }

    return post;
}

export default async function PostPage({ params }) {
    const sl = await params.slug;
    const post = await getPostBySlug(sl);
console.log("opening....")
    if (!post) {
        return (
            <div className="max-w-2xl mx-auto py-8 px-4">
                Post not found
            </div>
        );
    }

    let htmlContent = post.content.content;

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
}