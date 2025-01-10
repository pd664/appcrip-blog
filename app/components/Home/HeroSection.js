// components/HeroSection.jsx
'use client'
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSupabase } from '../Editor/hooks/useSupabase';

function HeroSection() {
    const { loading, error, editorData } = useSupabase();
    const [titles, setTitles] = useState([]);
    
    useEffect(() => {
        if (editorData) {
            const formattedTitles = editorData.map(data => ({
                id: data.id,
                title: data.title,
                year: new Date(data.created_at).getFullYear() || '',
                slug: data.title.toLowerCase().replace(/ /g, '-')
            }));
            setTitles(formattedTitles);
        }
    }, [editorData]);

    if (loading) {
        return <div className="max-w-2xl mx-auto py-8 px-4">Loading...</div>;
    }

    if (error) {
        return <div className="max-w-2xl mx-auto py-8 px-4">Error loading content</div>;
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            {titles.map((item) => (
                <div key={item.id} className="mb-8 group">
                    <div className="flex items-baseline gap-3 hover:opacity-70 transition-opacity">
                        <Link 
                            href={`/post/${item.slug}`}
                            className="text-xl md:text-2xl font-medium text-gray-900 underline decoration-1 underline-offset-4"
                        >
                            {item.title}
                        </Link>
                        <span className="text-gray-500 text-sm whitespace-nowrap">
                            {item.year}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default HeroSection;