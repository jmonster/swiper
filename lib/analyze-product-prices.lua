-- name
-- analyze-product-prices.lua
------------------------------------------------------------------
-- behavior
-- returns 0 if product is not a deal
-- returns 1 if product is a deal
-- redis.sadd(KEYS[5],product) if product is a deal
------------------------------------------------------------------
-- usage
-- EVAL "$(cat analyze-product-prices.lua)" 5 PRODUCT_ID START_TIME END_TIME THRESHOLD DEALS_BUCKET_NAME
-- EVAL "$(cat analyze-product-prices.lua)" 5 amazon_4815162342 1401749072712 1601749072712 0.5 todays_deals
------------------------------------------------------------------

function string:split( inSplitPattern, outResults )
  if not outResults then
    outResults = { }
  end
  local theStart = 1
  local theSplitStart, theSplitEnd = string.find( self, inSplitPattern, theStart )
  while theSplitStart do
    table.insert( outResults, string.sub( self, theStart, theSplitStart-1 ) )
    theStart = theSplitEnd + 1
    theSplitStart, theSplitEnd = string.find( self, inSplitPattern, theStart )
  end
  table.insert( outResults, string.sub( self, theStart ) )
  return outResults
end

-- parameters
local set_key = KEYS[1]
local start_range = KEYS[2]
local end_range = KEYS[3]
local threshold = tonumber(KEYS[4])
local deal_bucket_name = KEYS[5]
------------------------------------------------------------------

-- input validation
local type = redis.call("type", set_key)
if type.ok ~= 'zset' then return {err= "This operation requires a zset as it\'s first key"} end
------------------------------------------------------------------

-- implementation
local price_points = redis.call('zrangebyscore', set_key, start_range, end_range)
local len = #price_points
if len <= 1 then return { 0 } end

local sum = 0
for idx = 1, len do 
  local price = tonumber(price_points[idx]:split(':')[1])
  sum = sum + price
end

-- Only want to calculate the average without the latest price point
local latest_price = tonumber(price_points[len]:split(':')[1])
local average_price = (sum - latest_price) / (len - 1)

-- If yesterdays price is the same as today, then we can't possibly have deal even if less than average
if len >= 2 then
  if price_points[len - 1] == latest_price then return { 0 } end
end

local deal_score = 1 - (latest_price / average_price)

if deal_score >= threshold then
  -- Yayuhh!
  if deal_bucket_name then redis.call('sadd',deal_bucket_name,set_key) end
  local prev_price = tonumber(price_points[len - 1]:split(':')[1]);
  return { tostring(deal_score), tostring(average_price), tostring(latest_price), tostring(prev_price) }
else
  -- Oooooh.
  return { 0 }
end
