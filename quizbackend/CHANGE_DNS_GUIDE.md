# 🔧 CHANGE WiFi DNS TO GOOGLE DNS - VISUAL GUIDE

## ⚠️ CURRENT STATUS:
- Your DNS: 192.168.1.1 (Router - BLOCKING MongoDB)
- Need DNS: 8.8.8.8 (Google - ALLOWS MongoDB)

---

## 📋 STEP-BY-STEP INSTRUCTIONS (5 Minutes)

### Step 1: Open Network Connections
1. Press **Windows Key + R** on keyboard (this opens "Run" dialog)
2. Type: **ncpa.cpl**
3. Press **Enter**
4. A window titled "Network Connections" will open

### Step 2: Open Wi-Fi Properties
5. You'll see icons like "Ethernet", "Wi-Fi", etc.
6. **Right-click** on **"Wi-Fi"** icon
7. Click **"Properties"** from the menu
8. A new window "Wi-Fi Properties" will open

### Step 3: Open IPv4 Properties
9. You'll see a list of items with checkboxes
10. **Scroll down** and find: **"Internet Protocol Version 4 (TCP/IPv4)"**
11. **Click once** on it to select it (it will be highlighted in blue)
12. Click the **"Properties"** button (below the list)
13. A new window "Internet Protocol Version 4 (TCP/IPv4) Properties" will open

### Step 4: Change DNS Settings
14. You'll see two sections:
    - "Obtain an IP address automatically" (should be selected)
    - "Obtain DNS server address automatically" (currently selected - we'll change this)

15. Click on the radio button: **"Use the following DNS server addresses"**
    - Two text boxes will become active:
      - Preferred DNS server: [ empty ]
      - Alternate DNS server: [ empty ]

16. **Click in the first box** ("Preferred DNS server")
17. Type: **8.8.8.8**

18. **Click in the second box** ("Alternate DNS server")
19. Type: **8.8.4.4**

### Step 5: Save Changes
20. Click **"OK"** button (bottom of window)
21. Click **"OK"** button again (on the Wi-Fi Properties window)
22. **Close** the Network Connections window

### Step 6: Restart Your Terminal
23. Close your PowerShell/Terminal completely
24. Open a new PowerShell/Terminal window
25. Navigate to your project:
    ```
    cd c:\recover\quizbackend
    ```

### Step 7: Test Connection
26. Run:
    ```
    npm run dev
    ```

---

## ✅ EXPECTED SUCCESS OUTPUT:

```
> nodemon server.js
[nodemon] starting `node server.js`
server started at 3000
mongoose at connected cluster0-shard-00-00.ufgxnwm.mongodb.net  ✅
```

NOT:
```
mongoDb connected at Error: querySrv ECONNREFUSED  ❌
[nodemon] app crashed
```

---

## 🔍 HOW TO VERIFY DNS CHANGED:

After changing DNS, open PowerShell and run:
```powershell
Get-DnsClientServerAddress -InterfaceAlias "Wi-Fi" -AddressFamily IPv4
```

Should show:
```
ServerAddresses
---------------
{8.8.8.8, 8.8.4.4}
```

NOT:
```
{192.168.1.1}
```

---

## 🎯 WHAT DNS DOES:

Think of DNS like a phone book:
- Your computer asks DNS: "What's the address of cluster0.ufgxnwm.mongodb.net?"
- **Router DNS (192.168.1.1):** "I don't know!" ❌ → ECONNREFUSED
- **Google DNS (8.8.8.8):** "Here's the address!" ✅ → Connection works

---

## ⚡ ALTERNATIVE: Use Mobile Hotspot (Skip DNS Change)

If you don't want to change DNS settings:
1. **Turn OFF WiFi** on laptop
2. **Turn ON Mobile Hotspot** on phone
3. **Connect laptop** to phone's hotspot
4. Run `npm run dev`
5. ✅ Works immediately!

Mobile hotspots already use good DNS servers like Google's.

---

## 🆘 IF YOU NEED HELP:

After changing DNS, run this command to verify:
```bash
node test-connection.js
```

You should see:
```
✅ SUCCESS! Mongoose connected to: cluster0-shard-00-00.ufgxnwm.mongodb.net
```

---

## 📱 CONTACT ME AFTER:

Once you've changed the DNS settings:
1. Close and reopen your terminal
2. Run: `npm run dev`
3. Tell me if you see "mongoose at connected" ✅ or still get error ❌

---

**START WITH STEP 1 NOW!** Press Windows + R and type `ncpa.cpl`
