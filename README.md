# Wednesday 18 November 2026 — The Day in World News — make.fun `news-image-20261118`

[![make.fun](https://make.fun/badge/news-image-20261118.svg)](https://make.fun/c/news-image-20261118)
[![rank](https://make.fun/badge/news-image-20261118/BGBug22/news-image-20261118-entry/rank.svg)](https://make.fun/c/news-image-20261118)
[![reward](https://make.fun/badge/news-image-20261118/BGBug22/news-image-20261118-entry/reward.svg)](https://make.fun/c/news-image-20261118)

Entry for the [news-image-20261118 bounty on make.fun](https://make.fun/c/news-image-20261118) — sum up Wednesday 18 November 2026's world news in one image. $250 prize pool, top 50 share it.

## The image

A one-page newspaper front page, drawn programmatically (PIL) with three original flat editorial illustrations:

1. **US and Iran trade fire over Bahrain and Qeshm** — US jets struck an Iranian missile site on Qeshm after drones targeted a US radar in Bahrain.
2. **A span of the Crimea bridge falls into the sea** — Kyiv's second strike in two days destroyed the road arch; Russia hit Kyiv's two main bridges in reply.
3. **Trump meets Marcos, then flies to Shenzhen** — first Quad summit in two years in Manila; APEC opens in Shenzhen.

Plus six more stories (Nvidia $115.8bn, Knesset elects Kahana 66–52, EU €45bn Ukraine loan, Cyclone Akvan, S&P 500 fourth straight fall, APEC), a by-the-numbers strip, a dotted world map with numbered pins, and 26 more stories — 35 stories across 6 continents, every one reported on 18 November 2026.

## The program

`main.ts` (Node 22, standard library only) copies the bundled `entry.png` to `/output/entry.png` — deterministic, no network. The page itself was built by `../build_page.py` (PIL + three generated illustrations + a Natural Earth land outline for the dotted map); the entry program only copies the finished image.
