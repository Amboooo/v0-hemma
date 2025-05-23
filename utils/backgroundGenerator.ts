// Categories of images with keywords and Unsplash collections
const IMAGE_CATEGORIES = {
  cleaning: {
    keywords: ["cleaning", "organized", "tidy", "neat", "spotless", "vacuum", "mop", "broom", "dust"],
    collections: "4324303,1103088,3930681",
  },
  cooking: {
    keywords: ["cooking", "kitchen", "food", "meal", "recipe", "baking", "chef", "dinner", "lunch"],
    collections: "3178572,4252079,986941",
  },
  laundry: {
    keywords: ["laundry", "clothes", "washing", "folding", "ironing", "fabric", "clean clothes"],
    collections: "8961398,1103088,9389477",
  },
  gardening: {
    keywords: ["garden", "plants", "flowers", "yard", "outdoor", "lawn", "nature", "gardening"],
    collections: "3694365,1424240,4248573",
  },
  home: {
    keywords: ["home", "house", "interior", "living room", "cozy", "comfortable", "decor", "decoration"],
    collections: "1118894,3836292,3214285",
  },
  workspace: {
    keywords: ["workspace", "office", "desk", "work", "computer", "study", "productive", "organization"],
    collections: "1301903,3349207,3698396",
  },
  bathroom: {
    keywords: ["bathroom", "shower", "bath", "clean bathroom", "sink", "toilet", "tiles"],
    collections: "4933124,2183895,8156526",
  },
  bedroom: {
    keywords: ["bedroom", "bed", "sleep", "rest", "pillow", "blanket", "night", "relaxation"],
    collections: "8943764,1118894,3836292",
  },
  nature: {
    keywords: ["nature", "landscape", "mountain", "forest", "lake", "river", "outdoor", "scenic"],
    collections: "3694365,327760,2463607",
  },
  abstract: {
    keywords: ["abstract", "pattern", "texture", "color", "art", "design", "geometric", "creative"],
    collections: "4694315,8833468,8833472",
  },
}

// List of random prompts for when the user doesn't provide one
const RANDOM_PROMPTS = [
  "peaceful mountain landscape",
  "cozy living room with fireplace",
  "organized home office",
  "clean kitchen with modern appliances",
  "zen garden with raked sand",
  "minimalist workspace",
  "tidy bookshelf with color-coded books",
  "freshly cleaned bathroom",
  "organized garage with tools",
  "laundry room with folded clothes",
]

// Fallback gradient backgrounds when image services fail
const FALLBACK_GRADIENTS = [
  "linear-gradient(to right, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(to right, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(to right, #fa709a 0%, #fee140 100%)",
  "linear-gradient(to right, #6a11cb 0%, #2575fc 100%)",
  "linear-gradient(to right, #ff9a9e 0%, #fad0c4 100%)",
  "linear-gradient(to right, #a18cd1 0%, #fbc2eb 100%)",
  "linear-gradient(to right, #ffecd2 0%, #fcb69f 100%)",
  "linear-gradient(to right, #84fab0 0%, #8fd3f4 100%)",
  "linear-gradient(to right, #d4fc79 0%, #96e6a1 100%)",
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
]

// Function to find the best category for a prompt
const findBestCategory = (prompt: string): string => {
  if (!prompt) return "home"

  const lowerPrompt = prompt.toLowerCase()
  let bestMatch = { category: "home", count: 0 }

  Object.entries(IMAGE_CATEGORIES).forEach(([category, data]) => {
    const keywordMatches = data.keywords.filter((keyword) => lowerPrompt.includes(keyword.toLowerCase())).length
    if (keywordMatches > bestMatch.count) {
      bestMatch = { category, count: keywordMatches }
    }
  })

  return bestMatch.category
}

// Function to generate a seed for consistent but different backgrounds
const generateSeed = (prompt: string): number => {
  let hash = 0
  const str = prompt || "default"
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0 // Convert to 32bit integer
  }
  return Math.abs(hash)
}

// Function to get a background based on a prompt
export const generateBackgroundImage = (prompt: string): { url: string; isGradient: boolean } => {
  // If no prompt is provided, select a random one
  const finalPrompt = prompt.trim() || RANDOM_PROMPTS[Math.floor(Math.random() * RANDOM_PROMPTS.length)]

  // Find the best category for this prompt
  const category = findBestCategory(finalPrompt)

  // Get the collection IDs for this category
  const collections = IMAGE_CATEGORIES[category as keyof typeof IMAGE_CATEGORIES].collections

  // Generate a seed based on the prompt for consistent results
  const seed = generateSeed(finalPrompt)

  // Use the seed to select a specific image from the category
  const timestamp = Date.now()

  // Use Unsplash Source API with collections to get relevant images
  // The collections parameter ensures we get images related to the category
  // The seed ensures we get consistent results for the same prompt
  const imageUrl = `https://source.unsplash.com/collection/${collections}/1600x900?${encodeURIComponent(finalPrompt)}&sig=${seed}&t=${timestamp}`

  return {
    url: imageUrl,
    isGradient: false,
  }
}

// Function to get a fallback gradient
export const getFallbackGradient = (prompt: string): { url: string; isGradient: boolean } => {
  const seed = generateSeed(prompt)
  const gradientIndex = seed % FALLBACK_GRADIENTS.length
  return {
    url: FALLBACK_GRADIENTS[gradientIndex],
    isGradient: true,
  }
}
