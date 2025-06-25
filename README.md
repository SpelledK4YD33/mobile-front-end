# Installation
### 1. Install Dependencies
In the root of your project:
`npm install`
 #### Set Your Local IP Address
The app connects to your Spring Boot backend via your local network.

Find your current IP address:

##### On Windows
`ipconfig`
Look for your IPv4 Address.

#### On Mac/Linux
`
ifconfig
`
- In `src/services/parkingService.ts`, update this line:

```ts
const BASE_URL = "http://YOUR_DEVICE_IP:8080";
```
Replace YOUR_DEVICE_IP with your actual local IP address.

### 3 Start the App
Start the Expo development server:

`npx expo start`
Then, scan the QR code using the Expo Go app on your Android or iOS device (make sure the device is on the same Wi-Fi as your computer).
