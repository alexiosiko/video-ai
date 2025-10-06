"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Youtube, AlertCircle } from "lucide-react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FormData } from "./types";

interface YouTubeUrlInputProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  isProcessing: boolean;
}

const validateYouTubeUrl = (url: string) => {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)/;
  return youtubeRegex.test(url) || 'Please enter a valid YouTube URL';
};

export function YouTubeUrlInput({ register, errors, isProcessing }: YouTubeUrlInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="youtubeUrl" className="text-sm font-medium">
        YouTube Video URL
      </Label>
      <div className="relative">
        <Youtube className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          {...register('youtubeUrl', {
            required: 'YouTube URL is required',
            validate: validateYouTubeUrl,
          })}
          placeholder="https://www.youtube.com/watch?v=..."
          className="pl-10 h-12"
          disabled={isProcessing}
        />
      </div>
      {errors.youtubeUrl && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errors.youtubeUrl.message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export { validateYouTubeUrl };
export type { FormData };