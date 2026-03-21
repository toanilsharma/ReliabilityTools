import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * A hook to sync component state with the URL for shareable links.
 * Automatically serializes state into a Base64 encoded 'share' URL parameter.
 * If the 'share' parameter exists on mount, it deserializes and returns it to hydrate the app.
 *
 * @param initialState - The default state if no share parameter is present.
 * @returns [state, setState, shareUrl]
 */
export function useShareableState<T>(initialState: T): [T, (newState: T | ((prevState: T) => T)) => void, string] {
  const [searchParams, setSearchParams] = useSearchParams();
  const [state, setState] = useState<T>(() => {
    const shareParam = searchParams.get('share');
    if (shareParam) {
      try {
        const decodedString = atob(shareParam);
        const parsedState = JSON.parse(decodedString);
        return parsedState as T;
      } catch (error) {
        console.error('Failed to parse shareable state from URL:', error);
        return initialState;
      }
    }
    return initialState;
  });

  // Keep URL updated when state changes, taking care not to bloat history if we don't want to.
  // Actually, we generally only want the URL to update when the user EXPLICITLY clicks "Share"
  // to avoid huge URLs and slow renders during typing.
  // BUT the prompt asks for "Shareable URLs ... Generate a unique public URL for each calculation".
  // So a better approach is: we don't auto-update the URL on every keystroke, but we provide
  // the `shareUrl` dynamically based on the current state.
  
  const [shareUrl, setShareUrl] = useState<string>('');

  useEffect(() => {
    try {
      const jsonString = JSON.stringify(state);
      const encodedString = btoa(jsonString);
      
      // Construct the full URL for sharing
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('share', encodedString);
      setShareUrl(currentUrl.toString());
    } catch (error) {
      console.error('Failed to encode shareable state:', error);
      setShareUrl(window.location.href); // Fallback to current URL without state
    }
  }, [state]);

  return [state, setState, shareUrl];
}
