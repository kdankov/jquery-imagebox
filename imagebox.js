/*
 * ImageBox - jQuery Plugin
 * simple and fancy lightbox alternative
 * By Konstantin Dankov (http://dankov.name)
 * Copyright (c) 2009 Janis Skarnelis
 * Examples and documentation at: http://dankov.name/imagebox
 * 
 * Version: 2.0 Beta 1
 * Requires: jQuery v1.3+
 * 
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

function ib_init(){
	
	// --------------------------------------------------------
	// Configuration area ---- Make changes here when needed
	// --------------------------------------------------------
	
		var ib_information = true;
		var ib_external_padding = 100;
		var ib_animate_time = 300;
		
		// Debug information when things get bad
		var ib_debug = true; // Show information
		
	// --------------------------------------------------------
	// Configuration area ends here
	// --------------------------------------------------------
	
	// Checking for console support
	if ( typeof console == "object" ) {
		var support_for_console = true;
	}
	else
	{
		var support_for_console = false;
	}
	
	// Appending html structure to the page
	$('body').append('<div id="ib_overlay"></div>');
	$('body').append('<div id="ib_box"><div id="ib_inner"><img id="ib_image" src="" alt="" title="" /><div id="ib_info"><div id="ib_data"><h4></h4><p></p></div><div id="ib_close">X Close</div></div></div></div>');

	
	// OnClick event - starts the thing
	$('.imagebox').click(function(){
		
		// --------------------------------------------------------
		// Do not touch the code below if you don't know what are you doing
		// --------------------------------------------------------

		// Creating the objects that will be called multiple times. Ads readability and improoves performance.
		var ib_link 				= $(this);
		var ib_overlay 				= $('#ib_overlay');
		var ib_box 					= $('#ib_box');
		var ib_box_inner 			= ib_box.find('#ib_inner');
		var ib_pic 					= ib_box.find('#ib_image');
		var ib_panel_close 			= ib_box.find('#ib_close');
		var ib_info_panel 			= ib_box.find('#ib_info');
		var ib_info_panel_data 		= ib_info_panel.find('#ib_data');
		var ib_info_panel_header 	= ib_box.find('h4');
		var ib_info_panel_content	= ib_info_panel.find('p');
		
		// Get the window size. This is part of the resizing functionality it resizes bigger pictures to fit inside your window.
		var ib_pagesize = ib_getPageSize();
		var ib_pagesize_width = ib_pagesize[0];
		var ib_pagesize_height = ib_pagesize[1];
		
		// Get box padding from CSS
		var ib_padding_temp = ib_box.css("padding-top");
		var ib_numbers = new RegExp("\\d*")
		var ib_padding = ib_padding_temp.match(ib_numbers);

		// Hide the ImageBox window and its elements
		ib_box.hide();
		ib_pic.hide();

		ib_box.css({ width: "50px", height: "50px", marginTop: "-25px", marginLeft: "-25px" }); // Return the box to the center of the window to be ready for the next image.
		ib_pic.attr({ width: "50px", height: "50px" });
		
		// Show the overlay div - Curtains up
		ib_overlay.show();

		// Get the closing event attached
		$( '#ib_overlay, #ib_image, #ib_close' ).click(function(){ 
			ib_box.fadeOut( ib_animate_time, function (){
				ib_overlay.hide();
				ib_box.fadeOut( ib_animate_time );
				ib_info_panel.hide();
				ib_box.css({ width: "50px", height: "50px", marginTop: "-25px", marginLeft: "-25px" }); // Return the box to the center of the window to be ready for the next image.
				ib_pic.attr({ width: "50px", height: "50px" });
			});
		});
		
		// Create a new Image object and assign URI to it. Takes the href from the link and loads it as sorce for the image.
		ib_preload_image = new Image();
		ib_preload_image.src = ib_link.attr('href');

		// Checks if the link is actually an Image
		var ib_urlString = /\.jpg$|\.jpeg$|\.png$|\.gif$|\.bmp$/;
	    var ib_urlType = ib_preload_image.src.toLowerCase().match(ib_urlString);
		
		// Launch this when the new image is loaded.
		function ib_image_loaded()
		{
			
			// Get the new image dimensions and prepare for sime calculation
			var pwidth = ib_preload_image.width;
			var pheight = ib_preload_image.height;
			var pwidth2 = 0;
			var pheight2 = 0;
			
			
			if ( ib_debug && support_for_console )
			{
				console.info( "Page width: " + ib_pagesize_width + "px, Page height: " + ib_pagesize_height + "px" );
				console.info( "Image width: " + pwidth + "px, Image height: " + pheight + "px" );
			}

			// This part makes sure that if the image is bigger than your window it will be resized to fit.
			if( pwidth + ib_padding * 3 + ib_external_padding > ib_pagesize_width )
			{
				pwidth2 = ib_pagesize_width - ( ib_padding * 5 + ib_external_padding );
				pheight2 = ( pheight * pwidth2 ) / pwidth;
				pwidth = pwidth2;
				pheight = pheight2;

				if ( ib_debug && support_for_console)
				{
					console.info( "** Image resized --- New width: " + pwidth + "px, New height: " + pheight + "px" );
				}
			}
			else if( pheight + ib_padding * 4 + ib_external_padding > ib_pagesize_height )
			{
				pheight2 = ib_pagesize_height - ( ib_padding * 6 + ib_external_padding );
				pwidth2 = ( pwidth * pheight2 ) / pheight;
				pwidth = pwidth2;
				pheight = pheight2;

				if ( ib_debug && support_for_console )
				{
					console.info( "** Image resized --- New width: " + pwidth + "px, New height: " + pheight + "px" );
				}
			}
			
			// Calculate the box size - Its a sum of the image width and padding set in the config section.
			var boxwidth = pwidth;
			var boxheight = pheight;

			if ( ib_debug && support_for_console )
			{
				console.info( "Box width: " + boxwidth + "px, Box height: " + boxheight + "px" );
			}
			
			// Calculate the margins needed for positioning the box
			var margint = boxheight / 2;
			var marginl = boxwidth / 2;
			
			// Get information from the img element in the link
			var ib_pic_title = ib_link.find("img").attr("title");
			var ib_pic_alt = ib_link.find("img").attr("alt");
			
			if ( ib_debug && support_for_console )
			{
				console.info( "Margin top: " + margint + "px, Margin left: " + marginl + "px" );
				console.info( "Pictire title: " + ib_pic_title );
				console.info( "Picture description: " + ib_pic_alt );
				console.info( "************ End of report ************ ");
			}
			
			ib_pic
				.css({ display: "block" })
				.attr({ width: pwidth, height: pheight, src: ib_preload_image.src })
				.css({ marginTop: ib_padding, marginLeft: ib_padding });

			// Populate Title and Description
			ib_info_panel_header.text( ib_pic_title );
			ib_info_panel_content.html( ib_pic_alt );

			// Animation start
			ib_box.show().animate({ width: boxwidth, height: boxheight, marginTop: -margint, marginLeft:  -marginl }, ib_animate_time, function (){
				ib_box.hover(
					function(){	ib_info_panel.fadeIn( ib_animate_time );  },
					function(){	ib_info_panel.fadeOut( ib_animate_time ); }
				);
			});
			
		}
	    
		if(ib_urlType == '.jpg' || ib_urlType == '.jpeg' || ib_urlType == '.png' || ib_urlType == '.gif' || ib_urlType == '.bmp')
		{
			if ( ib_debug && support_for_console ){
				console.info( "************ Start of report ************ ");
				console.info( "Picture type: " + ib_urlType );
			}

			// Opera fix
			if( ib_preload_image.complete ){
				ib_image_loaded();
			}else {
				ib_preload_image.onload = function(){ 
					ib_image_loaded();
				}
			}
			
		}else {
			window.open( ib_urlString );
		}
		
		return false;
	});

}

function ib_getPageSize()
{
	var de = document.documentElement;
	var w = window.innerWidth || self.innerWidth || (de&&de.clientWidth) || document.body.clientWidth;
	var h = window.innerHeight || self.innerHeight || (de&&de.clientHeight) || document.body.clientHeight

	arrayPageSize = new Array(w,h) 

	return arrayPageSize;
}

// Start the script when the page is loaded
$(function(){ ib_init(); });