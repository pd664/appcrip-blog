// app/api/revalidate/route.js
import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        // Revalidate the cache
        revalidateTag('posts');
        
        return NextResponse.json({
            revalidated: true,
            message: 'Posts revalidated'
        });
    } catch (error) {
        return NextResponse.json({
            message: 'Error revalidating',
            error: error.message
        }, { status: 500 });
    }
}