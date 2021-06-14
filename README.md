[about](https://codechips.me/about/ "About me")[twitter](https://twitter.com/codechips "@codechips")[github](https://github.com/codechips "Github")

Is Vite currently the best bundler for Svelte?
==============================================

I tested Vite bundler for Svelte development together with Typescript and PostCSS.

Aug 24, 2020 - 10 min

Testing different bundlers for Svelte development is an odd hobby of mine. I like my development environments smooth as butter and my feedback loops tight.

First up is [Vite](https://github.com/vitejs/vite). A young bundler from the creator of the popular [Vue.js](https://vuejs.org/) framework, Evan You. I've heard many good things about Vite and decided to try it out.

The Purpose
-----------

I am on the quest to find the best bundler setup for Svelte development. My requirements are simple.

-   It must be fast
-   It must support Typescript
-   It must support PostCSS
-   It must produce small and efficient bundles
-   It must produce correct sourcemaps for debugging
-   It should support HMR (Hot Module Replacement)

Let's proceed with this list as our benchmark for a good Svelte bundler setup.

Test App
--------

For the purpose of testing I created a simple Svelte app. Its functionality is simple. You press a button and it fetches a random Kanye West tweet from [Kanye as a Service](https://kanye.rest/).

![Kanye Says app screenshot](https://res.cloudinary.com/codechips/image/upload/v1598252607/kanye-says-app_rup4n6.png)

The app might be simple, maybe even naïve, but it has a few interesting parts.

-   Svelte components in Typescript. I want to see if transpiling and type checking works correctly for TS.
-   External Svelte library. Not all bundlers support libraries written in Svelte efficiently.
-   External library dependency. I want to see if Vite supports tree shaking when bundling for production.
-   External Assets. It should be possible to import SVG, PNG, JSON and other external assets in our code.
-   PostCSS with TailwindCSS. A good bundler should make it easy to work with SASS and PostCSS.
-   Business components in Typescript. Typescript is here to stay. A good bundler should support it out-of-the-box.

With that checklist in place, let's proceed and see if Vite can handle all our requirements.

Although, I built the app specifically for testing different Svelte bundlers, I will walk you though how to set up Vite from scratch using a simpler Svelte app as an example.

Vite Overview
-------------

As I write this Vite haven't had an official release yet, but it's nearing one. Currently it's on `1.0.0⁠-⁠rc.4`. There are probably still a few wrinkles to iron out.

Vite is not a traditional bundler, like Webpack or Rollup, but an ESM bundler.

What does it mean? It means that it serves all your files and dependencies via native ES modules imports that most modern browsers support. This means superfast reloads during development as only file that was changes needs to be recomplied.

It comes with "batteries included", meaning it has sensible defaults and supports many features that you might need during development.

Vite, just like Snowpack, is using [ESBuild](https://github.com/evanw/esbuild) as its Typescript compiler.

If you want to know more details about please read the [How and Why](https://github.com/vitejs/vite#how-and-why) section in Vite's README.

### What's the difference between Vite and Rollup?

This can be a little confusing to many. Why should you use an ESM bundler instead of a traditional one line Webpack or Rollup?

Vite Installation
-----------------

There is an option to create Vite backed apps with [create-vite-app](https://github.com/vitejs/create-vite-app) command, but as of now there is no Svelte template, so we will setup everything manually for now. I will try to find some time to create a Svelte template based on my findings.

For my examples I will use [pnpm](https://pnpm.js.org/), a fast and disk space efficient package manager, but all the commands apply to `npm` as well.

Let's get cranking!

### Creating the project

First, we need to initialize our project and add Vite. Here are the steps.
```
$ mkdir vite-svelte-typescript\
$ cd vite-svelte-typescript\
$ pnpm init -y\
$ pnpm add -D vite
```
### Creating required files

Now we need to add an `index.html` file and a `src` directory where we will be keeping our app's source files.

Create a `src` directory and add an index file in the root directory with the following contents.
```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <title>Vite App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/index.js"></script>
  </body>
</html>
```
This file will be used by Vite as entry or template to our app. You can add anything you want there. Just make sure to point the entry JS/TS file to your app's main file.

Vite Configuration
------------------

You configure Vite by creating a `vite.config.js` in the root directory. It's in there that you can change Vite's dev server port and set many other options.

The configuration documentation is lacking behind at the moment. The best place to see what options are available is to look at Vite's [config source](https://github.com/vitejs/vite/blob/master/src/node/config.ts).

We don't have anything to configure yet, so we will postpone this task for now.

Vite and Svelte with vite-plugin-svelte
---------------------------------------

We are building a Svelte app, so we need to tell Vite how to deal with Svelte files. Luckily, there is a great Vite Svelte plugin we can use - [vite-plugin-svelte](https://github.com/intrnl/vite-plugin-svelte). Install the plugin and also the Svelte framework.

`$ pnpm add -D vite-plugin-svelte svelte`

The time has come to write some Vite configuration. We will just follow recommendation from the plugin's README file. Edit your `vite.config.js` and add the following.

```
//vite.config.js

import svelte from 'vite-plugin-svelte';

export default {
  plugins: [svelte()],
  rollupDedupe: ['svelte']
};
```
Let's test drive it by creating the simplest Svelte app possible.

First, create an `App.svelte` file in the `src` directory with the following contents.

copy`<!-- App.svelte -->

<h1>Hello Svelte!</h1>`

Now, create the main app entry file `index.js`, also in the `src` directory, with the following contents.

```
// main.js

import App from './App.svelte';
// import './index.css';

const app = new App({
  target: document.getElementById('app')
});

export default app;
```
Start the app by running `pnpx vite` and open the browser on `localhost:3000`.

Bam! Now Vite knows what Svelte is. While we are on it, let's tackle the Typescript and Svelte part next.

Vite and Typescript Support
---------------------------

Vite has Typescript support out of the box for normal Typescript files. As many other modern ESM bundlers it uses [esbuild](https://github.com/evanw/esbuild) which is written in Golang and is very fast. It's fast because it performs only transpilation of .ts files and does NOT perform type checking. If you need it, you must to run `tsc -⁠-⁠noEmit` in the build script. More on that later.

If you ask me, a better choice would have been [SWC](https://swc-project.github.io/) compiler. It's written in Rust, is just as fast and handles things a little better than ESBuild.

Let's add a simple timer written in Typescript and use it in our file.

```
// timer.ts

import { readable } from 'svelte/store';

export const enum Intervals {
  OneSec = 1,
  FiveSec = 5,
  TenSec = 10
}

export const init = (intervals: Intervals = Intervals.OneSec) => {
  return readable(0, set => {
    let current = 0;

    const timerId = setInterval(() => {
      current++;
      set(current);
    }, intervals * 1000);

    return () => clearTimeout(timerId);
  });
};
```

We are using enums, a Typescript feature, in order to not get any false positives.

Let's add it to our `App.svelte` file.

```
<!-- App.svelte -->

<script>
  import { init } from './timer';

  const counter = init();
</script>

<h1>Hello Svelte {$counter}!</h1>
```
Yep. Seems to work. Vite transpiles Typescript files to Javascript using ESBuild. It just works!

Svelte and Typescript Support
-----------------------------

When it comes to various template and languages support in Svelte files, [svelte-preprocess](https://github.com/sveltejs/svelte-preprocess) is king. Without this plugin, Typescript support in Svelte would not be possible.

Simply explained, svelte-preprocess works by injecting itself as a first-in-line preprocessor in the Svelte compilation chain. It parses your Svelte files and depending on the type delegates the parsing to a sub-processor, like Typescript, PostCSS, Less or Pug. The results are then passed on to the Svelte compiler.

Let's install it and add it to out setup.

copy`$ pnpm add -D svelte-preprocess typescript`

We need to change out `vite.config.js` and add the `svelte⁠-⁠preprocess` library.

```
// vite.config.js

import svelte from 'vite-plugin-svelte';\
import preprocess from 'svelte-preprocess';

export default {
  plugins: [svelte({ preprocess: preprocess() })],
  rollupdedupe: ['svelte']
};
```
And change our `App.svelte` to use Typescript.
```
<!-- App.svelte -->

<script lang="ts">
  import { init, Intervals }from './timer';

  const counter = init(Intervals.FiveSec);\</script>

<h1>Hello Svelte {$counter}!</h1>
```

We initialized our counter with 5s interval and everything works as advertised. `svelte⁠-⁠preprocess` for president!

Notice how little configuration we have written so far. If you ever worked with Rollup, you will definitely notice!

### svelte.config.js

If your editor shows syntax errors it's most likely you forgot to add `svelte.config.js`.

```
const preprocess = require('svelte-preprocess');

module.exports = { preprocess: preprocess() };

```

This configuration file is still a mystery to me, but I know that it's used by the Svelte Language Server which is used in VSCode Svelte extension and at least one other bundler - [Snowpack](https://snowpack.dev/).

Vite and PostCSS with TailwindCSS
---------------------------------

There are actually two parts of working with PostCSS in Vite and Svelte. Fist one is the Vite part. Vite has out-of-the-box support for PostCSS. You just need to install your PostCSS plugins and setup `postcss.config.js` file.

Let's do that. Let's add PostCSS and Tailwind CSS support.

```
$ pnpm add -D tailwindcss && pnpx tailwindcss init
```

Create a PostCSS config with the following contents.

```module.exports = {\
  plugins: [require("tailwindcss")]\
};
```
And add base Tailwind styles by creating an `index.css` in the `src` directory.

```
/* index.css */

@tailwind base;
body {
  @apply font-sans bg-indigo-200;
}

@tailwind components;
@tailwind utilities;
```
Last thing we need to do is to import `index.css` in our main `index.js` file.

```
// index.js

import App from './App.svelte';\
import './index.css';

const app = new App({\
  target: document.getElementById('app')\
});

export default app;
```
If you did everything right the page background should have a light indigo background.

PostCSS in Svelte files
-----------------------

When it comes to Svelte and PostCSS, as usual, `svelte⁠-⁠preprocess` is your friend here. As Vite, it has support for PostCSS.

However, we need to tweak the settings a bit as it doesn't work out of the box.

According to the svelte-preprocess documentation you can do it in two ways. Specify PostCSS plugins and pass them to the svelte-preprocess as arguments or install a `postcss-load⁠-⁠conf` plugin that will look for an existing `postcss.config.js` file.

This seems like the best option. I mean, we already have an existing PostCSS configuration. Why not (re)use it?

Let's install the postcss-load-conf library.

```
$ pnpm add -D postcss-load-conf
```

We also need to tweak our `vite.config.js` again.

```
import svelte from 'vite-plugin-svelte';
import preprocess from 'svelte-preprocess';

export default {\
  plugins: [svelte({ preprocess: preprocess({ postcss: true }) })],\
  rollupdedupe: ['svelte']\
};
```

Let's test it by adding some Tailwind directives to the style tag in `App.svelte`.

```
<!-- App.svelte -->

<script lang="ts">\
  import { init, Intervals } from './timer';\
  import logo from './assets/logo.svg';

  const counter = init(Intervals.FiveSec);\</script>

<style lang="postcss">\
  h1 {\
    @apply text-5xl font-semibold;\
  }\
</style>

<h1>Hello Svelte {$counter}!</h1>
```
Yep. Works fine. Notice that I added `lang="postcss"` to the style tag in order to make the editor happy.

Vite and SVG, or external assets support
----------------------------------------

Vite has built-in support for importing JSON and CSS files, but what about other assets like images and SVGs? It's possible too.

If you import an image or an SVG into your code it will be copied to the destination directory when bundling for production. Also, image assets smaller than 4kb will be base64 inlined.

Let's add an SVG logo to our `App.svelte`.

```
<!-- App.svelte -->

<script lang="ts">
  import { init, Intervals } from './timer';
  import logo from './assets/logo.svg';

  const counter = init(Intervals.FiveSec);</script>

<style lang="postcss">
  h1 {
    @apply text-5xl font-semibold;
  }
</style>

<h1>Hello Svelte {$counter}!</h1>
<img class="w-64 h-64" src={logo} alt="Svelte Logo" />
```
However, in our case, since we are using Typescript in Svelte we will get a type error. That's because Typescript doesn't know what an SVG is. The code will still work, but it's annoying to see this kind of error in the editor.

We can fix this by adding a Typescript type declaration file for most common asset types. While we are on it we can create a Typescript config file. It's actually not needed by Vite, because it does not do any typechecking, only transpiling, but it's needed for the editor and also for our TS type checker that we will setup later.

First, install the common Svelte Typescript config.

```
$ pnpm add -D @tsconfig/svelte
```

Next, create a `tsconfig.json` in the root directory of the project.

```
{\
  "extends": "@tsconfig/svelte/tsconfig.json",\
  "include": ["src/**/*"],\
  "exclude": ["node_modules/*", "dist"]\
}
```

Last thing we need to do is to add a Typescript declaration file in the `src` directory. The name is not important, but it should have a `.d.ts` extention. More of a convention than a requirement.

I named mine `types.d.ts`.

```
// types.d.ts - "borrowed" from Snowpack

declare module '*.css';
declare module '*.svg' {
  const ref: string;
  export default ref;
}
declare module '*.bmp' {
  const ref: string;
  export default ref;
}
declare module '*.gif' {
  const ref: string;
  export default ref;
}
declare module '*.jpg' {
  const ref: string;
  export default ref;
}
declare module '*.jpeg' {
  const ref: string;
  export default ref;
}
declare module '*.png' {
  const ref: string;
  export default ref;
}
declare module '*.webp' {
  const ref: string;
  export default ref;
}
```

If you did everything correctly you should not see any errors in your editor.

Vite and Environment Variables
------------------------------

It pretty common to make use of the environment variables in your code. While developing locally you might want to use a development API instance for your, while in production you need to hit the real API.

Vite supports environment variables. They must however be prefixed with `VITE_`. Vite support many ways to import your environment variables through different `.env` file. You can read more about it [here](https://github.com/vitejs/vite#modes-and-environment-variables).

For the sake of demonstration, let's setup and require and use an environment variable in our code.

Create an `.env.local` file with the following contents.

```
VITE_KANYE_API=https://api.kanye.rest
```
We now need to import it in our app. The way you do it is through `import.meta.env` object.

```
<!-- App.svelte -->

<script lang="ts">
  // import meta.env types from vite
	import type {} from 'vite';
  import { init, Intervals } from './timer';
  import logo from './assets/logo.svg'

  const counter = init(Intervals.FiveSec);

  const KANYE_API = import.meta.env.VITE_KANYE_API;

  console.log(KANYE_API);</script>

<style lang="postcss">
  h1 {
    @apply text-5xl font-semibold;
  }
</style>

<h1>Hello Svelte {$counter}!</h1>
<img class="w-64 h-64" src={logo} alt="Svelte Logo" />
```
If you open you dev tools you should see it printed in console.

Setting up a Smooth Workflow
----------------------------

Getting everything to compile and start is one thing. Getting your development environment to run smoothly is another.

Let's spend a few minutes to set it up.

### Linting Typescript files

We already have everything we need to typecheck our Typescript files. This should be done outside Vite by running `tsc -⁠-⁠noEmit`.

### Checking your Svelte files with svelte-check

Svelte has this cool CLI app called [svelte-check](https://codechips.me/svelte-with-vitejs-typescript-tailwind/). It's very good at catching all types of errors and warnings in your Svelte files.

### Putting it all together

Last step is to put everything together. For that purpose we will use [npm-run-all](https://codechips.me/svelte-with-vitejs-typescript-tailwind/) package. It will help us run npm scripts in parallel.

First, let's install the missing tools. While we are on it we will install a few other helpful utilities too that we will use.

```
$ pnpm add -D npm-run-all svelte-check cross-env sirv-cli
```
Replace the `scripts` property in `package.json` with the following object.

```
{
  "dev": "vite",
  "compile": "cross-env NODE_ENV=production vite build",
  "check": "svelte-check --human && tsc --noEmit",
  "watch:svelte": "svelte-check --human --watch",
  "watch:ts": "tsc --noEmit --watch",
  "start": "run-p watch:* dev",
  "build": "run-s check compile",
  "serve": "sirv dist"
}
```
Now you can simply run `pnpm start` and it will start local development server and also continuously lint our Svelte and Typescript files.

When you are done just run `pnpm run build`. Your app will be linted before it's compiled.

If you want to compile and serve the app in production mode just issue `pnpm run build serve`.

Vite Production Bundling
------------------------

For production bundling Vite is using Rollup, which is known for creating very efficient bundles, so you are in save hands.

When it comes to code you don't have to configure anything special. It just works.

But we need to tell Tailwind to purge our unused styles. You do it in `tailwind.config.js` file.

```
// tailwind.config.js

module.exports = {
  purge: ['./src/**/*.svelte', 'index.html'],
  theme: {
    extend: {}
  },
  variants: {},
  plugins: []
};
```

Now both our app and styles will be mean and lean. Here are some stats from my test app.

```
[write] dist/_assets/index.03af5881.js 32.03kb, brotli: 9.50kb
[write] dist/_assets/style.89655988.css 6.37kb, brotli: 1.67kb
[write] dist/_assets/usa.29970740.svg 0.88kb
[write] dist/index.html 0.41kb, brotli: 0.17kb
Build completed in 5.17s.
```

When bundling for production Vite injects CSS and JS tags into `index.html` automatically. However, it leaves the script tag as `type="module`. Thread carefully if you need to support old browsers.

```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8"/>
    <link rel="icon" href="/favicon.ico"/>
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <title>Vite App</title>
    <link rel="stylesheet" href="/_assets/style.89655988.css">
</head>
  <body>
    <div id="app"></div>
    <script type="module" src="/_assets/index.03af5881.js"><script>
</body>
</html>
```
What about Svite?
-----------------

Right. [Svite](https://github.com/dominikg/svite) is a Svelte specific bundler that's built on top of Vite. You should definitely check it out. It's great!

Plugins and Libraries Mentioned
-------------------------------

-   <https://github.com/vitejs/vite>
-   <https://github.com/evanw/esbuild>
-   <https://github.com/sveltejs/svelte-preprocess>
-   <https://github.com/intrnl/vite-plugin-svelte>
-   <https://github.com/dominikg/svite>
-   <https://github.com/mysticatea/npm-run-all>
-   <https://github.com/kentcdodds/cross-env>
-   <https://www.npmjs.com/package/svelte-check>
-   <https://www.npmjs.com/package/sirv-cli>
-   <https://github.com/michael-ciniawsky/postcss-load-config>
-   <https://www.npmjs.com/package/@tsconfig/svelte>
-   <https://github.com/swc-project/swc>
-   <https://www.npmjs.com/package/tailwindcss>
-   <https://www.npmjs.com/package/typescript>
-   <https://www.npmjs.com/package/rollup>
-   [https://snowpack.dev](https://snowpack.dev/)

Results
-------

Let's re-visit our list of requirements.

-   It must be fast. Check. Vite's cold starts and reloads feel superfast.
-   It must support Typescript. Check. Was easy to setup.
-   It must support PostCSS. Check. Works out-of-the-box.
-   It must produce small and efficient bundles. Check. Rollup is used for bundling.
-   It must produce correct sourcemaps for debugging. So-so. Could be better.
-   It should support HMR (Hot Module Replacement). Check. Works great.

Conclusion
----------

My goal was to see how good Vite is for Svelte development and also to show you how to setup an efficient local development environment.

I must say that I am happy with results. That happy, that I even dare to ask whether not Vite is currently the best bundler for Svelte.

If you have made it so far, you should not only learned about Vite, but also about how to effectively setup your development environment. Many of the things we went through apply to many different bundlers, not only Vite.

Vite is built by the creator of Vue.js. Although, it's a framework agnostic bundler, you can tell that it's probably has a tighter connection to Vue. You can find Vue specific things sprinkled here and there.

What I like most about Vite is its speed and flexibility. It has sensible default configuration options that are easy to change. I was also surprised how little configuration I had to write!

Probably the best thing is that Vite uses Rollup for creating production bundles. I've learned to trust Rollup by now after testing many different module bundlers.

You can find the full app setup on Github. Watch this repo as I test more bundlers for Svelte development.

<https://github.com/codechips/svelte-typescript-setups>

Thanks for reading and happy coding!

* * * * *


[

PREV

Would you recommend Svelte and what router do you like?

](https://codechips.me/svelte-ssr-and-router-recommendation/)

[

NEXT

9 Neat ES Features That Save You Lots of Typing

](https://codechips.me/9-neat-es-features/)


CTO. Maker. Friend. Manager by day, hacker by night.
----------------------------------------------------

Writing about modern reactive web development, together with a healthy dose of career and productivity tips.

Trying to blog weekly. Subscribe below for updates.

Your Email

GET NOTIFIED

Zero spam. Unsubscribe anytime.

Ilia Mikhailov © 2021

[home](https://codechips.me/)[articles](https://codechips.me/articles/)[email](mailto:ilia@codechips.me)[rss](https://codechips.me/feed.xml)