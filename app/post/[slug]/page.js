import Image from 'next/image';
import { supabaseService } from '@/app/components/Editor/utils/supabase/supabaseService';

// Enable static page generation with fallback
export const dynamicParams = true;

// Generate static params during build time
export async function generateStaticParams() {
    const posts = await supabaseService.fetchEditorData();

    return posts?.map((post) => ({
        slug: post.title.toLowerCase().replace(/ /g, '-'),
    })) || [];
}

// Revalidate every 10 seconds to allow the page to be updated after the build
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

    // Convert lexical data to HTML
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
