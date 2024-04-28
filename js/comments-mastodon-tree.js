---
---

        //I think this is ready for testing, however I still need to wire it into the displayToot function.  
        //I also need to update the createCarousel function to use the new design.

        function createCarouselNew(media_attachments, id) {

            console.log("createCarouselNew()");
            console.log(media_attachments);


            // Create a carousel card
            function createCard(imageID, imagePreviewUrl, imageUrl, imagePositionX, imagePositionY, text) {
                var card = document.createElement('div');
                card.setAttribute('class', 'card ');
                var a = document.createElement('a');
                a.setAttribute('href', imageUrl);
                a.setAttribute('target', '_blank');
                var img = document.createElement('img');
                img.setAttribute('src', imagePreviewUrl);
                img.setAttribute('class', 'object-fit-cover card-img-top');
                img.setAttribute('alt', text);
                //TODO: Add Image Set.  This is for the lazy loading of images.
                //TODO Add BlurHash.  This is for the lazy loading of images.

                img.setAttribute('style', 'object-position: ' + imagePositionX + ' ' + imagePositionY+";" );
                a.appendChild(img);
                card.appendChild(a);

                var cardBody = document.createElement('div');
                cardBody.setAttribute('class', 'card-body');
                var cardTitle = document.createElement('p');
                cardTitle.setAttribute('class', 'h5 card-title');
                cardTitle.textContent = text;
                //var cardText = document.createElement('p');
                //cardText.setAttribute('class', 'card-text');
                //cardText.textContent = text;
                //This is for the last updated text, however that isn't used.  Perhaps this can be reused for something else.
                //var cardTextSmall = document.createElement('p');
                //cardTextSmall.setAttribute('class', 'card-text');
                //var small = document.createElement('small');
                //small.setAttribute('class', 'text-muted');
                //small.textContent = lastUpdated;
                //cardTextSmall.appendChild(small);

                cardBody.appendChild(cardTitle);
                //cardBody.appendChild(cardText);
                //cardBody.appendChild(cardTextSmall);
                card.appendChild(cardBody);

                return card;
            }


            // Function to create a carousel item
            function createCarouselItem(active, items) {
                var item = document.createElement('div');
                item.setAttribute('class', `carousel-item ${active ? 'active' : ''}`);
                var cardGroup = document.createElement('div');
                cardGroup.setAttribute('class', 'card-group');
                item.appendChild(cardGroup);

                if (items) {
                    items.forEach(function(currentItem) {

                        console.log("tems.forEach(function(currentItem) {");
                        console.log(currentItem);

                        var imageUrl = currentItem.imageUrl;
                        var imagePreviewUrl = currentItem.imagePreviewUrl;
                        var text = currentItem.text;
                        var imageID = currentItem.id;
                        var imagePositionX = currentItem.imagePositionY;
                        var imagePositionY = currentItem.imagePositionY;

                        cardGroup.appendChild(createCard(imageID, imagePreviewUrl, imageUrl, imagePositionX, imagePositionY, text));
                    });
                }

                return item;
            }

            // Function to create a button for the indicators
            function createButton(index, isActive) {
                var button = document.createElement('button');
                    button.setAttribute('type', 'button');
                    button.dataset.bsTarget = '#' + 'carousel-' + id
                    button.dataset.bsSlideTo = index;
                    button.setAttribute('class', isActive ? 'active carousel-button' : 'carousel-button');
                    button.setAttribute('aria-label', `Slide ${index + 1}`);
                if (isActive) {
                    button.setAttribute('aria-current', 'true');
                }
                return button;
            }

            // Create the main carousel container
            var carousel = document.createElement('div');
                carousel.setAttribute('id', 'carousel-' + id);
                carousel.setAttribute('class', 'carousel slide');
                carousel.dataset.bsRide = 'false';

            // Create the carousel indicators container
            var carouselIndicators = document.createElement('div');
                carouselIndicators.setAttribute('class', 'carousel-indicators row w-100 p-0 m-0 position-relative');
                carousel.appendChild(carouselIndicators);

            // Create the carousel inner container
            var carouselInner = document.createElement('div');
                carouselInner.setAttribute('class', 'carousel-inner');
                carousel.appendChild(carouselInner);


            var CarouselArray = [];
            var numberOfButtons = 0;
            var isFirstItem = true;
            for (var i = 0; i < media_attachments.length; i++) {
                var ImageID = media_attachments[i].id;
                var imageUrl = media_attachments[i].url;
                var imagePreviewUrl = media_attachments[i].preview_url;
                var text = media_attachments[i].text;
                var imagePositionX = (media_attachments[i].meta.focus.x * 100) + '%';
                var imagePositionY = (media_attachments[i].meta.focus.y * 100) + '%';

                console.log (imagePositionX + " " + imagePositionY);
                console.log ( (media_attachments[i].meta.focus.x * 100) + '%' + " "+ (media_attachments[i].meta.focus.y * 100) + '%');
                console.log ( media_attachments[i].meta.focus.x + " "+ media_attachments[i].meta.focus.y );


                var item = {
                    id: ImageID,
                    imageUrl: imageUrl,
                    imagePreviewUrl: imagePreviewUrl,
                    imagePositionX: imagePositionX,
                    imagePositionY: imagePositionY,
                    text: text,
                };

                CarouselArray.push(item);

                // If tempArray has 3 items or if this is the last item
                if (CarouselArray.length === 3 || i === media_attachments.length - 1) {

                    // Add items to the carousel inner container
                    carouselInner.appendChild(createCarouselItem(isFirstItem, CarouselArray));
                    // Reset tempArray
                    CarouselArray = [];

                    if (numberOfButtons === 0) {
                        // Add buttons to the carousel indicators for every 3 images
                        carouselIndicators.appendChild(createButton(numberOfButtons, true));
                    } else {
                        carouselIndicators.appendChild(createButton(numberOfButtons, false));
                    }
                    numberOfButtons += 1;

                    isFirstItem = false
                }
            }

            // Append the carousel to the document body or a specific container
            return carousel;
        }

        /**
         * Loads a "toot" (a post or comment) from a given URL and displays it in a specified HTML element.
         *
         * @param {string} url - The URL of the toot.
         * @param {string|HTMLElement} element - The ID of an HTML element or the HTML element itself where the toot will be displayed.
         *
         * The function sends a GET request to the Mastodon API to retrieve the toot. The URL of the API endpoint is determined based on the given URL. If the URL does not contain "/api/v" or "/m/", the function modifies it to conform to the expected format of the API endpoint URL.
         *
         * When the request is successful, the function parses the response as JSON and passes the resulting object along with the specified element to the `displayToot` function.
         *
         * @returns {void}
         */        
         function loadTootThread(url, element) {
            var xmlhttp = new XMLHttpRequest();
            if (url.indexOf("/api/v") == -1 && url.indexOf("/m/") == -1) {
                if (url.indexOf("http") != 0) {
                    // console.log("This doesn't look like a valid URL: " + url);
                    url = "https://" + url;
                }
                var splitUrl = url.split("/");
                // url = splitUrl[0] + '//' + splitUrl[2] + '/b api/v1/statuses/';
                url = splitUrl[0] + "//" + splitUrl[2] + "/api/v1/statuses/";
                // support different URL syntaxes for links to toots
                if (splitUrl[3] && splitUrl[3] == "users") {
                    url += splitUrl[6];
                } else if (splitUrl[3] && splitUrl[3] == "web") {
                    url += splitUrl[5];
                } else {
                    url += splitUrl[4];
                }
                if (splitUrl[3] == "notes") {
                    // Shuttlecraft
                    url = splitUrl[0] + "//" + splitUrl[2] + "/m/" + splitUrl[4];
                }
                lastUrl = url;
                // console.log(url);
            }
        
            xmlhttp.onreadystatechange = function () {
                //console.log('xmlhttp.onreadystatechange()');
                if (this.readyState == 4 && this.status == 200) {
                var myArr = JSON.parse(this.responseText);
                displayToot(myArr, element);
                }
            };
            xmlhttp.open("GET", url, true);
            xmlhttp.setRequestHeader(
                "Accept",
                'application/ld+json; profile="https://www.w3.org/ns/activitystreams"'
            );
            xmlhttp.send();
        }

        /**
         * Loads the replies to a "toot" (a post or comment) and displays them in a specified HTML element.
         *
         * @param {Object} arr - An object containing the data of the toot. This parameter is currently not used in the function.
         * @param {string|HTMLElement} element - The ID of an HTML element or the HTML element itself where the replies will be displayed.
         *
         * The function sends a GET request to the Mastodon API to retrieve the replies to the toot. The URL of the API endpoint is determined based on the last URL that was used to load a toot. If the last URL contains "/m/", the function appends "/replies" to it, otherwise it appends "/context".
         *
         * When the request is successful, the function parses the response as JSON and passes the resulting object along with the specified element to the `displayTootReplies` function.
         *
         * @returns {void}
         */        
         function loadTootReplies(arr, element) {
            var xmlhttp = new XMLHttpRequest();
        
            // TODO: figure out the URL
            // var url = 'https://mastodon.social/api/v1/statuses/108195817029536656/context';
            var url = lastUrl + "/context";
            if (lastUrl.indexOf("/m/") != -1) {
                url = lastUrl + "/replies";
            }
            if (lastRepliesUrl == url) {
                // TODO: this is hinky when considering multiple different ways you can request original toot URL
                // return;
            }
            lastRepliesUrl = url;
        
            xmlhttp.onreadystatechange = function () {
                //console.log('xmlhttp.onreadystatechange()');
                if (this.readyState == 4 && this.status == 200) {
                var myArr = JSON.parse(this.responseText);
                displayTootReplies(myArr, element);
                }
            };
            xmlhttp.open("GET", url, true);
            xmlhttp.setRequestHeader(
                "Accept",
                'application/ld+json; profile="https://www.w3.org/ns/activitystreams"'
            );
            xmlhttp.send();
        }
 
        /**
         * Displays a "toot" (a post or comment) in a specified HTML element.
         *
         * @param {Object} arr - An object containing the data of the toot.
         * The arr object should have the following properties:
         * - account: An object containing the account information of the user who made the toot. If this property is not present, the function will try to use the attributedTo property instead.
         * - created_at: The date and time when the toot was created. If this property is not present, the function will use the published property instead.
         * - url: The URL of the toot.
         * - content: The content of the toot.
         *
         * @param {string|HTMLElement} element - The ID of an HTML element or the HTML element itself where the toot will be displayed.
         *
         * The function fills the specified element with the toot data, including the author's avatar, display name, username, instance name, the toot content, and the time since the toot was created. It also sets the href attribute of all elements with the class "authorLink" to the URL of the author's account.
         *
         * @returns {void}
         */        
         function displayToot(arr, element) {
            console.log("displayToot()");
            console.log(arr);
            // var displayJson = JSON.stringify(arr, null, 2);
            // handle missing / alternate variables
            if (!arr.account) {
                // handling data likely from Shuttlecraft
                var display_name = arr.attributedTo.split("/");
                display_name = display_name[display_name.length - 1];
                arr.account = {
                    url: arr.attributedTo,
                    avatar: "",
                    display_name: display_name,
                    username: display_name,
                };
            }
            if (!arr.created_at) {
                arr.created_at = arr.published;
            }
            // figure out multiple authors in comments thread
            var instanceName = arr.url
                .replaceAll("http://", "")
                .replaceAll("https://", "")
                .split("/")[0];
            originalAuthorId = arr.account.id;
            previousAuthorId = arr.account.id;
            originalAuthorUsername = arr.account.username;
            originalAuthorUsernameWithInstance = "@" + originalAuthorUsername + "@" + instanceName;
            topOfThreadId = arr.id;
            var displayToot;
            if (typeof element === "string") {
                displayToot = document.getElementById(element);
            }
            // backup the reply template, then remove old replies
            if (!tootReplyHtml) {
                tootReplyHtml = document.getElementById("displayTootTemplate").outerHTML + "";
            }
            // actually display content
            document.getElementsByClassName("tootReplies")[0].innerHTML = "";
            function ge(cn) {
                return displayToot.getElementsByClassName(cn)[0];
            }
            // ge('authorLink').href = arr.account.url;
            displayToot.id = arr.id; // new for trees

            if (arr.media_attachments && arr.media_attachments.length > 0) {
                var attachments = createCarouselNew(arr.media_attachments, arr.id);
                ge("attachments").appendChild(attachments);
            } else {
                ge("attachments").style.display = "none";
            }


            ge("avatarImg").src = "";
            ge("avatarImg").src = arr.account.avatar;
            ge("displayNameSpan").innerHTML = arr.account.display_name;
            ge("userNameSpan").innerHTML = "@" + arr.account.username;
            ge("instanceNameSpan").innerHTML = "@" + instanceName;
            ge("content").innerHTML = formatToot(arr.content);
            ge("createdAtLink").innerHTML = timeSince(arr.created_at);
            ge("createdAtLink").href = arr.url;
            var links = document.getElementsByClassName("authorLink");
            for (var i = 0; i < links.length; i++) {
                links[i].href = arr.account.url;
            }
            firstPost = arr;
            loadTootReplies(arr, document.getElementsByClassName("tootReplies")[0]);
            // console.log('Displayed original toot');
        }

        function getImageFromBlurHash(blurhash) {
            const pixels = decode(blurhash, width, height);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const imageData = ctx.createImageData(width, height);
            imageData.data.set(pixels);
            ctx.putImageData(imageData, 0, 0);
            return canvas.toDataURL();
        }

        /**
         * Calculates the time elapsed since a given date and returns a string representing this duration.
         *
         * @param {string|Date} date - The date from which the elapsed time is calculated. Can be a Date object or a string that can be parsed into a Date object.
         *
         * @returns {string} A string representing the time elapsed since the given date. The string is in the format of "Xy", "Xm", "Xd", "Xh", "Xm", or "Xs", where X is the amount of time and y, m, d, h, m, and s stand for year, month, day, hour, minute, and second, respectively. If the elapsed time is exactly 1 unit, the unit is singular (e.g., "1y", "1m", etc.).
         *
         * @example
         * // returns "1y" if the current date is exactly one year after January 1, 2020
         * timeSince("2020-01-01T00:00:00Z");
         */        
         function timeSince(date) {
            var seconds = Math.floor((new Date() - new Date(date)) / 1000);

            var interval = seconds / 31536000;

            if (interval > 1) {
                return Math.floor(interval) + " y";
            } else if (interval === 1) {
                return "1y";
            }
            interval = seconds / 2592000;
            if (interval > 1) {
                return Math.floor(interval) + " mon";
            } else if (interval === 1) {
                return "1m";
            }
            interval = seconds / 86400;
            if (interval > 1) {
                return Math.floor(interval) + " d";
            } else if (interval === 1) {
                return "1d";
            }
            interval = seconds / 3600;
            if (interval > 1) {
                return Math.floor(interval) + " h";
            } else if (interval === 1) {
                return "1h";
            }
            interval = seconds / 60;
            if (interval > 1) {
                return Math.floor(interval) + " min";
            } else if (interval === 1) {
                return "1m";
            }
            return Math.floor(seconds) === 1 ? "1s" : Math.floor(seconds) + "s";
        }

        /**
         * This function creates and displays a comment or reply in a thread.
         * 
         * @param {string|HTMLElement} element - The ID of an HTML element or the HTML element itself where the comment will be displayed.
         * @param {Object} arr - An object containing the data of the comment.
         * 
         * The arr object should have the following properties:
         * - account: An object containing the account information of the user who made the comment. If this property is not present, the function will try to use the actor property instead.
         * - created_at: The date and time when the comment was created. If this property is not present, the function will use the published property instead.
         * - url: The URL of the comment. If this property is not present, the function will use the note.url property instead.
         * - content: The content of the comment. If this property is not present, the function will use the note.content property instead.
         * - in_reply_to_id: The ID of the comment that this comment is replying to.
         * 
         * The function creates an HTML element for the comment, fills it with the comment data, and appends it to the specified element. It also handles indentation for nested replies.
         * 
         * @returns {HTMLElement} The HTML element of the comment.
         */        
         function displayTootReplies(threadArr, element) {
            console.log("displayTootReplies()");
            console.log(threadArr);
            // var displayJson = JSON.stringify(arr, null, 2);
            var arr;
            //console.log(baseElement);
            // for Shuttlecraft
            if (!threadArr.descendants) {
                threadArr = { descendants: threadArr };
            }
    
            function compareTootDates(a, b) {
                if (a.created_at < b.created_at) {
                    return -1;
                }
                if (a.created_at > b.created_at) {
                    return 1;
                }
                return 0;
            }
        
            function sortRepliesByDate(arr) {
                var returnArr = [];
                for (var i = 0; i < arr.length; i++) {
                    returnArr[i] = arr[i];
                }
                // first sort by data may be redundant
                returnArr.sort(compareTootDates);
                return returnArr;
            }
        
            threadArr.descendants = sortRepliesByDate(threadArr.descendants); // sortRepliesIntoTree(threadArr.descendants);
        
            threadArr = threadArr.descendants;
            for (var i = 0; i < threadArr.length; i++) {
                displayTootReply(threadArr[i], element);
            }
        
            // console.log('Displayed ' + threadArr.descendants.length + ' replies');
        }

        /**
         * Displays a reply to a "toot" (a post or comment) in a specified HTML element.
         *
         * @param {Object} arr - An object containing the data of the reply.
         * The arr object should have the following properties:
         * - account: An object containing the account information of the user who made the reply. If this property is not present, the function will try to use the actor property instead.
         * - created_at: The date and time when the reply was created. If this property is not present, the function will use the published property instead.
         * - url: The URL of the reply.
         * - content: The content of the reply.
         * - in_reply_to_id: The ID of the toot that this reply is replying to.
         *
         * @param {string|HTMLElement} element - The ID of an HTML element or the HTML element itself where the reply will be displayed.
         *
         * The function fills the specified element with the reply data, including the author's avatar, display name, username, instance name, the reply content, and the time since the reply was created. It also sets the href attribute of all elements with the class "authorLink" to the URL of the author's account.
         *
         * The function handles indentation for nested replies. The indentation level is determined based on the ID of the toot that the reply is replying to.
         *
         * @returns {HTMLElement} The HTML element of the reply.
         */
        function displayTootReply(arr, element) {

            console.log("displayTootReply()");
            console.log(arr);

            if (typeof element === "string") {
                baseElement = document.getElementById(element);
            } else {
                baseElement = element;
            }
        
            // handle missing / alternate variables
            if (!arr.account) {
                // handling data likely from Shuttlecraft
                display_name = arr.actor.name;
                arr.account = {
                url: arr.actor.url,
                avatar: arr.actor.image.url,
                display_name: arr.actor.name,
                username: arr.actor.preferredUsername,
                };
            }
            if (!arr.created_at) {
                arr.created_at = arr.published;
            }
            if (!arr.url) {
                arr.url = arr.note.url;
            }
            if (!arr.content) {
                arr.content = arr.note.content;
            }
        
            var instanceName = arr.url
                .replaceAll("http://", "")
                .replaceAll("https://", "")
                .split("/")[0];
            var displayToot = document.createElement("div");
            displayToot.innerHTML = tootReplyHtml;
            function ge(cn) {
                return displayToot.getElementsByClassName(cn)[0];
            }
            var contentObj = ge("content");
            contentObj.innerHTML = formatToot(arr.content);
            if (contentObj.innerText.indexOf(originalAuthorUsernameWithInstance) == 0) {
                // console.log("Post starts with original author's username");
                contentObj.getElementsByTagName("a")[0].style.display = "none";
            }
            // console.log(displayToot);
            baseElement.appendChild(displayToot);
            // when someone else comments and jumps into the thread, show their info
            if (!(combineRepliesFromSameAuthor && arr.account.id == previousAuthorId)) {
                // TODO: promising but needs refinement
                if (arr.in_reply_to_id == topOfThreadId) {
                    indentCount == indentCountDefault;
                }
                if (arr.in_reply_to_id == previousTootId) {
                    indentCount++;
                } else if (arr.in_reply_to_id == previousParentTootId) {
                    // do nothing
                } else {
                    // OLD -- indentCount--;
                    indentCount = getIndentCount(arr.in_reply_to_id);
                }
                if (indentCount <= indentCountDefault) {
                    indentCount = indentCountDefault;
                }
        
                // displayToot.style.marginLeft = '10px'; // don't need to increase over time -- (indentCount*5) + 'px'; // TODO: magic number
                displayToot.id = arr.id; // new for trees
                displayToot.className = "displayTootAndReplies";
                //ge("author").style.display = "grid";

                if (arr.media_attachments && arr.media_attachments.length > 0) {
                    var attachments = createCarouselNew(arr.media_attachments, arr.id);
                    ge("attachments").appendChild(attachments);
                } else {
                    ge("attachments").style.display = "none";
                }

                ge("authorLink").href = arr.account.url;
                ge("avatarImg").src = "";
                ge("avatarImg").src = arr.account.avatar;
                ge("displayNameSpan").innerHTML = arr.account.display_name;
                ge("userNameSpan").innerHTML = "@" + arr.account.username;
                ge("instanceNameSpan").innerHTML = "@" + instanceName;
                ge("createdAtLink").innerHTML = timeSince(arr.created_at);
                ge("createdAtLink").href = "#url=" + arr.url; // blog
                var links = displayToot.getElementsByClassName("authorLink");
                for (var n = 0; n < links.length; n++) {
                    links[n].href = arr.account.url;
                }
            } else {
                // ge("author").style.display = "none";
            }
            previousAuthorId = arr.account.id;
            previousTootId = arr.id;
            previousParentTootId = arr.in_reply_to_id;
            setIndentCount(arr.in_reply_to_id, indentCount);
            bulkTootReplyHtml += displayToot.innerHTML;
            displayToot.style.display = "block";
        
            // Use HTML hierarchy to show embedded replies
            if (arr.in_reply_to_id) {
                var potentialParentElement = document.getElementById(arr.in_reply_to_id);
                if (potentialParentElement) {
                //blog
                potentialParentElement.appendChild(displayToot);
                }
            }
        
            return displayToot;
        }
    
        function setIndentCount(id, count) {
            indentCountPerId[id] = count;
        }

        function getIndentCount(id) {
            if (indentCountPerId[id]) {
                return indentCountPerId[id];
            }
            return indentCountDefault; // TODO: could be -1 or some error code?
        }
    
        function formatToot(html) {
            if (html.indexOf("<p>") != 0) {
                html = "<p>" + html + "</p>";
            }
            html = html.replaceAll("<br>", "</p><p>");
            return html;
        }

        /**
         * Retrieves the value of a specified variable from the URL hash.
         *
         * @param {string} variable - The name of the variable to retrieve its value.
         *
         * The function parses the URL hash (the part of the URL that follows the # symbol) as a query string. It splits the query string into key-value pairs, and for each pair, it decodes the key and the value from the URL-encoded format and compares the key with the specified variable. If a match is found, it returns the corresponding value.
         *
         * @returns {string} The value of the specified variable. If the variable is not found in the URL hash, it returns an empty string.
         *
         * @example
         * // returns "value" if the URL hash is "#variable=value"
         * getHashVariable("variable");
         */
         function getHashVariable(variable) {
            query = window.location.hash.substr(1);
            vars = query.split("&");
            for (i = 0; i < vars.length; i++) {
                pair = vars[i].split("=");
                if (decodeURIComponent(pair[0]) == variable) {
                return decodeURIComponent(pair[1]);
                }
            }
            return "";
        }

        // Examples:
        // loadToot('https://mastodon.social/@patrickmcurry/108195817029536656','displayToot'); // Load via user-face URL
        // loadToot('https://mastodon.social/api/v1/statuses/108195817029536656','displayToot'); // Load via API URL
    

        /**
         * Processes the URL hash and loads a "toot" (a post or comment) from a specified URL or a default URL.
         *
         * The function retrieves the value of the "url" variable from the URL hash. If the value is not an empty string and is different from the last URL that was used to load a toot, the function updates the last URL and loads the toot from the new URL. If the value is an empty string or the same as the last URL, the function loads the toot from a default URL.
         *
         * The default URL is "https://{{site.mastodon_comments.host}}/@Ted/{{page.mastodon-post-id}}", where {{site.mastodon_comments.host}} and {{page.mastodon-post-id}} are placeholders that should be replaced with the actual values.
         *
         * The loaded toot is displayed in an HTML element with the ID "displayToot".
         *
         * This function is called when the window is loaded and when the URL hash changes.
         *
         * @returns {void}
         */
         function processHash(mastodonHost, mastodonpostid) {
            var url = getHashVariable("url");
            if (url != "" && url != lastUrl) {
                lastUrl = url;
                loadTootThread(url, "displayToot");
            } else {
                loadTootThread(
                    "https://"+mastodonHost+"/@Ted/"+mastodonpostid,
                    "displayToot"
                );
            }
        }
        /**
         * Handles the click event on a reply in a comment thread.
         *
         * @param {HTMLElement} element - The reply that was clicked.
         *
         * The function checks if the clicked reply has a great-grandparent element. If it does, the function modifies the great-grandparent element's style to hide the other replies and adds a "Show Replies" button.
         *
         * Specifically, it sets the height of the great-grandparent element to "14px", the overflow property to "hidden", and the backgroundColor property to "#eeeeee", effectively hiding the other replies and highlighting the clicked reply. It then prepends the "Show Replies" button to the great-grandparent element. The HTML of the "Show Replies" button is retrieved from an element with the ID "showTootTemplate".
         *
         * @returns {boolean} Always returns false. This can be used to prevent the default action of the click event.
         */        
         function clickOnReply(element) {
            //console.log(element);
            if (
                element.parentElement &&
                element.parentElement.parentElement &&
                element.parentElement.parentElement.parentElement &&
                element.parentElement.parentElement.parentElement.parentElement &&
                true
            ) {
                var elem = element.parentElement.parentElement.parentElement.parentElement;
                elem.style.height = "14px"; // 'none';
                elem.style.overflow = "hidden";
                elem.style.backgroundColor = "#eeeeee";
                var showHtml = document.getElementById("showTootTemplate").innerHTML;
                //console.log(showHtml);
                elem.innerHTML = showHtml + elem.innerHTML;
                return false;
            }
        }
    
        /**
         * Handles the click event on a "Show Replies" button in a comment thread.
         *
         * @param {HTMLElement} element - The "Show Replies" button that was clicked.
         *
         * The function checks if the clicked button has a grandparent element. If it does, the function modifies the grandparent element's style to show the hidden replies and removes the "Show Replies" button.
         *
         * Specifically, it sets the height and overflow properties of the grandparent element to their default values, and the backgroundColor property to an empty string, effectively removing any previously applied background color. It then removes the first element with the class "showReplies" from the grandparent element.
         *
         * @returns {boolean} Always returns false. This can be used to prevent the default action of the click event.
         */
        function clickOnReplyShow(element) {
            //console.log(element);
            if (element.parentElement && element.parentElement.parentElement && true) {
                var elem = element.parentElement.parentElement;
                elem.style.height = "";
                elem.style.overflow = "show";
                elem.style.backgroundColor = "";
                elem.getElementsByClassName("showReplies")[0].outerHTML = "";
                return false;
            }
        }
        var originalAuthorId;
        var originalAuthorUsername;
        var originalAuthorUsernameWithInstance;
        var previousAuthorId;
        var lastUrl;
        var lastRepliesUrl;
        var tootReplyHtml;
   
        var topOfThreadId = -1;
        var firstPost;
   
        var combineRepliesFromSameAuthor = false; // changed for /tree -- different from /thread
        var indentCountDefault = 1;
    
        var baseElement;
        var indentCount = indentCountDefault;
        var previousTootId = -1;
        var previousParentTootId = -1;

        var stackObjects = [];
        var stackIndexes = [];
        var stackElements = [];
        var currentIndex = 0;
    
        var bulkTootReplyHtml = "";
        var lastPostElem;
        var skippedFirst = false;

        var indentCountPerId = [];

        var mastodonhost = "{{site.mastodon_comments.host}}";
        var mastodonpostid = "{{page.mastodon-post-id}}";

        window.onload = processHash(mastodonhost, mastodonpostid);
        window.onhashchange = function () {
            location.reload();
        };