(function($)
{
	var lib = library;
	$.fn.albumify = function()
	{
		//Display Functions run after all ajax requests have finished
		$(document).ajaxStop(function()
		{
			$(this).off("ajaxStop");
			displayHeaderBar();
			albumStyle(albums);
			displayAlbumArt();
			displaySelectedAlbum();
			document.body.style.display = "block";//Lets the user see the screen
			removeLoading();
		});
		
		var ALBUM_BG_COLOR = "#333";
		var ALBUM_BORDER_COLOR = "#666";
		var BLUE = "#0099FF";
		
		var playingTrack;
		var libDiv = this[0];
		var libList;
		var images = [];
		var albums = [];
		var libLength = lib.albums.length;
		
		//***LOAD PAGE AND DATA***//
		//========================================================//
		
		showLoading();
		generateDivs();
		
		//Retrieve array of album objects made my generateDivs()
		albums = document.getElementsByClassName("album");
		libList = document.getElementById("tracksList");
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
				"width": window.innerWidth + "px",
				"height": window.innerHeight + "px"
			}).attr("id", "loadingScreen");
			
			var loadingWords = $("<h1>").css({
				"line-height": window.innerHeight + "px"
			}).html("Loading . . .").attr("id", "loadingText");
			
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
			
			var albumList = "<div id='albumList'>";
			
			for(var i = 0; i < libLength; i++)
			{
				var div = "<div class='album'>";
				div += "<div class='vinyl'><div class='vinylHole'></div></div>";
				div += "<img width='150' height='150' src='' />";		
				div += "<h2>" + lib.albums[i].album + "</h2><h3>" + lib.albums[i].artist + "</h3>";
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
			for(var i = 0; i < albumsArray.length; i++)
			{
				singleAlbumStyle(albumsArray[i]);
			}//End For Loop
			$(libDiv).css({"background-color": "#303030"});
		}//End Album Styles
		
		function singleAlbumStyle(album)
		{
			var albumH2 = album.getElementsByTagName("h2");
			var albumH3 = album.getElementsByTagName("h3");
			var albumImg = album.getElementsByTagName("img")[0];
			
			album.addEventListener('mouseenter', moveVinyl, false);
			album.addEventListener('mouseleave', endMoveVinyl, false);
			album.addEventListener('click', setSelectedAlbum, false);
			
			$(album).css({
				"border-bottom": "1px solid " + ALBUM_BORDER_COLOR,
				"background-color": ALBUM_BG_COLOR
			});
			
			$(albumImg).addClass("albumArt");
			$(albumH2).addClass("albumHeader2");
			$(albumH3).addClass("albumHeader3");
		}
		
		function displayHeaderBar()
		{
			var headerBar = $("<div>").attr("id", "headerBar");
			var searchInput = $("<input />").attr({"type": "text", "placeholder": "search for an album", "id": "headerSearch"});
			var searchBtn = $("<div>").attr("id", "headerSearchButton").html("Search").click(searchQuery);
			var albumifyTitle = $("<h1>").attr("id", "headerTitle").html("ALBUMIFY");
			$(headerBar).append(searchInput).append(searchBtn).prepend(albumifyTitle);
			$(document.body).prepend(headerBar);
		}
		
		//Adds album art to the album div's img Element
		function displayAlbumArt()
		{
			for(var i = 0; i < albums.length; i++)
			{
				var albumImgElement = albums[i].getElementsByTagName("img")[0];
				albumImgElement.src = albums[i].image.src;
			}
		}
		
		function displaySingleAlbumArt(album)
		{
			var albumImgElement = album.getElementsByTagName("img")[0];
			albumImgElement.src = album.image.src;
		}
		
		//Set Attributes of selected Album
		function displaySelectedAlbum()
		{
			var vinyl = selectedAlbum.getElementsByClassName("vinyl")[0];
			selectedAlbum.removeEventListener('mouseenter', moveVinyl, false);
			selectedAlbum.removeEventListener('mouseleave', endMoveVinyl, false);
			$(selectedAlbum).css({
				//"background": 'linear-gradient(to right, ' + ALBUM_BG_GRADIENT_COLOR + ' 30%, ' + ALBUM_BG_GRADIENT_COLOR_2 + ')'
				"box-shadow": "inset -4em 0px 0 #0099FF"
			});
			
			$(selectedAlbum).children("h2").addClass("albumHeader2Selected");
			$(selectedAlbum).children("h3").addClass("albumHeader3Selected");
			$(vinyl).addClass("vinylSelected");
			
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
			var headerDiv = $("<div>").attr("id", "tracksHeader");
			var headerAlbum = $("<h1>").attr("id", "tracksH1").html(album.name);
			var headerArtists = $("<h2>").attr("id", "tracksH2").html(album.artists[0].name);
			var headerAlbumImg = $("<img/>").attr({
				"id": "tracksAlbumArt",
				"src": album.image.src
			});
			var clearFix = $("<div>").css("clear", "both");
			$(headerDiv).append(headerAlbum).append(headerArtists).prepend(headerAlbumImg).append(clearFix);
			$(libList).append(headerDiv);
			album.trackList.forEach(function(track, i)
			{
				libList.innerHTML += "<div class='track'><a>" + track.name + "</a>" + album.trackList[i].audio.outerHTML + "<span>" + msToMinutesAndSeconds(track.duration_ms) + "</span><div style='clear: both'></div></div>";
			});
		}
		
		//Display Album art button and set the click event for displaying selected album's art
		function generateAlbumArtButton(album)
		{
			//Button Object - Very long object.
			var btn = $("<button />").addClass("albumArtButton").html("View Album Art").click(function() //Click Event Handler 
			{
				//Div Object that blackens the background
				var bgBlur = generateBgBlur();
				
				//"X" Button that closes the newly generated album window
				var exitButton = generateExitButton();
				
				//Left position for the image; places it in center screen
				var imageLeft = (window.innerWidth/2) - 320; //320 is half of the image's width
				var newImg = $("<img />").attr("src", album.image.largeArt);
				var newDiv = $("<div>").append(newImg).addClass("newAlbumArt").css({
					"left": imageLeft + "px",
					"width": album.image.largeArtW + "px",
					"height": album.image.largeArtH + "px"
				}).append(exitButton).fadeIn(500);
				
				$(libDiv).append(bgBlur);
				$(libDiv).append(newDiv);
				
			}).hover(function() //Handler IN for album art btn
			{
				$(this).addClass("albumArtButtonHover");
			}, function()  //Handler OUT for album art btn
			{
				$(this).removeClass("albumArtButtonHover");
			});
			//Finally add the button to the right side of page.
			$(libList).append(btn);
		}// END GENERATE ALBUM ART Button
		
		function displayArtistInfo(album)
		{
			//Artist Block will contain all related artist information
			var artistBlock = $("<div>").attr("id", "artistBlock");
			var artistHeader = $("<h2>").attr("id", "artistHeader").html("Artist - " + album.artists[0].name);
			var artistPic = $("<img />").attr({src: album.artistsPic[0][0].url, id: "artistPic"});
			
			//TOP TRACKS
			var artistTopTracks = $("<div>").attr("id", "topTracks");
			var topTracksHeader = $("<h3>").attr("id", "topTracksHeader").html("Top Tracks from " + album.artists[0].name);
			var topTracksOl = $("<ol>").attr("id", "topTracksList");
			//END TOP TRACKS
			
			//OTHER ALBUMS
			var otherAlbumsDiv = $("<div>").attr("id", "otherAlbums");
			var otherAlbumsHeader = $("<h2>").attr("id", "otherAlbumsHeader").html("Other Albums by " + album.artists[0].name);
			//END OTHER ALBUMS
			
			//RELATED ARTISTS
			var relatedArtistsDiv = $("<div>").attr("id", "relatedArtists");
			var relatedArtistsHeader = $("<h2>").attr("id", "relatedArtistsHeader").html("Similar Artists to " + album.artists[0].name);
			//END RELATED ARTISTS
			
			$(otherAlbumsDiv).append(otherAlbumsHeader);
			$(artistTopTracks).append(topTracksHeader).append(topTracksOl);
			$(relatedArtistsDiv).append(relatedArtistsHeader);
			
			displayTopTracks(album, topTracksOl);	
			displayOtherAlbums(album, otherAlbumsDiv);
			displayRelatedArtists(album, relatedArtistsDiv);
			
			$(artistBlock).append(artistHeader).append(artistPic).append(artistTopTracks).append(otherAlbumsDiv).append(relatedArtistsDiv);
			$(libList).append(artistBlock);
		}// END DISPLAY ARTIST INFO
		
		//Related Artists Display
		function displayRelatedArtists(album, appendee)
		{
			for(var i = 0; i < 8; i++)
			{
				try
				{
					var linkWrapper = $("<a>").attr({href: album.relatedArtists[i].url, target: "spotify"}).addClass("relatedArtistPicWrapper");
					var imgElement = $("<img />").attr("src", album.relatedArtists[i].image.url).addClass("relatedArtistPic")
					.data("data", {index: i, album: album, isArtist: true}).hover(elementHoverIn, elementHoverOut);
					$(linkWrapper).append(imgElement);
					$(appendee).append(linkWrapper);
				}
				catch(e)
				{
					console.log(e);
				}
			}
		}
		
		//Other Album Display
		function displayOtherAlbums(album, appendee)
		{
			//FOR loop that adds Other Albums
			//Displays 10 albums. i < 5 would display only 5
			for(var i = 0; i < 8; i++)
			{
				//Try/catch prevents failure if the artist does not have enough albums to complete the for loop
				try
				{
					var linkWrapper = $("<a>").attr({href: album.otherAlbums[i].external_urls.spotify, target: "spotify"});
					var imgElement = $("<img />").attr("src", album.otherAlbums[i].images[2].url).addClass("otherAlbumArt")
					//Using jQuery's data method to save the index of the foor loop
					.data("data", {index: i, album: album, isArtist: false}).hover(elementHoverIn, elementHoverOut);
					$(linkWrapper).append(imgElement);
					$(appendee).append(linkWrapper);
					}
				catch(e)
				{
					console.log("Not enough albums");
				}
			}
		}
		
		//Related Artist Display
		function displayTopTracks(album, appendee)
		{
			//FOR loop that adds top tracks and related events
			for(var i = 0; i < 5; i++)
			{
				//Try/catch prevents crashing if artist does not have 'i' number of top tracks
				try
				{	
					//Set an index property via data() that can be used in the anonymous function
					var topTrackLink = $("<a>").attr({href: "", id: "topTrack" + i}).html(album.topTracks[i].name).data("index", i).css({
						"color": "#ccc",
						"text-decoration": "none"
					//CLICK EVENT THAT PLAYS TRACK's CORRESPONDING AUDIO
					}).click(function(e)
					{
						e.preventDefault();
						playTrack(album, this);
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
					var topTrackLi = $("<li>").append(topTrackLink).addClass("topTrackLi");
					$(appendee).append(topTrackLi);
				}
				catch(e)
				{
					//console.log("Artist does not have 10 top tracks");
				}
			}
		}
		
		//Load Artist Information
		function loadArtistInfo(album)
		{
			var albumID = album.id;
			album.artistsPic = [];
			album.otherAlbums = [];
			album.relatedArtists = [];
			album.topTracks = [];
			
			//Loads artists from album's id
			//Nested AJAX request... Gets the artists' ids from the album, and uses that ID to find the related artists' info
			$.ajax
			({
				dataType: 'json',
				url: 'https://api.spotify.com/v1/albums/' + albumID
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
						url: 'https://api.spotify.com/v1/artists/' + album.artists[0].id
					}).done(function(data2)
					{
						album.artistsPic.push([data2.images[0], data2.name, data2.id]);
					});
				}
				else
				{
					album.artists.forEach(function(artist)
					{
						$.ajax
						({
							dataType: 'json',
							url: 'https://api.spotify.com/v1/artists/' + artist.id
						}).done(function(data2)
						{
							album.artistsPic.push(data2.images[0], data2.name, data2.id);
						});
					});
				}
				
				//This ajax request receives artist's other albums
				//Currently only takes albums from the first artist in a list
				$.ajax
				({
					dataType: 'json',
					url: 'https://api.spotify.com/v1/artists/' + album.artists[0].id + '/albums?album_type=album&limit=20'
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
					url: 'https://api.spotify.com/v1/artists/' + album.artists[0].id + '/top-tracks?country=US'
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
				
				//This Ajax Request will fetch an artist's related artists
				$.ajax
				({
					dataType: 'json',
					url: 'https://api.spotify.com/v1/artists/' + album.artists[0].id + '/related-artists'
				}).done(function(data)
				{
					try
					{
						for(var i = 0; i < 10; i++)
						{
							var relatedArtist = {
								name: data.artists[i].name,
								image: data.artists[i].images[3],
								url: data.artists[i].external_urls.spotify
							};
							album.relatedArtists.push(relatedArtist);
						}
					}
					catch(e)
					{
						console.log(e + " No Related Artists");
					}
				});
				
			});
		}
		
		//Loads Albums Art and tracks
		function albumLoad(albumsArray)
		{
			for(var i = 0; i < albumsArray.length; i++)
			{
				getAlbumArt(albumsArray[i]);
			}
		}// END STYLING ALBUMS
		
		// Ajax call used to retrieve album art of passed album div
		function getAlbumArt(album)
		{
			if(album === null || album === undefined) { return false; }
			var curAlbumName = $(album.getElementsByTagName("h2")[0]).html();
			var curAlbumArtist = $(album.getElementsByTagName("h3")[0]).html();
			
			$.ajax
			({
				dataType: "json",
				url: "https://api.spotify.com/v1/search?q=album:'" + curAlbumName + "'%20artist:'" + curAlbumArtist + "'&limit=2&type=album"
			}).done(function(data)
			{
				//Prevents errors if there is a misspelling in the JSON
				if(data.albums.items.length <= 0)
				{
					$(album).remove();
					//get the new list of albums without the one just removed
					albums = document.getElementsByClassName("album");
				}
				else
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
				}
			});
		}
		
		//Loads the tracks of an album
		function loadTracks(album)
		{
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
				});
			});
		}
		
		function endMoveVinyl()
		{
			var vinyl = this.getElementsByClassName("vinyl")[0];
			$(vinyl).animate({
				left: "-=40"
			}, 100, "swing", function()
			{
				
			});
		}
		
		function elementHoverIn(e)
		{
			var $this = $(this);
			var mousex = e.clientX || e.pageX;
			var mousey = e.clientY || e.pageY;
			var hoverDiv = $("<div>").attr("id", "hoverDiv").css({
				"left": (mousex - 25) + "px",
				"top": (mousey - 50) + "px"
			//Apply jQuery's 'data' method yet again to retrieved saved index.
			//If you just use the 'i' value straight from the for loop, i will equal the latest value set in the loop (aka, 9). We do not want this.
			});
			if($this.data("data").isArtist)
			{
				$(hoverDiv).html($this.data("data").album.relatedArtists[$this.data("data").index].name);
			}
			else
			{
				$(hoverDiv).html($this.data("data").album.otherAlbums[$this.data("data").index].name);
			}
			$("body").append(hoverDiv);
		}
		
		function elementHoverOut()
		{
			$("#hoverDiv").remove();
		}
		
		function searchQuery()
		{
			var query = $("#headerSearch").val();
			var bgBlur = generateBgBlur();
			var exitButton = generateExitButton();
			var newDiv = $("<div>").attr("id", "queryResults").css({
							"left": window.innerWidth/2 - 300 + "px",
							"width": 800 + "px",
							"height": 600 + "px"
						}).fadeIn(500);
			$(newDiv).append(exitButton);			
			$(document.body).append(bgBlur).append(newDiv);
			ajaxSearch(query);
		}
		
		function ajaxSearch(searchTerm)
		{
			$.ajax({
				dataType: 'json',
				url: "https://api.spotify.com/v1/search?q=album:'" + searchTerm + "'&limit=15&type=album"
			}).done(function(data)
			{
				var resultsDiv = $("#queryResults");
				if(data.albums.items.length <= 0)
				{
					resultsDiv.append("<br/><br/>No Results Found. At the moment, Albumify can only search for albums." +
					" Searching by Artists is planned to be implemented in the future.");
				}
				else
				{
					for(var i = 0; i < 15; i++)
					{
						try
						{
							var albumID = data.albums.items[i].id;
							var searchResult = $("<div>").addClass("searchResult");
							var searchResultImg = $("<img/>").attr("src", data.albums.items[i].images[1].url);
							$(searchResult).append(searchResultImg);
							$(searchResult).append("<p>" + data.albums.items[i].name + "</p>");
							findArtist(albumID, searchResult);
							resultsDiv.append(searchResult);
						}
						catch(e)
						{
							console.log(e);
						}
					}
					resultsDiv.append("<br />");
				}
			});
		}
		
		function findArtist(albumID, appendee)
		{
			$.ajax({
				dataType: 'json',
				url: "https://api.spotify.com/v1/albums/" + albumID
			}).done(function(data)
			{
				data.artists.forEach(function(artist)
				{
					$(appendee).append("<p class='searchP'>" + artist.name + "</p>").data("data", 
					{
						album: convertAccentedCharacters(data.name),
						artist: convertAccentedCharacters(artist.name)
					});
				});
				$(appendee).click(initAlbumCreation);
			});
		}
		
		function initAlbumCreation(e)
		{
			e.preventDefault();
			var newAlbum = $("<div>").addClass("album");
			var newVinyl = $("<div>").addClass("vinyl");
			var newVinylHole = $("<div>").addClass("vinylHole");
			var newImg = $("<img/>").attr({"width": "150", "height": "150", "src": ""});
			var newAlbumName = $("<h2>").html($(this).data("data").album);
			var newArtistName = $("<h3>").html($(this).data("data").artist);
			var clearFix = $("<div>").css("clear", "both");
			$(newAlbum).append(newVinyl).append(newImg).append(newAlbumName).append(newArtistName).append(clearFix);
			$(newVinyl).append(newVinylHole);
			$("#albumList").append(newAlbum);
			albums = document.getElementsByClassName("album");
			newAlbum = albums[albums.length - 1];
			singleAlbumStyle(newAlbum);
			$("#queryResults").remove();
			$("#bgBlur").remove();
			getAlbumArt(newAlbum);
			$(document).ajaxStop(function()
			{
				displaySingleAlbumArt(newAlbum);
				setNewAlbumAsSelected(newAlbum);
				$(this).off("ajaxStop");
			});
		}
		
		function generateBgBlur()
		{
			return $("<div>").css({
						"width": window.innerWidth + "px",
						"height": window.innerHeight + "px"
					}).attr("id", "bgBlur").fadeIn(500);
		}
		
		function generateExitButton()
		{
			return $("<button />").html("X").addClass("exitButton").hover(function()
				{
					$(this).addClass("exitButtonHover"); //Hover Handler IN for exit button
				}, function()
				{
					$(this).removeClass("exitButtonHover"); //Hover Handler OUT exit button
			}).click(function()
				{
					var bgBlur = document.getElementById("bgBlur");
					//The "parent" is the Div that will hold the album image
					$(this).parent().fadeOut(500, function()
					{
						$(this).remove();
					});
					$(bgBlur).fadeOut(500, function()
					{
						$(this).remove();
					});
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
		
		//Primary function that plays a track
		function playTrack(album, track)
		{
			var index = $(track).data().index;
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
		}
		
		//Sets the clicked album's styles and animation,
		//And also calls all display functions to retrieve and display AJAX data
		function setSelectedAlbum(e)
		{
			e.preventDefault();
			if(this != selectedAlbum)
			{
				//Update old selection
				updateOldSelectedAlbum();
				
				//Update New Selection
				selectedAlbum = this;
				displaySelectedAlbum();
			}
		}
		
		function setNewAlbumAsSelected(album)
		{
			//Update old selection
			updateOldSelectedAlbum();
			
			//Update New Selection
			selectedAlbum = album;
			displaySelectedAlbum();
		}
		
		function updateOldSelectedAlbum()
		{
			var oldVinyl = selectedAlbum.getElementsByClassName("vinyl")[0];
			selectedAlbum.addEventListener('mouseenter', moveVinyl, false);
			selectedAlbum.addEventListener('mouseleave', endMoveVinyl, false);
			$(oldVinyl).animate({
				left: "-=40px"
			}, 100, "swing");
			$(selectedAlbum).css({
				"background-color": ALBUM_BG_COLOR,
				"background": ALBUM_BG_COLOR,
				"box-shadow": "none"
			});
			$(selectedAlbum).children("h2").removeClass("albumHeader2Selected");
			$(selectedAlbum).children("h3").removeClass("albumHeader3Selected");
		}
		
		//OTHER UTLITIY FUNCTIONS
		//Converts milliseconds given in most API's to 'minutes:seconds'
		//Found Here: http://stackoverflow.com/questions/21294302/converting-soundclouds-milliseconds-to-minutes-and-seconds-with-javascript
		function msToMinutesAndSeconds(ms)
		{
			var minutes = Math.floor(ms / 60000);
			var seconds = ((ms % 60000)/1000).toFixed(0);
			if(seconds >= 60){
				seconds = 0;
				minutes++;
			}
			return minutes + ":" + (seconds < 10 ? 0 : '') + seconds;
		}
		
		//Used for converting diacritics to their normal counterparts
		//Spotify's API cannot search with diacritics, even though they give names containing them
		//Found on stack overflow: http://stackoverflow.com/questions/863800/replacing-diacritics-in-javascript
		function convertAccentedCharacters(str){
			var changes;
			var defaultDiacriticsRemovalMap = [
				{'base':'A', 'letters':/[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g},
				{'base':'AA','letters':/[\uA732]/g},
				{'base':'AE','letters':/[\u00C6\u01FC\u01E2]/g},
				{'base':'AO','letters':/[\uA734]/g},
				{'base':'AU','letters':/[\uA736]/g},
				{'base':'AV','letters':/[\uA738\uA73A]/g},
				{'base':'AY','letters':/[\uA73C]/g},
				{'base':'B', 'letters':/[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g},
				{'base':'C', 'letters':/[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g},
				{'base':'D', 'letters':/[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g},
				{'base':'DZ','letters':/[\u01F1\u01C4]/g},
				{'base':'Dz','letters':/[\u01F2\u01C5]/g},
				{'base':'E', 'letters':/[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g},
				{'base':'F', 'letters':/[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g},
				{'base':'G', 'letters':/[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g},
				{'base':'H', 'letters':/[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g},
				{'base':'I', 'letters':/[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g},
				{'base':'J', 'letters':/[\u004A\u24BF\uFF2A\u0134\u0248]/g},
				{'base':'K', 'letters':/[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g},
				{'base':'L', 'letters':/[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g},
				{'base':'LJ','letters':/[\u01C7]/g},
				{'base':'Lj','letters':/[\u01C8]/g},
				{'base':'M', 'letters':/[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g},
				{'base':'N', 'letters':/[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g},
				{'base':'NJ','letters':/[\u01CA]/g},
				{'base':'Nj','letters':/[\u01CB]/g},
				{'base':'O', 'letters':/[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g},
				{'base':'OI','letters':/[\u01A2]/g},
				{'base':'OO','letters':/[\uA74E]/g},
				{'base':'OU','letters':/[\u0222]/g},
				{'base':'P', 'letters':/[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g},
				{'base':'Q', 'letters':/[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g},
				{'base':'R', 'letters':/[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g},
				{'base':'S', 'letters':/[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g},
				{'base':'T', 'letters':/[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g},
				{'base':'TZ','letters':/[\uA728]/g},
				{'base':'U', 'letters':/[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g},
				{'base':'V', 'letters':/[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g},
				{'base':'VY','letters':/[\uA760]/g},
				{'base':'W', 'letters':/[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g},
				{'base':'X', 'letters':/[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g},
				{'base':'Y', 'letters':/[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g},
				{'base':'Z', 'letters':/[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g},
				{'base':'a', 'letters':/[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g},
				{'base':'aa','letters':/[\uA733]/g},
				{'base':'ae','letters':/[\u00E6\u01FD\u01E3]/g},
				{'base':'ao','letters':/[\uA735]/g},
				{'base':'au','letters':/[\uA737]/g},
				{'base':'av','letters':/[\uA739\uA73B]/g},
				{'base':'ay','letters':/[\uA73D]/g},
				{'base':'b', 'letters':/[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g},
				{'base':'c', 'letters':/[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g},
				{'base':'d', 'letters':/[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g},
				{'base':'dz','letters':/[\u01F3\u01C6]/g},
				{'base':'e', 'letters':/[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g},
				{'base':'f', 'letters':/[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g},
				{'base':'g', 'letters':/[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g},
				{'base':'h', 'letters':/[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g},
				{'base':'hv','letters':/[\u0195]/g},
				{'base':'i', 'letters':/[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g},
				{'base':'j', 'letters':/[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g},
				{'base':'k', 'letters':/[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g},
				{'base':'l', 'letters':/[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g},
				{'base':'lj','letters':/[\u01C9]/g},
				{'base':'m', 'letters':/[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g},
				{'base':'n', 'letters':/[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g},
				{'base':'nj','letters':/[\u01CC]/g},
				{'base':'o', 'letters':/[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g},
				{'base':'oi','letters':/[\u01A3]/g},
				{'base':'ou','letters':/[\u0223]/g},
				{'base':'oo','letters':/[\uA74F]/g},
				{'base':'p','letters':/[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g},
				{'base':'q','letters':/[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g},
				{'base':'r','letters':/[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g},
				{'base':'s','letters':/[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g},
				{'base':'t','letters':/[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g},
				{'base':'tz','letters':/[\uA729]/g},
				{'base':'u','letters':/[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g},
				{'base':'v','letters':/[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g},
				{'base':'vy','letters':/[\uA761]/g},
				{'base':'w','letters':/[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g},
				{'base':'x','letters':/[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g},
				{'base':'y','letters':/[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g},
				{'base':'z','letters':/[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g}
			];
			if(!changes) {
				changes = defaultDiacriticsRemovalMap;
			}
			for(var i=0; i<changes.length; i++) {
				str = str.replace(changes[i].letters, changes[i].base);
			}
			return str;
		}
			
		//checks for repeat albums
		function isRepeatAlbum(album, album2)
		{
			//Checks if the 2 passed albums are identical
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
			}
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
				});
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
	};
}(jQuery));
