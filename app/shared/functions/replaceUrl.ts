export function replaceUrl(url: string) {
    // Replace get.php → player_api.php
    const replacedUrl = url.includes('get.php')
      ? url.replace('get.php', 'player_api.php')
      : url;
  
    try {
      const u = new URL(replacedUrl);
      // Remove 'type' and 'output' params
      u.searchParams.delete('type');
      u.searchParams.delete('output');
      return u.toString();
    } catch {
      // If invalid URL, just return the original (fallback)
      return replacedUrl;
    }
  }
  