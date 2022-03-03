# BURNDOWN

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, create a `.env.local` file. The contents should be:

```bash
NEXT_PUBLIC_SHORTCUT_API_TOKEN=XYZ
```

Replace XYZ with the actual token.

Then run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## About BURNDOWN

I decided to use this as an opportunity to build an app I actually do want to see for Jira. Our instance of Jira is slow, meaning each action taken requires waiting for the update to actually take affect before we can move on. Instead, I'd love the ability to quickly specify the changes I want and then publish them all at the end.

The goal of this app is to "burn" through the tickets, quickly decorating them with the changes you'd like to make. It currently supports modifying the estimates and archived state. Everything is controlled through keyboard shortcuts as indicated at the top of the page. Once you have burned through the entire list, you can click the "Blast Off" button to publish the changes all at once.

### Design Details

- You're only interacting with one ticket at any given moment, so that is highlighted at the top. The next few are listed below it with fewer details. You are able to click on any of them to view them in the app.
- I attempted to optimize everything for speed. Every possible action on this page can be accomplished with one hand in a single position on the keyboard. You can hold down any of the keys to speed through the estimate values, etc, as well.
- Hover over the main title for a surprise!

### Things I'd Fix Given More Time

- I'd add more animations. Cards should slide of the screen when dismissed instead of disappearing.
- I'd add a right-handed mode. The keys are currently set to A/S/D/F because I'm left-handed.
- The PUTs at the end seem to succeed, but I don't see the changes reflected when I refresh the page.
- Clicking Blast Off at the end gives little visual confirmation that it worked. I'd add a better message + fun animation to indicate this.
- I'd improve the visual cues around your actions - the changes to the text are pretty subtle when changing the archived state and estimates.
