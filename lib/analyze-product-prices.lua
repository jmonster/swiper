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
if len == 0 then return 0 end

local sum = 0
for idx = 1, len do sum = sum + price_points[idx] end

local average_price = sum/len
local latest_price = price_points[len]

-- if yesterdays price is the same as today, then we can't possibly have deal even if less than average
if len >= 2 && price_points[len-1] == latest_price then return 0 end

local deal_score = latest_price/average_price

if deal_score <= threshold then
  -- Yayuhh!
  if deal_bucket_name then redis.call('sadd',deal_bucket_name,set_key) end
  return tostring(deal_score)
else
  -- Oooooh.
  return 0
end
