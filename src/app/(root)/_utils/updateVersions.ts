import axios from 'axios';
import { LANGUAGE_CONFIG, LanguageConfig } from '../_constants';

interface PistonRuntime {
  language: string;
  version: string;
  aliases: string[];
  runtime?: string;
}

export async function updateLanguageVersions() {
  try {
    const response = await axios.get('https://emkc.org/api/v2/piston/runtimes');
    const runtimes: PistonRuntime[] = response.data;

    // Create a map of language to latest version
    const latestVersions = new Map<string, string>();
    
    runtimes.forEach(runtime => {
      const currentVersion = latestVersions.get(runtime.language);
      if (!currentVersion || compareVersions(runtime.version, currentVersion) > 0) {
        latestVersions.set(runtime.language, runtime.version);
      }
    });

    // Update LANGUAGE_CONFIG with latest versions
    Object.values(LANGUAGE_CONFIG).forEach((config: LanguageConfig) => {
      const latestVersion = latestVersions.get(config.pistonRuntime.language);
      if (latestVersion) {
        config.pistonRuntime.version = latestVersion;
      }
    });

    return true;
  } catch (error) {
    console.error('Failed to update language versions:', error);
    return false;
  }
}

// Helper function to compare version strings
function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
  
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const part1 = parts1[i] || 0;
    const part2 = parts2[i] || 0;
    
    if (part1 > part2) return 1;
    if (part1 < part2) return -1;
  }
  
  return 0;
}
