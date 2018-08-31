import { screen, utils } from "wombat";
import template from "./video-t.html";
import languages from "./lang.json";
import "./video-t.less";

function showScreen(screen_obj, screen_element) {
	screen_element.querySelector(`#title`).textContent = screen_obj.title;
	screen_element.querySelector(`#message`).textContent = screen_obj.message;
	const continue_button = screen_element.querySelector(`#continue`);
	continue_button.disabled = true;
	continue_button.value = screen_obj.continue.pending;

	screen_element.addEventListener(`continue_ready`, () => {
		continue_button.value = screen_obj.continue.ready;
		continue_button.disabled = false;
	});

}

function asycSetTimeout(ms_delay) {
	return new Promise(res => setTimeout(res, ms_delay));
}

async function fadeBackgroundToColour(DOM, { colour = `#121212`, duration = 250 }) {
	DOM.setAttribute(`style`, `background-color: ${colour}; transition: background-color ${duration}ms linear`);
	await asycSetTimeout(duration);
}

export default async function (config, callback) {

	const lang = Object.assign({}, utils.buildLanguage(languages, config), config.language_options);
	const DOM = document.createElement(`div`);
	DOM.innerHTML = template;
	screen.enter(DOM, `fade`);

	const video_element = DOM.querySelector('#player');
	const screen_element = DOM.querySelector('#screen');
	showScreen(lang.screens.intro, screen_element);
	const sources = (() => {
		const sources = [];
		for (const [format, src] of Object.entries(config.src)) {
			sources.push((() => {
				const src_element = document.createElement(`source`);
				src_element.type = `video/${format}`;
				src_element.src = src;

				return src_element;
			})());
		}
		return sources;
	})();

	for (const source of sources) {
		video_element.appendChild(source);
	}

	if (config.preload === true) {
		await new Promise(res => {
			video_element.addEventListener(`canplaythrough`, () => {
				screen_element.dispatchEvent((() => {
					return new CustomEvent(`continue_ready`);
				})());
				res();
			});
		});
	} else {
		screen_element.dispatchEvent((() => {
			return new CustomEvent(`continue_ready`);
		})());
	}

	await new Promise(res => {
		screen_element.querySelector('#continue').onclick = async () => {
			screen_element.style.display = `none`;
			await fadeBackgroundToColour(DOM.querySelector('#main'), config.background.colour, config.background.duration);
			video_element.style.visibility = `visible`;
			res();
		};
	})

	for (let loop_count = 0; loop_count < config.repeats + 1; ++loop_count) {
		video_element.play();
		await new Promise(res => {
			video_element.addEventListener(`ended`, () => {
				res();
			});
		});
	}


	screen.exit(`fade`, () => {
		callback({}, []);
	});
}