/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import handler from './handlers';
export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
	//
	// Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
	// MY_QUEUE: Queue;
	AI: any;
}
export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		if (request.method !== "POST") {
			return new Response(null, {
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Method': 'POST',
					'Access-Control-Allow-Headers': '*',
				}
			})
		}
		
		let url = new URL(request.url);
		let url_path = url.pathname;
		if (url_path.endsWith("/v1/chat/completions")) {
			return await handler(request, env, 'completions');
		} else if (url_path.endsWith('/v1/audio/transcriptions'))
			return handler(request, env, 'asr');
		else if (url_path.endsWith('/v1/images/generations'))
			return handler(request, env, 'text2img');
		else if (url_path.endsWith('/v1/chat/translation'))
			return handler(request, env, 'translation');
		else {
			return new Response(url.pathname + "not supported", {
				status: 502,
				headers: { 'content-type': 'text/plain' }
			});
		}
	}
};

