'use client'
// components/ParentComponent.jsx
'use client'
import React from 'react';
import Header from './Header';
import HeroSection from './HeroSection';

function ParentComponent() {
    return (
        <div>
            <Header />
            <HeroSection />
        </div>
    );
}

export default ParentComponent;
// import React, { useEffect, useState } from 'react';
// import { useSupabase } from '../Editor/hooks/useSupabase'; // Assuming useSupabase is correctly implemented
// import { dbToLexicalData, convertLexicalDataToHtml } from './lexical-html'; // Path to dbToLexicalData
// import Header from './Header';
// import HeroSection from './HeroSection';

// function ParentComponent() {
//   const { loading, error, editorData, saveContent } = useSupabase(); // Fetching data from Supabase
//   const [htmlContent, setHtmlContent] = useState([]);

//   console.log("editorData", editorData);

//   useEffect(() => {
//     if (editorData) {
//       try {
//         // Reset htmlContent when editorData changes
//         setHtmlContent([]);

//         // Loop through editorData and convert each piece to HTML
//         editorData && editorData.forEach((data) => {
//           console.log("datatatatatt", data)
//           // const parsedContent = JSON.parse(data.content.content); // Parse the content field into an object
//           // console.log("parsed", parsedContent)
//           const lexicalData = dbToLexicalData(data.content); // Assuming dbToLexicalData takes parsed content
//           console.log("lexicaled data", lexicalData)
//           const html = convertLexicalDataToHtml(lexicalData);
//           console.log("generted html", html)
//           setHtmlContent((prevContent) => [...prevContent, html]); // Append new HTML content
//         });
//       } catch (error) {
//         console.error('Error processing editor data:', error);
//       }
//     }
//   }, [editorData]);
// console.log("html", htmlContent)
//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error loading data: {error.message}</div>;
//   }

//   return (
//     <div>
//       <Header />
//       <HeroSection />
//       <h1>Converted Content</h1>
//       {/* Loop through the array of HTML content and display */}
//       {htmlContent.map((html, index) => (
//         <div key={index} dangerouslySetInnerHTML={{ __html: html }} />
//       ))}
//     </div>
//   );
// }

// export default ParentComponent;
