import time
import requests

TELEGRAM_TOKEN = "7273000311:AAG62POhHJoYYUdXAV_v7z_ia8MEcd_6eOw"
TELEGRAM_API_URL = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}"

def get_updates(offset=None):
    url = f"{TELEGRAM_API_URL}/getUpdates"
    params = {"timeout": 10, "offset": offset}
    try:
        response = requests.get(url, params=params, timeout=15)
        print("Telegram API status:", response.status_code)
        print("Telegram API response:", response.text)
        return response.json()
    except Exception as e:
        print("Error saat polling Telegram:", e)
        return {"ok": False, "result": []}

def send_telegram_message(message, chat_id):
    url = f"{TELEGRAM_API_URL}/sendMessage"
    payload = {"chat_id": chat_id, "text": message}
    requests.post(url, data=payload)

def main():
    last_update_id = None
    while True:
        print("Polling Telegram...")
        updates = get_updates(last_update_id)
        if updates.get("ok"):
            for result in updates["result"]:
                message = result["message"]
                chat_id = message["chat"]["id"]
                text = message.get("text", "").lower()
                print("Received:", text)
                if text == "/humidity":
                    data = requests.get("http://localhost:5000/data").json()
                    hum = data.get("humidity")
                    send_telegram_message(f"Humidity : {hum}%", chat_id)
                elif text == "/temperature":
                    data = requests.get("http://localhost:5000/data").json()
                    temp = data.get("temperature")
                    send_telegram_message(f"Temperature : {temp}°C", chat_id)
                elif text == "/start":
                    send_telegram_message(
                        "Welcome to SIPADU (Sistem pemanen air dari udara)!\nType /humidity to check humidity now, /temperature to check temperature now.",
                        chat_id
                    )
                last_update_id = result["update_id"] + 1
        time.sleep(2)

if __name__ == "__main__":
    print("Mulai polling Telegram...")
    main()
