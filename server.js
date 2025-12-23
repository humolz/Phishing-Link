const express = require('express');
const cors = require('cors');
const path = require('path');
const os = require('os');

const app = express();
app.use(cors());
app.use(express.json());

let deviceInfoList = [
    {
        ipv4: '192.168.1.2',
        ipv6: 'fe80::1',
        subnetMask: '255.255.255.0',
        defaultGateway: '192.168.1.1',
        deviceName: 'Sample Device 1',
        location: 'Sample Location 1'
    },
    {
        ipv4: '192.168.1.3',
        ipv6: 'fe80::2',
        subnetMask: '255.255.255.0',
        defaultGateway: '192.168.1.1',
        deviceName: 'Sample Device 2',
        location: 'Sample Location 2'
    }
];

let archiveList = [];

// Function to get network interfaces
function getNetworkInterfaces() {
    let ipv4, ipv6, subnetMask, defaultGateway;

    Object.values(os.networkInterfaces()).forEach(ifs => {
        ifs.forEach(iface => {
            if (iface.family === 'IPv4' && !iface.internal) {
                ipv4 = iface.address;
                subnetMask = iface.netmask;
            }
            if (iface.family === 'IPv6' && !iface.internal) {
                ipv6 = iface.address;
            }
        });
    });

    const defaultRoute = os.networkInterfaces()['en0']?.find(net => net.family === 'IPv4' && net.netmask !== '255.255.255.255');
    if (defaultRoute) {
        defaultGateway = defaultRoute.address;
    }

    return { ipv4, ipv6, subnetMask, defaultGateway };
}

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// Serve ips-page.html from the 'server' directory
app.get('/ips-page', (req, res) => {
    res.sendFile(path.join(__dirname, 'ips-page.html'));
});

// Serve index.html by default
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.post('/api/device-info', (req, res) => {
    const networkInfo = getNetworkInterfaces();
    const newDeviceInfo = { ...req.body, ...networkInfo };
    deviceInfoList.push(newDeviceInfo);
    console.log(`Received device info: IP - ${newDeviceInfo.ipv4}, Location - ${newDeviceInfo.location}, Device - ${newDeviceInfo.deviceName}`);
    res.status(201).send('Device info received');
});

app.get('/api/device-info', (req, res) => {
    console.log('GET request received for /api/device-info');
    console.log(`Sending device info list: ${JSON.stringify(deviceInfoList)}`);
    res.json(deviceInfoList);
});

app.post('/api/archive', (req, res) => {
    archiveList = [...archiveList, ...deviceInfoList];
    deviceInfoList = [];
    console.log('Archive updated and current list cleared');
    res.status(200).send('List archived and cleared');
});

app.get('/api/archive', (req, res) => {
    console.log('GET request received for /api/archive');
    console.log(`Sending archive list: ${JSON.stringify(archiveList)}`);
    res.json(archiveList);
});

// Update Content Security Policy
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self'");
    next();
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
