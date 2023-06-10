import { NextApiRequest, NextApiResponse } from 'next';

import { dockerEnvVarFix } from '@chatbot-ui/core/utils/docker';

import ProdiaAI from 'prodia-ai';

async function createImageGenerationJob(
  apiKey: string,
  jobRequest: any,
): Promise<any> {
  const imageGenerationJob = await ProdiaAI.createJob(jobRequest);
  return imageGenerationJob;
}

async function fetchJobStatus(apiKey: string, jobId: string): Promise<any> {
  const imageGenerationJob = await ProdiaAI.getJob(jobId);
  return imageGenerationJob;
}

const modelMap = {
  'Analog Diffusion v1.0': 'analog-diffusion-1.0.ckpt [9ca13f02]',
  'Anything v3.0': 'anythingv3_0-pruned.ckpt [2700c435]',
  'Anything v4.5': 'anything-v4.5-pruned.ckpt [65745d25]',
  'Anything V5': 'anythingV5_PrtRE.safetensors [893e49b9]',
  'Orange Mix AOM3A3': 'AOM3A3_orangemixs.safetensors [9600da17]',
  'Deliberate v2': 'deliberate_v2.safetensors [10ec4b29]',
  'Dreamlike Diffusion 1.0': 'dreamlike-diffusion-1.0.safetensors [5c9fd6e0]',
  'Dreamlike Diffusion 2.0': 'dreamlike-diffusion-2.0.safetensors [fdcf65e7]',
  'Dreamshaper 5 BakedVae': 'dreamshaper_5BakedVae.safetensors [a3fbf318]',
  'Dreamshaper 6 BakedVae': 'dreamshaper_6BakedVae.safetensors [114c8abb]',
  'Elddreths Vivid Mix': 'elldreths-vivid-mix.safetensors [342d9d26]',
  'Lyriel v15': 'lyriel_v15.safetensors [65d547c5]',
  'Meinamix MeinaV9': 'meinamix_meinaV9.safetensors [2ec66ab0]',
  'Openjourney V4': 'openjourney_V4.ckpt [ca2f377f]',
  'Portrait+ 1.0': 'portrait+1.0.safetensors [1400e684]',
  'Realistic Vision V2.0': 'Realistic_Vision_V2.0.safetensors [79587710]',
  'Rev Animated v122': 'revAnimated_v122.safetensors [3f4fefd9]',
  'SDV1 4': 'sdv1_4.ckpt [7460a6fa]',
  'Pruned Emaonly v1-5': 'v1-5-pruned-emaonly.ckpt [81761151]',
  'Shonins Beautiful v10': 'shoninsBeautiful_v10.safetensors [25d8c546]',
  'Theallys Mix II Churned': 'theallys-mix-ii-churned.safetensors [5d9225a4]',
  'Timeless 1.0': 'timeless-1.0.ckpt [7c4971d4]',
  // Add all your models here
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const key = dockerEnvVarFix(process.env.PRODIA_KEY);
  if (!key) {
    return res.status(500).json({
      message: 'Missing API key',
    });
  }

  ProdiaAI.key(key);

  const body = JSON.parse(req.body);

  let parsedModel: string;

  try {
    parsedModel = modelMap[body.model as keyof typeof modelMap];
    if (!parsedModel) {
      parsedModel = modelMap['Dreamlike Diffusion 2.0'];
    }
  } catch (e) {
    return res.status(500).json({
      message: 'Invalid model',
    });
  }

  const defaultSettings = {
    steps: body.steps || 50,
    cfg_scale: body.cfg_scale || 20,
    upscale: body.upscale || true,
    sampler: body.sampler || 'DDIM',
    aspect_ratio: body.aspect_ratio || 'square',
    model: modelMap['Dreamlike Diffusion 2.0'],
  };

  const imageGenerationRequest = {
    model: parsedModel || defaultSettings.model,
    prompt: body.prompt || 'puppy',
    negative_prompt:
      body.negativePrompt ||
      'unnatural, unrealistic, cartoon, illustration, painting, drawing, unreal engine, black and white, monochrome, oversaturated, low saturation, surreal, underexposed, overexposed, jpeg artifacts, conjoined, aberrations, multiple levels, harsh lighting, anime, sketches, twisted, video game, photoshop, creative, UI, abstract, collapsed, rotten, extra windows, disfigured, disproportionate, bad anatomy, bad proportions, ugly, out of frame, mangled, asymmetric, cross-eyed, depressed, immature, stuffed animal, out of focus, high depth of field, cloned face, cloned head, age spot, skin blemishes, collapsed eyeshadow, asymmetric ears, imperfect eyes, floating hair, unnatural, conjoined, missing limb, missing arm, missing leg, poorly drawn face, poorly drawn feet, poorly drawn hands, floating limb, disconnected limb, extra limb, malformed limbs, malformed hands, poorly rendered face, poor facial details, poorly rendered hands, double face, unbalanced body, unnatural body, lacking body, childish, long body, cripple, old, fat, cartoon, 3D, weird colors, unnatural skin tone, unnatural skin, stiff face, fused hand, skewed eyes, mustache, beard, surreal, cropped head, group of people,pixelated,noisy,distorted,overexposed,underexposed,caricature,unnatural colors,oversaturated,undersaturated,too dark,too light,lack of detail,exaggerated features,unbalanced composition,fuzzy,sketch-like,discolored,flat lighting,cartoon,deformed,ugly,blurry,low quality,low resolution,low res,low resolution,low res',
    seed: -1,
    steps: defaultSettings.steps,
    cfg_scale: defaultSettings.cfg_scale,
    upscale: defaultSettings.upscale,
    sampler: defaultSettings.sampler,
    aspect_ratio: defaultSettings.aspect_ratio,
  };

  try {
    let imageGenerationJob = await createImageGenerationJob(
      key,
      imageGenerationRequest,
    );

    while (
      imageGenerationJob.status !== 'succeeded' &&
      imageGenerationJob.status !== 'failed'
    ) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      imageGenerationJob = await fetchJobStatus(key, imageGenerationJob.job);
    }

    if (imageGenerationJob.status !== 'succeeded') {
      throw new Error('Image generation job failed');
    }

    res.status(200).json({ imageUrl: imageGenerationJob.imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to generate image' });
  }
};
