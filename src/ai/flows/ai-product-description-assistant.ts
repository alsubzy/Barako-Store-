'use server';
/**
 * @fileOverview A Genkit flow for generating engaging product descriptions based on product attributes.
 *
 * - generateProductDescription - A function that handles the product description generation process.
 * - GenerateProductDescriptionInput - The input type for the generateProductDescription function.
 * - GenerateProductDescriptionOutput - The return type for the generateProductDescription function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateProductDescriptionInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  category: z.string().describe('The category of the product (e.g., "Fruits", "Dairy", "Bakery").'),
  keyFeatures: z
    .string()
    .describe('Comma-separated list of key features or benefits of the product.'),
});
export type GenerateProductDescriptionInput = z.infer<
  typeof GenerateProductDescriptionInputSchema
>;

const GenerateProductDescriptionOutputSchema = z.object({
  description: z.string().describe('An engaging and detailed product description.'),
});
export type GenerateProductDescriptionOutput = z.infer<
  typeof GenerateProductDescriptionOutputSchema
>;

export async function generateProductDescription(
  input: GenerateProductDescriptionInput
): Promise<GenerateProductDescriptionOutput> {
  return generateProductDescriptionFlow(input);
}

const productDescriptionPrompt = ai.definePrompt({
  name: 'productDescriptionPrompt',
  input: { schema: GenerateProductDescriptionInputSchema },
  output: { schema: GenerateProductDescriptionOutputSchema },
  prompt: `You are a professional copywriter specializing in creating engaging and compelling product descriptions for a grocery store. Your goal is to write a detailed and appealing description that highlights the product's best qualities and entices customers.

Product Name: {{{productName}}}
Category: {{{category}}}
Key Features: {{{keyFeatures}}}

Based on the information above, craft a unique and enticing product description. Focus on sensory details, benefits, and quality. Make sure the description is concise yet informative, suitable for a product listing.`, 
});

const generateProductDescriptionFlow = ai.defineFlow(
  {
    name: 'generateProductDescriptionFlow',
    inputSchema: GenerateProductDescriptionInputSchema,
    outputSchema: GenerateProductDescriptionOutputSchema,
  },
  async (input) => {
    const { output } = await productDescriptionPrompt(input);
    return output!;
  }
);
