import os
import json
import time
import requests

def get_access_token():
    path = os.path.expanduser('~/.clasprc.json')
    if not os.path.exists(path):
        raise FileNotFoundError("clasp credentials file not found")
        
    with open(path) as f:
        data = json.load(f)
        
    creds = data['tokens']['default']
    access_token = creds['access_token']
    expiry_date = creds.get('expiry_date', 0)
    
    # If expired (or expiring in 60s), refresh it
    current_time_ms = int(time.time() * 1000)
    if expiry_date < current_time_ms + 60000:
        print("Access token expired or expiring soon. Refreshing...")
        refresh_token = creds['refresh_token']
        client_id = creds['client_id']
        client_secret = creds['client_secret']
        
        token_url = "https://oauth2.googleapis.com/token"
        response = requests.post(token_url, data={
            'client_id': client_id,
            'client_secret': client_secret,
            'refresh_token': refresh_token,
            'grant_type': 'refresh_token'
        })
        
        if response.status_code != 200:
            raise RuntimeError(f"Failed to refresh token: {response.text}")
            
        new_creds = response.json()
        access_token = new_creds['access_token']
        print("Token refreshed successfully.")
        
    return access_token

def write_sheet(spreadsheet_id, range_name, values):
    token = get_access_token()
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # 1. Clear sheet values
    clear_url = f"https://sheets.googleapis.com/v4/spreadsheets/{spreadsheet_id}/values/{range_name}:clear"
    r1 = requests.post(clear_url, headers=headers)
    print(f"Clear {range_name}: {r1.status_code}")
    
    # 2. Write new values
    write_url = f"https://sheets.googleapis.com/v4/spreadsheets/{spreadsheet_id}/values/{range_name}?valueInputOption=USER_ENTERED"
    body = {
        "range": range_name,
        "majorDimension": "ROWS",
        "values": values
    }
    r2 = requests.put(write_url, headers=headers, json=body)
    print(f"Write {range_name}: {r2.status_code}")

if __name__ == "__main__":
    # Milestone Sheet
    milestone_id = "14KAfUTW1q5ITpndMOZ5V2wYY4qooncwnyf5yZNzA6sc"
    milestone_values = [
        ["id", "title", "targetDate", "startDate"],
        ["ms1", "TFDA 實地查核 (東興實驗室)", "2026-07-20", "2026-01-01"],
        ["ms2", "TFDA能力試驗 (食品中孔雀綠、結晶紫)", "2026-09-01", "2026-06-01"],
        ["ms3", "內稽準備工作與報告整理", "2026-08-15", "2026-05-15"]
    ]
    write_sheet(milestone_id, "Sheet1!A1:D", milestone_values)
    
    # Instrument Sheet
    instrument_id = "1A6JdygFF3LCz99jHlSEXh4AyEv_i9hdZLDpMEF3bJRM"
    instrument_values = [
        ["id", "name", "status", "user", "note"],
        ["inst1", "LC-MS/MS (新55)", "online", "廖老師組-Willy", "正常運作中"],
        ["inst2", "LC-MS/MS (QTRAP2)", "maintenance", "Fred (維修廠商)", "7/22 預約保養更換針座"],
        ["inst3", "Orbitrap QE (質譜儀)", "online", "項晴", "目前跑2%移動相"],
        ["inst4", "GC-MS/MS (農藥組)", "online", "無人上機", "正常運作"],
        ["inst5", "Nitrogen Generator (氮氣機)", "issue", "廠商維修中", "風扇震動過大待檢修"]
    ]
    write_sheet(instrument_id, "Sheet1!A1:E", instrument_values)
