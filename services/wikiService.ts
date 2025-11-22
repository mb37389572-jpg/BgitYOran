
export const fetchTeamLogo = async (teamName: string, sport: 'football' | 'basketball' = 'football'): Promise<string> => {
  if (!teamName) return '';

  const cleanName = teamName.trim();
  const sportSuffix = sport === 'football' ? 'football' : 'basketball';

  // ---------------------------------------------------------
  // STRATEGY 1: TheSportsDB (Best for transparent logos)
  // ---------------------------------------------------------
  try {
    const tsdbUrl = `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(cleanName)}`;
    const res = await fetch(tsdbUrl);
    const data = await res.json();
    
    if (data.teams && data.teams.length > 0) {
      const targetSport = sport === 'football' ? 'Soccer' : 'Basketball';
      
      // 1. Try to find exact sport match
      const exactMatch = data.teams.find((t: any) => t.strSport === targetSport);
      if (exactMatch && exactMatch.strTeamBadge) {
        return exactMatch.strTeamBadge;
      }
      
      // 2. Fallback to first result if badge exists
      if (data.teams[0].strTeamBadge) {
        return data.teams[0].strTeamBadge;
      }
    }
  } catch (err) {
    console.warn("TheSportsDB lookup failed", err);
  }

  // ---------------------------------------------------------
  // STRATEGY 2: Wikipedia Page Image Scan (Robust)
  // ---------------------------------------------------------
  // Instead of guessing filenames or taking the main thumbnail (which is often a stadium),
  // we find the correct page, get ALL images on it, and pick the one named "logo.svg" etc.

  const wikiBase = "https://en.wikipedia.org/w/api.php";

  // Helper to score image filenames
  const scoreImage = (name: string): number => {
    const lower = name.toLowerCase();
    let score = 0;
    
    // Positive keywords
    if (lower.includes('logo')) score += 20;
    if (lower.includes('badge')) score += 20;
    if (lower.includes('crest')) score += 20;
    if (lower.includes('.svg')) score += 10; // SVGs are usually high quality logos
    if (lower.includes('.png')) score += 5;
    
    // Negative keywords (Avoid stadiums, kits, photos)
    if (lower.includes('stadium')) score -= 50;
    if (lower.includes('arena')) score -= 50;
    if (lower.includes('photo')) score -= 20;
    if (lower.includes('squad')) score -= 20;
    if (lower.includes('team')) score -= 10;
    if (lower.includes('jersey')) score -= 10;
    if (lower.includes('kit')) score -= 10;
    if (lower.includes('flag')) score -= 5;
    if (lower.includes('map')) score -= 50;
    
    return score;
  };

  const getBestImageFromPage = async (pageTitle: string): Promise<string | null> => {
    try {
      // Get all images linked on the page
      // imlimit=50 to get a good spread of images (logos are usually near the top, but not always)
      const url = `${wikiBase}?action=query&titles=${encodeURIComponent(pageTitle)}&prop=images&imlimit=50&format=json&origin=*`;
      const res = await fetch(url);
      const data = await res.json();
      
      const pages = data.query?.pages;
      if (!pages) return null;
      
      const pageId = Object.keys(pages)[0];
      const images = pages[pageId]?.images;

      if (!images || images.length === 0) return null;

      // Filter and Sort images
      const rankedImages = images
        .map((img: any) => ({
          title: img.title,
          score: scoreImage(img.title)
        }))
        .filter((img: any) => img.score > 0) // Only keep likely logos
        .sort((a: any, b: any) => b.score - a.score); // Best first

      if (rankedImages.length === 0) return null;

      // Fetch the URL of the winner
      const winnerTitle = rankedImages[0].title;
      const imgUrlReq = `${wikiBase}?action=query&titles=${encodeURIComponent(winnerTitle)}&prop=imageinfo&iiprop=url&format=json&origin=*`;
      const imgRes = await fetch(imgUrlReq);
      const imgData = await imgRes.json();
      
      const imgPages = imgData.query.pages;
      const imgPageId = Object.keys(imgPages)[0];
      
      return imgPages[imgPageId]?.imageinfo?.[0]?.url || null;
    } catch (e) {
      console.error("Error fetching page images", e);
      return null;
    }
  };

  // Step 2a: Find the correct page title (Handling Redirects & Spelling)
  // We try with sport suffix first, then without.
  const searchQueries = [
    `${cleanName} ${sportSuffix} club`, // "Arsenal football club"
    `${cleanName} ${sportSuffix}`,      // "Arsenal football"
    cleanName                           // "Arsenal" (or "Ankara Gençlerbirliği")
  ];

  for (const query of searchQueries) {
    try {
      // OpenSearch is good for finding the Canonical Title
      const searchUrl = `${wikiBase}?action=opensearch&search=${encodeURIComponent(query)}&limit=1&namespace=0&format=json&origin=*`;
      const searchRes = await fetch(searchUrl);
      const searchData = await searchRes.json();
      
      // searchData[1] contains titles
      if (searchData[1] && searchData[1].length > 0) {
        const bestPageTitle = searchData[1][0];
        const logoUrl = await getBestImageFromPage(bestPageTitle);
        if (logoUrl) return logoUrl;
      }
    } catch (e) {
      console.error(`Wiki search failed for ${query}`, e);
    }
  }

  return '';
};
