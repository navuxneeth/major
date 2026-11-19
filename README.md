# Almari

Almari keeps a copy of a family's important papers on the phone, and remembers where each original is kept at home: which almirah, which shelf, which file.

A Major Project on aging and digital inclusion at MIT Institute of Design, Pune, by Anubhuti Raj, Drishti Mishra, Navaneeth Sankar K P, Padmashree Naik and Vikhyat Kaushik, guided by Prof. Sohnit Kumar with Vinay.

The prototype opens with sample papers for one family, Sunita and her son Rahul, and everything stays on your own device.

**Try it:** https://navuxneeth.github.io/major/anubhuti/ (best on a phone)

## Why we made it

We surveyed 131 people and interviewed 6 older adults and 10 family helpers. Three things kept coming up:

- Paper is still the real record. The phone only holds scattered copies.
- Usually one person knows where everything is kept, so things fall apart when that person is busy, away or unwell.
- Half the helpers live in another city and help over phone calls, without seeing the screen.

## What it does

- Every paper shows where its original is, with a drawing of the family's own almirah.
- Search by typing or by voice, in English or Hindi.
- Show a paper full screen at a counter, or share a copy stamped for one purpose, with the Aadhaar number masked.
- A helper can ask for a paper. The parent sees one card and taps Send.
- Lists for a hospital visit, train journey, bank visit or pension, showing which file each paper is in.
- Reminders for renewals, an "If I'm unwell" page, and a printable list of what is where.
- Short "Show me how" guides that point to the right button.
- Each family member sees everything, chosen folders, or only the emergency page.
- Passwords are never stored. The app only notes where the password diary is.

"Lend my phone", where a helper could guide the parent remotely, is kept as an explored idea and is not part of the main app.

## For testing

The testing kit for moderators is at `/#/lab`. To start a participant on fresh sample data, add `?fresh=1&as=keeper` (Sunita) or `?fresh=1&as=helper` (Rahul) to the link, with `&lang=hi` for Hindi.

## Run it locally

```
npm install
npm run dev
```

Built with React, TypeScript, Vite, Tailwind CSS and Motion. The live site is served from the `gh-pages` branch: run `npm run build` and copy `dist/` there.
