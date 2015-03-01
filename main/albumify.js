(function($)
{
	var lib = library;
	$.fn.albumify = function()
	{
		//Display Functions run after all ajax requests have finished
		$(document).ajaxStop(function()
		{
			albumStyle(albums);
			displayAlbumArt();
			displaySelectedAlbum();
			document.body.style.display = "block";//Lets the user see the screen
			removeLoading();
		});
		
		const ALBUM_BG_COLOR = "#333";
		const ALBUM_BG_GRADIENT_COLOR = "#333";
		const ALBUM_BG_GRADIENT_COLOR_2 = "#194775";
		const ALBUM_BORDER_COLOR = "#666";
		const BLUE = "#0099FF";
		
		var playingTrack;
		var libDiv = this[0];
		var libList;
		var images = [];
		var albums = [];
		var albumsLength = 0;
		var libLength = lib.albums.length;
		
		//***LOAD PAGE AND DATA***//
		//========================================================//
		
		showLoading();
		generateDivs();
		
		//Retrieve array of album objects made my generateDivs()
		albums = document.getElementsByClassName("album");
		libList = document.getElementById("tracksList");
		albumsLength = albums.length;
		selectedAlbum = albums[0];
		
		//Initiates the AJAX requests
		albumLoad(albums);
		
		//========================================================//
		//***END LOADING PAGE AND DATA***//
		
		//***FUNCTIONS***//
		//Show loading screen...
		function showLoading()
		{
			var loadingDiv = $("<div>").css({
				"color": "#eee",
				"background-color": "#202020",
				"width": window.innerWidth + "px",
				"height": window.innerHeight + "px",
				"position": "absolute",
				"z-index": "100",
				"top": "0"
			}).attr("id", "loadingScreen");
			
			var loadingWords = $("<h1>").css({
				"font-family": "Roboto",
				"font-size": "50px",
				"line-height": window.innerHeight + "px",
				"width": "300px",
				"margin": "0 auto"
			}).html("Loading . . .");
			
			$(loadingDiv).append(loadingWords);
			$("html").append(loadingDiv);
		}
		
		function removeLoading()
		{
			var loadingScreen = $("#loadingScreen");
			loadingScreen.fadeOut(500, function()
			{
				$(this).remove();
			});
		}
		
		// Appends div for every album in the json
		function generateDivs()
		{
			document.body.style.display = "none"; //Stops the user seeing unfinished UI; gets set back to normal once ajax calls and styling are done
			
			var libList = "<div id='tracksList'></div>";
			libDiv.innerHTML += libList;
			
			var albumList = "<div id='albumList'>"
			
			for(var i = 0; i < libLength; i++)
			{
				var div = "<div class='album'>";
				
				div += "<div class='vinyl'><div class='vinylHole'></div></div>"
				
				div += "<img class='albumArt' width='150' height='150' src='' />"
							
				div += "<h2>" + lib.albums[i].album + "</h2><h3>" + lib.albums[i].artist + "</h3>"
						
				div += "<div style='clear: both;'></div></div>";
				
				albumList += div;
			}
			
			albumList += "<div style='clear: both'></div></div>";
			libDiv.innerHTML += albumList;
			libDiv.innerHTML += "<div style='clear:both;'></div>";
		}// END GENERATE DIVS
		
		//Applies Styles to albums
		function albumStyle(albumsArray)
		{
			var albumList = document.getElementById("albumList");
			for(var i = 0; i < albumsLength; i++)
			{
				var albumH2 = albumsArray[i].getElementsByTagName("h2");
				var albumH3 = albumsArray[i].getElementsByTagName("h3");
				var albumImg = albumsArray[i].getElementsByTagName("img")[0];
				var albumVinyl = albumsArray[i].getElementsByClassName("vinyl")[0];
				var albumVinylHole = albumsArray[i].getElementsByClassName("vinylHole")[0];
				
				albumsArray[i].addEventListener('mouseenter', moveVinyl, false);
				albumsArray[i].addEventListener('mouseleave', endMoveVinyl, false);
				albumsArray[i].addEventListener('click', setSelectedAlbum, false);
				
				$(albumsArray[i]).css({"margin": "0",
								"position": "relative",
								"padding": "1em",
								"width": "100%",
								"border-bottom": "1px solid " + ALBUM_BORDER_COLOR,
								"float": "left",
								"clear": "left",
								"background-color": ALBUM_BG_COLOR,
								"cursor": "pointer"
							});
							
				$(albumImg).css({"float": "left",
								"border": "none",
								"outline": "none",
								"position": "relative",
								"border-radius": "2px"
								})
							
				$(albumH2).css({"margin": "0px 25px",
								"position": "relative",
								"padding": "0",
								"float": "left",
								"width": "50%",
								"color": "#f6f6f6",
								"font-size": "30px",
								"font-family": "Roboto",
								"font-weight": "100",
								"z-index": "1"
								});
								
				$(albumH3).css({"margin": "15px 25px",
								"position": "relative",
								"padding": "0",
								"float": "left",
								"width": "50%",
								"color": "#ddd",
								"font-family": "Roboto",
								"font-weight": "300",
								"z-index": "1"
								});
							
				$(albumVinyl).css({"position": "absolute",
									"left": "40px",
									"width": "150px",
									"height": "150px",
									"border-radius": "100%",
									"background-color": "#101010",
									"z-index": "0"
									})
								
				$(albumVinylHole).css({"position": "relative",
										"width": "55px",
										"height": "55px",
										"margin": "45px auto",
										"border-radius": "100%",
										"background-color": "#ddd",
										"z-index": "2"
										});
			}//End For Loop
			
			$(libDiv).css({"background-color": "#303030"});
			
			//Tracks List
			$(libList).css({"position": "relative",
							"height": "100vh",
							"width": "65%",
							"float": "right",
							"background-color": "#252525",
							"z-index": "0",
							"overflow-y": "scroll",
							"overflow-x": "hidden"
							});
			
			//List of Albums
			$(albumList).css({
				"width": "35%",
				"min-width": "420px",
				"height": "100vh",
				"overflow-y": "scroll",
				"overflow-x": "hidden"
				});
		}//End Album Styles
		
		//Adds album art to the album div's img Element
		function displayAlbumArt()
		{
			for(var i = 0; i < albumsLength; i++)
			{
				var albumImgElement = albums[i].getElementsByTagName("img")[0];
				albumImgElement.src = albums[i].image.src;
			}
		}
		
		//Set Attributes of selected Album
		function displaySelectedAlbum()
		{
			var vinyl = selectedAlbum.getElementsByClassName("vinyl")[0];
			selectedAlbum.removeEventListener('mouseenter', moveVinyl, false);
			selectedAlbum.removeEventListener('mouseleave', endMoveVinyl, false);
			$(selectedAlbum).css({
				//"background": 'linear-gradient(to right, ' + ALBUM_BG_GRADIENT_COLOR + ' 30%, ' + ALBUM_BG_GRADIENT_COLOR_2 + ')'
				"box-shadow": "inset -3.5em 0px 0 #0099FF"
			})
			
			$(selectedAlbum).children("h2").css({
				"color": "#00bbff"
			})
			
			$(selectedAlbum).children("h3").css({
				"color": "#00bbff"
			})
			
			$(vinyl).css({
				"left": "80px"
			});
			
			//Functions that display the selected album's information
			//Order will effect the look
			displayAlbumTracks(selectedAlbum);
			displayArtistInfo(selectedAlbum);
			generateAlbumArtButton(selectedAlbum);
		}
		
		//Display Tracks of selected album
		function displayAlbumTracks(album)
		{
			//Each newly selected album will clear the right side of the app
			libList.innerHTML = "";
			album.trackList.forEach(function(track, i)
			{
				libList.innerHTML += "<div class='track'><a>" + track.name + "</a>" + album.trackList[i].audio.outerHTML + "<span>" + msToMinutesAndSeconds(track.duration_ms) + "</span><div style='clear: both'></div></div>";
			});
		}
		
		//Display Album art button and set the click event for displaying selected album's art
		function generateAlbumArtButton(album)
		{
			//Button Object - Very long object.
			var btn = $("<button />").html("View Album Art").click(function() //Click Event Handler 
			{
				//Div Object that blackens the background
				var bgBlur = $("<div>").css({
					"position": "absolute",
					"background-color": "rgba(0, 0, 0, 0.6)",
					"width": window.innerWidth + "px",
					"height": window.innerHeight + "px",
					"z-index": "3",
					"left": "0px",
					"top": "0px"
				}).attr("id", "bgBlur").fadeIn(500);
				
				//"X" Button that closes the newly generated album window
				var exitButton = $("<button />").html("X").css({
					"position": "absolute",
					"top": "0",
					"right": "0",
					"background-color": "rgba(153, 0, 0, 0.2)",
					"border": "none",
					"text-align": "center",
					"width": "45px",
					"height": "25px",
					"color": "#eee"
				}).hover(function()
					{
						$(this).css({ "background-color": "#990000", "cursor": "pointer"}); //Hover Handler IN for "eXit"
					}, function()
					{
						$(this).css({"background-color": "rgba(153, 0, 0, 0.2)", "cursor": "default"}); //Hover Handler OUT "eXit"
				}).click(function()
					{
						//Removing the bgBlur object must be in the callback for fadeOut, or else object will be removed before Fading
						var bgBlur = document.getElementById("bgBlur");
						//The "parent" is the Div that will hold the album image in the new div
						$(this).parent().fadeOut(500, function()
						{
							$(this).remove();
						});
						
						$(bgBlur).fadeOut(500, function()
						{
							$(this).remove();
						});
				});
				
				//NOTE: all of this code is still within btn's click even handler
				//Left position for the image; places it in center screen
				var imageLeft = (window.innerWidth/2) - 320;
				var newImg = $("<img />").attr("src", album.image.largeArt);
				var newDiv = $("<div>").append(newImg).css({
					"position": "absolute",
					"left": imageLeft + "px",
					"top": "100px",
					"z-index": "4",
					"border-radius": "5px",
					"border": "5px solid #eee",
					"width": album.image.largeArtW + "px",
					"height": album.image.largeArtH + "px",
					"box-shadow": "3px 5px 20px -10px #000"
				}).append(exitButton).fadeIn(500);
				
				$(libDiv).append(bgBlur);
				$(libDiv).append(newDiv);
				
			}).hover(function()
			{
				$(this).css({ "background-color": "#0066CC", "cursor": "pointer" }); //Handler IN for btn
			}, function()
			{
				$(this).css({ "background-color": "#0099FF", "cursor": "default" }); //Handler OUT for btn
			}).css({
				"background-color": "#0099FF",
				"color": "#202020",
				"font-family": "Roboto",
				"border": "none",
				"margin": "16px",
				"padding": "1em",
				"border-radius": "5px",
				"clear": "both"
			});
			//Finally add the button to the right side.
			$(libList).append(btn);
		}// END GENERATE ALBUM ART Button
		
		function displayArtistInfo(album)
		{
			//Artist Block will contain all related artist information
			var artistBlock = $("<div>").attr("id", "artistBlock").css({
				"position": "relative",
				"float": "left",
				"border-bottom": "1px solid #666",
				"width": "100%"
			});
			
			var artistHeader = $("<h2>").attr("id", "artistHeader").html("Artist - " + album.artists[0].name).css({
				"margin": "0",
				"padding": ".6em",
				"font-family": "Roboto",
				"color": "#eee",
				"font-weight": "100",
				"display": "block"
			});
			
			var artistPic = $("<img />").attr({src: album.artistsPic[0][0].url, id: "artistPic"}).css({
				"float": "left",
				"margin": "0em 1em 1em",
				"width": "60%",
				"border": "4px solid #ccc",
				"border-radius": "5px"
			});
			
			//TOP TRACKS
			var artistTopTracks = $("<div>").attr("id", "topTracks").css({
				"float": "left",
				"width": "32%",
				"margin": "0 1em 1em 0"
			});
			
			var topTracksHeader = $("<h3>").attr("id", "topTracksHeader").html("Top Tracks from " + album.artists[0].name).css({
				"margin": "0",
				"font-family": "Roboto",
				"color": "#eee",
				"font-weight": "100",
				"border-bottom": "1px solid #666"
			});
			
			var topTracksOl = $("<ol>").attr("id", "topTracksList").css({
				"font-family": "Roboto",
				"color": "#eee",
				"margin": "1em 0 0 2em",
				"padding": "0"
			});
			//END TOP TRACKS
			
			//OTHER ALBUMS
			//Other albums div will contain artist's other albums, still in the artist block
			var otherAlbumsDiv = $("<div>").attr("id", "otherAlbums").css({
				"display": "block",
				"clear": "both",
				"margin": "0em 1em 1em"
			});
			
			var otherAlbumsHeader = $("<h2>").attr("id", "otherAlbumsHeader").html("Other Albums by " + album.artists[0].name).css({
				"margin": "0",
				"padding": "0 .6em .6em 0",
				"font-family": "Roboto",
				"color": "#eee",
				"font-weight": "100",
				"display": "block"
			});
			//END OTHER ALBUMS
			
			$(otherAlbumsDiv).append(otherAlbumsHeader);
			$(artistTopTracks).append(topTracksHeader).append(topTracksOl);
			
			//FOR loop that adds top tracks and related events
			for(var i = 0; i < 10; i++)
			{
				//Try/catch prevents crashing if artist does not have 10 top tracks
				try
				{	
					//Set an index property via data() that can be used in the anonymous function
					var topTrackLink = $("<a>").attr({href: "", id: "topTrack" + i}).html(album.topTracks[i].name).data("index", i).css({
						"color": "#eee",
						"text-decoration": "none"
					//CLICK EVENT THAT PLAYS TRACK's CORRESPONDING AUDIO
					}).click(function(e)
					{
						e.preventDefault();
						var index = $(this).data().index;
						var allLinks = document.getElementById("topTracksList").getElementsByTagName("a");
						var thisLink = $("#topTrack" + index);
						
						resetLinks(allLinks);
						
						//Playing track logic
						if(playingTrack === null || playingTrack === undefined)
						{
							playingTrack = album.topTracks[index].audio;
							playingTrack.relatedLink = thisLink;
							playingTrack.load();
							playingTrack.play();
							playingTrack.addEventListener('ended', endedTopTrack, false);
							setSelectedLink(thisLink, false);
						}
						else if(playingTrack === album.topTracks[index].audio)
						{
							if(!playingTrack.paused)
							{
								playingTrack.pause();
								setSelectedLink(thisLink, true);
							}
							else
							{
								if(playingTrack.readyState > 3)
								{
									playingTrack.play();
									playingTrack.addEventListener('ended', endedTopTrack, false);
									setSelectedLink(thisLink, false);
								}
								else
								{
									playingTrack.load();
									playingTrack.play();
									playingTrack.addEventListener('ended', endedTopTrack, false);
									setSelectedLink(thisLink, false);
								}
							}
						}
						else
						{
							if(!playingTrack.paused)
							{
								playingTrack.pause();
								setSelectedLink(thisLink, true);
							}
							playingTrack = album.topTracks[index].audio;
							playingTrack.relatedLink = thisLink;
							
							if(playingTrack.readyState > 3)
							{
								playingTrack.play();
								playingTrack.addEventListener('ended', endedTopTrack, false);
								setSelectedLink(thisLink, false);
							}
							else
							{
								playingTrack.load();
								playingTrack.play();
								playingTrack.addEventListener('ended', endedTopTrack, false);
								setSelectedLink(thisLink, false);
							}
						}//end playing track logic

					//HOVER EFFECTS
					}).hover(
						function() //HANDLER IN
						{
							$(this).css({
								"text-decoration": "underline"
							});
						},
						function() //HANDLER OUT
						{
							$(this).css({
								"text-decoration": "none"
							});
						}
					);
					
					var topTrackLi = $("<li>").append(topTrackLink).css({
						"margin": "0 0 1em 0"
					});
					
					$(topTracksOl).append(topTrackLi);
				}
				catch(e)
				{
					//console.log("Artist does not have 10 top tracks");
				}
			}
						
			//FOR loop that adds Other Albums
			var delay = 200;
			//Displays 10 albums. i < 5 would display only 5
			for(var i = 0; i < 9; i++)
			{
				//Try/catch prevents failure if the artist does not have enough albums to complete the for loop
				try
				{
					var linkWrapper = $("<a>").attr({href: album.otherAlbums[i].external_urls.spotify, target: "spotify"}).fadeIn(delay);
					var imgElement = $("<img />").attr("src", album.otherAlbums[i].images[2].url).css({
						"border-radius": "0px",
						"margin": "0 1em 0 0"
					//Using jQuery's data method to save the index of the foor loop
					}).data("index", i).hover(function(e) // Handler IN : displays album name
					{
						var mousex = e.clientX || e.pageX;
						var mousey = e.clientY || e.pageY;
						var hoverDiv = $("<div>").attr("id", "hoverDiv").css({
							"position": "absolute",
							"padding": ".5em",
							"height": "30px",
							"font-family": "Roboto",
							"line-height": "30px",
							"left": (mousex - 25) + "px",
							"top": (mousey - 50) + "px",
							"background-color": "#eee",
							"border-radius": "10px",
							"box-shadow": "0px 2px 10px -5px #000"
						//Apply jQuery's 'data' method yet again to retrieved saved index.
						//If you just use the 'i' value straight from the for loop, i will equal the latest value set in the loop (aka, 9). We do not want this.
						}).html(album.otherAlbums[$(this).data().index].name);
						$("body").append(hoverDiv);
					}, function(e) // Handler OUT : removes album name
					{
						$("#hoverDiv").remove();
					});
					
					$(linkWrapper).append(imgElement);
					$(otherAlbumsDiv).append(linkWrapper);
					
					delay += 200; //Add to delay
				}
				catch(e)
				{
					console.log("Not enough albums")
				}
			}
			
			$(artistBlock).append(artistHeader).append(artistPic).append(artistTopTracks).append(otherAlbumsDiv);
			$(libList).append(artistBlock);
		}// END DISPLAY ARTIST INFO
		
		//Load Artist Information
		function loadArtistInfo(album)
		{
			album.artistsPic = [];
			album.otherAlbums = [];
			album.topTracks = [];
			
			//Loads artists from album's id
			//Nested AJAX request... Gets the artists' ids from the album, and uses that ID to find the related artists' info
			$.ajax
			({
				dataType: 'json',
				url: 'https://api.spotify.com/v1/albums/' + album.id,
				cache: true
			}).done(function(data)
			{
				album.artists = data.artists;
				//Some albums have multiple artists;
				//If there are more than two, we will have to loop through them...
				//Otherwise just take [0] index
				if(album.artists.length < 2)
				{
					$.ajax
					({
						dataType: 'json',
						url: 'https://api.spotify.com/v1/artists/' + album.artists[0].id,
						cache: true
					}).done(function(data2)
					{
						album.artistsPic.push([data2.images[0], data2.name, data2.id]);
					});
				}
				else
				{
					album.artists.forEach(function(artist, i)
					{
						$.ajax
						({
							dataType: 'json',
							url: 'https://api.spotify.com/v1/artists/' + artist.id,
							cache: true
						}).done(function(data2)
						{
							album.artistsPic.push(data2.images[0], data2.name, data2.id);
						});
					});
				}
				
				//This ajax request recieves artist's other albums
				//Currently only takes albums from the first artist in a list
				$.ajax
				({
					dataType: 'json',
					url: 'https://api.spotify.com/v1/artists/' + album.artists[0].id + '/albums?album_type=album&limit=20',
					cache: true
				}).done(function(data)
				{
					data.items.forEach(function(otherAlbum)
					{
						//Is the retrieved album a repeat?
						if(isRepeatAlbum(album, otherAlbum))
						{
							//console.log("No item pushed")
						}
						else
						{
							album.otherAlbums.push(otherAlbum);
						}
					});
				});
				
				//This Ajax Request gets the artist's top tracks
				//Currently only retrieves first artist's tracks if there is more than one artist
				$.ajax
				({
					dataType: 'json',
					url: 'https://api.spotify.com/v1/artists/' + album.artists[0].id + '/top-tracks?country=US',
					cache: true
				}).done(function(data)
				{
					//Generate an audio object for each top track, and add that object as a property of the track
					data.tracks.forEach(function(track, i)
					{
						album.topTracks.push(track);
						var topTrack = new Audio();
						topTrack.src = track.preview_url;
						topTrack.preload = "none";
						album.topTracks[i].audio = topTrack;
					});
				});
			});
		}
		
		//Loads Albums Art and tracks
		function albumLoad(albumsArray)
		{
			for(var i = 0; i < albumsLength; i++)
			{
				getAlbumArt(albumsArray[i]);
			}
		}// END STYLING ALBUMS
		
		// Ajax call used to retrieve album art of passes album div
		function getAlbumArt(album)
		{
			if(album === null || album === undefined) { return false; }
			var curAlbum = album;
			var curAlbumName = $(album.getElementsByTagName("h2")[0]).text();
			var curAlbumArtist = $(album.getElementsByTagName("h3")[0]).text();
			var curAlbumImg = album.getElementsByTagName("img")[0];
			
			$.ajax
			({
				dataType: "json",
				url: "https://api.spotify.com/v1/search?q=album:'" + curAlbumName + "'%20artist:'" + curAlbumArtist + "'&limit=2&type=album",
				cache: true
			}).done(function(data)
			{
				var image = new Image(150, 150);
				image.src = (data.albums.items[0].images[1].url);
				image.largeArt = (data.albums.items[0].images[0].url);
				image.largeArtW = (data.albums.items[0].images[0].width);
				image.largeArtH = (data.albums.items[0].images[0].height);
				image.album = (curAlbumName);
				image.artist = (curAlbumArtist);
				images.push(image);
				album.id = data.albums.items[0].id;
				album.name = (curAlbumName);
				album.image = image;
				loadTracks(album);
				loadArtistInfo(album);
			});
		}
		
		//Loads the tracks of an album
		function loadTracks(album)
		{
			var albumTitle = album.getElementsByTagName("h2")[0].innerHTML;
			var artist = album.getElementsByTagName("h3")[0].innerHTML;
			album.trackList = [];

			$.ajax
			({
				dataType: "json",
				url: "https://api.spotify.com/v1/albums/" + album.id
			}).done(function(data)
			{
				album.trackList = data.tracks.items;
				
				album.trackList.forEach(function(track, i)
				{
					var albumTrack = new Audio();
					albumTrack.src = track.preview_url;
					albumTrack.controls = true;
					albumTrack.preload = "none";
					album.trackList[i].audio = albumTrack;
				});
			});
		}
		
		// EVENT LISTENERS
		//Animation for the Vinyl of an album
		function moveVinyl()
		{
			var vinyl = this.getElementsByClassName("vinyl")[0];
			$(vinyl).animate({
				left: "+=40"
			}, 100, "swing", function()
			{

			});
			
			$(this).hover(
			function()
			{
				$(this).css({
					"background-color": "#444"
				});
			},
			function()
			{
				$(this).css({
					"background-color": ALBUM_BG_COLOR
				})
			});
		};
		
		function endMoveVinyl()
		{
			var vinyl = this.getElementsByClassName("vinyl")[0];
			$(vinyl).animate({
				left: "-=40"
			}, 100, "swing", function()
			{
				
			});
		}
		
		//Reverts Top Track link to default color when track finishes
		function endedTopTrack()
		{
			this.relatedLink.css({
				"color": "#eee"
			});
			
			this.removeEventListener('ended', endedTopTrack, false);
		}
		
		//Sets the clicked album's styles and animation,
		//And also calls all display functions to retrieve and display AJAX data
		function setSelectedAlbum(e)
		{
			e.preventDefault();
			if(this != selectedAlbum)
			{
				//Update old selection
				var oldVinyl = selectedAlbum.getElementsByClassName("vinyl")[0];
				selectedAlbum.addEventListener('mouseenter', moveVinyl, false);
				selectedAlbum.addEventListener('mouseleave', endMoveVinyl, false);
				$(oldVinyl).animate({
					left: "-=40px",
				}, 100, "swing");
				$(selectedAlbum).css({
					"background-color": ALBUM_BG_COLOR,
					"background": ALBUM_BG_COLOR,
					"box-shadow": "none"
				});
				$(selectedAlbum).children("h2").css({
					"color": "#f6f6f6"
				});
				$(selectedAlbum).children("h3").css({
					"color": "#ddd"
				});
				
				//Update New Selection
				selectedAlbum = this;
				displaySelectedAlbum();
			}
		}
		
		//OTHER UTLITIY FUNCTIONS
		//Converts milliseconds given in most API's to 'minutes:seconds'
		//Found Here: http://stackoverflow.com/questions/21294302/converting-soundclouds-milliseconds-to-minutes-and-seconds-with-javascript
		function msToMinutesAndSeconds(ms)
		{
			var minutes = Math.floor(ms / 60000);
			var seconds = ((ms % 60000)/1000).toFixed(0);
			return minutes + ":" + (seconds < 10 ? 0 : '') + seconds;
		}
			
		//checks for repeat albums
		function isRepeatAlbum(album, album2)
		{
			//Checks if the 2 passed albums (album and album2) are identical
			if(album.name === album2.name) { return true; }
			//Checks if the album currently has no other albums to check against
			else if(album.otherAlbums.length <= 0) { return false; }
			//if album has a list of other albums already,
			//loop through them and compare each one to the pending album2
			for(var i = 0; i < album.otherAlbums.length; i++)
			{
				var origAlbum = album.otherAlbums[i].name.toLowerCase();
				var altAlbum = album2.name.toLowerCase();
				if(origAlbum === altAlbum)
				{
					return true;
				}
			};
			return false;
		}
		
		//Sets a selected link for top track to blue or default depending on boolean
		function setSelectedLink(selectedLink, selected)
		{			
			if(selected)
			{
				selectedLink.css({
					"color": "#eee"
				});
			}
			else
			{
				selectedLink.css({
					"color": BLUE
				})
			}
		}
		
		//Turns all links to default color
		function resetLinks(allLinks)
		{
			for(var i = 0; i < allLinks.length; i++)
			{
				$(allLinks[i]).css({
					"color": "#eee"
				});
			}
		}
	}
}(jQuery));
