# WDMD211_JSProject: Albumify -

All the information and media generated is taken just from Spotify's API (so far).

Features Include:
  - 30 second previews of each song on a given album
  - Close up view of Album Art
  - List of related albums and their Spotify Links
  - Artist Picture
  - Artist's top 10 tracks

Possible Planned Features:
  - Search function which will dynamically add Albums given a user's search
  - Possible Spotify Log-on feature, to get access to full songs and users' playlists
  - Display related artists
  - Artist Bio
  - Custom Colors/Styles

# What

Albumify is a full page JavaScript/jQuery App made for those interested in learning more about their favorite artists and albums in one, single location. Hear previews of an Artist's album, the artist's top tracks, view artists' pictures, album art, get links to the artist's other albums, get other related artists - All in one page in your browser!

# Where

Albumify runs in your browser, and is compatible with the latest versions of Chrome, FireFox, Safari, and Internet Explorer. (IE9 and previous versions are not supported).

# How

Implementing Albumify is simple. Load Albumify's script into your html (along with jQuery), and simply take an empty div and apply the method call albumify(). (Parameters are planned to be added, for changing the theme).

```js
  <body onload="$('#myDiv').albumify();">
    <div id="myDiv"></div>
  </body>
```

Albumify utilizes jQuery and it's many features. Albumify itself is within the 'fn' object of jQuery, and is easily applied to almost any html.

~ Tyler Schafman 2015
  WDMD211 @ UWSP
