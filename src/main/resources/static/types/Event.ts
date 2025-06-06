export interface Event {
    id: number;
    name: string;
    image: string;
    question: string;
    year: number;
    isEntry: boolean;
    options: Option[];
}

export interface Option {
    id: number;
    optionText: string;
    effect: string;
    nextType: 'show' | 'jump';
    nextEventName: string;
} 