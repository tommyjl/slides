# Slides

This is a simple HTML-based presentation program. It can be started from the
command line and viewed in a browser.

## Installation

```
go install .
```

## Usage

```
slides presentation.html

slides -port 8001 presentation.html
```

The supplied HTML-file should contain only `<section>`-elements at the top
level. Each section is a slide. Each slide can an element with a
`presenter-note` class, which will be hidden in the slide, but visible in a
presenter-note section instead.

Example:

```
<section>
    <h2>The first slide</h2>
</section>
<section>
    <h2>The second slide</h2>
    <aside class="presenter-notes">
        <p>This slide has some notes for the presenter.
    </aside>
</section>
```

If the presentation is open in multiple tabs (in the same browser), the slides
will synchronously move between tabs.

## Keyboard shortcuts

- LeftArrow: Previous slide
- RightArrow: Next slide
- F: Fullscreen
