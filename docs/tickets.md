Okay, this is a well-defined set of requirements. Based on the PRD, brainstorm, and technical spike, here are the JIRA epics and their constituent tickets:

---

**Epic 1: Application Foundation & PWA Setup**

*   **Goal:** Establish the basic SvelteKit project structure, configure it as a Progressive Web App (PWA) with essential offline capabilities, and set up the local database schema.
*   **Tickets:**

    1.  **Ticket 1.1: Initialize SvelteKit Project & Basic PWA Manifest**
        *   **Background:** We need a foundational SvelteKit application to build upon. This includes the PWA manifest for installability. (PRD 4, 6.1, 6.2, 6.5, 6.8)
        *   **Acceptance Criteria:**
            *   A new SvelteKit project is created.
            *   A `manifest.json` file is created and linked in `app.html`.
            *   The manifest includes `short_name`, `name`, `icons` (192px, 512px placeholders are fine), `start_url`, `display: 'standalone'`, `background_color`, `theme_color`.
            *   The application can be built and served locally.
            *   Basic deployment to a static host (e.g., GitHub Pages, Netlify) is demonstrated.
        *   **Technical Suggestions:**
            *   Use `npm create svelte@latest my-app`.
            *   Follow SvelteKit PWA guidelines for manifest.
            *   Icon placeholders can be simple colored squares initially.

    2.  **Ticket 1.2: Implement Service Worker for Basic App Shell Caching**
        *   **Background:** Core PWA functionality requires a service worker to cache the application shell for offline access. (PRD 6.4)
        *   **Acceptance Criteria:**
            *   A `src/service-worker.js` (or `src/service-worker/index.js`) is implemented.
            *   The service worker caches the main application shell files (HTML, JS, CSS).
            *   After the first load, the application shell loads and is usable offline (even if no data is present yet).
            *   SvelteKit's `$service-worker` module is utilized for build files and versioning.
        *   **Technical Suggestions:**
            *   Use SvelteKit's built-in service worker support.
            *   Implement `install` and `activate` event listeners for caching and cache management.
            *   Implement a `fetch` event listener with a cache-first or network-first (falling back to cache) strategy for app shell assets.

    3.  **Ticket 1.3: Setup IndexedDB with Dexie.js & Define Entry Schema**
        *   **Background:** We need a client-side database to store user entries. Dexie.js will simplify IndexedDB interaction. (PRD 5.1.4, 6.3)
        *   **Acceptance Criteria:**
            *   Dexie.js is added as a project dependency.
            *   A Dexie database instance is initialized.
            *   An `Entries` table schema is defined in Dexie with fields: `id` (auto-incrementing or UUID), `date` (YYYY-MM-DD, unique index), `mood`, `activities` (array of strings/IDs), `notes` (text), `timestamp`.
            *   The database initializes successfully on app load.
        *   **Technical Suggestions:**
            *   `npm install dexie`.
            *   Create a `db.js` or similar module to manage the Dexie instance and schema definition.
            *   Define the schema using `db.version(1).stores({...})`. For `date`, ensure it's suitable for unique indexing.

---

**Epic 2: Daily Entry Logging**

*   **Goal:** Enable users to log their daily mood, activities, and optional notes, and save this data to the local IndexedDB.
*   **Tickets:**

    1.  **Ticket 2.1: Implement Mood Selection UI**
        *   **Background:** The user needs to select their mood for the day using a simple iconic interface. (PRD 5.1.1)
        *   **Acceptance Criteria:**
            *   A horizontal row of 5 distinct icons representing moods (e.g., "Awful" to "Great") is displayed on the entry logging page/view.
            *   User can tap one icon to select it.
            *   The selected mood icon is clearly visually indicated (e.g., larger, highlighted border, different color).
            *   Only one mood can be selected at a time; tapping another mood deselects the previous one.
            *   The selected mood value (e.g., 1-5 or string identifier) is stored in a Svelte store or component state.
        *   **Technical Suggestions:**
            *   Use SVG icons or a small icon font.
            *   Create a Svelte component for the mood selector.
            *   Use Svelte's reactive statements for visual feedback on selection.

    2.  **Ticket 2.2: Implement Activity Selection UI**
        *   **Background:** The user needs to select multiple activities they engaged in from a predefined list. (PRD 5.1.2)
        *   **Acceptance Criteria:**
            *   A predefined list/grid of 15-20 activity icons/labels is displayed.
            *   User can tap multiple activities to select/deselect them.
            *   Selected activities are clearly visually indicated (e.g., highlighted, checkmark).
            *   The initial list of activities is hardcoded (e.g., in a JS array/object) and easily modifiable in the codebase.
            *   Selected activity IDs/names are stored in a Svelte store or component state (e.g., an array).
        *   **Technical Suggestions:**
            *   Create a Svelte component for the activity selector.
            *   Store activities as an array of objects (e.g., `{ id: 'exercise', label: 'Exercise', icon: '...' }`).
            *   Manage selected activities in an array.

    3.  **Ticket 2.3: Implement Notes Input Field**
        *   **Background:** The user needs a way to add optional textual notes to their daily entry. (PRD 5.1.3)
        *   **Acceptance Criteria:**
            *   A multi-line text input field (textarea) is available on the entry logging page/view.
            *   The note text is stored in a Svelte store or component state.
            *   Entering notes is optional.
        *   **Technical Suggestions:**
            *   Use a standard HTML `<textarea>` element.
            *   Bind its value to a Svelte variable.

    4.  **Ticket 2.4: Implement Save Entry Logic**
        *   **Background:** The selected mood, activities, and notes need to be saved as a single entry for the current day into IndexedDB. (PRD 5.1.4)
        *   **Acceptance Criteria:**
            *   A "Save" button is present on the entry logging page/view.
            *   Upon clicking "Save":
                *   An entry object is created using the selected mood, activities, notes, the current calendar date (YYYY-MM-DD), and a full timestamp.
                *   The entry is saved to the IndexedDB `Entries` table using Dexie.js.
                *   If an entry for the current calendar day already exists, it is overwritten/updated.
                *   The user receives a simple visual confirmation (e.g., "Saved!" toast/message).
                *   The input fields are reset (or the user is navigated away, TBD in next epic).
        *   **Technical Suggestions:**
            *   Use Dexie.js `db.entries.put()` method for saving/updating, using the `date` (YYYY-MM-DD) as the key if it's the primary key, or a unique index if `id` is the primary key.
            *   Get current date using `new Date().toISOString().split('T')[0]` for YYYY-MM-DD format.

---

**Epic 3: Data Viewing & Navigation**

*   **Goal:** Allow users to view their logged entries for the current week and navigate to view entries from previous weeks.
*   **Tickets:**

    1.  **Ticket 3.1: Implement Current Week View Display**
        *   **Background:** Users need to see a summary of their moods and activities for the last 7 days. (PRD 5.2.1)
        *   **Acceptance Criteria:**
            *   A view displays entries for the current week (last 7 days from current date, or a fixed Mon-Sun view).
            *   Each day in the week visually represents the logged mood (e.g., using the selected mood icon).
            *   Logged activities for each day are visible or easily accessible (e.g., small icons, or list on tap).
            *   If no entry exists for a day, it is clearly indicated (e.g., blank, "No entry" text).
            *   Data is fetched from IndexedDB using Dexie.js.
        *   **Technical Suggestions:**
            *   Calculate the date range for the current week.
            *   Use Dexie.js `where('date').between(startDate, endDate).toArray()` to fetch entries.
            *   Create Svelte components to render each day's summary.

    2.  **Ticket 3.2: Implement Historical Week Navigation**
        *   **Background:** Users need to be able to navigate to view data from weeks prior to the current one. (PRD 5.2.2)
        *   **Acceptance Criteria:**
            *   "Previous Week" and "Next Week" (up to current week) navigation controls are present on the weekly view.
            *   Clicking "Previous Week" updates the view to show data for the preceding 7-day period.
            *   Clicking "Next Week" updates the view to show data for the subsequent 7-day period (disabled if viewing the current week).
            *   Navigation allows going back indefinitely as long as data exists.
        *   **Technical Suggestions:**
            *   Maintain the current week's start date in a Svelte store.
            *   Modify this date upon navigation and re-fetch data from Dexie.js.

    3.  **Ticket 3.3: Display Full Entry Details (Mood, Activities, Notes) on Tap**
        *   **Background:** While the weekly view provides a summary, users might want to see the full details of a specific day's entry, including notes. (Implicit from PRD 5.2.1 "easily accessible")
        *   **Acceptance Criteria:**
            *   Tapping on a specific day in the weekly view displays its full details: mood icon, list of activities, and the full note text.
            *   This could be a modal, an expansion, or navigation to a dedicated day-detail view.
        *   **Technical Suggestions:**
            *   A Svelte modal component or an inline expandable section.
            *   Pass the selected day's entry data to this component.

---

**Epic 4: Basic Security - PIN Access**

*   **Goal:** Implement a simple client-side PIN lock mechanism to deter casual unauthorized access to the application.
*   **Tickets:**

    1.  **Ticket 4.1: Implement PIN Entry UI**
        *   **Background:** A UI is needed for the user to enter their PIN. (PRD 5.3.1)
        *   **Acceptance Criteria:**
            *   On application launch (or when not authenticated), a PIN entry screen is displayed.
            *   The UI allows for input of a (e.g., 4-digit) PIN.
            *   Input can be via a simple number input field or custom-styled buttons.
        *   **Technical Suggestions:**
            *   Create a Svelte component for the PIN screen.
            *   Could use `<input type="password">` with pattern for digits or a series of individual input boxes.

    2.  **Ticket 4.2: Implement PIN Check Logic & Application Lock**
        *   **Background:** The entered PIN needs to be validated against a hardcoded PIN to grant or deny access. (PRD 5.3.1, 6.6)
        *   **Acceptance Criteria:**
            *   A PIN is hardcoded in the V1 client-side JavaScript codebase.
            *   When a PIN is submitted, it's compared against the hardcoded PIN.
            *   If correct, the PIN screen is hidden, and the main application interface is displayed/unlocked.
            *   If incorrect, an error message is shown, and the user can try again.
            *   The authenticated state is managed (e.g., in a Svelte store or session/local storage for the current session only).
        *   **Technical Suggestions:**
            *   Store the hardcoded PIN as a constant in a JavaScript module.
            *   Use a Svelte store (`writable`) to manage the `isAuthenticated` state.
            *   Conditionally render the PIN screen or the main app content based on this store.

    3.  **Ticket 4.3: Prompt for PIN on App Launch/Resume**
        *   **Background:** The PIN lock should engage whenever the app is newly launched or brought to the foreground after a period of inactivity (simple version for v1).
        *   **Acceptance Criteria:**
            *   The PIN prompt is shown when the application is first loaded.
            *   (Optional for v1 simplicity, but good to consider) If the app uses session storage for auth state, the PIN prompt will naturally re-appear on new tab/session.
            *   No complex "timeout" logic for v1, just on-launch protection.
        *   **Technical Suggestions:**
            *   Leverage Svelte's `onMount` lifecycle hook in the root layout/page to check authentication state.
            *   For simplicity in v1, not persisting auth state beyond the session (e.g. in localStorage) means it will always ask on fresh load. If auth state *is* persisted to make it smoother for user, then a "logout" or "timeout" would be a future feature. For now, assume it checks on any "fresh" app start.

---

**Epic 5: Data Management - Backup & Restore**

*   **Goal:** Provide users with the ability to export their data for backup and import previously exported data back into the application.
*   **Tickets:**

    1.  **Ticket 5.1: Implement Data Export Functionality**
        *   **Background:** Users need a way to back up their tracked data. (PRD 5.4.1)
        *   **Acceptance Criteria:**
            *   An "Export Data" button/option is available (e.g., in a settings area).
            *   Clicking the button retrieves all entries from IndexedDB.
            *   Data is formatted as a JSON string.
            *   The JSON data is offered to the user as a downloadable file (e.g., `tellme_backup.json`).
        *   **Technical Suggestions:**
            *   Use Dexie.js `db.entries.toArray()` to get all data.
            *   Use `JSON.stringify()` to convert the array of entry objects to a JSON string.
            *   Create a temporary `<a>` element with a `href` using a `blob:` URL and the `download` attribute to trigger the file download.

    2.  **Ticket 5.2: Implement Data Import Functionality**
        *   **Background:** Users need a way to restore their data from a previous backup. (PRD 5.4.2)
        *   **Acceptance Criteria:**
            *   An "Import Data" button/option is available.
            *   Clicking the button allows the user to select a JSON file from their device.
            *   The application parses the selected JSON file.
            *   Data from the file is imported into IndexedDB.
            *   Existing data with the same `date` (or primary key) is overwritten by imported data.
            *   User receives confirmation of successful import or an error message if parsing/import fails.
        *   **Technical Suggestions:**
            *   Use `<input type="file" accept=".json">`.
            *   Use `FileReader API` to read the file content.
            *   Use `JSON.parse()` to convert the JSON string back to an array of objects.
            *   Use Dexie.js `db.entries.bulkPut()` to import data, which will update existing or insert new. Consider clearing existing data first if a "full replace" is desired (`db.entries.clear()`). PRD implies overwrite on same timestamps, `bulkPut` handles this well if `date` is primary key or part of a unique index being used in the objects.

    3.  **Ticket 5.3: Create Basic Settings/Data Management UI Area**
        *   **Background:** The export and import functions need a dedicated place in the UI.
        *   **Acceptance Criteria:**
            *   A simple settings page or section is created.
            *   The "Export Data" and "Import Data" buttons are accessible from this area.
        *   **Technical Suggestions:**
            *   This could be a new route in SvelteKit or a modal dialog.
            *   Simple buttons and descriptive text.

---

This structure provides a good roadmap for development, starting with the foundation and progressively adding features. Each ticket is designed to be a manageable chunk of work.