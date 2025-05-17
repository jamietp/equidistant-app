export interface Recommendation {
    id: string;
    title: string;
    description: string;
    activityType: string;
    distance: number;
}

interface RecommendationsProps {
    recommendations: Recommendation[];
}

const Recommendations: React.FC<RecommendationsProps> = ({ recommendations }) => {
    return (
        <div>
            <h2>Recommended Activities</h2>
            <ul>
                {recommendations.map((rec) => (
                    <li key={rec.id}>
                        <h3>{rec.title}</h3>
                        <p>{rec.description}</p>
                        <p>Type: {rec.activityType}</p>
                        <p>Distance: {rec.distance} km</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Recommendations;