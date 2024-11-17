# homebridge-api-temperature-sensor

config example

```
       {
            "accessory": "TemperatureSensorPlugin",
            "name": "Car Porch",
            "temperatureUrl": "http://192.168.100.4/temperature"
        },
        {
            "accessory": "TemperatureSensorPlugin",
            "name": "Garden",
            "temperatureUrl": "http://192.168.100.16/temperature0"
        }
```

GET request response sample;
'23.20'
