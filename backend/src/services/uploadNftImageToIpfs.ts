import Jimp from 'jimp';
import path from 'path';
import { File } from 'buffer'
import { pinata } from "../libs/pinata";
import { Blob } from 'buffer';

interface TextPosition {
    x: number;
    y: number;
}

interface TemplateConfig {
    fileName: string;
    username: TextPosition;
    tokenId: TextPosition;
}

// Define configurations for each template
const TEMPLATE_CONFIGS: Record<string, TemplateConfig[]> = {
    'kesar': [
        {
            fileName: 'kesar-template-1.png',
            username: { x: 480, y: 580 },
            tokenId: { x: 480, y: 650 }
        },
        {
            fileName: 'kesar-template-1.png',
            username: { x: 480, y: 580 },
            tokenId: { x: 480, y: 650 }
        },
        {
            fileName: 'kesar-template-1.png',
            username: { x: 480, y: 580 },
            tokenId: { x: 480, y: 650 }
        }
    ],
    'pashmina': [
        {
            fileName: 'pashmina-template-1.png',
            username: { x: 380, y: 920 },
            tokenId: { x: 280, y: 820 }
        },
        {
            fileName: 'pashmina-template-2.png',
            username: { x: 420, y: 940 },
            tokenId: { x: 320, y: 840 }
        },
        {
            fileName: 'pashmina-template-3.png',
            username: { x: 360, y: 910 },
            tokenId: { x: 260, y: 810 }
        }
    ],
    'walnut': [
        {
            fileName: 'walnut-template-1.png',
            username: { x: 400, y: 940 },
            tokenId: { x: 300, y: 840 }
        },
        {
            fileName: 'walnut-template-2.png',
            username: { x: 380, y: 920 },
            tokenId: { x: 280, y: 820 }
        },
        {
            fileName: 'walnut-template-3.png',
            username: { x: 420, y: 930 },
            tokenId: { x: 320, y: 830 }
        }
    ]
};

function getRandomTemplate(productType: string): TemplateConfig {
    const templates = TEMPLATE_CONFIGS[productType.toLowerCase()];
    if (!templates) {
        throw new Error(`No templates found for product type: ${productType}`);
    }
    const randomIndex = Math.floor(Math.random() * templates.length);
    return templates[randomIndex];
}

async function uploadNftImageToIpfs(username: string, type: string, tokenId: number): Promise<string> {
    try {
        // Get random template configuration based on product type
        const template = getRandomTemplate(type);
        console.log('template', template);
        const templatePath = path.join(process.cwd(), 'public', template.fileName);
        console.log('templatePath', templatePath);
        // Load the template image
        const image = await Jimp.read(templatePath);
        console.log('image', image);
        // Load fonts
        const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);

        // Add username
        image.print(
            font,
            template.username.x,
            template.username.y,
            username
        );

        // Add token ID
        image.print(
            font,
            template.tokenId.x,
            template.tokenId.y,
            `#${tokenId}`
        );

        // Convert image to buffer
        const imageBuffer = await image.getBufferAsync(Jimp.MIME_PNG);
        console.log('imageBuffer', imageBuffer);

        const blob = new Blob([imageBuffer], { type: 'image/png' })
        console.log('blob', blob);
        const file = new File([blob], 'kesar-template-1', { type: 'image/png' })
        console.log('file', file);
        const result = await pinata.upload.file(file)
        console.log('result', result);
        console.log(`Url: https:ipfs.io/ipfs/${result.IpfsHash}`);
        return `https:ipfs.io/ipfs/${result.IpfsHash}`;

    } catch (error) {
        console.error('Error generating and uploading NFT image:', error);
        throw new Error('Failed to generate and upload NFT image');
    }
}

export { uploadNftImageToIpfs };