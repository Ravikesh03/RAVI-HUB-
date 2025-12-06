# Google Sheets API Setup Guide for Fiji Task Marketplace

## Your Google Sheet Structure

Your Google Sheet at [https://docs.google.com/spreadsheets/d/1iVD0Sy5snBbCVjKY0X7TXfSRIGjbLLMS5ca-jiTHe84/edit?gid=0#gid=0](https://docs.google.com/spreadsheets/d/1iVD0Sy5snBbCVjKY0X7TXfSRIGjbLLMS5ca-jiTHe84/edit?gid=0#gid=0) already has a good foundation:

### Current Structure (Sheet1):
- **A**: Task Title
- **B**: Category  
- **C**: Description
- **D**: Budget Range
- **E**: Location
- **F**: Posted By (Name)
- **G**: Status

### Required Additional Sheet (Bids):
You need to create a second sheet called "Bids" with these columns:
- **A**: Task ID
- **B**: Bidder Name
- **C**: Amount
- **D**: Message
- **E**: Estimated Time
- **F**: Status

## Step-by-Step Setup

### 1. Create the Bids Sheet
1. Open your Google Sheet
2. Click the "+" button at the bottom to add a new sheet
3. Rename it to "Bids"
4. Add these headers in row 1:
   ```
   Task ID | Bidder Name | Amount | Message | Estimated Time | Status
   ```

### 2. Enable Google Sheets API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

### 3. Create API Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy your API key
4. (Optional) Restrict the API key to Google Sheets API only

### 4. Share Your Google Sheet
1. In your Google Sheet, click "Share" (top right)
2. Click "Change to anyone with the link"
3. Set permission to "Editor"
4. Copy the sharing link

### 5. Update the Website
1. Open `js/google-sheets-api.js`
2. Find line 4: `this.apiKey = '';`
3. Replace the empty string with your API key:
   ```javascript
   this.apiKey = 'YOUR_API_KEY_HERE';
   ```

### 6. Test the Integration
1. Open `test-integration.html` in your browser
2. Click "Test Get Tasks" to verify reading works
3. Click "Test Add Task" to verify writing works
4. Check your Google Sheet to see the new data

## Sample Data Structure

### Tasks Sheet (Sheet1):
```
Task Title | Category | Description | Budget Range | Location | Posted By | Status
House Cleaning Needed in Suva | Cleaning | Looking for reliable house cleaner... | $80-120 | Suva | Ravikesh.G | Active
```

### Bids Sheet:
```
Task ID | Bidder Name | Amount | Message | Estimated Time | Status
1 | John Smith | $90 | I have 5 years experience in house cleaning... | 3 hours | Pending
1 | Mary Johnson | $85 | Available immediately, can start tomorrow... | 2.5 hours | Pending
```

## Troubleshooting

### Common Issues:

1. **"API key not valid" error**
   - Make sure you copied the entire API key
   - Check that the Google Sheets API is enabled

2. **"Access denied" error**
   - Ensure your Google Sheet is shared with "Anyone with the link can edit"
   - Check that the spreadsheet ID is correct

3. **"Sheet not found" error**
   - Verify the sheet names are exactly "Sheet1" and "Bids"
   - Check that the Bids sheet exists

4. **CORS errors in browser**
   - This is normal for local development
   - The website will fall back to local storage

### Testing Commands:
```javascript
// Test in browser console
const api = new GoogleSheetsAPI();
api.init().then(() => api.getTasks()).then(console.log);
```

## Security Notes

- Keep your API key private
- Consider restricting the API key to specific domains
- Monitor API usage in Google Cloud Console
- The website includes fallback to local storage for offline use

## Next Steps

1. Complete the API setup above
2. Test the integration using `test-integration.html`
3. Start using the website to post tasks and submit bids
4. Monitor your Google Sheet to see real-time updates

Your Google Sheet will automatically populate with sample data when you first use the website, and then you can start posting real tasks and receiving bids!
