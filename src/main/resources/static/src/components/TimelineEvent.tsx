import React from 'react';
import { Event } from '../types/Event';

interface TimelineEventProps {
    event: Event;
    index: number;
}

const TimelineEvent: React.FC<TimelineEventProps> = ({ event, index }) => {
    const handleOptionClick = async (optionId: number) => {
        try {
            const response = await fetch(`/api/events/options/${optionId}/select`, {
                method: 'POST',
            });
            const result = await response.json();
            // 处理选项结果
            console.log(result);
        } catch (error) {
            console.error('选择选项失败:', error);
        }
    };

    return (
        <div className="timeline-event">
            <div className="event-year">{event.year}</div>
            <div className="event-content">
                <img 
                    src={event.image} 
                    alt={event.name} 
                    className="event-image"
                />
                <h3 className="event-title">{event.name}</h3>
                <p className="event-description">{event.question}</p>
                <div className="event-options">
                    {event.options?.map(option => (
                        <button
                            key={option.id}
                            className="event-option"
                            onClick={() => handleOptionClick(option.id)}
                        >
                            {option.optionText}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TimelineEvent; 