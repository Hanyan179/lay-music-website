import React, { useEffect, useState } from 'react';
import { Event } from '../types/Event';
import TimelineEvent from './TimelineEvent';

const Timeline: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await fetch('/api/events');
            const data = await response.json();
            setEvents(data);
        } catch (error) {
            console.error('加载事件失败:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">加载中...</div>;
    }

    return (
        <div className="timeline-container">
            <div className="timeline">
                {events.map((event, index) => (
                    <TimelineEvent 
                        key={event.id} 
                        event={event} 
                        index={index}
                    />
                ))}
            </div>
        </div>
    );
};

export default Timeline; 