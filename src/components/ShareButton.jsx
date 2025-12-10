import { createSignal } from 'solid-js';

/**
 * Share Button Component
 * Allows users to share their AI timeline predictions to X (Twitter) and LinkedIn
 */
export default function ShareButton(props) {
  const [showMenu, setShowMenu] = createSignal(false);

  // UPDATE THESE WITH YOUR ACTUAL SOCIAL MEDIA HANDLES
  const SOCIAL_HANDLES = {
    twitter: '@faisalnair', // TODO: Replace with your X/Twitter handle
    linkedin: 'faisalnazir', // TODO: Replace with your LinkedIn name or URL
  };

  /**
   * Generate share text based on current predictions
   * ASI and Superintelligence are treated as equivalent
   */
  const generateShareText = () => {
    const { agiYear, asiYear } = props.timeline;
    const singularityYear = Math.round(asiYear + 3);
    const scenario = props.scenario;

    return `My AI Timeline Prediction:\n\n🤖 AGI: ${Math.round(agiYear)}\n⭐ ASI/Superintelligence: ${Math.round(asiYear)}\n🌀 Singularity: ${Math.round(singularityYear)}\n\nScenario: ${scenario}\n\nPredict your own timeline: ${typeof window !== 'undefined' ? window.location.href : ''}\n\n#AI #Singularity #ArtificialIntelligence #Future #AGI #ASI\n\nCC: ${SOCIAL_HANDLES.twitter}`;
  };

  /**
   * Generate LinkedIn-specific share text (shorter, more professional)
   */
  const generateLinkedInText = () => {
    const { agiYear, asiYear } = props.timeline;
    const singularityYear = Math.round(asiYear + 3);
    const scenario = props.scenario;

    return `My AI Timeline Prediction:\n\n🤖 AGI: ${Math.round(agiYear)}\n⭐ ASI/Superintelligence: ${Math.round(asiYear)}\n🌀 Singularity: ${Math.round(singularityYear)}\n\nScenario: ${scenario}\n\nPredict your own timeline 👇\n\n#AI #AGI #ASI #ArtificialIntelligence #Future`;
  };

  /**
   * Share to X (Twitter)
   */
  const shareToTwitter = () => {
    const text = generateShareText();
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'width=600,height=400');
    setShowMenu(false);
  };

  /**
   * Share to LinkedIn - copies text to clipboard and opens LinkedIn share
   */
  const shareToLinkedIn = async () => {
    const shareUrl = window.location.href;
    const shareText = generateLinkedInText();

    // Copy the share text to clipboard first
    try {
      await navigator.clipboard.writeText(shareText);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }

    // Open LinkedIn share dialog
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=600');

    // Show a brief alert to let user know text is copied
    alert('Your prediction text has been copied! Paste it into your LinkedIn post.');
    setShowMenu(false);
  };

  /**
   * Copy link to clipboard
   */
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      // Could add a toast notification here
      alert('Link copied to clipboard!');
      setShowMenu(false);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div class="share-button-container">
      <button
        class="share-btn"
        onClick={() => setShowMenu(!showMenu())}
        title="Share your prediction"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="18" cy="5" r="3"></circle>
          <circle cx="6" cy="12" r="3"></circle>
          <circle cx="18" cy="19" r="3"></circle>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </svg>
        Share
      </button>

      <Show when={showMenu()}>
        <div class="share-dropdown">
          <div class="share-header">Share your prediction</div>

          <button class="share-option" onClick={shareToTwitter}>
            <div class="share-option-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </div>
            <div class="share-option-content">
              <div class="share-option-title">Share to X (Twitter)</div>
              <div class="share-option-desc">Tag {SOCIAL_HANDLES.twitter}</div>
            </div>
          </button>

          <button class="share-option" onClick={shareToLinkedIn}>
            <div class="share-option-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </div>
            <div class="share-option-content">
              <div class="share-option-title">Share to LinkedIn</div>
              <div class="share-option-desc">Tag {SOCIAL_HANDLES.linkedin}</div>
            </div>
          </button>

          <div class="share-divider"></div>

          <button class="share-option" onClick={copyLink}>
            <div class="share-option-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
            </div>
            <div class="share-option-content">
              <div class="share-option-title">Copy Link</div>
              <div class="share-option-desc">Share directly</div>
            </div>
          </button>
        </div>
      </Show>

      <Show when={showMenu()}>
        <div class="share-backdrop" onClick={() => setShowMenu(false)}></div>
      </Show>
    </div>
  );
}
