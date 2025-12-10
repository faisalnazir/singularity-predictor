# Share Button Setup

## Overview
The Singularity Predictor now includes share buttons that allow users to share their AI timeline predictions to X (Twitter) and LinkedIn, with you tagged in the posts.

## Current Status
✅ Share buttons added to the header
✅ X (Twitter) integration complete
✅ LinkedIn integration complete
✅ Copy link functionality added
✅ Build successful

## Setting Up Your Social Media Tags

To tag yourself in shared posts, you need to update the social media handles in the ShareButton component.

### Step 1: Open the ShareButton Component
Edit the file: `src/components/ShareButton.jsx`

### Step 2: Update the Handles
Find this section (around line 10):

```javascript
// UPDATE THESE WITH YOUR ACTUAL SOCIAL MEDIA HANDLES
const SOCIAL_HANDLES = {
  twitter: '@yourusername', // TODO: Replace with your X/Twitter handle
  linkedin: 'Your Name', // TODO: Replace with your LinkedIn name or URL
};
```

Replace the placeholder values with your actual social media information:

```javascript
// UPDATE THESE WITH YOUR ACTUAL SOCIAL MEDIA HANDLES
const SOCIAL_HANDLES = {
  twitter: '@youractualhandle', // Your X/Twitter username
  linkedin: 'Your Full Name', // Your LinkedIn profile name
};
```

### Example:
```javascript
const SOCIAL_HANDLES = {
  twitter: '@FaisalKhan',
  linkedin: 'Faisal Khan',
};
```

## Share Text Format

When users share their predictions, the text will include:
- AGI prediction year
- Superintelligence prediction year
- ASI prediction year
- Singularity year
- Current scenario name
- Link to the app
- Relevant hashtags (#AI #Singularity #ArtificialIntelligence #Future #AGI #ASI)
- Your tag (if applicable)

### Example Share Text:
```
My AI Timeline Prediction:

🤖 AGI: 2027
🚀 Superintelligence: 2032
⭐ ASI: 2035
🌀 Singularity: 2038

Scenario: race

Predict your own timeline: https://your-app-url.com

#AI #Singularity #ArtificialIntelligence #Future #AGI #ASI
```

## Testing

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open the app in your browser

3. Click the "Share" button in the header

4. Test each sharing option:
   - Share to X (Twitter)
   - Share to LinkedIn
   - Copy Link

## Open Graph Tags for LinkedIn Preview

LinkedIn requires proper Open Graph meta tags to display a preview. The `index.html` file has been updated with:

- `og:title` - Title for the preview
- `og:description` - Description for the preview
- `og:image` - Image for the preview (1200x630px recommended)
- `og:url` - Canonical URL

### Step 3: Add Preview Image

Create an Open Graph image (1200x630px) and save it as:
- `public/og-image.jpg` (or .png)

Then update `index.html` line 14:
```html
<meta property="og:image" content="https://your-domain.com/og-image.jpg" />
```

Replace `your-domain.com` with your actual domain.

### Step 4: Update URLs

In `index.html`, update these lines with your actual domain:

```html
<meta property="og:url" content="https://your-actual-domain.com" />
<meta property="twitter:url" content="https://your-actual-domain.com" />
<meta property="twitter:image" content="https://your-actual-domain.com/og-image.jpg" />
```

## Important Notes for LinkedIn Sharing

1. **LinkedIn requires a publicly accessible URL** - localhost won't work for previews
2. **Open Graph tags must be present** before LinkedIn crawls the page
3. **LinkedIn caches previews** - it may take time to update after changes
4. **Use the Web Share API when available** - works better on mobile devices

## Troubleshooting LinkedIn Preview

If LinkedIn still shows "Cannot display preview":

1. **Deploy to a public domain** (not localhost)
2. **Wait 24-48 hours** for LinkedIn to re-crawl
3. **Use LinkedIn's Post Inspector** to debug: https://www.linkedin.com/post-inspector/
4. **Check that og:image is accessible** and returns HTTP 200

## Customization

You can customize the share text by modifying the `generateShareText()` function in `ShareButton.jsx`.

## Notes

- The share buttons open in new popup windows (except Web Share API on mobile)
- Users must be logged into their social media accounts to post
- The copy link feature uses the Clipboard API (works in modern browsers)
- Twitter sharing works well on both localhost and deployed versions
- LinkedIn preview requires public deployment with proper meta tags
