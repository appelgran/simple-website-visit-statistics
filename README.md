# simple-website-visit-statistics
Simple and good website visits statistics. Self-hosted with various technologies.

## Pieces
* [x] Collecting javascript
  * Javascript responsible for collecting visits and sending them to a receiving backend
* [ ] API backend
  * Combination of one backend technology and one storage technology
  * Can receive from Collecting javascript
  * Can answer queries from Displaying frontend
  * [ ] PHP & TSV (tab separated values, flat-file)
    * [x] Can receive from Collecting javascript
    * [ ] Can answer queries from Displaying frontend
* [ ] Displaying frontend
  * Queries API backend and shows statistics
* [ ] Report maker/sender
  * Queries API backend and sends an email with a statistics report (weekly/monthly)

## API backend reference
* Visits per day
*	Most popular urls
*	Visits per week
*	Desktop/mobile ratio
