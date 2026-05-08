export interface Medication {
    med_id: number; 
    user_id: string;
    name: string;
    description: string;
    hour: number;
    days_to_take: string[];
    taken: false;
    date_added: Date;
}

export interface Medication {
    med_id: number;
    user_id: string;
    day: string;
}