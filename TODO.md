# Poll App Development Tracker

## Todo List

- [ ] Next Up

  - [x] Create an admin page for poll creation
  - [x] Allow admins to publish a new poll (which sets it as active and deactivates the previous one)

- [x] 1. Firestore Integration
  - [x] Set up Firebase and Firestore in the project
  - [x] Create Firestore data models for polls and votes
- [x] 2. Public Voting Flow
  - [x] Fetch and display the active poll from Firestore on the homepage
  - [x] Allow public users to vote (one vote per user per poll, tracked by browser or IP)
  - [x] After voting, show poll results (with percentages and total votes)
- [x] 3. Admin Authentication
  - [x] Set up admin authentication (e.g., with LINE login or another provider)
  - [x] Restrict poll creation and publishing to authenticated admins only
- [ ] 4. Admin Poll Management
  - [ ] Optionally, allow admins to see a list/history of previous polls (not required for MVP)
- [ ] 5. UI/UX Enhancements
  - [ ] Add loading and error states for all data fetching
  - [ ] Add toast notifications for actions (e.g., vote submitted, poll created)
  - [ ] Ensure mobile responsiveness and accessibility

## Completed

- Project requirements and todo list defined
- Cleaned up unused files and components
