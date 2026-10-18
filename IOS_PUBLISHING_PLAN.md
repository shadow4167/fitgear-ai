# How to Put FitGear AI on the App Store (from Windows)

## The big idea

Your app already works as a website. We put it inside a small iPhone app "shell" using a free tool called **Capacitor**. The shell opens your website inside the app.

Because the app shows your website, any change you make to the website shows up in the app right away. You only send a new version to Apple when you change the shell itself (like the icon).

You don't need a Mac. A service called **Codemagic** builds the iPhone app on its own Mac computers over the internet.

## What you need

| Thing | Cost | Notes |
|---|---|---|
| Apple Developer account | **$99 per year** | A parent has to sign up, because you must be 18 or older |
| Codemagic account | **Free** (about 500 build minutes a month) | Check codemagic.io, because prices can change |
| An iPhone to test on | $0 if you can use one | Yours or a family member's |
| Website hosting (Vercel) | **Free** | Your website has to be online for the app to load it |
| Capacitor | **Free** | |

**Total: about $99 per year.**

## Steps

1. ~~**Put the website online.**~~ Done: it's already on GitHub and Vercel.
2. **Get the Apple Developer account.** Your parent signs up at developer.apple.com and pays $99. Approval takes up to 2 days.
3. **Add Capacitor to the project.** This adds the iPhone shell files and tells the shell to open your website's address.
4. **Make the app look nice.** Add the app icon, the start-up screen, and the app name.
5. **Connect Codemagic.** Link your GitHub project, Codemagic, and the Apple account together.
6. **Build the app.** Codemagic builds it and sends it to Apple.
7. **Test it on an iPhone.** Install it with Apple's free **TestFlight** app. Try every screen: questions, results, chat, game, and shop.
8. **Make the App Store page.** Add the app name, description, screenshots, age rating, and a **privacy policy**. The privacy policy is required because the chat sends questions to an AI service.
9. **Send it to Apple for review.** This usually takes 1 to 3 days.
10. **Fix anything Apple asks about, then go live.**

## How long it takes

| Step | Time |
|---|---|
| Website online + Apple account | 1–2 days |
| Capacitor + icon + Codemagic setup | 2–3 days |
| Testing on iPhone | 1 day |
| App Store page + privacy policy | 1 day |
| Apple review | 1–3 days |
| Fixing anything Apple rejects | 1–3 days |

**Total: about 1 to 2 weeks.**

## Watch out for

- **Apple sometimes rejects apps that are "just a website."** To be safe, the app should feel like a real app: bottom menu, smooth screens, and maybe saving favorite gear. Your app already has a lot of this.
- **Product photos:** don't copy brand photos (Bauer, CCM, etc.) into the app without permission. Apple can reject the app for that.
- **Windows can't show a pretend iPhone screen,** so all testing happens on a real iPhone through TestFlight.

## Other ways (if you get one later)

- **Mac:** easiest and best for making the app look polished.
- **iPad:** the free Swift Playgrounds app can build simple apps, but it has fewer tools.
