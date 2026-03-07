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
                setRecentTools(JSON.parse(stored));
            }
        } catch (e) {
            console.error('Failed to load recent tools', e);
        }
    }, []);

    const addRecentTool = (tool: Omit<RecentTool, 'timestamp'>) => {
        setRecentTools((prev) => {
            // Remove if already exists to move to top
            const filtered = prev.filter(t => t.id !== tool.id);
            const updated = [
                { ...tool, timestamp: Date.now() },
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
