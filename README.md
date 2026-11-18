# Almari

**Know what important papers your family has, and exactly where each original is kept: on the phone or in the almirah.**

Live: https://navuxneeth.github.io/major/
Testing kit (for facilitators): https://navuxneeth.github.io/major/#/lab

Major Project, Group 4 · B.Des UX, MIT Institute of Design · Drishti Mishra, Anubhuti Raj, Padmashree Naik, Vikhyat Kaushik, Navaneeth Sankar K P · Mentor: Prof. Sohnit Kumar · Co-mentor: Vinay

## Why it exists
From 16 in-depth interviews (6 older adults, 10 caregivers) and a 131-response family survey:
- Paper is the family's real record; the phone only holds convenience copies.
- Finding is the real pain: failed searches turn into hour-long hunts and arguments at home.
- Where things are kept usually lives in one person's head, so taking over fails when that person is busy, away or unwell.
- Half the helpers live in another city and help blind, over phone calls.

## What it does
- **Where the original is:** every document records its place, shelf and file colour, drawn as the family's own almirah.
- **Find in one step:** search or speak (English and Hindi), with a full-screen "show at counter" view.
- **Ready for…:** hospital, train, bank and pension checklists that list each document and which file it is in.
- **Family circle:** each member sees everything, chosen folders, or only the emergency card; helpers can add documents; the owner sees who viewed what.
- **Ask for a document:** a son in another city asks, the parent sends it with one tap.
- **Share safely:** every copy sent out is stamped "For SBI KYC only · date", with Aadhaar masking and 24-hour links.
- **Reminders** for renewals go to the owner and the helper.
- **Passwords:** never stored. Almari remembers only where the password diary is and which number or email each account uses.
- **If I'm unwell** card and a printable almirah index.
- Opens with the phone's own lock. No new password.

All data is a fictional sample family, stored only in the browser. DigiLocker import is shown as a concept; a real connection needs DigiLocker partner approval.

## Testing links
Each link starts a participant on fresh sample data:
- Older adult, English: `https://navuxneeth.github.io/major/?fresh=1&as=keeper&lang=en`
- Older adult, Hindi: `https://navuxneeth.github.io/major/?fresh=1&as=keeper&lang=hi`
- Caregiver, English: `https://navuxneeth.github.io/major/?fresh=1&as=helper&lang=en`
- Caregiver, Hindi: `https://navuxneeth.github.io/major/?fresh=1&as=helper&lang=hi`

## Run locally
```
npm install
npm run dev
```
Built with React, TypeScript, Vite, Tailwind CSS and Motion. Deployed to GitHub Pages by `.github/workflows/pages.yml` on every push to `main`.
