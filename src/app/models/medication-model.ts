export interface MedicationModel {
    med_id: number; 
    user_id: string;
    name: string;
    description: string;
    hour: number;
    days_to_take: string[];
    // storing dates as string for ease with firestore
    date_added: string;
    dates_taken: string[];
}