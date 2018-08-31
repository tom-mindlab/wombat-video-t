# Video (1.0)

Video player component for wombat. 

Uses the HTML5 `<video>` tag (documentation [here](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video)). As such it supports many formats, including mp4, webm, ogv and more (depending on browser).

Backup formats are accepted and recommended.

## Input Configuration:

- `"background"`: Settings for the document background
  - `"colour"`: The colour (in any valid css format) the background will be
  - `"duration"`: The transition time for the background to fade to the specified `"colour"`
- `"repeats"`: The numbers of times the video will be played before the component exits
- `"prebuffer"`: Whether the browser will wait until it believes the video is playable without interruption before enabling the intro screen's continue button (implemented via the [`canplaythrough` event](https://developer.mozilla.org/en-US/docs/Web/Events/canplaythrough))
- `"src"`: The sources for the video player to pull from. You can specify as many fallbacks as you want: the player will attempt to use them in the order you list them in.
  - `"<format>"`: `"<path>"`: The format of a `src` object (i.e `"mp4": "https://i.imgur.com/RXDTqRD.mp4"`)
- `"language"`: The language to fallback to if configuration doesn't have specific overrides.
- `"language_options"`: The language overrides to apply

## Behavior:

- Display intro screen
- If `"prebuffer"` is `true`, keep the continue button disabled until the video is considered smoothly playable (no buffering). Otherwise, enable the continue button immediately.
- Clear the intro screen away, fade the background to the specified `"colour"` over the specified `"duration"`, begin video playback
- If `"repeats"` was greater than `0`, repeat up to the specified number
- Fade out, submit `META` and `DATA` objects *(both will be empty)*

## Output:

- `DATA`: An array object *(will be empty as we gather no information in this component)*
- `META`: An object representing user information to capture for future elements in the experiment *(will be empty like `DATA`)*