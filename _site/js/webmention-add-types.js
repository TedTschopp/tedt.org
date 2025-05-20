;(function(window,JekyllWebmentionIO){
	if ( ! ( 'JekyllWebmentionIO' in window ) ){ window.JekyllWebmentionIO = {}; }
            JekyllWebmentionIO.types = { 
				bookmarks: "bookmark",
				likes: "like",
				links: "link",
				posts: "post",
				replies: "reply",
				reposts: "repost",
				rsvps: "rsvp"
			};
}(this, this.JekyllWebmentionIO));