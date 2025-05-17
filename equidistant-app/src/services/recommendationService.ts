interface Activity {
    type: string;
    rating: number;
}

export const generateRecommendations = (userPreferences: string[], activities: Activity[]) => {
    // Logic to generate recommendations based on user preferences and activities
    const recommendations = activities.filter(activity => 
        userPreferences.includes(activity.type)
    );
    return recommendations;
};

export const getTopRecommendations = (recommendations: Activity[]) => {
    // Logic to sort and return top recommendations based on rating or distance
    return recommendations.sort((a, b) => b.rating - a.rating).slice(0, 5);
};