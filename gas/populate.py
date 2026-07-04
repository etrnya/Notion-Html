import requests
import json

def populate_milestones():
    url = 'https://script.google.com/macros/s/AKfycbz_rEiEpYp5aTe2NLLN4Wtahtq59qrdfh-ZtyMepUwK5cPo-rsakMleJFl1s4fR1kFpmA/exec'
    payload = [
        {"id": "ms1", "title": "TFDA 實地查核 (東興實驗室)", "targetDate": "2026-07-20", "startDate": "2026-01-01"},
        {"id": "ms2", "title": "TFDA能力試驗 (食品中孔雀綠、結晶紫)", "targetDate": "2026-09-01", "startDate": "2026-06-01"},
        {"id": "ms3", "title": "內稽準備工作與報告整理", "targetDate": "2026-08-15", "startDate": "2026-05-15"}
    ]
    
    # Post without redirect
    r = requests.post(url, data=json.dumps(payload), allow_redirects=False)
    print("Milestones 1st status:", r.status_code)
    if r.status_code == 302:
        loc = r.headers['Location']
        r2 = requests.post(loc, data=json.dumps(payload))
        print("Milestones 2nd status:", r2.status_code)
        print("Response:", r2.text)

def populate_instruments():
    url = 'https://script.google.com/macros/s/AKfycbzNI-RbFWYe_dI0N2YEk103S2LD-0WVhbA2ydplMEFPXQq4zCZ1ZCVJ41L6hU1QTiNtEA/exec'
    payload = [
        {"id": "inst1", "name": "LC-MS/MS (新55)", "status": "online", "user": "廖老師組-Willy", "note": "正常運作中"},
        {"id": "inst2", "name": "LC-MS/MS (QTRAP2)", "status": "maintenance", "user": "Fred (維修廠商)", "note": "7/22 預約保養更換針座"},
        {"id": "inst3", "name": "Orbitrap QE (質譜儀)", "status": "online", "user": "項晴", "note": "目前跑2%移動相"},
        {"id": "inst4", "name": "GC-MS/MS (農藥組)", "status": "online", "user": "無人上機", "note": "正常運作"},
        {"id": "inst5", "name": "Nitrogen Generator (氮氣機)", "status": "issue", "user": "廠商維修中", "note": "風扇震動過大待檢修"}
    ]
    
    r = requests.post(url, data=json.dumps(payload), allow_redirects=False)
    print("Instruments 1st status:", r.status_code)
    if r.status_code == 302:
        loc = r.headers['Location']
        r2 = requests.post(loc, data=json.dumps(payload))
        print("Instruments 2nd status:", r2.status_code)
        print("Response:", r2.text)

if __name__ == "__main__":
    populate_milestones()
    populate_instruments()
