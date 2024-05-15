Currently cloudflare AI worker supports some basic models.
And there are some free credits you can play with.
For the released model you have 1000 [neurons](https://developers.cloudflare.com/workers-ai/platform/pricing/) per day and unlimited against beta model.
So this is the project which will deploy a worker to provide OpenAI compatible API.
Any PR will be welcomed.

# Quick Start

## Requirements

1. An cloudflare account.
2. If you have domain, it would be best.
   Once deployment and setup, you can call the api with your domain.
3. npm, nodejs installed

## Deployment

Just deploy this project with:

1.  npm install

2.  npx wrangler login

3.  npx wrangler deploy

4.  setup custom domain to your worker

## How to use

1.  Assume your ip is example.com and you set it up for your work after deployment.
2.  Then all the APIs now you can use including:
    A: Chat
    https://example.com/v1/api/chat/completions: chat and completions
    **Examples:**

        curl -X POST \
            -H "Content-Type: application /json" \
            -H "Authorization: basic HelloWorld" \
            -d  '{"model": "llama-3-8b-instruct", "prompt": "How are you?"}'
            https://example.com/v1/chat/completions


        curl -X POST \
            -H "Content-Type: application /json" \
            -H "Authorization: basic HelloWorld" \
            -d  '{"model": "llama-3-8b-instruct", "messages": [{"role", "user", "content": "How are you?"}]}'
            https://example.com/v1/chat/completions


        curl -X POST -H "Content-Type: application/json" -H "Authorization: basic HelloWorld"
            -d '{
                    "model": "llama-3-8b-instruct",
                    "messages": [
                                    {"role":"user","content": "How are you?"},
                                    {"role": "system", "content":"you are a friendly assistant"}
                                ]
                }'
            https://example.com/v1/chat/completions

    B: Speak to Text

    **Example:** https://example.com/v1/audio/transcriptions: speech to text with whisper

        curl -X POST -H "Content-Type: multipart/form-data" -H " Authorization: 12345" \
            https://example.com/v1/audio/transcriptions -F model="whisper" -F "file=@test.mp3"

    Or just omit the model. Currently whisper is the only available model.

    C: Translation:

    **Example:** https://example.com/v1/chat/translations: translation from one lang to another lang

         curl https://example.com/v1/chat/translation
             -H "Content-Type: application/json"
             -H "Authorization: Bearer 12345"
             -d '{
                  "model": "m2m100-1.2b",
                  "text": "A cute baby sea otter", "source_lang": "english", "target_lang": "French",
                 }'

    Currently this is the only model to support translation.

    D: Text to Image

    **Example:** https://example.com/v1/images/generations: generate images

            curl https://example.com/v1/images/generations
              -H "Content-Type: application/json"
              -H "Authorization: Bearer 12345"
              -d '{
                "model": "dreamshaper-8-lcm",
                "prompt": "A cute baby sea otter",
                "n": 1,
                "size": "1024x1024"
              }'

For all the supported models, refer to (cloudflare doc)[https://developers.cloudflare.com/workers-ai/models/]
Note:

1. All the release model have some free credits you can use. You will be charged when it is out.
2. All the beta model are free and unlimited.
3. If you do not have a username and want to use this locally,

   a. Just clone the code

   b. npm install

   c. npx wrangler login

   d. npx wrangler dev

   you will have your local http AI service. But it still consume your cloudflare credit.

## Authorization

You will need sort of auth to protect your API. ~~Currently, KVnamesapce is used for this.~~

Set it up from your worker setting/Variables, AUTH = "your auth key".

Voila!!

## Dev

1. change the code

2. `npx wranger dev` to launch the local env.

3. test your api with curl or other script language

## TODO

1. Currently KVnamespace is used and use will be charged when it is out of free credits
   A user friendly Auth method will be nice.
