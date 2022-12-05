# Prereqs

8 Install node:
  - https://nodejs.org/en/download/

* Install expo:
  `npm install -g expo-cli`

* Install dependencies:
  `npm instal`

* Create a Google Account for your project
* Create a firebase project with android, Apple, and WebApp. This code uses firebase storage for accounts and audio recordings firestore database for profile data storage.
* download google-services.json from your firebase project->settings (for android)
* download GoogleService-info.json from your firebase project->settings (for apple)
* download the firebase config for the web app from project->settings (for web app). Copy the section 'Your web app's Firebase configuration' into firebase/config.json
## To Run

* Run the following commands:

  * `expo start`

  * In your browser open http://localhost:19002/ or whatever is given in the console and scan QR code with expo application on your phone
