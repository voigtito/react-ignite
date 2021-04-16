import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from 'stream';

async function buffer(readable: Readable) {
    const chunks = [];
    for await(const chunk of readable) {
        chunks.push(
            typeof chunk === 'string' ? Buffer.from(chunk) : chunk
        );
    }
    return Buffer.concat(chunks);
}

export const config = {
    api: {
        bodyparser: false
    }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const buf = await buffer(req);
    
        return res.status(200).json({ok: true});
    } else {
        // If the request was not a post.
        res.setHeader('Allow', 'Post');
        res.status(405).end('Method not allowed');
    }
}