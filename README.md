
Currently cloudflare AI worker supports some basic models.
And there are some free credits you can play with.
For the released model you have 1000 [neurons](https://developers.cloudflare.com/workers-ai/platform/pricing/) per day and unlimited against beta model.
So this is the project which will deploy a worker to provide OpenAI compatible API.
Any PR will be welcomed. 

# Quick Start
## Requirements
  1. An cloudflare account.
  2. If you have domain, it would be best. Once deployment and setup, you can call the api with your
  domain.
  3. npm, nodejs installed
## Deployment
   Just deploy this project with:
   1. npm install
   2. npx wrangler login
   3. npx wrangler deploy
   4. setup custom domain to your worker
    
## Dev
   1. change the code
   2. `npx wranger dev` to launch the local env.
   3. test your api with curl or other script language

## TODO
   
