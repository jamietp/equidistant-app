import { Activity } from '../models/activity';

export const fetchActivities = async (location: string): Promise<Activity[]> => {
    // Logic to fetch activities based on the user's location
    const response = await fetch(`https://api.example.com/activities?location=${location}`);
    if (!response.ok) {
        throw new Error('Failed to fetch activities');
    }
    const activities = await response.json();
    return activities;
};

export const searchActivities = (activities: Activity[], query: string): Activity[] => {
    // Logic to search activities based on a query
    return activities.filter(activity => 
        activity.name.toLowerCase().includes(query.toLowerCase())
    );
};