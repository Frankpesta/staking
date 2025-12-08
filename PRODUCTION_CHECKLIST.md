# Production Deployment Checklist - Email Verification System

## ✅ Completed Changes

### 1. Email Verification Enforcement
- ✅ **Login now requires email verification**: Users cannot login until they verify their email address
- ✅ **Login error handling**: Login page shows helpful error message with link to resend verification email when email is not verified

### 2. Email Sending Implementation
- ✅ **Welcome email on signup**: Automatically sends verification email when user signs up
- ✅ **Resend verification**: New action `resendVerificationEmail` allows users to request a new verification email
- ✅ **Email templates**: Using Resend with React Email templates

### 3. Code Updates
- ✅ Updated `convex/actions/users.ts`:
  - Added email verification check in login function
  - Enabled email sending in `createUser` action
  - Created `resendVerificationEmail` action
- ✅ Updated `app/(auth)/login/page.tsx`:
  - Added error handling for unverified emails
  - Added link to resend verification page
- ✅ Updated `app/(auth)/resend-verification/page.tsx`:
  - Implemented actual resend functionality using the new action

## 🔧 Required Environment Variables for Production

### Critical Variables (Must be set):

1. **RESEND_API_KEY**
   - Already configured by you ✅
   - Used in: `convex/actions/email.ts`
   - Purpose: Sends verification emails via Resend

2. **NEXT_PUBLIC_APP_URL**
   - **MUST BE SET FOR PRODUCTION**
   - Example: `https://yourdomain.com`
   - Used in: `convex/actions/users.ts` (lines 91, 310)
   - Purpose: Generates correct verification links in emails
   - **Current default**: `http://localhost:3000` (development only)
   - **Action Required**: Set this to your production URL

### Other Required Variables:
- `NEXT_PUBLIC_CONVEX_URL` - Your Convex deployment URL
- `CONVEX_DEPLOYMENT` - Your Convex deployment name
- `JWT_SECRET` - Secret for JWT token generation
- `SESSION_SECRET` - Secret for session management

## 📋 Production Deployment Steps

1. **Set Environment Variables in Production**:
   ```bash
   # In your production environment (Vercel, Railway, etc.)
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   RESEND_API_KEY=your-resend-api-key
   NEXT_PUBLIC_CONVEX_URL=your-convex-url
   # ... other variables
   ```

2. **Set Convex Environment Variables**:
   ```bash
   # In Convex dashboard or via CLI
   npx convex env set RESEND_API_KEY your-resend-api-key
   npx convex env set NEXT_PUBLIC_APP_URL https://yourdomain.com
   ```

3. **Verify Email Domain in Resend**:
   - Ensure `noreply@truststaking.com` (or your domain) is verified in Resend
   - Update `FROM_EMAIL` in `convex/actions/email.ts` if using a different domain

4. **Test the Flow**:
   - Sign up a new user
   - Check email inbox for verification email
   - Click verification link
   - Try to login (should work after verification)
   - Try to login before verification (should be blocked)

## 🔍 Verification Flow

1. **User Signs Up**:
   - User account created with `emailVerified: false`
   - Verification token generated (24 hour expiration)
   - Welcome email sent with verification link

2. **User Clicks Verification Link**:
   - Link format: `https://yourdomain.com/verify-email?token=TOKEN`
   - Token validated and user's `emailVerified` set to `true`
   - User redirected to login page

3. **User Attempts Login**:
   - If `emailVerified === false`: Login blocked with error message
   - If `emailVerified === true`: Login succeeds

4. **Resend Verification**:
   - User can request new verification email from `/resend-verification`
   - New token generated and email sent
   - Old tokens remain valid until expiration

## ⚠️ Important Notes

1. **Email Sending Failures**: The system is designed to not fail user creation if email sending fails. Emails are sent asynchronously and errors are logged but don't block the flow.

2. **Token Expiration**: Verification tokens expire after 24 hours. Users can request a new token via the resend verification page.

3. **Security**: The resend verification action doesn't reveal whether an email exists or is already verified (security best practice).

4. **TypeScript Types**: The code uses type assertions for `internal.actions.email` because Convex generates types dynamically. This is safe and will work correctly at runtime.

## 🧪 Testing Checklist

Before deploying to production, test:

- [ ] Sign up with new email
- [ ] Receive verification email
- [ ] Click verification link
- [ ] Verify email is marked as verified
- [ ] Login with verified email (should succeed)
- [ ] Try to login before verification (should fail)
- [ ] Use resend verification page
- [ ] Receive new verification email
- [ ] Verify old token still works (if not expired)
- [ ] Check error messages are user-friendly

## 📝 Files Modified

- `convex/actions/users.ts` - Login check, email sending, resend action
- `convex/users.ts` - Removed commented email code from verifyEmail
- `app/(auth)/login/page.tsx` - Error handling for unverified emails
- `app/(auth)/resend-verification/page.tsx` - Implemented resend functionality
- `lib/utils/convex-api.ts` - Added resendVerificationEmail type

## 🚀 Ready for Production

All code changes are complete. Ensure `NEXT_PUBLIC_APP_URL` is set to your production domain before deploying!
