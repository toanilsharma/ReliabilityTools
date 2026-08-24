/**
 * Google Analytics 4 (GA4) & Data Layer Event Tracking Utility
 */

declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}

/**
 * Generic helper to send custom events to GA4 and Push to dataLayer
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  // Push to dataLayer array if available
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      ...params
    });

    // Call gtag if initialized
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    }
  }
}

/**
 * Custom Conversion Event 1: Tool / Calculator Execution
 * Fires when a user successfully calculates a result (after passing input validation).
 */
export function trackToolCalculation(toolName: string, toolSlug: string) {
  trackEvent('tool_calculated', {
    tool_name: toolName,
    tool_slug: toolSlug,
    timestamp: new Date().toISOString()
  });
}

/**
 * Custom Conversion Event 2: Template Download
 * Fires when a user downloads an ISO/FMEA/FRACAS template.
 */
export function trackTemplateDownload(templateName: string) {
  trackEvent('template_downloaded', {
    template_name: templateName,
    timestamp: new Date().toISOString()
  });
}

/**
 * Custom Conversion Event 3: Skill Test Start
 * Fires when a user begins the 20-question reliability skill assessment.
 */
export function trackSkillTestStart() {
  trackEvent('skill_test_started', {
    timestamp: new Date().toISOString()
  });
}

/**
 * Custom Conversion Event 4: Skill Test Complete
 * Fires when a user finishes the reliability certification quiz with their final score and title.
 */
export function trackSkillTestComplete(scorePercent: number, certificationTitle: string) {
  trackEvent('skill_test_completed', {
    score_percent: scorePercent,
    certification_title: certificationTitle,
    timestamp: new Date().toISOString()
  });
}
