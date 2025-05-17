export const getUserLocation = async (): Promise<GeolocationCoordinates> => {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve(position.coords);
                },
                (error) => {
                    reject(error);
                }
            );
        } else {
            reject(new Error("Geolocation is not supported by this browser."));
        }
    });
};

interface Coordinates {
    latitude: number;
    longitude: number;
}

export const calculateMidpoint = (locations: GeolocationCoordinates[]): Coordinates => {
    const latitudes = locations.map(loc => loc.latitude);
    const longitudes = locations.map(loc => loc.longitude);

    return {
        latitude: latitudes.reduce((a, b) => a + b, 0) / latitudes.length,
        longitude: longitudes.reduce((a, b) => a + b, 0) / longitudes.length,
    };
};