#include <WiFi.h>
#include <HTTPClient.h>
#include "DHT.h"

#define DHTPIN 4        // Pin DHT22
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

const char* ssid = "realmeC35"; //ssid wifi
const char* password = "awawa1010"; //pss wifi
const char* serverUrl = "https://dht22telepolling-production.up.railway.app/update"; //ganti server flasknya

void setup() {
    Serial.begin(115200);
    dht.begin();
    WiFi.begin(ssid, password);
    Serial.print("Connecting to WiFi");
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("\nConnected to WiFi");
}

void loop() {
    if (WiFi.status() == WL_CONNECTED) {
        float temperature = dht.readTemperature();
        float humidity = dht.readHumidity();
        if (isnan(temperature) || isnan(humidity)) {
            Serial.println("Failed to read from DHT sensor!");
            return;
        }

        HTTPClient http; //server client http
        http.begin(serverUrl);
        http.addHeader("Content-Type", "application/json");
        
        String jsonPayload = "{\"temperature\": " + String(temperature) + ", \"humidity\": " + String(humidity) + "}";

        int httpResponseCode = http.POST(jsonPayload);
        
        if (httpResponseCode > 0) {
            Serial.println("Data sent successfully!");
        } else {
            Serial.println("Error sending data");
        }
        
        http.end();
    } else {
        Serial.println("WiFi not connected");
    }
    delay(10000); // Kirim data setiap 10 detik
}
