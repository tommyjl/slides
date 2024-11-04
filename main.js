const sender = new BroadcastChannel("nav");
const receiver = new BroadcastChannel("nav");

const mode = location.hash.substring(1);
let currentSection = 0;

function updateMode() {
	if (mode === "presentation") {
		document.body.style.setProperty("--presentation", "true");
	}
}


function enterFullscreen() {
	const main = document.querySelector("main");
	main.requestFullscreen();
}

function setActiveSection(pageNumber) {
	const sections = document.querySelectorAll("main > section");
	currentSection = Math.max(0, Math.min(sections.length - 1, pageNumber));

	for (let i = 0; i < sections.length; i++) {
		if (i === currentSection) {
			sections[i].classList.add("active");
			sections[i].classList.remove("inactive");
		} else {
			sections[i].classList.add("inactive");
			sections[i].classList.remove("active");
		}
	}
}

function useSlideNavigation() {
	receiver.addEventListener("message", event => {
		switch (event.data) {
		case "prev": setActiveSection(currentSection - 1); break;
		case "next": setActiveSection(currentSection + 1); break;
		}
	});
}

function useKeyboardHandler() {
	window.addEventListener("keydown", event => {
		if (event.altKey || event.shiftKey || event.ctrlKey) {
			return;
		}

		switch (event.key) {
		case "ArrowLeft": sender.postMessage("prev"); break;
		case "ArrowRight": sender.postMessage("next"); break;
		case "F":
		case "f": enterFullscreen(); break;
		}
	});
}

function useReloading() {
	if (mode === "presentation") {
		receiver.addEventListener("message", event => {
			if (event.data === "reload") {
				navigation.reload();
			}
		});
	} else {
		sender.postMessage("reload");
	}
}

function usePresenterNotes() {
	function f() {
		const presenterNotes = document.getElementById("presenter-notes");
		const aside = document.querySelector(`.active .presenter-notes`);
		presenterNotes.innerHTML = aside?.innerHTML ?? "";
	}

	f();

	receiver.addEventListener("message", event => {
		switch (event.data) {
		case "prev":
		case "next": f(); break;
		}
	});
}

setActiveSection(0);
useSlideNavigation();
useKeyboardHandler();
useReloading();
usePresenterNotes();

setActiveSection(0);
updateMode();
