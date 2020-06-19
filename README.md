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
* visitspermonth
  * parameters: month=YYYYMM
  * return value: int
* visitsperweek
  * parameters: week=YYYYWW
  * return value: int
* visitsperday
  * parameters: day=YYYYMMDD
  * return value: int
* mostvisited
  * parameters: day_start=YYYYMMDD, day_end=YYYYMMDD, limit=[0-9]+, filter=urlname/*
  * return value: JSON, array of objects, {[{"url":"...", "count":...}, ...]}
* mostreferrer
  * parameters: day_start=YYYYMMDD, day_end=YYYYMMDD, limit=[0-9]*
  * return value: JSON, array of objects, {[{"referrer":"...", "count":...}, ...]}
* devicetypes
  * parameters: day_start=YYYYMMDD, day_end=YYYYMMDD, tresholds=[0-9]+,[0-9]+,...
  * return value: JSON, object with key "percents" and "numbers" to arrays of objects
* mostreferrer
  * parameters: day_start=YYYYMMDD, day_end=YYYYMMDD, limit=[0-9]*
  * return value: JSON, array of objects, {[{"referrer":"...", "count":...}, ...]}
