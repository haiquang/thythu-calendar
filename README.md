# ThyThu Calendar

A React-based calendar application that allows users to create, view, and manage events. User authentication is handled by Firebase, and all calendar data is stored in a Firestore database.

## Features

- User authentication (login, register, logout)
- Create calendar events with title, date, and description
- View all your scheduled events
- Delete events you no longer need
- Responsive design that works on desktop and mobile

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/thythu-calendar.git
   cd thythu-calendar
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up Firebase:
   - Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Enable Authentication with Email/Password
   - Create a Firestore database
   - Add your Firebase configuration to `src/firebase/config.js`

4. Start the development server:
   ```
   npm start
   ```

## Deployment

This project is set up for easy deployment to GitHub Pages:

1. Update the `homepage` field in `package.json` to your GitHub Pages URL:
   ```
   "homepage": "https://yourusername.github.io/thythu-calendar"
   ```

2. Deploy to GitHub Pages:
   ```
   npm run deploy
   ```

## Technologies Used

- React.js
- Firebase Authentication
- Firestore Database
- React Router
- GitHub Pages

## License

MIT

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
