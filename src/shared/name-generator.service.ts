// src/shared/utils/name-generator.util.ts
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class NameGeneratorService {
  private adjectives: string[] = [];
  private nouns: string[] = [];

  constructor() {
    this.loadWords();
  }

  // Load words from the JSON file
  private loadWords() {
    try {
      const data = fs.readFileSync(
        path.resolve(process.cwd(), 'dist/assets/words.json'),
        'utf8',
      );
      const words = JSON.parse(data);
      this.adjectives = words.adjectives;
      this.nouns = words.nouns;
    } catch (error) {
      console.error('Error loading words from JSON file:', error);
    }
  }

  generateRandomSubdomain(): string {
    const adjective =
      this.adjectives[Math.floor(Math.random() * this.adjectives.length)];
    const noun = this.nouns[Math.floor(Math.random() * this.nouns.length)];
    const randomSuffix = Math.floor(Math.random() * 100); // Optional, to ensure uniqueness
    return `${adjective}-${noun}-${randomSuffix}`;
  }

  generateRandomDbName(): string {
    const adjective =
      this.adjectives[Math.floor(Math.random() * this.adjectives.length)];
    const noun = this.nouns[Math.floor(Math.random() * this.nouns.length)];

    // Generate a UUID and slice the last 8 characters
    const randomSuffix = uuidv4().slice(-8);

    // Return the formatted database name
    return `${adjective}_${noun}_${randomSuffix}`;
  }
}
