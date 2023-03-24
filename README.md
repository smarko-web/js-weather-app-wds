## Table of contents
- [Overview](##Overview)
    - [Links](##links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
    - [key consepts](##key-consepts)
- [Continued development](##continued-development)
 
## Overview
# Weather App in JavaScript 

This self challenge was encouraged by this [YouTube video](https://www.youtube.com/watch?v=w0VEOghdMpQ) where I learned how to use an API from [open-meteo](https://open-meteo.com/)

## Links

- Live Site URL: [view site](https://smarko-web.github.io/js-weather-app-wds/)

## My process

### Built with

* JS

### What I learned

Use this section to recap over some of your major learnings while working through this project. Writing these out and providing code samples of areas you want to highlight is a great way to reinforce your own knowledge.

To see what I learned, take a look at the following code snippets:

``` html
   <template id="day-card-template">
      <div class="day-card">
        <img data-icon class="weather-icon">
        <div class="day-card-day" data-date></div>
        <div class="day-temps">
          <div class="day-high"> 
            <span data-high-temp></span>
            <span>&deg;</span>
          </div>
          <div class="day-low">
            <span data-low-temp></span>
            <span>&deg;</span>
          </div>
        </div>
      </div>
    </template>
    <template id="hour-row-template">
      <tr class="hour-row">
        <td>
          <div class="info-group">
            <div class="label" data-day></div>
            <div data-time></div>
          </div>
        </td>
        <td>
          <img data-icon class="weather-icon">
        </td>
        <td>
          <div class="info-group">
              <div class="label">Temp</div>
              <div>
                <span data-temp></span>
                <span>&deg;</span>
              </div>
            </div>
          </div>
        </td>
        <td>
          <div class="info-group">
              <div class="label">FL Temp</div>
              <div>
                <span data-fl-temp></span>
                <span>&deg;</span>
              </div>
            </div>
          </div>
        </td>
        <td>
          <div class="info-group">
            <div class="label">Wind</div>
            <div>
              <span data-wind></span>
              <span class="value-sub-info">mph</span>
            </div>
          </div>
        </td>
        <td>
          <div class="info-group">
            <div class="label">Precip</div>
            <div>
              <span data-precip></span>
              <span class="value-sub-info">in</span>
            </div>
          </div>
        </td>
      </tr>
    </template>
```

### key concepts
* HTML template
## Continued development

I would like to become more proficient in my HTML, JS and CSS skills before I start doing more advanced web development. As I am practicing these skills, applying the prior knowledge that I have grained from YouTube and other Self paced courses, increasing confidence in web design/development.