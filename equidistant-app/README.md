# MidPoint

## Overview
The MidPoint App is a London-focused application that allows users to input their locations, find activities at a midpoint, and view tailored recommendations. This MVP aims to enhance user experience by providing a seamless way to discover activities based on geographic proximity.

## Features
- User location input with geolocation support
- Calculation of the geographic midpoint between multiple locations
- Display of activities available at the midpoint
- Tailored recommendations based on user preferences
- Interactive map showing user locations and activity pins

## Project Structure
```
equidistant-app
├── src
│   ├── components
│   ├── services
│   ├── types
│   ├── utils
│   ├── constants
│   ├── app.tsx
│   └── index.tsx
├── public
│   └── index.html
├── tests
│   └── __tests__
│       └── components
├── package.json
├── tsconfig.json
└── README.md
```

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd equidistant-app
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm start
   ```

## Usage
- Input your location in the provided field or enable geolocation.
- The app will calculate the midpoint and display activities available at that location.
- View tailored recommendations based on your preferences.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.