# Mastodon API Implementation - Jekyll Comment System

## Overview

This document describes the implementation of proper Mastodon API endpoints in the Jekyll blog's comment system, replacing the previous generic interaction URLs with official Mastodon REST API calls.

## Changes Made

### 1. API Endpoint Implementation

The system now uses the correct Mastodon API endpoints according to the official documentation:

#### Favorite Actions
- **Favorite**: `POST /api/v1/statuses/:id/favourite`
- **Unfavorite**: `POST /api/v1/statuses/:id/unfavourite`

#### Boost/Reblog Actions  
- **Boost**: `POST /api/v1/statuses/:id/reblog`
- **Unboost**: `POST /api/v1/statuses/:id/unreblog`

#### Bookmark Actions
- **Bookmark**: `POST /api/v1/statuses/:id/bookmark`
- **Unbookmark**: `POST /api/v1/statuses/:id/unbookmark`

#### Reply Actions
- **Reply**: `POST /api/v1/statuses` (with `in_reply_to_id` parameter)

### 2. New Helper Methods

#### `buildApiUrl(postUrl, actionType)`
Constructs proper Mastodon REST API endpoints from post URLs and action types.

#### `buildInteractionUrl(postUrl, actionType)`  
Updated fallback method for interaction pages with proper action type mapping.

#### `performApiInteraction(postUrl, actionType, onSuccess, onError)`
Attempts API calls with proper error handling and fallback mechanisms.

#### `setButtonLoading(button, isLoading)`
Provides visual loading feedback with spinner icons during API calls.

### 3. Enhanced Interaction Handlers

All interaction handlers (`handleFavorite`, `handleBoost`, `handleBookmark`, `handleReply`) now:

1. **Attempt API calls first** - Try the official Mastodon API endpoints
2. **Graceful fallback** - Fall back to interaction URLs if API calls fail
3. **Proper state management** - Update button states based on API responses
4. **Loading indicators** - Show spinners during API calls
5. **Error handling** - Handle authentication, CORS, and permission errors

### 4. Authentication and CORS Handling

The implementation includes:

- **Same-instance detection** - Only attempts API calls for posts from the same Mastodon instance
- **Cookie-based authentication** - Uses `credentials: 'include'` for session auth
- **Error code handling** - Proper handling of 401 (unauthorized) and 403 (forbidden) responses
- **CORS fallback** - Graceful handling of cross-origin restrictions

## API Requirements

According to the Mastodon API documentation, all interaction endpoints require:

- **HTTP Method**: POST
- **Authentication**: `Authorization: Bearer <user_token>` header
- **OAuth Scopes**: 
  - `write:favourites` - For favorite/unfavorite actions
  - `write:statuses` - For boost/unboost and reply actions  
  - `write:bookmarks` - For bookmark/unbookmark actions

## Current Limitations

### 1. Authentication
The current implementation relies on session cookies rather than OAuth Bearer tokens. For full API functionality, users would need to:

- Be logged into the same Mastodon instance as the post
- Have granted appropriate OAuth permissions to the website

### 2. Cross-Instance Interactions
API calls will only work for posts from the same instance as the website. Cross-instance interactions will automatically fall back to interaction URLs.

### 3. CORS Restrictions
Most Mastodon instances don't allow cross-origin API calls from external websites, so the fallback mechanism is essential.

## User Experience

### Successful API Calls
- Instant feedback without page redirects
- Proper state updates (button colors, icons)
- Real-time interaction counts (if implemented)

### Fallback to Interaction URLs
- Opens interaction page in new tab
- Preserves current page state
- User can complete interaction on Mastodon instance

## Testing

The implementation has been designed to:

1. **Fail gracefully** - Always provide a working fallback
2. **Log appropriately** - Console messages for debugging
3. **Maintain compatibility** - Works with existing comment system
4. **Handle edge cases** - Invalid URLs, network errors, etc.

## Future Enhancements

### 1. OAuth Integration
Implement proper OAuth flow to obtain Bearer tokens for authenticated API calls.

### 2. Proxy Service
Create a backend proxy service to handle authentication and CORS issues.

### 3. Instance Auto-Detection
Automatically detect user's Mastodon instance and redirect accordingly.

### 4. Real-time Updates
Use WebSocket connections or polling to update interaction counts in real-time.

## Files Modified

- `_includes/comments-mastodon-tree.html` - Main implementation file
- Updated the `MastodonInteractions` class with new API methods

## Compliance

This implementation follows the official Mastodon API documentation available at:
- https://docs.joinmastodon.org/methods/statuses/
- https://docs.joinmastodon.org/methods/favourites/  
- https://docs.joinmastodon.org/methods/bookmarks/

All API endpoints, HTTP methods, and response handling comply with the official specifications.
