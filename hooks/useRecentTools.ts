import { useState, useEffect } from 'react';

export interface RecentTool {
    id: string;
    name: string;
    path: string;
    timestamp: number;
}

export const useRecentTools = () => {
    const [recentTools, setRecentTools] = useState<RecentTool[]>([]);

    useEffect(() => {
        try {
            const stored = localStorage.getItem('recentTools');
            if (stored) {
                const parsed: RecentTool[] = JSON.parse(stored);
                const normalized = parsed.map(t => {
                    let cleanPath = t.path;
                    if (!cleanPath.startsWith('/tools/') && cleanPath.startsWith('/')) {
                        const slug = cleanPath.replace(/^\//, '').replace(/\/$/, '').replace(/-calculator$/, '');
                        cleanPath = `/tools/${slug}/`;
                    }
                    if (!cleanPath.endsWith('/')) {
                        cleanPath = `${cleanPath}/`;
                    }
                    return { ...t, path: cleanPath };
                });
                setRecentTools(normalized);
            }
        } catch (e) {
            console.error('Failed to load recent tools', e);
        }
    }, []);

    const addRecentTool = (tool: Omit<RecentTool, 'timestamp'>) => {
        const canonicalPath = tool.path.endsWith('/') ? tool.path : `${tool.path}/`;
        setRecentTools((prev) => {
            // Remove if already exists to move to top
            const filtered = prev.filter(t => t.id !== tool.id);
            const updated = [
                { ...tool, path: canonicalPath, timestamp: Date.now() },
                ...filtered
            ].slice(0, 4); // Keep only top 4

            try {
                localStorage.setItem('recentTools', JSON.stringify(updated));
            } catch (e) {
                console.error('Failed to save recent tools', e);
            }

            return updated;
        });
    };

    return { recentTools, addRecentTool };
};
