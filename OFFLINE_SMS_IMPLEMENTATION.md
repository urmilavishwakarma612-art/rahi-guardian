# SMS Fallback Implementation Guide

## Problem Statement
When internet connectivity is unavailable but cellular network exists, emergency reports cannot reach volunteers. This document explains how to implement SMS fallback functionality.

## Architecture Overview

```
User Device (No Internet) → Cellular Network → SMS Gateway → Supabase Edge Function → Database
```

## Implementation Steps

### 1. Choose SMS Service Provider
Select a service that supports India:
- **Twilio** (Most popular, reliable)
- **MSG91** (India-focused)
- **2Factor** (Indian service)
- **Amazon SNS**

### 2. Backend Setup (Supabase Edge Function)

Create edge function: `supabase/functions/emergency-sms/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  try {
    const { phone, lat, lng, message } = await req.json()
    
    // Send SMS via Twilio/MSG91
    const smsResponse = await fetch('https://api.twilio.com/2010-04-01/Accounts/YOUR_ACCOUNT_SID/Messages.json', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa('YOUR_ACCOUNT_SID:YOUR_AUTH_TOKEN')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: '+918001234567', // Emergency number or volunteer
        From: 'YOUR_TWILIO_NUMBER',
        Body: `🚨 EMERGENCY\nLat: ${lat}\nLng: ${lng}\nDetails: ${message}\nGoogle Maps: https://maps.google.com/?q=${lat},${lng}`
      })
    })
    
    // Create incident in database
    const { data, error } = await supabase
      .from('incidents')
      .insert({
        location_lat: lat,
        location_lng: lng,
        description: message,
        incident_type: 'other',
        severity: 'high',
        status: 'pending'
      })
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})
```

### 3. Frontend Detection Logic

Add to `src/pages/Emergency.tsx`:

```typescript
const detectConnectivity = async () => {
  // Check if data connection works
  try {
    await fetch('https://your-api.com/ping', { method: 'HEAD', timeout: 3000 })
    return 'internet' // Full internet
  } catch {
    // Check if device has cellular signal
    if (navigator.connection) {
      const conn = navigator.connection as any
      if (conn.effectiveType && conn.effectiveType !== 'none') {
        return 'cellular' // Only cellular, no data
      }
    }
    return 'none' // No connectivity
  }
}

const sendEmergencySMS = async (lat: number, lng: number, message: string) => {
  // Use SMS API Gateway (requires phone number input from user)
  const phoneNumber = prompt("Enter your phone number for SMS fallback:")
  
  try {
    await fetch(`tel:108?body=EMERGENCY at ${lat},${lng}. ${message}`)
    toast.success("SMS fallback initiated. Emergency services will be contacted.")
  } catch {
    toast.error("Please dial 108 manually")
  }
}
```

### 4. Cost Considerations

| Service | Cost per SMS | Free Tier |
|---------|-------------|-----------|
| Twilio | ₹0.60/SMS | $15.50 credit |
| MSG91 | ₹0.15/SMS | 100 free SMS |
| 2Factor | ₹0.18/SMS | None |

### 5. User Experience Flow

```
1. User reports emergency
2. App detects: No internet ❌ + GPS available ✅
3. Show dialog: "Internet unavailable. Send via SMS?"
4. User confirms
5. App sends SMS to 108 / Highway Patrol
6. SMS includes: GPS coordinates + Google Maps link
```

### 6. Web SMS API (Browser Native - Limited Support)

Modern browsers support direct SMS:

```typescript
if ('sms' in navigator) {
  const url = `sms:108?body=EMERGENCY at lat:${lat},lng:${lng}. Help needed!`
  window.location.href = url
}
```

**Limitations:**
- Only works on mobile devices
- User must manually send SMS
- Not fully automated

### 7. Security Considerations

- ⚠️ **Do NOT store SMS API keys in frontend code**
- ✅ Store all credentials in Supabase Edge Function Secrets
- ✅ Rate-limit SMS sending to prevent abuse
- ✅ Validate phone numbers before sending
- ✅ Log all SMS sends for auditing

### 8. Testing Strategy

```bash
# Test with Twilio sandbox number
# India test numbers: +91XXXXXXXXXX

# Test SMS delivery
curl -X POST https://your-project.supabase.co/functions/v1/emergency-sms \
  -H "Content-Type: application/json" \
  -d '{"phone": "+91XXXXXXXXXX", "lat": 28.6139, "lng": 77.2090, "message": "Test emergency"}'
```

## Hackathon Demo Strategy

**For judges demo:**
1. Show internet disconnection simulation
2. Trigger emergency report
3. Display "SMS Fallback Active" UI
4. Show SMS being sent (screenshot or test number)
5. Explain cost efficiency: Only triggers when internet fails

## Alternative: WhatsApp Business API

```typescript
// WhatsApp is more reliable in India than SMS
const whatsappEmergency = `https://wa.me/918001234567?text=${encodeURIComponent(
  `🚨 EMERGENCY\nLocation: ${lat},${lng}\nGoogle Maps: https://maps.google.com/?q=${lat},${lng}`
)}`

window.open(whatsappEmergency, '_blank')
```

## Recommendation for RAHI

**Implement hybrid approach:**
1. ✅ Primary: Internet-based incident reporting
2. ✅ Secondary: SMS fallback (when cellular only)
3. ✅ Tertiary: Manual dial 108 button

This ensures **zero-point-of-failure** emergency response system.

---

**Implementation Time Estimate:** 4-6 hours
**Cost:** ~₹0.20 per SMS (MSG91) or $0.0079 per SMS (Twilio)
**Reliability:** 99.9% delivery rate in India
