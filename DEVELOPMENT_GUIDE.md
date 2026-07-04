# Notion Embed HTML Widgets - Developer & Integration Guide

This guide documents the design constraints, browser sandboxing pitfalls, and real-time syncing mechanisms for developing and deploying HTML widgets embedded in Notion.

---

## 🚫 1. Notion Sandboxed IFrame Constraints (Crucial Pitfalls)

When HTML widgets are embedded in Notion (either uploaded directly as file attachments or embedded via URLs), they are rendered inside sandboxed iframes. You must design with these constraints in mind:

### A. Dialog Modals Blocked (No `alert`, `confirm`, `prompt`)
* **Problem**: Browsers block native JavaScript modal dialogs inside sandboxed iframes for security (to prevent phishing). Calls to `confirm()` or `alert()` will throw a console warning and fail silently.
* **Solution**: Implement **custom inline HTML confirmations**. For instance, when clicking "Delete", toggle the button state to a red warning button saying "Confirm?" and execute on the second click.

### B. LocalStorage Storage Access (Null Origin Sandbox)
* **Problem**: When you upload an HTML file directly to Notion, it is served from Notion's attachment server (S3) with sandboxing enabled. In some browsers, this forces a `null` origin, which blocks access to `localStorage` (throws a SecurityError).
* **Solution**: 
  1. Always wrap `localStorage` reads and writes in `try-catch` blocks.
  2. Implement an **in-memory fallback array** so that if `localStorage` throws an error, the widget still works in-memory for the current session without crashing.
  3. Encourage users to deploy widgets via HTTPS (e.g., GitHub Pages) and embed the HTTPS URL. This scopes `localStorage` to the hosting domain rather than a sandboxed `null` origin.

### C. Responsiveness & Embed Sizing
* **Problem**: Notion embeds have a height set by the user dragging the block handle. Using `min-height: 100vh` or vertical flex centering on the `body` tag will crop the widget on mobile devices or smaller screens.
* **Solution**: Set `body { background-color: transparent; padding: 4px; display: block; }` and let the container flow naturally. Ensure headers wrap (`flex-wrap: wrap`) to support mobile narrow layouts.

---

## ☁️ 2. Real-Time Cloud Syncing via Google Sheets (GAS)

To enable true **cross-device, cross-user syncing** (so that different colleagues see the same status on their computers or phones), we use a Google Sheets spreadsheet as the database, bridged by a Google Apps Script (GAS) Web App.

### How it works:
1. The widget settings UI allows pasting a **Google Apps Script Web App URL**.
2. **GET Request (doGet)**: On page load, the widget fetches the spreadsheet's latest data and renders it.
3. **POST Request (doPost)**: Whenever an item is edited, added, deleted, or moved, the widget POSTs the updated data list to GAS, which overwrites the spreadsheet rows securely.

The GAS scripts are provided in the `gas/` directory of this project.
