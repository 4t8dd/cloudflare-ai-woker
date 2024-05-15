const models = {
	completions: {
		'llama-2-7b-chat-int8': '@cf/meta/llama-2-7b-chat-int8',
		'llama-2-7b-chat-fp16': '@cf/meta/llama-2-7b-chat-fp16',
		'mistral-7b-instruct-v0.1': '@cf/mistral/mistral-7b-instruct-v0.1',
		'deepseek-math-7b-instruct': '@cf/deepseek-ai/deepseek-math-7b-instruct',
		'sqlcoder-7b-2': '@cf/defog/sqlcoder-7b-2',
		'gemma-1b-it-lora': '@cf/google/gemma-1b-it-lora',
		'gemma-7b-it-lora': '@cf/google/gemma-7b-it-lora',
		'llama-2-7b-chat-hf-lora': '@cf/meta-llama/llama-2-7b-chat-hf-lora',
		'phi-2': '@cf/microsoft/phi-2',
		'mistral-7b-instruct-v0.2-lora': '@cf/mistral/mistral-7b-instruct-v0.2-lora',
		'openchat-3.5-0106': '@cf/openchat/openchat-3.5-0106',
		'qwen1.5-0.5b-chat': '@cf/qwen/qwen1.5-0.5b-chat',
		'qwen1.5-1.8b-chat': '@cf/qwen/qwen1.5-1.8b-chat',
		'qwen1.5-14b-chat-awq': '@cf/qwen/qwen1.5-14b-chat-awq',
		'qwen1.5-7b-chat-awq': '@cf/qwen/qwen1.5-7b-chat-awq',
		'discolm-german-7b-v1-awq': '@cf/thebloke/discolm-german-7b-v1-awq',
		'falcon-7b-instruct': '@cf/tiiuae/falcon-7b-instruct',
		'tinyllama-1.1b-chat-v1.0': '@cf/tinyllama/tinyllama-1.1b-chat-v1.0',
		'gemma-7b-it': '@hf/google/gemma-7b-it',
		'mistral-7b-instruct-v0.2': '@hf/mistral/mistral-7b-instruct-v0.2',
		'starling-lm-7b-beta': '@hf/nexusflow/starling-lm-7b-beta',
		'hermes-2-pro-mistral-7b': '@hf/nousresearch/hermes-2-pro-mistral-7b',
		'codellama-7b-instruct-awq': '@hf/thebloke/codellama-7b-instruct-awq',
		'deepseek-coder-6.7b-base': '@hf/thebloke/deepseek-coder-6.7b-base-awq',
		'deepseek-coder-6.7b-instruct-awq': '@hf/thebloke/deepseek-coder-6.7b-instruct-awq',
		'llama-2-13b-chat': '@hf/thebloke/llama-2-13b-chat-awq',
		'llamaguard-7b-awq': '@hf/thebloke/llamaguard-7b-awq',
		'mistral-7b-instruct-v0.1-awq': '@hf/thebloke/mistral-7b-instruct-v0.1-awq',
		'neural-chat-7b-v3-1-awq': '@hf/thebloke/neural-chat-7b-v3-1-awq',
		'openchat_3.5-awq': '@hf/thebloke/openchat_3.5-awq',
		'openhermes-2.5-mistral-7b': '@hf/thebloke/openhermes-2.5-mistral-7b-awq',
		'zephyr-7b-beta-awq': '@hf/thebloke/zephyr-7b-beta-awq',
		'llama-3-8b-instruct': '@cf/meta/llama-3-8b-instruct',
	},
	text2img: {
		'dreamshaper-8-lcm': '@cf/lykon/dreamshaper-8-lcm',
		'stable-diffusion-v1-5-img2img': '@cf/runwayml/stable-diffusion-v1-5-img2img',
		'stable-diffusion-v1-5-inpainting': '@cf/runwayml/stable-diffusion-v1-5-inpainting',
		'stable-diffusion-xl-base-1.0': '@cf/stabilityai/stable-diffusion-xl-base-1.0',
		'stable-diffusion-xl-lightning': '@cf/bytedance/stable-diffusion-xl-lightning',
	},
	translation: { 'm2m100-1.2b': '@cf/meta/m2m100-1.2b' },
	asr: { whisper: '@cf/openai/whisper', 'whisper-tiny-en': '@cf/openai/whisper-tiny-en' },
};

const ga_models = [
	'whisper',
	'resnet-50',
	'distilbert-sst-2-int8',
	'bge-base-en-v1.5',
	'bge-large-en-v1.5',
	'bge-small-en-v1.5',
	'llama-2-7b-chat-fp16',
	'llama-2-7b-chat-int8',
	'mistral-7b-instruct-v0.1',
	'm2m100-1.2b',
];

export default function getModel(name: string, type: string): { [key: string]: string } {
	let model: string = '';
	let models_ = JSON.parse(JSON.stringify(models));
	if (name in models_[type]) {
		let release: string = '';
		if (name in ga_models) {
			release = 'ga';
		} else {
			release = 'beta';
		}
		return { release: release, model: models_[type][name] };
	}

	throw 'model not found: ' + name;
}
