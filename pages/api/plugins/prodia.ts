import { NextApiRequest, NextApiResponse } from 'next';
import ProdiaAI from 'prodia-ai';
import Redis from 'ioredis';

const redisClient = new Redis(process.env.REDIS_CONNECTION_STRING);
ProdiaAI.key(process.env.PRODIA_KEY);

async function createImageGenerationJob(apiKey: string, jobRequest: any): Promise<any> {
  const imageGenerationJob = await ProdiaAI.createJob(jobRequest);
  return imageGenerationJob;
}

async function fetchJobStatus(apiKey: string, jobId: string): Promise<any> {
  const imageGenerationJob = await ProdiaAI.getJob(jobId);
  return imageGenerationJob;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const ip = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress);
    let ipGenerationsCount = await redisClient.get(ip);

    if (ipGenerationsCount && parseInt(ipGenerationsCount) >= 50) {
      return res.status(429).json({ message: 'You have reached the limit of 50 generations per hour' });
    }

    if (!ipGenerationsCount) {
      await redisClient.set(ip, '1', 'EX', 3600);
    } else {
      await redisClient.incr(ip);
    }

    const { prompt } = req.body;

    const defaultSettings = {
      steps: 30,
      cfg_scale: 14,
      upscale: true,
      sampler: 'DPM++ 2M Karras',
    };

    const prodiaApiKey = process.env.PRODIA_KEY;
    const imageGenerationRequest = {
      model: 'deliberate_v2.safetensors [10ec4b29]',
      prompt: prompt || 'puppy',
      negative_prompt: 'unnatural, unrealistic, cartoon, illustration, painting, drawing, unreal engine, black and white, monochrome, oversaturated, low saturation, surreal, underexposed, overexposed, jpeg artifacts, conjoined, aberrations, multiple levels, harsh lighting, anime, sketches, twisted, video game, photoshop, creative, UI, abstract, collapsed, rotten, extra windows, disfigured, disproportionate, bad anatomy, bad proportions, ugly, out of frame, mangled, asymmetric, cross-eyed, depressed, immature, stuffed animal, out of focus, high depth of field, cloned face, cloned head, age spot, skin blemishes, collapsed eyeshadow, asymmetric ears, imperfect eyes, floating hair, unnatural, conjoined, missing limb, missing arm, missing leg, poorly drawn face, poorly drawn feet, poorly drawn hands, floating limb, disconnected limb, extra limb, malformed limbs, malformed hands, poorly rendered face, poor facial details, poorly rendered hands, double face, unbalanced body, unnatural body, lacking body, childish, long body, cripple, old, fat, cartoon, 3D, weird colors, unnatural skin tone, unnatural skin, stiff face, fused hand, skewed eyes, mustache, beard, surreal, cropped head, group of people,pixelated,noisy,distorted,overexposed,underexposed,caricature,unnatural colors,oversaturated,undersaturated,too dark,too light,lack of detail,exaggerated features,unbalanced composition,fuzzy,sketch-like,discolored,flat lighting,cartoon,deformed,ugly,blurry,low quality,low resolution,low res,low resolution,low res',
      seed: -1,
      ...defaultSettings,
      aspect_ratio: 'square',
    };

    let imageGenerationJob = await createImageGenerationJob(prodiaApiKey, imageGenerationRequest);

    while (imageGenerationJob.status !== "succeeded" && imageGenerationJob.status !== "failed") {
      await new Promise((resolve) => setTimeout(resolve, 250));
      imageGenerationJob = await fetchJobStatus(prodiaApiKey, imageGenerationJob.job);
    }

    if (imageGenerationJob.status !== "succeeded") {
      throw new Error("Image generation job failed");
    }

    res.status(200).json({ imageUrl: imageGenerationJob.imageUrl, prompt: prompt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate image" });
  }
};

export default handler;
