#!/bin/zsh

for recipe in recipes/*.js(:t:r); do
 app=yayuhh-swiper-$recipe
 truncated_app=${app:0:30}
 git remote add $truncated_app git@heroku.swiper:$truncated_app.git

 # recipe env variable config
 heroku config:set RECIPE=$recipe -a $truncated_app

 git push $truncated_app master:master
 git remote remove $truncated_app
done
