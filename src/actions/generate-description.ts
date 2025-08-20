"use server";

import { generateTaskDescription } from "@/ai/flows/task-description-generator";

export async function generateDescriptionAction(taskName: string): Promise<{ description?: string; error?: string }> {
  if (!taskName) {
    return { error: "Task name is required." };
  }
  try {
    const result = await generateTaskDescription({ taskName });
    return { description: result.description };
  } catch (error) {
    console.error("AI description generation failed:", error);
    return { error: "Failed to generate description from AI." };
  }
}
