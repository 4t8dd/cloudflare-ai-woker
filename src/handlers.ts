import getModel from './models';

interface handle {
	execute(): Promise<Response>;
	processRequest(): Promise<any>;
}

class HandleCompletionOrChat implements handle {
	private request: Request;
	private env: any;
	constructor(request: Request, env: any) {
		this.env = env;
		this.request = request;
	}

	async execute(): Promise<Response> {
		let opt: {[key:string]:string};

		try {
			opt = await this.processRequest();
		} catch (err) {
			throw(err)
		}
		let response;
		try {
			response = await this.env.AI.run(opt.model, {
				messages: opt.messages,
				stream: opt.stream,
			})
		} catch (err) {
			console.log(err.stack)
			throw (err);
		}

		if (opt.stream) {
			return new Response(response, {
				headers: { 'content-type': 'text/event-stream' },
			})
		}
		return Response.json(response);
	}

	async processRequest(): Promise<{ [key: string]: any }> {
		//logger.info(this.request.method)

		const jsonData: { [key: string]: any } = await this.request.json();
		if (!jsonData) {
			throw new Error('Missing data.');
		}

		let modelName: string = jsonData.model;
		let stream: boolean = jsonData.stream == 'true' || false;
		let messages = jsonData.messages;
		let type: string = jsonData.type;

		if (!Array.isArray(messages)) {
			throw ("messages should be array.")
		}

		if (messages[0]['role'] !== 'system') {
			messages.push({ role: 'system', content: 'you are friendly assistant.' });
		}
		
		let modelInfo;
		try {
			modelInfo = getModel(modelName, 'completions');
		} catch (err) {
			throw (err);
		}
		const options: { [key: string]: any } = {
			model: modelInfo['model'],
			stream: stream,
			type: type,
			messages: messages,
		};
		return options;
	}
}

class HandleText2Img implements handle {
	private request: Request;
	private env: any;
	constructor(req: Request, env: any) {
		this.env = env;
		this.request = req;
	}
	async execute(): Promise<Response> {
		let opt: { [key: string]: string };
		let res;
		try {
			opt  = await this.processRequest();		
		} catch (err) {
			throw (err);
		}

		try {
			res = await this.env.AI.run(opt.model, opt.inputs);
		} catch (err) {
			throw (err);
		}
		return new Response(res, { headers: { 'content-type': 'image/png' } });
	}

	async processRequest(): Promise<{ [key: string]: any }> {
		let jsonData: { [key: string]: any } = await this.request.json();

		let prompt= jsonData.prompt;
		if (!prompt) {
			throw ('no promot found.')
		}
	
		let inputs = { 'prompt': prompt };

		let modelName = jsonData.model;
		try {
			let modelInfo = getModel(modelName, 'text2img');
			return { model: modelInfo['model'], inputs: inputs};
		} catch (err) {
			throw (err);
		}
	}
}

class HandleASR implements handle {
	private request: Request;
	private env: any;
	
	constructor(req: Request, env: any) {
		this.request = req;
		this.env = env;
	}

	async execute(): Promise<Response> {

		let opt: { [key: string]: string };
		try { opt = await this.processRequest(); } catch (err) { throw (err); }

		const blob = opt.blob;
		const input = { audio: [...new Uint8Array(blob)], };
		const response = await this.env.AI.run(opt.model, input);

		return Response.json({ input: { audio: [] }, response });
	}

	async processRequest(): Promise<{ [key: string]: string }> {
		let arrayBuff;
		let model;
		let formData = await this.request.formData();
		let modelName:string = formData.get('model')|| 'whisper';

		try {

			let modelInfo = getModel(modelName, 'asr');
			arrayBuff = await formData.get('file')?.arrayBuffer();
			model = modelInfo['model']
		} catch (err) {
			throw(err)
		}
		
		return {
			'model': model,
			'blob': arrayBuff,
		}
	}
}


class HandleImage2Text implements handle {
	private request: Request;
	private env: any;
	constructor(req: Request, env: any) {
		this.env = env;
		this.request = req
	}
	execute(): Promise<Response> {
		throw new Error('Method not implemented.');
	}
	processRequest(): Promise<any> {
		throw new Error('Method not implemented.');
	}
}

class HandleTranslation implements handle {

	private request: Request;
    private env: any;

	constructor(req: Request, env: any) {
		this.request = req;
		this.env = env;
	}

	async execute(): Promise<Response> {
	
		let opt;
		let res;
		try {
			opt = await this.processRequest();
		} catch (err) {
			throw (err);
		}

		try {
			res = await this.env.AI.run(opt.model, {
				text: opt.text,
				source_lang: opt.source_lang,
				target_lang: opt.target_lang,
			})
		} catch (err) {
			throw (err);
		}
		return new Response(JSON.stringify(res));
	}


	async processRequest(): Promise<any> {

		let jsonData:{[key:string]:string} = await this.request.json();
		let modelName = jsonData.model || 'm2m100-1.2b';
		let source_lang = jsonData.source_lang || 'english';
		let target_lang = jsonData.target_lang;
		let text = jsonData.text;

		if (!source_lang || !target_lang || !text) {
			throw ('missing paramter!')
		}
		let modelInfo;
		try {
			modelInfo = getModel(modelName, 'translation');
		} catch (err) {
			throw (err);
		}

		return {
			'model': modelInfo['model'],
			'source_lang': source_lang,
			'target_lang': target_lang,
			'text': text,
		};

	}
}

export default async function handler(request: Request, env: any, opt: string): Promise<Response> {
	let process;
	let not_found = new Response('API Not allowed', {
		status: 405,
		headers: {'content-type': 'text/plain'},
	 });
	switch (opt) {
		case 'completions':
			process = new HandleCompletionOrChat(request, env);
			break;
		case 'translation':
			process = new HandleTranslation(request, env);
			break;
		case 'asr':
			process = new HandleASR(request, env);
			break;
		case 'text2img':
			process = new HandleText2Img(request, env);
			break;
		case 'img2text':
			process = new HandleImage2Text(request, env);
			break;
		default: ;
	}
	if (process) {
		return await process.execute();
	} else {
		return not_found;
	}
}
