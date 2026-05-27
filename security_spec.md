# Security Specification and Threat Model (TDD)

This document maps out the system data invariants, the "Dirty Dozen" rogue payloads, and our strategy for ensuring absolute security and structural integrity of user metadata, generations, and messages inside Cloud Firestore.

## 1. Data Invariants

- **Root Ownership Invariant**: A user profile matching `/users/{userId}` can only be read, created, or updated by the user matching `{userId}`.
- **Relational Integrity Invariant**: All subcollections (`/users/{userId}/generations/*`, `/users/{userId}/notifications/*`, and `/users/{userId}/messages/*`) are strictly bound to parent user context. It is mathematically impossible to write or read subcollection assets unless the caller is `userId`.
- **Credits/Tier Protection Invariant**: Regular users are strictly forbidden from modifying sensitive fields like `tier` or `credits` inside their `users` document directly.
- **Strict Date and Timestamp Invariant**: Document metadata timestamps cannot be falsified; they must strictly reference server time or be parsed correctly.

---

## 2. The "Dirty Dozen" Rogue Payloads

Here are 12 specific payloads attempting to break identity, integrity, or system state:

1. **Identity Spoofing - Profile Injection**: Attempting to create or update profile document `/users/user_alice` with `request.auth.uid = 'user_bob'`.
2. **Identity Spoofing - Generation Injection**: Writing a generation to `/users/user_alice/generations/g_123` while authenticated as `user_bob`.
3. **Privilege Escalation - Self Upgrade**: Attempting to update profile at `/users/user_alice` with `tier = 'Enterprise Cosmic'` to escape limits.
4. **Denial of Wallet - ID Exhaustion**: Creating a document with a 2MB junk ID (e.g. `projectId = 'AAAAAA...'`) hoping to blow up indexing databases.
5. **PII Data Leak**: Authenticated user trying to scrape and list another user's private messages or notification feed.
6. **State Shortcutting - Negative Credits**: Attempting to write a negative number of credits (e.g., `-9999`) to bypass billing validation.
7. **Temporal Fraud - Falsifying Join Date**: Trying to backdate `joinedDate` to some ancient date to gain legacy perks.
8. **Malicious Type Injection - Generative Spoof**: Writing a Generation document where `type` is an invalid format like `hazardous-code`.
9. **Asset Spoofing - Invalid Images**: Adding a generation with empty or malicious URL structure in the `output` field.
10. **Notification Hijacking - Ghost Notice**: Forging a read state update on messages or notifications belonging to a completely different operator.
11. **Rogue Chat Logs**: Injecting user thoughts as coming from role `assistant` to spoof chat history.
12. **Null Key Injection**: Sending fields not defined in the schema to store garbage data.

---

## 3. Core Security Rules Structure

Our Firestore Rules will strictly enforce standard schemas under `allow write` using the rules validation functions.
- Every read checks `request.auth.uid == userId`.
- Every list checks `request.auth.uid == userId`.
- Every create verifies elements size, id pattern, and type safety.
- Updates split into specific allowed operations preventing users from updating administrative metadata fields like `tier` or `credits` directly.
- All IDs are fully constrained using `isValidId()`.
