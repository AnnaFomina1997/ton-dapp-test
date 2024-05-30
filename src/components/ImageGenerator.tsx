// src/components/ImageGenerator.tsx
import React from 'react';

interface ImageGeneratorProps {
    prompt: string;
    setPrompt: (prompt: string) => void;
    handleGenerate: () => void;
    generatedImage: string | null;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ prompt, setPrompt, handleGenerate, generatedImage }) => {
    return (
        <div className="ImageGenerator">
            <input
                type="text"
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="Enter a prompt"
            />
            <button className="Button" onClick={handleGenerate}>Generate Image</button>
            {generatedImage && <img src={generatedImage} alt="Generated Visual" />}
        </div>
    );
};

export default ImageGenerator;
