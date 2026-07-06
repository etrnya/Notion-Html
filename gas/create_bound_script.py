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

def create_bound_project(title, parent_id):
    token = get_access_token()
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    url = "https://script.googleapis.com/v1/projects"
    body = {
        "title": title,
        "parentId": parent_id
    }
    
    response = requests.post(url, headers=headers, json=body)
    print(f"Create Project status: {response.status_code}")
    if response.status_code != 200:
        print("Error response:", response.text)
        return None
        
    res_data = response.json()
    print("Project created successfully!")
    print(f"Script ID: {res_data.get('scriptId')}")
    print(f"Title: {res_data.get('title')}")
    return res_data.get('scriptId')

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 3:
        print("Usage: python create_bound_script.py <title> <parent_id>")
        sys.exit(1)
        
    title = sys.argv[1]
    parent_id = sys.argv[2]
    create_bound_project(title, parent_id)
