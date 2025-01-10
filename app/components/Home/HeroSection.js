// components/HeroSection.jsx
'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSupabase } from '../Editor/hooks/useSupabase';
import Image from 'next/image';

const fetchFirstThreeImages = async () => {
    const bucketName = "prateek-test-interview";
    const region = "ap-south-1";
    const folder = "images";

    try {
        const response = await fetch(
            `https://${bucketName}.s3.${region}.amazonaws.com?prefix=${folder}/`
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch bucket contents: ${response.statusText}`);
        }

        const textResponse = await response.text();

        // Parse the XML response
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(textResponse, "text/xml");
        const keys = xmlDoc.getElementsByTagName("Key");

        // Extract the first three image URLs
        const imageUrls = [];
        for (let i = 0; i < Math.min(3, keys.length); i++) {
            const key = keys[i].textContent;
            imageUrls.push(`https://${bucketName}.s3.${region}.amazonaws.com/${key}`);
        }

        return imageUrls;
    } catch (err) {
        console.error("Error fetching images from S3:", err);
        return [];
    }
};

function HeroSection() {
    const { loading, error, editorData } = useSupabase();
    const [titles, setTitles] = useState([]);
    const [images, setImages] = useState([]);

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

    useEffect(() => {
        const fetchImages = async () => {
            const fetchedImages = await fetchFirstThreeImages();
            setImages(fetchedImages);
        };

        fetchImages();
    }, []);

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
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((imageUrl, index) => (
                    <div key={index} className="relative w-full h-64">
                        <Image 
                            src={imageUrl} 
                            alt={`Image ${index + 1}`} 
                            layout="fill" 
                            objectFit="cover" 
                            className="rounded-lg shadow"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HeroSection;
