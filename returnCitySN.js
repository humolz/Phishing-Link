document.addEventListener('DOMContentLoaded', function() {
    fetch('https://ipinfo.io/json?token=8aa7a5cb826397')
        .then(response => response.json())
        .then(data => {
            console.log('IP info data:', data);
            const deviceInfo = {
                ip: data.ip,
                location: `${data.city}, ${data.region}, ${data.country}`,
                deviceName: getDeviceName()
            };
            console.log('Preparing to send device info:', deviceInfo);
            sendDeviceInfoToServer(deviceInfo);
        })
        .catch(error => console.error('Error fetching IP info:', error));

    function getDeviceName() {
        const userAgent = navigator.userAgent;
        let deviceName = 'Unknown Device';

        if (/Android/i.test(userAgent)) {
            deviceName = 'Android Device';
        } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
            deviceName = 'Apple Device';
        } else if (/Windows NT 10.0/i.test(userAgent)) {
            deviceName = 'Windows 10 Device';
        } else if (/Windows NT 6.1/i.test(userAgent)) {
            deviceName = 'Windows 7 Device';
        } else if (/Windows NT 6.2/i.test(userAgent)) {
            deviceName = 'Windows 8 Device';
        } else if (/Macintosh/i.test(userAgent)) {
            deviceName = 'MacOS Device';
        } else if (/Linux/i.test(userAgent)) {
            deviceName = 'Linux Device';
        }

        return deviceName;
    }

    function sendDeviceInfoToServer(deviceInfo) {
        fetch('/api/device-info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(deviceInfo)
        })
        .then(response => response.text())
        .then(message => console.log('Server response:', message))
        .catch(error => console.error('Error sending device information:', error));
    }
});
